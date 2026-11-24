import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const content=JSON.parse(fs.readFileSync('dist/content.json'));
const ctx=vm.createContext({document:{addEventListener(){}},location:{hash:'#lab'},data:content.articles,esc:x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),videoCard:v=>`<div>${v.title} ${v.url}</div>`});
vm.runInContext(fs.readFileSync('dist/lab-catalog.js','utf8')+'\n'+fs.readFileSync('dist/labs.js','utf8')+'\nthis.catalog=LAB_EXPERIMENTS;this.groups=LAB_GROUPS;this.math=LabMath;',ctx);
const plain=x=>JSON.parse(JSON.stringify(x));
test('31 experiments span eight genres with live exhibit links and Japanese media',()=>{
 assert.equal(ctx.catalog.length,31);assert.equal(new Set(ctx.catalog.map(e=>e.id)).size,31);assert.equal(ctx.groups.length,8);
 for(const g of ctx.groups)assert.ok(ctx.catalog.filter(e=>e.group===g.name).length>=3,g.name);
 for(const e of ctx.catalog){const a=content.articles.find(a=>a.id===e.article);assert.ok(a,e.id);assert.ok(a.videos.some(v=>['ja','ja-subtitles','ja-text'].includes(v.language)),e.id);assert.ok(e.explain.length>50&&e.limit.length>25,e.id);for(const s of e.references){assert.equal(s.language,'ja');assert.equal(new URL(s.url).protocol,'https:')};ctx.fixture=e;assert.match(vm.runInContext('labMedia(fixture)',ctx),/日本語の参考資料/)}
});
test('every new model renders all of its control extremes without invalid numbers',()=>{
 for(const e of ctx.catalog.filter(e=>e.controls.length)){
  const initial=Object.fromEntries(e.controls.map(c=>[c.key,c.value]));
  for(const c of e.controls)for(const value of c.type==='select'?[0,c.options.length-1]:[c.min,c.max]){
   ctx.fixture={id:e.id,values:{...initial,[c.key]:value}};const m=vm.runInContext('labModel(fixture.id,fixture.values)',ctx);
   assert.match(m.visual,/viewBox="0 0 600 320"|lab-word-stack|lab-paper-stack/);assert.ok(m.result.length>10,e.id);assert.doesNotMatch(m.visual,/NaN|Infinity|undefined/,e.id);
  }
 }
});
test('D’Hondt matches the official worked example and preserves every seat',()=>{
 assert.deepEqual(plain(ctx.math.seats([1200,1000,700,400],4).seats),[2,1,1,0]);
 for(let n=3;n<=20;n++){const r=ctx.math.seats([45,35,20],n);assert.equal(r.seats.reduce((a,b)=>a+b),n);assert.equal(r.order.length,n)}
});
test('same voters can produce three different sequential majority winners',()=>{
 assert.deepEqual([0,1,2].map(order=>ctx.math.majority([5,5,5],order).winner),[2,0,1]);
 assert.equal(ctx.math.majority([1,2,1],0).winner,null);
});
test('normalization, base rates and aggregation use the correct denominators',()=>{
 assert.equal(ctx.math.allocation([0,0,0]).reduce((a,b)=>a+b),100);
 const base=ctx.math.base(1);assert.equal(base.truePositive,9);assert.equal(base.falsePositive,99);assert.ok(Math.abs(base.posterior-100/12)<1e-8);
 assert.deepEqual(plain(ctx.math.mix(10,90)),{a:36,b:74});assert.deepEqual(plain(ctx.math.mix(50,50)),{a:60,b:50});
 assert.equal(ctx.math.average(50).median,4);assert.equal(ctx.math.average(50).mean,12.8);
});
test('packing, parallel work, clocks and selection retain their model invariants',()=>{
 assert.equal(ctx.math.packing(12,18,0).count,3);assert.equal(ctx.math.packing(12,18,1).count,4);
 assert.equal(ctx.math.parallel(25),60);assert.equal(ctx.math.parallel(0),35);
 assert.equal(ctx.math.clock(720-40),'11:20');assert.equal(ctx.math.clock(720+40),'12:40');
 for(let t=0;t<=20;t++){assert.ok(Math.abs(ctx.math.selection(50,1,t)-50)<1e-9);assert.ok(ctx.math.selection(50,1.2,t)>=50);assert.ok(ctx.math.selection(50,.8,t)<=50)}
});
test('gallery filtering and every direct experiment route render a complete experience',()=>{
 assert.equal((vm.runInContext('lab()',ctx).match(/class="lab-tile"/g)||[]).length,31);
 vm.runInContext("labGroup='歴史と文化'",ctx);assert.equal((vm.runInContext('lab()',ctx).match(/class="lab-tile"/g)||[]).length,5);
 for(const e of ctx.catalog){ctx.location.hash='#lab-'+e.id;const html=vm.runInContext('lab()',ctx);assert.match(html,/lab-workshop/);assert.match(html,/日本語の参考資料/);assert.match(html,/いまの発見をGPTへコピー/)}
});

test('video lessons link to distinct experiments and show inspectable outcomes',()=>{
 for(const article of content.articles.filter(a=>a.videoOrigin)){
  assert.ok(article.labs?.length,article.id);
  for(const id of article.labs)assert.equal(ctx.catalog.find(e=>e.id===id)?.article,article.id);
 }
 assert.deepEqual(plain(ctx.math.seats([54,33,13],4).seats),[3,1,0]);
 assert.deepEqual(plain(ctx.math.seats([54,33,13],4,2).seats),[2,1,1]);
});
