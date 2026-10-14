const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
function el(dataset={}){return {dataset,hidden:false,textContent:'',attrs:{},handlers:{},classList:{toggle(){}},setAttribute(k,v){this.attrs[k]=v},addEventListener(k,f){this.handlers[k]=f}};}
const cards=['ququmo','accel','support','mynavi','try'].map(k=>el({card:k,audience:['mynavi','try'].includes(k)?'corporate':'individual corporate'}));
const buttons=['individual','corporate'].map(type=>el({type}));const more=el(),note=el(),choice=el(),links=[el({track:'hero_compare'}),el({track:'compare_ququmo',provider:'ququmo'})];
const document={querySelectorAll:s=>s==='[data-card]'?cards:s==='[data-type]'?buttons:links,querySelector:s=>s==='.choice'?choice:null,getElementById:s=>s==='more-providers'?more:note};
const window={LP_CONFIG:{},dispatchEvent(){}};vm.runInNewContext(fs.readFileSync('assets/analytics.js','utf8'),{window,document,location:{origin:'https://example.test',pathname:'/'},CustomEvent:class{}});
const visible=()=>cards.filter(c=>!c.hidden).map(c=>c.dataset.card);
assert.deepEqual(visible(),['ququmo','accel','support']);buttons[1].handlers.click();assert.deepEqual(visible(),['ququmo','accel','mynavi']);more.handlers.click();assert.equal(visible().length,5);assert.equal(more.attrs['aria-expanded'],'true');buttons[0].handlers.click();assert.deepEqual(visible(),['ququmo','accel','support']);assert.equal(more.hidden,true);
links[0].handlers.click();links[1].handlers.click();assert.equal(window.dataLayer.at(-2).event,'compare_click');assert.equal(window.dataLayer.at(-1).event,'provider_outbound');assert.equal(window.dataLayer.at(-1).link_kind,'official');console.log('PASS audience selection, expansion/reset, separate click events');
