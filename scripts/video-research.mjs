import {videoKey} from './check.mjs';

export const favoriteChannels=catalog=>catalog.channels.filter(channel=>channel.origin==='favorite');

export function feedVideos(xml,channel){
 return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].flatMap(([,entry])=>{
  const id=entry.match(/<yt:videoId>([\w-]{11})<\/yt:videoId>/)?.[1];
  const title=entry.match(/<title>([^<]+)<\/title>/)?.[1];
  const published=entry.match(/<published>([^<]+)<\/published>/)?.[1];
  return id&&title&&published?[{id,title,channel:channel.id,url:'https://www.youtube.com/watch?v='+id,published}]:[];
 });
}

export async function discoverVideos(catalog,articles,bank,fetcher=fetch){
 const favorites=favoriteChannels(catalog);
 const known=new Set([...articles.flatMap(a=>a.videos),...bank.flatMap(a=>a.videos)].map(v=>videoKey(v.url)));
 const feeds=await Promise.allSettled(favorites.map(async channel=>{
  const channelId=new URL(channel.url).pathname.split('/').at(-1);
  if(!/^UC[\w-]{22}$/.test(channelId))throw Error('Invalid favorite channel ID');
  const response=await fetcher('https://www.youtube.com/feeds/videos.xml?channel_id='+channelId,{signal:AbortSignal.timeout(12000)});
  if(!response.ok)throw Error('YouTube feed '+response.status);
  return feedVideos(await response.text(),channel);
 }));
 const latest=feeds.map((feed,i)=>{
  if(feed.status==='fulfilled')return feed.value;
  console.warn('Video feed unavailable:',favorites[i].id,feed.reason.message);
  return [];
 });
 const archive=catalog.videos.filter(v=>favorites.some(c=>c.id===v.channel));
 const candidates=[];
 // Keep older editorial picks in circulation and interleave channels for new arrivals.
 for(const video of [...archive,...Array.from({length:Math.max(0,...latest.map(v=>v.length))},(_,i)=>latest.flatMap(feed=>feed[i]?[feed[i]]:[])).flat()]){
  const key=videoKey(video.url);
  if(known.has(key))continue;
  known.add(key);
  candidates.push({channel:video.channel,title:video.title,url:video.url,published:video.published});
 }
 return candidates;
}

export function rankVideoEntries(entries,articles,favorites){
 const channels=new Set(favorites.map(c=>c.id));
 const used=new Set(articles.flatMap(a=>a.videos).map(v=>videoKey(v.url)));
 const topics=new Set(articles.map(a=>a.id));
 const counts=new Map();
 for(const a of articles.filter(a=>a.videoOrigin))counts.set(a.category,(counts.get(a.category)||0)+1);
 return entries.filter(entry=>entry.language==='ja'&&entry.videoOrigin?.observed&&entry.videoOrigin?.evidence&&
  entry.videos?.[0]?.relation==='direct'&&!topics.has(entry.id)&&!used.has(videoKey(entry.videos[0].url)))
  .sort((a,b)=>Number(channels.has(b.videoOrigin.channel))-Number(channels.has(a.videoOrigin.channel))||
    (counts.get(a.category)||0)-(counts.get(b.category)||0));
}

async function probe(url,fetcher){
 const original=new URL(url);
 const youtube=videoKey(url).startsWith('youtube:');
 const target=youtube?'https://www.youtube.com/oembed?format=json&url='+encodeURIComponent(url):url;
 const response=await fetcher(target,{signal:AbortSignal.timeout(15000)});
 if(!response.ok)throw Error(`Reference returned ${response.status}: ${original.hostname}`);
 if(youtube){
  const result=await response.json();
  if(result.type!=='video'||!result.title)throw Error('YouTube did not return video metadata');
 }else await response.body?.cancel();
}

export async function verifyLinks(article,fetcher=fetch){
 const urls=new Set([...article.videos.map(v=>v.url),...article.sources.map(s=>s.url),article.videoOrigin?.evidence].filter(Boolean));
 await Promise.all([...urls].map(url=>probe(url,fetcher)));
}
