import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {chooseCandidate,cleanHtml,generate} from './update.mjs';
import {validate} from './check.mjs';
const content=JSON.parse(fs.readFileSync('dist/content.json'));
test('scheduled publication selects underrepresented categories and excludes reused sources',()=>{
const bank=[{id:'one',category:'科学',url:content.articles[0].sources[0].url},{id:'two',category:'自然',url:'https://www.nasa.gov/2'},{id:'three',category:'文化',url:'https://www.nasa.gov/3'}];assert.equal(chooseCandidate(bank,content.articles).id,'three');
});
test('source cleanup discards scripts and styles',()=>assert.equal(cleanHtml('<script>evil()</script><style>bad</style><p>Scientific evidence</p>'),' Scientific evidence '));
test('quality validator rejects missing assets and broken related links',()=>{const broken=structuredClone(content);broken.articles[0].related.push('missing');assert.throws(()=>validate(broken),/Broken related/);broken.articles[0].related=[];broken.articles[0].image='missing';assert.throws(()=>validate(broken),/Missing asset/)});
test('failed generation does not proceed without enough evidence',async()=>{await assert.rejects(()=>generate({url:'https://www.nasa.gov/test',language:'ja',videos:[{}]},[],async()=>({ok:true,text:async()=>'<p>too short</p>'})),/Insufficient source/)});
test('failed updates leave published content unchanged',()=>{
const root=fs.mkdtempSync(path.join(os.tmpdir(),'curiosity-test-'));
try{for(const dir of ['dist','scripts'])fs.cpSync(dir,path.join(root,dir),{recursive:true});fs.writeFileSync(path.join(root,'package.json'),'{"type":"module"}');const before=fs.readFileSync(path.join(root,'dist/content.json'),'utf8');fs.writeFileSync(path.join(root,'scripts/approved-queue.json'),JSON.stringify([{...content.articles[0],id:'broken-new-item',title:'broken-new',image:'absent'}]));const run=spawnSync(process.execPath,['scripts/update.mjs'],{cwd:root,encoding:'utf8',env:{...process.env,OPENAI_API_KEY:''}});assert.equal(run.status,1);assert.equal(fs.readFileSync(path.join(root,'dist/content.json'),'utf8'),before)}finally{fs.rmSync(root,{recursive:true,force:true})}
});
test('legacy queue is held and existing content remains intact',()=>{const root=fs.mkdtempSync(path.join(os.tmpdir(),'curiosity-publish-'));try{for(const dir of ['dist','scripts'])fs.cpSync(dir,path.join(root,dir),{recursive:true});fs.writeFileSync(path.join(root,'package.json'),'{"type":"module"}');const run=spawnSync(process.execPath,['scripts/update.mjs'],{cwd:root,encoding:'utf8',env:{...process.env,OPENAI_API_KEY:''}});assert.equal(run.status,0,run.stderr);const after=JSON.parse(fs.readFileSync(path.join(root,'dist/content.json')));assert.equal(after.articles.length,content.articles.length);assert.equal(new Set(after.articles.map(a=>a.id)).size,after.articles.length)}finally{fs.rmSync(root,{recursive:true,force:true})}});

test('Japanese video and Japanese references are mandatory for every exhibit',()=>{for(const field of ['videos','sources']){const bad=structuredClone(content);if(field==='videos')bad.articles[0].videos=[];else bad.articles[0].sources[0].language='en';assert.throws(()=>validate(bad),/Japanese/)}const bad=structuredClone(content);bad.articles[0].videos[0].language='en';assert.throws(()=>validate(bad),/Japanese/)});
test('thin article is rejected even if the time label says five minutes',()=>{const bad=structuredClone(content);bad.articles[0].minutes=5;bad.articles[0].sections=Array.from({length:5},()=>({heading:'背景',text:'短い要約'}));assert.throws(()=>validate(bad),/insufficient article depth/)});
test('unreviewed generation cannot invent media or language evidence',async()=>{await assert.rejects(()=>generate({url:'https://example.com'},[],()=>{throw Error('must not fetch')}),/curated Japanese video/)});
test('new reviewed candidate still publishes atomically',()=>{const root=fs.mkdtempSync(path.join(os.tmpdir(),'curiosity-reviewed-'));try{for(const dir of ['dist','scripts'])fs.cpSync(dir,path.join(root,dir),{recursive:true});fs.writeFileSync(path.join(root,'package.json'),'\{"type":"module"\}');fs.writeFileSync(path.join(root,'scripts/approved-queue.json'),JSON.stringify([{...content.articles[0],id:'reviewed-example',title:'確認済みの記事を公開する動作検証'}]));const run=spawnSync(process.execPath,['scripts/update.mjs'],{cwd:root,encoding:'utf8',env:{...process.env,OPENAI_API_KEY:''}});assert.equal(run.status,0,run.stderr);const after=JSON.parse(fs.readFileSync(path.join(root,'dist/content.json')));assert.equal(after.articles.length,content.articles.length+1);assert.equal(after.articles.at(-1).id,'reviewed-example')}finally{fs.rmSync(root,{recursive:true,force:true})}});
