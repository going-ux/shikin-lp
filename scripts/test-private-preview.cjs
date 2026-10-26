const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
const origin=process.env.LP_PREVIEW_ORIGIN||'http://127.0.0.1:8067';
const dir='docs/evidence/private-preview-20261026';fs.mkdirSync(dir,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const external=[],results=[];
 try{
  for(const width of [320,375,390,1024])for(const mode of ['a','b']){
   const ctx=await browser.newContext({viewport:{width,height:780}});
   await ctx.route('**/*',r=>{if(!r.request().url().startsWith(origin+'/')){external.push(r.request().url());return r.abort();}return r.continue();});
   const p=await ctx.newPage(),errors=[],requests=[];p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>requests.push(r.url()));
   const response=await p.goto(origin+'/'+mode);assert(response.headers()['content-security-policy'].includes("img-src 'self' data:"));
   const events=()=>p.evaluate(()=>window.dataLayer.filter(x=>x[0]==='event').map(x=>({name:x[1],fields:x[2]})));
   assert.equal((await events()).filter(e=>e.name==='page_view').length,1);
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   const hero=await p.locator('.hero .btn').boundingBox(),sticky=await p.locator('.sticky').boundingBox();if(sticky)assert(hero.y+hero.height<=sticky.y);
   await p.screenshot({path:`${dir}/${mode}-full-${width}.png`,fullPage:true});
   await p.locator('.hero .btn').click();await p.waitForTimeout(120);
   assert.equal((await events()).filter(e=>e.name==='compare_click').length,1);
   if(sticky){await p.locator('.sticky a').click();assert.equal((await events()).filter(e=>e.name==='compare_click').length,2);}
   const slot=p.locator('#ququmo-affiliate-slot');await slot.scrollIntoViewIfNeeded();
   await p.screenshot({path:`${dir}/${mode}-cta-${width}.png`});
   const target=mode==='a'?slot.locator('button'):slot.locator('a');
   const box=await target.boundingBox();assert(box.x>=0&&box.x+box.width<=width);if(sticky)assert(box.y+box.height<=(await p.locator('.sticky').boundingBox()).y,'CTA must be above sticky');
   await p.locator('.faq summary').first().click();assert.equal(await p.locator('.faq details').first().getAttribute('open'),'');
   if(mode==='a'){
    await target.focus();await target.press('Enter');assert.equal(p.url(),origin+'/a#compare');
    assert.equal((await events()).filter(e=>e.name==='provider_outbound').length,0);assert.equal(requests.filter(u=>u.endsWith('/mock/pixel.gif')).length,0);
   }else{
    const image=await slot.locator('img').boundingBox();assert.equal(image.width,1);assert.equal(image.height,1);
    assert.equal(requests.filter(u=>u.endsWith('/mock/pixel.gif')).length,1);
    const recorded=[];await p.exposeFunction('capture',x=>recorded.push(x));await p.evaluate(()=>window.addEventListener('lp:analytics',e=>window.capture(e.detail)));
    await target.focus();await Promise.all([p.waitForURL(origin+'/mock/ququmo'),target.press('Enter')]);
    assert.deepEqual(recorded.map(e=>e.event),['cta_click','provider_outbound']);for(const e of recorded){assert.equal(e.link_kind,'affiliate');assert.equal(e.page_location,origin+'/b');}
   }
   assert.deepEqual(errors,[]);results.push({mode,width,layout:'PASS',faq:'PASS',keyboard:'PASS',initialPageView:1,realExternalRequests:0});await ctx.close();
  }
  for(const mode of ['a','b']){
   const ctx=await browser.newContext({javaScriptEnabled:false});const p=await ctx.newPage();await p.goto(origin+'/'+mode);
   assert.equal(await p.locator('#ququmo-affiliate-slot > a').count(),0);assert.equal(await p.locator('[data-preview-cta]').getAttribute('aria-disabled'),'true');await ctx.close();
  }
  const ctx=await browser.newContext();const p=await ctx.newPage();await p.goto(origin+'/b');await p.evaluate(()=>{window.dataLayer.push=()=>{throw Error('test failure')}});await Promise.all([p.waitForURL(origin+'/mock/ququmo'),p.locator('#ququmo-affiliate-slot a').click()]);await ctx.close();
  const ui=await browser.newPage({viewport:{width:1440,height:1000}});await ui.goto(origin);await ui.waitForTimeout(150);assert.equal(await ui.locator('iframe').count(),2);await ui.screenshot({path:dir+'/comparison-desktop.png',fullPage:true});await ui.close();
  assert.deepEqual(external,[]);
  fs.writeFileSync(dir+'/results.json',JSON.stringify({time:new Date().toISOString(),results,thirdPartyRequests:external,jsOff:'PASS: both stopped',analyticsFailure:'PASS: mock navigation',externalClicks:0,applications:0},null,2)+'\n');
  console.log('PASS private preview: A/B × 320/375/390/1024, FAQ/keyboard/CTAs, one page_view, event separation, no-JS stop, failure fallback, external requests 0');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
