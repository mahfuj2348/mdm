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
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
