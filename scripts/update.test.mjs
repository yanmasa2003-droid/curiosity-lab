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
test('failed generation does not proceed without enough evidence',async()=>{await assert.rejects(()=>generate({url:'https://www.nasa.gov/test'},[],async()=>({ok:true,text:async()=>'<p>too short</p>'})),/Insufficient source/)});
test('failed updates leave published content unchanged',()=>{
const root=fs.mkdtempSync(path.join(os.tmpdir(),'curiosity-test-'));
try{for(const dir of ['dist','scripts'])fs.cpSync(dir,path.join(root,dir),{recursive:true});fs.writeFileSync(path.join(root,'package.json'),'{"type":"module"}');const before=fs.readFileSync(path.join(root,'dist/content.json'),'utf8');fs.writeFileSync(path.join(root,'scripts/approved-queue.json'),JSON.stringify([{id:'broken-new-item',title:'broken',sources:[],image:'absent'}]));const run=spawnSync(process.execPath,['scripts/update.mjs'],{cwd:root,encoding:'utf8',env:{...process.env,OPENAI_API_KEY:''}});assert.equal(run.status,1);assert.equal(fs.readFileSync(path.join(root,'dist/content.json'),'utf8'),before)}finally{fs.rmSync(root,{recursive:true,force:true})}
});
test('reviewed queue publishes one unique valid article',()=>{const root=fs.mkdtempSync(path.join(os.tmpdir(),'curiosity-publish-'));try{for(const dir of ['dist','scripts'])fs.cpSync(dir,path.join(root,dir),{recursive:true});fs.writeFileSync(path.join(root,'package.json'),'{"type":"module"}');const run=spawnSync(process.execPath,['scripts/update.mjs'],{cwd:root,encoding:'utf8',env:{...process.env,OPENAI_API_KEY:''}});assert.equal(run.status,0,run.stderr);const after=JSON.parse(fs.readFileSync(path.join(root,'dist/content.json')));assert.equal(after.articles.length,content.articles.length+1);assert.equal(new Set(after.articles.map(a=>a.id)).size,after.articles.length)}finally{fs.rmSync(root,{recursive:true,force:true})}});
