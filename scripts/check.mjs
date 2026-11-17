import fs from 'node:fs';
import assert from 'node:assert/strict';
export function validate(content,base='dist'){
 assert.ok(Array.isArray(content.articles)&&content.articles.length>=12,'12 articles required');
 const ids=new Set(),titles=new Set(),allowed=['imagine.gsfc.nasa.gov','spaceplace.nasa.gov','science.nasa.gov','www.nasa.gov','oceanservice.noaa.gov','www.nhm.ac.uk','www.britishmuseum.org','ed.ted.com','www.nist.gov','www.si.edu','openstax.org','www.nps.gov','www.metmuseum.org','www.exploratorium.edu','www.loc.gov','asia.si.edu','library.si.edu','www.noaa.gov','annex.exploratorium.edu'];
 for(const a of content.articles){
  assert.match(a.id,/^[a-z][a-z0-9-]*$/);assert.ok(!ids.has(a.id),'Duplicate ID');ids.add(a.id);assert.ok(!titles.has(a.title),'Duplicate title');titles.add(a.title);
  for(const k of ['title','subtitle','summary','talk','revisit','category','image','checked'])assert.equal(typeof a[k],'string',`${a.id}: ${k}`);
  assert.ok(a.title.length>6&&a.summary.length>40&&a.talk.length>30);assert.ok(a.sections.length>=2);assert.ok(a.minutes>=1&&a.minutes<=30);
  assert.ok(a.sources.length>0);for(const s of a.sources){const url=new URL(s.url);assert.equal(url.protocol,'https:');assert.ok(allowed.includes(url.hostname),`Unapproved source ${url.hostname}`)}
  assert.ok(fs.existsSync(`${base}/assets/${a.image}.jpg`),`Missing asset ${a.image}`);
 }
 for(const a of content.articles)for(const id of a.related)assert.ok(ids.has(id),`Broken related link ${id}`);
 return true;
}
if(process.argv[1]?.endsWith('check.mjs')){const c=JSON.parse(fs.readFileSync('dist/content.json','utf8'));validate(c);const manifest=JSON.parse(fs.readFileSync('dist/manifest.webmanifest'));assert.equal(manifest.start_url,'./');for(const i of manifest.icons)assert.ok(fs.existsSync('dist/'+i.src.replace('./','')));console.log(`Validated ${c.articles.length} exhibits, sources, related links, images and PWA manifest.`)}
