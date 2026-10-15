const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const dir=require('node:path').join(process.cwd(),'docs/evidence/payment-cycle');fs.mkdirSync(dir,{recursive:true});const results=[];
for(const width of [320,375,390]){
 const result={width};
 for(const [version,port] of [['before',8002],['after',8001]]){
  const context=await browser.newContext({viewport:{width,height:780},deviceScaleFactor:1,isMobile:true,hasTouch:true});
  await context.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:'+port+'/?private=do-not-send#top');await page.evaluate(()=>document.fonts.ready);
  const section=page.locator('section').filter({has:page.locator('.timeline')});
  await section.scrollIntoViewIfNeeded();
  await section.screenshot({path:dir+'/'+version+'-'+width+'.png'});
  const layout=await page.evaluate(()=>{
   const timeline=document.querySelector('.timeline'),section=timeline.closest('section'),sticky=document.querySelector('.sticky');
   return {scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth,sectionHeight:section.getBoundingClientRect().height,stickyHeight:sticky.getBoundingClientRect().height,steps:[...timeline.children].map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}})};
  });
  assert.equal(layout.scrollWidth,width);assert.equal(errors.length,0);
  if(version==='after'){
   assert.equal(await page.locator('ol.payment-cycle>li').count(),3);
   for(let i=1;i<3;i++)assert.ok(layout.steps[i].y>=layout.steps[i-1].y+layout.steps[i-1].height);
   for(const s of layout.steps){assert.ok(s.x>=0);assert.ok(s.x+s.width<=width);}
   // Viewport screenshot records the whole diagram and fixed CTA together.
   await page.screenshot({path:dir+'/after-viewport-'+width+'.png'});
  }
  await page.locator('.hero .btn').click();
  assert.equal(await page.locator('[data-card]:visible').count(),3);
  await page.locator('[data-type="corporate"]').click();
  assert.equal(await page.locator('[data-card]:visible').count(),3);
  await page.locator('#more-providers').click();assert.equal(await page.locator('[data-card]:visible').count(),5);
  await page.locator('[data-type="individual"]').click();assert.equal(await page.locator('[data-card]:visible').count(),3);
  const outbound=page.locator('[data-provider="ququmo"]');
  await outbound.evaluate(el=>el.addEventListener('click',e=>e.preventDefault(),{once:true}));
  await outbound.click();
  const events=await page.evaluate(()=>window.dataLayer.filter(e=>e[0]==='event').map(e=>({name:e[1],location:e[2].page_location})));
  assert.equal(events.filter(e=>e.name==='page_view').length,1);
  assert.equal(events.filter(e=>e.name==='business_type_select').length,2);
  for(const name of ['compare_click','comparison_expand','provider_outbound'])assert.equal(events.filter(e=>e.name===name).length,1);
  for(const e of events)assert.equal(e.location,'http://127.0.0.1:'+port+'/');
  const sticky=page.locator('.sticky a');await sticky.click();
  assert.ok(await sticky.isVisible());
  result[version]={...layout,events:events.map(e=>e.name),pageErrors:errors};await context.close();
 }
 results.push(result);
}
fs.writeFileSync(dir+'/results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});
