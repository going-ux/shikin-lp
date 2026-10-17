// Run current prototype on 8011 and main 829231f snapshot on 8012.
// Chromium and Playwright are required; third-party traffic is blocked.
const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const out=path.resolve(process.cwd(),process.env.LP_EVIDENCE_DIR||'docs/evidence/implementation-20261016');
const events=p=>p.evaluate(()=>window.dataLayer.filter(e=>e[0]==='event').map(e=>({name:e[1],fields:e[2]})));
const count=(entries,name)=>entries.filter(e=>e.name===name).length;
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const results=[];
 async function context(width,extras={}){
  const c=await browser.newContext({viewport:{width,height:780},deviceScaleFactor:1,isMobile:true,hasTouch:true,...extras});
  await c.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());return c;
 }
 try{
  for(const width of [320,375,390]){
   const result={width};
   for(const [version,port] of [['before',8012],['after',8011]]){
    const c=await context(width),p=await c.newPage(),errors=[],adRequests=[];p.on('pageerror',e=>errors.push(e.message));
    p.on('request',request=>{const host=new URL(request.url()).hostname;if(host.endsWith('a8.net')||host.endsWith('example.invalid'))adRequests.push(request.url());});
    await p.goto('http://127.0.0.1:'+port+'/?private=do-not-send#top');await p.evaluate(()=>document.fonts.ready);
    await p.screenshot({path:path.join(out,version+'-full-'+width+'.png'),fullPage:true});
    const cycle=p.locator('section').filter({has:p.locator('.timeline')});
    await cycle.screenshot({path:path.join(out,version+'-cycle-'+width+'.png')});
    const layout=await p.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,
     steps:[...document.querySelector('.timeline').children].map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}})}));
    assert.equal(layout.width,layout.scrollWidth);
    if(version==='after'){
     for(let i=1;i<3;i++)assert.ok(layout.steps[i].y>=layout.steps[i-1].y+layout.steps[i-1].height);
     for(const step of layout.steps){assert.ok(step.x>=0);assert.ok(step.x+step.width<=width);}
     assert.equal(count(await events(p),'compare_view'),0);
    }
    await p.locator('.hero .btn').click();
    if(version==='after'){
     await p.waitForFunction(()=>window.dataLayer.some(e=>e[1]==='compare_view'));
     assert.equal(await p.locator('[data-card]:visible').count(),1);
     assert.equal(await p.locator('.choice').isVisible(),false);
     assert.equal(await p.locator('#more-providers').isVisible(),false);
     assert.equal(await p.locator('#ququmo-affiliate-slot').getAttribute('data-status'),'pending');
     assert.equal(await p.locator('#ququmo-a8-code').evaluate(t=>t.content.querySelectorAll('*').length),0);
     // Synthetic non-A8 fixture verifies inert template content cannot load a pixel.
     await p.locator('#ququmo-a8-code').evaluate(t=>{t.innerHTML='<a href="https://example.invalid/link">fixture</a><img src="https://example.invalid/pixel.gif" width="1" height="1" alt="">';});
     await p.waitForTimeout(100);assert.equal(adRequests.length,0);
     assert.equal(await p.locator('#ququmo-affiliate-slot a').count(),0);
     await p.locator('[data-card="ququmo"]').screenshot({path:path.join(out,'after-provider-'+width+'.png')});
     const oldUrl=p.url(),button=p.locator('[data-preview-cta]');
     assert.equal(await button.getAttribute('aria-disabled'),'true');await button.click({force:true});assert.equal(p.url(),oldUrl);
     let box=await button.boundingBox(),sticky=await p.locator('.sticky').boundingBox();
     assert.ok(box.y>=0&&box.y+box.height<=sticky.y,'CTA covered by sticky footer');
     await button.focus();await p.keyboard.press('Enter');assert.equal(p.url(),oldUrl);
     const faq=p.locator('.faq details').first();await faq.locator('summary').click();assert.notEqual(await faq.getAttribute('open'),null);
     await faq.locator('summary').click();assert.equal(await faq.getAttribute('open'),null);
     await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(100);await p.locator('.sticky a').click();await p.waitForTimeout(100);
     const got=await events(p);
     for(const [name,n] of [['page_view',1],['compare_view',1],['compare_click',2],['cta_click',2],['provider_outbound',0],['business_type_select',0]])assert.equal(count(got,name),n,name);
     for(const e of got){assert.equal(e.fields.page_location,'http://127.0.0.1:'+port+'/');assert.equal(e.fields.business_type,'unspecified');assert.ok(!JSON.stringify(e).includes('do-not-send'));assert.ok(!JSON.stringify(e).includes('info@'));}
     const privacy=p.locator('.policy').last();await privacy.locator('summary').click();assert.ok((await privacy.innerText()).includes('Google Analytics'));await privacy.locator('summary').click();
     assert.equal(await p.locator('.policy a[href^="https://policies.google.com/"]').count(),2);
     assert.ok(!(await p.locator('body').innerText()).includes('開発試作'));
     assert.ok(!(await p.locator('body').innerText()).includes('（試作）'));
     await p.setViewportSize({width,height:640});await button.click({force:true});box=await button.boundingBox();sticky=await p.locator('.sticky').boundingBox();assert.ok(box.y+box.height<=sticky.y);
     result.previewEvents=got.map(e=>e.name);
    }
    assert.equal(errors.length,0);assert.equal(adRequests.length,0);result[version]={layout,pageErrors:errors,adRequests};await c.close();
   }
   const direct=await context(width),p=await direct.newPage();await p.goto('http://127.0.0.1:8011/#compare');
   await p.waitForFunction(()=>window.dataLayer.some(e=>e[1]==='compare_view'));
   assert.equal(count(await events(p),'compare_view'),1);assert.equal(count(await events(p),'compare_click'),0);await direct.close();
   const scrolling=await context(width),scrolled=await scrolling.newPage();await scrolled.goto('http://127.0.0.1:8011/');
   await scrolled.locator('#compare h2').scrollIntoViewIfNeeded();
   await scrolled.waitForFunction(()=>window.dataLayer.some(e=>e[1]==='compare_view'));
   assert.equal(count(await events(scrolled),'compare_view'),1);assert.equal(count(await events(scrolled),'compare_click'),0);await scrolling.close();
   const nojs=await context(width,{javaScriptEnabled:false}),f=await nojs.newPage();await f.goto('http://127.0.0.1:8011/');
   assert.equal(await f.locator('[data-card]:visible').count(),1);assert.equal(await f.locator('[data-provider]:visible').count(),1);
   assert.equal(await f.locator('[data-provider]:visible').evaluate(e=>e.tagName),'BUTTON');assert.equal(await f.locator('[data-provider]:visible').getAttribute('href'),null);
   await nojs.close();result.directAnchorView=true;result.scrollView=true;result.noJsFallback=true;results.push(result);
  }
  // Current analytics with original multi-provider HTML/config verifies retained behavior.
  const legacy=await context(375);await legacy.route('**/assets/analytics.js',r=>r.fulfill({contentType:'text/javascript',body:fs.readFileSync('assets/analytics.js','utf8')}));
  const p=await legacy.newPage();await p.goto('http://127.0.0.1:8012/');assert.equal(await p.locator('[data-card]:visible').count(),3);
  await p.locator('[data-type="corporate"]').click();assert.equal(await p.locator('[data-card]:visible').count(),3);
  await p.locator('#more-providers').click();assert.equal(await p.locator('[data-card]:visible').count(),5);
  await p.locator('[data-type="individual"]').click();assert.equal(await p.locator('[data-card]:visible').count(),3);
  const link=p.locator('[data-provider="ququmo"]');await link.evaluate(e=>e.addEventListener('click',x=>x.preventDefault(),{once:true}));
  await link.click();assert.equal(count(await events(p),'provider_outbound'),1);await legacy.close();
  // Failed config download must not accidentally reveal unreleased records.
  const missing=await context(375);await missing.route('**/assets/config.js',r=>r.abort());
  const failed=await missing.newPage(),failureErrors=[];failed.on('pageerror',e=>failureErrors.push(e.message));await failed.goto('http://127.0.0.1:8011/');
  assert.equal(await failed.locator('[data-card]:visible').count(),1);
  assert.equal(await failed.locator('.choice').isVisible(),false);
  const url=failed.url();await failed.locator('[data-preview-cta]').click({force:true});assert.equal(failed.url(),url);
  assert.equal(await failed.evaluate(()=>window.dataLayer.filter(e=>e.event==='provider_outbound').length),0);
  assert.equal(await failed.evaluate(()=>window.dataLayer.filter(e=>e.event==='cta_click').length),1);
  assert.equal(failureErrors.length,0);await missing.close();
  fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({widths:results,legacyCompatibility:true,configFailureSafe:true},null,2));
  console.log('PASS 320/375/390px: layout/sticky CTA, single/no-JS, FAQ, disabled outbound, keyboard, compare_view once/direct anchor, GA4 queues; legacy 3→3→5→3 and outbound');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
