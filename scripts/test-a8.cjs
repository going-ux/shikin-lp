// All off-site requests are mocked. Never generate real A8 test clicks here.
const {chromium}=require('playwright');
const assert=require('node:assert/strict'), fs=require('node:fs');
const {spawn,execFileSync}=require('node:child_process');
const baseline=execFileSync('git',['show','58a5181:index.html'],{encoding:'utf8'});
const server=spawn('python3',['-m','http.server','8056','--bind','127.0.0.1'],{stdio:'ignore'});
const origin='http://127.0.0.1:8056';
const link='https://px.a8.net/svt/ejp?a8mat=4BEFL9+A9Q87U+4JGG+BWVTE';
const pixel='https://www14.a8.net/0.gif?a8mat=4BEFL9+A9Q87U+4JGG+BWVTE';
(async()=>{
 let browser;
 try {
  for(let n=0;n<40;n++){try{const r=await fetch(origin);if(r.ok)break;}catch{} await new Promise(r=>setTimeout(r,100));}
  browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
  const results=[];
  const evidence=process.env.LP_A8_EVIDENCE_DIR||'docs/evidence/a8-link-20261026';fs.mkdirSync(evidence,{recursive:true});
  for(const width of [320,375,390]){
   const context=await browser.newContext({viewport:{width,height:640}});
   const requests=[],errors=[];
   await context.route('**/*',route=>{
    const u=route.request().url();
    if(u===origin+'/__baseline')return route.fulfill({contentType:'text/html',body:baseline});
    if(u.startsWith(origin+'/'))return route.continue();
    requests.push(u);
    if(u===link)return route.fulfill({contentType:'text/html',body:'<title>Mock destination</title>Mock only'});
    if(u===pixel)return route.fulfill({contentType:'image/gif',body:Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7','base64')});
    return route.fulfill({body:'',contentType:'text/javascript'});
   });
   const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
   await page.goto(origin+'/__baseline');
   await page.screenshot({path:`${evidence}/before-${width}.png`,fullPage:true});
   await page.goto(origin+'/?private=never-send#top');
   const stopped=page.locator('[data-preview-cta]');
   await stopped.click({force:true});
   assert.equal(requests.filter(u=>u===pixel||u===link).length,0);
   assert.equal(await page.locator('#ququmo-affiliate-slot > a').count(),0);
   assert.equal(await page.evaluate(()=>window.dataLayer.filter(e=>e[0]==='event'&&e[1]==='provider_outbound').length),0);
   await page.screenshot({path:`${evidence}/prepared-${width}.png`,fullPage:true});
   // Test-only activation, with every third-party request mocked. Source stays pending.
   await page.route('**/assets/analytics.js',async route=>{
    const response=await route.fetch();
    const setup=`const slot=document.getElementById('ququmo-affiliate-slot');const fragment=document.getElementById('ququmo-a8-code').content.cloneNode(true);fragment.querySelector('a').textContent='QuQuMoのサービス内容を確認する';slot.replaceChildren(fragment);slot.dataset.status='active';`;
    await route.fulfill({response,body:setup+await response.text()});
   });
   requests.length=0;
   await page.reload();
   const events=()=>page.evaluate(()=>window.dataLayer.filter(x=>x[0]==='event').map(x=>({name:x[1],fields:x[2]})));
   assert.equal((await events()).filter(e=>e.name==='page_view').length,1);
   assert.equal(await page.locator('[data-card]:visible').count(),1);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   const hero=await page.locator('.hero .btn').boundingBox(),sticky=await page.locator('.sticky').boundingBox();
   assert(hero.y+hero.height<=sticky.y,'hero CTA overlap');
   await page.locator('.sticky a').click();
   await page.waitForTimeout(150);
   assert.equal((await events()).filter(e=>e.name==='compare_click').length,1);
   const a=page.locator('#ququmo-affiliate-slot a');
   assert.equal(await a.getAttribute('href'),link);
   assert.equal(await a.getAttribute('rel'),'nofollow');
   const image=await page.locator('#ququmo-affiliate-slot img').boundingBox();
   assert.equal(image.width,1);assert.equal(image.height,1);
   assert.equal(requests.filter(u=>u===pixel).length,1);
   await page.locator('.faq summary').first().click();
   assert.equal(await page.locator('.faq details').first().getAttribute('open'),'');
   await a.scrollIntoViewIfNeeded();await a.focus();
   const rect=await a.boundingBox();assert(rect.x>=0&&rect.x+rect.width<=width);
   await page.screenshot({path:`${evidence}/candidate-${width}.png`,fullPage:true});
   // Retain observed custom events across the mocked document navigation.
   const observed=[];await page.exposeFunction('captureAnalytics',e=>observed.push(e));
   await page.evaluate(()=>window.addEventListener('lp:analytics',e=>window.captureAnalytics(e.detail)));
   await Promise.all([page.waitForURL(link),a.press('Enter')]);
   assert.equal(requests.filter(u=>u===link).length,1);
   assert.deepEqual(observed.map(e=>e.event),['cta_click','provider_outbound']);
   for(const e of observed){assert.equal(e.link_kind,'affiliate');assert.equal(e.cta_id,'compare_ququmo');assert.equal(e.page_location,origin+'/');}
   assert.deepEqual(errors,[]);
   results.push({preparedSource:{status:'pending',adRequests:0,outboundEvents:0},width,height:640,horizontalOverflow:false,pixelRequests:1,mockNavigations:1,events:observed.map(e=>e.event),errors});
   // The source document must stay stopped with JavaScript disabled.
   const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width,height:640}});
   await nojs.route('**/*',r=>r.request().url().startsWith(origin+'/')?r.continue():r.fulfill({body:''}));
   const np=await nojs.newPage();await np.goto(origin);assert.equal(await np.locator('#ququmo-affiliate-slot > a').count(),0);assert.equal(await np.locator('[data-preview-cta]').getAttribute('aria-disabled'),'true');await nojs.close();
   await context.close();
  }
  // A broken analytics queue must not cancel the native anchor click.
  const ctx=await browser.newContext();await ctx.route('**/*',r=>r.request().url().startsWith(origin+'/')?r.continue():r.fulfill({body:'mock'}));
  const p=await ctx.newPage();await p.route('**/assets/analytics.js',async r=>{const response=await r.fetch();await r.fulfill({response,body:`const slot=document.getElementById('ququmo-affiliate-slot');slot.replaceChildren(document.getElementById('ququmo-a8-code').content.cloneNode(true));slot.dataset.status='active';`+await response.text()});});await p.goto(origin);await p.evaluate(()=>{window.dataLayer.push=()=>{throw new Error('analytics unavailable')}});
  await Promise.all([p.waitForURL(link),p.locator('#ququmo-affiliate-slot a').click()]);await ctx.close();
  fs.writeFileSync(evidence+'/results.json',JSON.stringify({checkedAt:new Date().toISOString(),externalRequests:'mocked, zero real A8 clicks',results,analyticsFailureNavigation:'PASS',noJavaScript:'PASS: source remains stopped'},null,2)+'\n');
  console.log('PASS A8: 320/375/390, native/keyboard navigation mocked, FAQ/internal/sticky CTA, 1px once, page_view once, CTA/outbound each once, sanitized location, analytics failure navigation and source JS-off stop');
 }finally{if(browser)await browser.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});
