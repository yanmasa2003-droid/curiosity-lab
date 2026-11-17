import fs from 'node:fs';
import assert from 'node:assert/strict';
export function validate(content,base='dist'){
 assert.ok(Array.isArray(content.articles)&&content.articles.length>=12,'12 articles required');
 const ids=new Set(),titles=new Set(),allowed=['pro.quick-art.com','alma-telescope.jp','www.jamstec.go.jp','www.minpaku.ac.jp','global.canon','www.sci.osaka-u.ac.jp','www.nict.go.jp','ds.data.jma.go.jp','nh.kanagawa-museum.jp','www.eboard.jp','www.shinshu-u.ac.jp','edu.jaxa.jp','www.dic-global.com','www.muji.com','www.lidea.today','www.maff.go.jp','www.kikkoman.co.jp','faq-toshiba-lifestyle.dga.jp','www.audio-technica.co.jp','www.bunka.go.jp','www.jans.or.jp','sites.google.com','www.ndl.go.jp','www.imes.boj.or.jp','www.nabunken.go.jp','www.jstage.jst.go.jp','www.bk.mufg.jp','www.boj.or.jp','www.jsme-fed.org','www.healthliteracy.jp','www.titech.ac.jp'];
 const videoHosts=['pro.quick-art.com','www.youtube.com','digitalcast.jp','ch.u-tokyo.ac.jp','www.mitoyo-kanko.com','nh.kanagawa-museum.jp','www.eboard.jp','www.join-hands.jp','www.ted.com'];
 for(const a of content.articles){
  assert.match(a.id,/^[a-z][a-z0-9-]*$/);assert.ok(!ids.has(a.id),'Duplicate ID');ids.add(a.id);assert.ok(!titles.has(a.title),'Duplicate title');titles.add(a.title);
  for(const k of ['title','subtitle','summary','talk','revisit','category','image','checked'])assert.equal(typeof a[k],'string',`${a.id}: ${k}`);
  assert.ok(a.title.length>6&&a.summary.length>40&&a.talk.length>30);assert.ok(a.sections.length>=5,`${a.id}: five explanatory sections required`);assert.ok(a.sections.reduce((n,s)=>n+s.text.length,0)>=800,`${a.id}: insufficient article depth`);if(a.rooms){assert.ok(Array.isArray(a.rooms));for(const r of a.rooms)assert.ok(['laundry','cooking','tools','communication','mind','civilization','nature','play'].includes(r),'Unknown room')}if(a.interactive)assert.ok(['fold','drying','eggs','salad','heat','noise','plain','teachback','choice','timeline','money','camouflage','curveball'].includes(a.interactive),'Unknown interaction');assert.ok(a.minutes>=1&&a.minutes<=30);
  assert.ok(a.sources.length>0);for(const s of a.sources){const url=new URL(s.url);assert.equal(url.protocol,'https:');assert.equal(s.language,'ja',`${a.id}: Japanese reference required`);assert.ok(allowed.includes(url.hostname),`Unapproved source ${url.hostname}`)}
  assert.ok(Array.isArray(a.videos)&&a.videos.length>0,`${a.id}: Japanese video required`);for(const v of a.videos){const u=new URL(v.url);assert.equal(u.protocol,'https:');assert.ok(videoHosts.includes(u.hostname),'Unapproved video host');assert.ok(['ja','ja-subtitles','ja-text'].includes(v.language),`${a.id}: Japanese video required`);assert.ok(v.title&&v.provider&&v.note&&v.checked&&v.verification==='publisher-page','Verified video metadata required');if(v.id){assert.match(v.id,/^[A-Za-z0-9_-]{11}$/);assert.equal(u.searchParams.get('v'),v.id)}}
  assert.ok(fs.existsSync(`${base}/assets/${a.image}.jpg`),`Missing asset ${a.image}`);
 }
 for(const a of content.articles)for(const id of a.related)assert.ok(ids.has(id),`Broken related link ${id}`);
 return true;
}
if(process.argv[1]?.endsWith('check.mjs')){const c=JSON.parse(fs.readFileSync('dist/content.json','utf8'));validate(c);const manifest=JSON.parse(fs.readFileSync('dist/manifest.webmanifest'));assert.equal(manifest.start_url,'./');for(const i of manifest.icons)assert.ok(fs.existsSync('dist/'+i.src.replace('./','')));console.log(`Validated ${c.articles.length} exhibits, sources, related links, images and PWA manifest.`)}
