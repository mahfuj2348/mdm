const {chromium}=require('playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try {
 const page=await browser.newPage({viewport:{width:1000,height:800}});
 await page.setContent('<div style="height:120px"></div><video style="width:600px;height:340px;background:#222"></video><div style="height:1500px"></div>');
 await page.evaluate(()=>{
  const orig=Element.prototype.attachShadow;
  Element.prototype.attachShadow=function(init){const root=orig.call(this,init);window.testShadow=root;return root;};
  window.chrome={runtime:{id:'test',sendMessage:async()=>({ok:true,items:[]}),onMessage:{addListener(){},removeListener(){}}}};
 });
 await page.addScriptTag({content:fs.readFileSync('extension/content.js','utf8')});
 const rect=await page.evaluate(()=>{const r=window.testShadow.querySelector('.download').getBoundingClientRect();return {x:r.x+20,y:r.y+10};});
 await page.mouse.move(150,250);
 await page.mouse.move(rect.x,rect.y,{steps:10});
 await page.mouse.click(rect.x,rect.y);
 assert.equal(await page.evaluate(()=>!!window.testShadow.querySelector('.chooser')),true);
 await page.evaluate(()=>document.querySelector('video').remove());
 await page.waitForTimeout(1000);
 assert.equal(await page.evaluate(()=>getComputedStyle(window.testShadow.host).display),'block');
 await page.mouse.wheel(0,200);await page.waitForTimeout(100);
 assert.equal(await page.evaluate(()=>!!window.testShadow.querySelector('.chooser')),true);
 await page.keyboard.press('Escape');
 assert.equal(await page.evaluate(()=>!!window.testShadow.querySelector('.chooser')),false);
 console.log('PASS: real Chromium pointer travel, preview removal, scroll and Escape');
 const feed=await browser.newPage();
 await feed.route('https://www.youtube.com/**',route=>route.fulfill({contentType:'text/html',body:'<a id="thumbnail" href="/watch?v=abcdefghijk" style="display:block;width:400px;height:220px;background:#ddd"><video></video></a>'}));
 await feed.goto('https://www.youtube.com/');
 await feed.evaluate(()=>{
   const original=Element.prototype.attachShadow;
   Element.prototype.attachShadow=function(options){const root=original.call(this,options);window.panel=root;return root;};
   window.chrome={runtime:{id:'test',onMessage:{addListener(){}},sendMessage:async message=>{window.handoff=message;return {ok:true};}}};
 });
 for(const name of ['media-choices.js','content.js'])await feed.addScriptTag({content:fs.readFileSync('extension/'+name,'utf8')});
 await feed.mouse.move(100,120);
 await feed.waitForFunction(()=>window.panel.host.offsetWidth>0);
 await feed.evaluate(()=>document.querySelector('video').remove());
 await feed.waitForTimeout(1000);
 const target=await feed.evaluate(()=>{const r=window.panel.querySelector('.download').getBoundingClientRect();return {x:r.left+10,y:r.top+10};});
 await feed.mouse.click(target.x,target.y);
 const row=await feed.evaluate(()=>{const r=window.panel.querySelector('.row').getBoundingClientRect();return {x:r.left+10,y:r.top+10};});
 await feed.mouse.click(row.x,row.y);
 assert.equal(await feed.evaluate(()=>window.handoff.item.url),'https://www.youtube.com/watch?v=abcdefghijk');
 console.log('PASS: YouTube thumbnail handoff after preview is removed');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
