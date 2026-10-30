export function streamProgress(segments) {
  const complete=segments.filter(s=>s.done), downloaded=segments.reduce((n,s)=>n+s.downloaded,0);
  const completedBytes=complete.reduce((n,s)=>n+s.downloaded,0);
  return {completed:complete.length,total:segments.length,estimatedBytes:complete.length>=2&&complete.length<segments.length?Math.max(downloaded,completedBytes/complete.length*segments.length):null};
}

// A measured rolling window absorbs packet/segment bursts without inventing
// progress. A genuine stall reaches zero after the window expires.
export function transferRate(initialBytes = 0, initialTime = Date.now(), windowMs = 2000) {
  const samples = [{bytes: initialBytes, time: initialTime}];
  return (bytes, time = Date.now()) => {
    if (bytes < samples.at(-1).bytes) samples.splice(0, samples.length, {bytes, time});
    samples.push({bytes, time});
    while (samples.length > 2 && samples[1].time <= time - windowMs) samples.shift();
    const first = samples[0];
    return Math.max(0, (bytes - first.bytes) * 1000 / Math.max(1, time - first.time));
  };
}
