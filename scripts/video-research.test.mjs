import test from 'node:test';
import assert from 'node:assert/strict';
import {discoverVideos,feedVideos,rankVideoEntries,verifyLinks} from './video-research.mjs';

const channel={id:'favorite',origin:'favorite',url:'https://www.youtube.com/channel/UC7rWtV-JngmNWe01-zkI21A'};
const xml='<entry><title>新着の問</title><yt:videoId>h5uVonVxjM4</yt:videoId><published>2026-11-25</published></entry>';
const video={url:'https://www.youtube.com/watch?v=h5uVonVxjM4',relation:'direct'};

test('episode discovery receives videos and deduplicates old picks and published versions of the same video',async()=>{
 assert.equal(feedVideos(xml,channel)[0].title,'新着の問');
 const catalog={channels:[channel],videos:[{...video,channel:channel.id,title:'以前に選んだ同じ動画'}]};
 const fetcher=async()=>({ok:true,text:async()=>xml});
 assert.equal((await discoverVideos(catalog,[],[],fetcher)).length,1);
 assert.deepEqual(await discoverVideos(catalog,[{videos:[{url:video.url+'&t=6'}]}],[],fetcher),[]);
});

test('verified favorites and underrepresented fields beat unrelated and repeated candidates',()=>{
 const entry={language:'ja',videoOrigin:{channel:channel.id,evidence:'reference',observed:'checked'},videos:[video],category:'科学',id:'test'};
 const lower={...entry,id:'underrepresented',category:'心理'};
 const unrelated={...entry,id:'other',videoOrigin:{...entry.videoOrigin,channel:'other'},category:'歴史'};
 const existing=[{videos:[],category:'科学',videoOrigin:{},id:'published'}];
 assert.deepEqual(rankVideoEntries([unrelated,entry,lower],existing,[channel]).map(e=>e.id),[lower.id,entry.id,unrelated.id]);
 assert.equal(rankVideoEntries([entry],[{...existing[0],videos:[{url:video.url+'&t=4'}]}],[channel]).length,0);
 assert.equal(rankVideoEntries([{...entry,videoOrigin:null}],existing,[channel]).length,0);
});

test('publication checks video metadata and rejects a broken reference',async()=>{
 const a={videos:[video],sources:[{url:'https://wired.jp/missing'}]};
 await assert.rejects(()=>verifyLinks(a,async url=>url.includes('oembed')?{ok:true,json:async()=>({type:'video',title:'Episode'})}:{status:404}),/404/);
 await assert.rejects(()=>verifyLinks({...a,sources:[]},async()=>({ok:true,json:async()=>({type:'article'})})),/video metadata/);
});
