const vm = require('node:vm'), fs = require('node:fs'), assert = require('node:assert/strict');
function element(dataset = {}) {
  return {dataset, hidden:false, textContent:'', attrs:{}, handlers:{}, classList:{toggle(){}},
    setAttribute(k,v){this.attrs[k]=v}, addEventListener(k,f){this.handlers[k]=f}, appendChild(){}};
}
const window = {dispatchEvent(){}};
vm.runInNewContext(fs.readFileSync('assets/config.js','utf8'), {window});
const cards = ['ququmo','accel','support','mynavi','try'].map(card => element({card, audience:['mynavi','try'].includes(card)?'corporate':'individual corporate'}));
const buttons = ['individual','corporate'].map(type => element({type}));
const more=element(), note=element(), choice=element(), privacy=element(), contact=element(), heading=element(), scripts=[];
const links=[element({track:'hero_compare'}),element({track:'compare_ququmo',provider:'ququmo'})];
const document={head:{appendChild(s){scripts.push(s)}},createElement(){return element()},
  querySelectorAll(s){return s==='[data-card]'?cards:s==='[data-type]'?buttons:links},
  querySelector(s){return s==='.choice'?choice:s==='#compare h2'?heading:privacy},
  getElementById(s){return s==='more-providers'?more:s==='contact'?contact:note}};
const location={origin:'https://shikin.diggworks.com',pathname:'/',search:'?utm_source=test&private=do-not-send',hash:'#compare'};
let observation;
class IntersectionObserver {
  constructor(callback, options){observation={callback,options,disconnected:false};}
  observe(target){observation.target=target;}
  disconnect(){observation.disconnected=true;}
}
vm.runInNewContext(fs.readFileSync('assets/analytics.js','utf8'),{window,document,location,IntersectionObserver,CustomEvent:class{}});
const commands=()=>Array.from(window.dataLayer,x=>Array.from(x));
const events=()=>commands().filter(x=>x[0]==='event');
assert.equal(scripts.length,1);
assert.equal(scripts[0].src,'https://www.googletagmanager.com/gtag/js?id=G-JGJTNJHVZ5');
const configs=commands().filter(x=>x[0]==='config');
assert.equal(configs.length,1);
assert.equal(configs[0][2].send_page_view,false);
assert.equal(events().length,1);
assert.equal(events()[0][1],'page_view');
assert.equal(choice.hidden,true);
assert.equal(more.hidden,true);
assert.equal(cards.filter(card=>!card.hidden).length,1);
assert.equal(cards.find(card=>!card.hidden).dataset.card,'ququmo');
buttons[1].handlers.click();
links[0].handlers.click();
let prevented=false;
links[1].handlers.click({preventDefault(){prevented=true}});
assert.deepEqual(events().map(x=>x[1]),['page_view','business_type_select','compare_click','cta_click']);
assert.equal(events()[1][2].business_type,'unspecified');
assert.equal(events()[2][2].cta_id,'hero_compare');
assert.equal(events()[3][2].provider,'ququmo');
assert.equal(events()[3][2].link_kind,'disabled');
assert.equal(events()[3][2].disabled,true);
assert.equal(prevented,true);
assert.equal(events().filter(x=>x[1]==='provider_outbound').length,0);
more.handlers.click();
assert.equal(events().at(-1)[1],'comparison_expand');
assert.equal(events().filter(x=>x[1]==='page_view').length,1);
assert.equal(events().filter(x=>x[1]==='lp_view').length,0);
assert.equal(observation.target,heading);
assert.equal(events().filter(x=>x[1]==='compare_view').length,0);
observation.callback([{target:heading,isIntersecting:true,intersectionRatio:0.1}]);
assert.equal(events().filter(x=>x[1]==='compare_view').length,0);
observation.callback([{target:heading,isIntersecting:true,intersectionRatio:0.5}]);
observation.callback([{target:heading,isIntersecting:true,intersectionRatio:1}]);
assert.equal(events().filter(x=>x[1]==='compare_view').length,1);
assert.equal(events().at(-1)[2].section_id,'compare');
assert.equal(observation.disconnected,true);
assert.equal(events().filter(x=>x[1]==='page_view').length,1);
for(const event of events()) assert.equal(event[2].page_location,'https://shikin.diggworks.com/');
const html=fs.readFileSync('index.html','utf8');
assert.ok(html.includes('JavaScriptが有効な場合にGoogle Analyticsを使用します'));
assert.ok(html.includes('https://policies.google.com/privacy?hl=ja'));
assert.ok(html.includes('https://tools.google.com/dlpage/gaoptout?hl=ja'));
assert.equal(privacy.textContent,'','analytics must not overwrite the static disclosure');
console.log('PASS GA4: one page_view, automatic disabled, single-provider/disabled CTA, zero outbound, handler compatibility, compare_view threshold and deduplication, sanitized URLs');
