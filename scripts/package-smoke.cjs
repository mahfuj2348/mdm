// Verify the shipped runtime and media executables, not just source dependencies.
const {execFileSync}=require('node:child_process');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const win=process.platform==='win32';
let appRoot;
if(win){
  const installer=fs.readdirSync(path.join(root,'release')).find(name=>name.endsWith('-Setup.exe'));
  assert.ok(installer,'Windows installer is missing');
  appRoot=path.join(process.env.RUNNER_TEMP||require('node:os').tmpdir(),'MDM-installer-smoke');
  execFileSync(path.join(root,'release',installer),['/S','/D='+appRoot],{timeout:180000,stdio:'pipe'});
} else {
  appRoot=path.join(root,'release',process.arch==='arm64'?'mac-arm64':'mac','MDM.app','Contents');
}
const resources=path.join(appRoot,win?'resources':'Resources');
const exe=path.join(appRoot,win?'MDM.exe':'MacOS/MDM');
const probe=`const fs=require('node:fs'); const path=require('node:path');
const r=${JSON.stringify(resources)};
const pkg=require(path.join(r,'app.asar','package.json'));
if(pkg.version!==${JSON.stringify(require('../package.json').version)})throw new Error('Wrong package version');
for(const file of ['browser/extension/manifest.json','browser/integration/native-host.cjs',${JSON.stringify(win?'browser/integration/native-host.exe':'browser/integration/native-host.sh')}])fs.accessSync(path.join(r,file));
import(require('node:url').pathToFileURL(path.join(r,'app.asar','core','engine.mjs')).href).then(m=>{if(!m.DownloadEngine)throw new Error('Missing engine');console.log('Runtime and download engine OK');}).catch(e=>{console.error(e);process.exit(1)});`;
console.log(execFileSync(exe,['-e',probe],{env:{...process.env,ELECTRON_RUN_AS_NODE:'1'},encoding:'utf8',timeout:30000}));
for(const tool of [path.join(resources,'app.asar.unpacked','node_modules','ffmpeg-static',win?'ffmpeg.exe':'ffmpeg'),path.join(resources,'tools',win?'yt-dlp.exe':'yt-dlp_macos')]){
  const result=execFileSync(tool,[tool.includes('ffmpeg')?'-version':'--version'],{encoding:'utf8',timeout:30000});
  console.log(path.basename(tool)+': '+result.split('\n')[0]);
}
console.log(win?'PASS: silent installer, bundled runtime, connector, FFmpeg and yt-dlp':'PASS: app bundle, runtime, connector, FFmpeg and yt-dlp');
