import {createHash} from 'node:crypto';
import {promises as fs} from 'node:fs';
import {fileURLToPath} from 'node:url';
const version='2026.10.26';
const binaries={
  darwin:['yt-dlp_macos','0f922c15ccc0b83eefa1c8bc9104e434318c4bf16e408e1ee93b7745a6efe0aa'],
  win32:['yt-dlp.exe','f5389d3698ecde4ef06f4e6b1ce0294fe9ac1396228c8990b8d3416d6d177a7d']
};
const [name,expected]=binaries[process.platform]||[];
if(!name)throw new Error('Release builds require Windows or macOS.');
const target=fileURLToPath(new URL('../vendor/'+name,import.meta.url));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
let existing;try{existing=await fs.readFile(target);}catch(e){if(e.code!=='ENOENT')throw e;}
if(existing&&hash(existing)===expected){console.log(name+' already verified');process.exit(0);}
const response=await fetch(`https://github.com/yt-dlp/yt-dlp/releases/download/${version}/${name}`);
if(!response.ok)throw new Error(`Download failed: HTTP ${response.status}`);
const bytes=Buffer.from(await response.arrayBuffer());
if(hash(bytes)!==expected)throw new Error('Vendor checksum mismatch');
await fs.writeFile(target,bytes,{mode:0o755});console.log('Verified '+name);
