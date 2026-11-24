import test from 'node:test';
import assert from 'node:assert/strict';
import {waitForArtifact} from './wait-pages-artifact.mjs';
const input={api:'https://api.github.com',repository:'owner/repo',runId:'42',name:'github-pages-42-2',token:'test-only'};
test('deployment waits for delayed metadata and ignores a previous attempt artifact',async()=>{let calls=0,pauses=0;await waitForArtifact({...input,fetcher:async()=>({ok:true,json:async()=>({artifacts:++calls===1?[{name:'github-pages-42-1'}]:[{name:input.name}]})}),pause:async()=>{pauses++}});assert.equal(calls,2);assert.equal(pauses,1)});
test('deployment stops when uploaded artifact never becomes visible',async()=>{await assert.rejects(()=>waitForArtifact({...input,fetcher:async()=>({ok:true,json:async()=>({artifacts:[]})}),pause:async()=>{}}),/not visible/)});
