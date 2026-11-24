// Artifact listing can lag behind a successful upload. Wait for this exact run/attempt.
export async function waitForArtifact({api,repository,runId,name,token,fetcher=fetch,pause=ms=>new Promise(r=>setTimeout(r,ms))}){
 for(let attempt=0;attempt<10;attempt++){
  const r=await fetcher(`${api}/repos/${repository}/actions/runs/${runId}/artifacts`,{headers:{Accept:'application/vnd.github+json',Authorization:`Bearer ${token}`},signal:AbortSignal.timeout(15000)});
  if(!r.ok)throw Error(`Cannot check Pages artifact (${r.status})`);
  const {artifacts}=await r.json();
  if(artifacts?.some(a=>a.name===name&&!a.expired)){console.log('Pages artifact is ready.');return;}
  await pause(3000);
 }
 throw Error('Uploaded Pages artifact is not visible yet; retry this workflow.');
}
if(process.argv[1]?.endsWith('wait-pages-artifact.mjs'))waitForArtifact({api:process.env.GITHUB_API_URL,repository:process.env.GITHUB_REPOSITORY,runId:process.env.GITHUB_RUN_ID,name:process.env.PAGES_ARTIFACT_NAME,token:process.env.GITHUB_TOKEN}).catch(e=>{console.error(e.message);process.exitCode=1});
