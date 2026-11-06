import test from 'node:test';
import assert from 'node:assert/strict';
import windows from '../desktop/progress-window.cjs';
test('opening a minimized transfer restores it before showing and focusing',()=>{
  const calls=[];
  const window={isDestroyed:()=>false,isMinimized:()=>true,restore:()=>calls.push('restore'),show:()=>calls.push('show'),setAlwaysOnTop:value=>calls.push(`top:${value}`),moveTop:()=>calls.push('moveTop'),focus:()=>calls.push('focus')};
  windows.showProgress(window);assert.deepEqual(calls,['restore','show','top:true','moveTop','focus','top:false']);
});
test('cancel closes progress, but completion keeps its completion actions visible',()=>{
  let closed=0;const window={isDestroyed:()=>false,close:()=>closed++};
  assert.equal(windows.closeCancelledProgress(window,{status:'complete'}),false);
  assert.equal(windows.closeCancelledProgress(window,{status:'downloading'}),false);
  assert.equal(windows.closeCancelledProgress(window,{status:'cancelled'}),true);
  assert.equal(closed,1);
});

test('browser panel opens on the clicked display without activating the main desktop',()=>{
  const calls=[];
  const window={isDestroyed:()=>false,getSize:()=>[560,480],
    setVisibleOnAllWorkspaces:(v,options)=>calls.push([v,options]),
    setPosition:(...args)=>calls.push(args),setAlwaysOnTop:(...args)=>calls.push(args),
    showInactive:()=>calls.push('inactive')};
  windows.showProgress(window,{x:-1440,y:40,width:1440,height:860});
  assert.deepEqual(calls,[[true,{visibleOnFullScreen:true,skipTransformProcessType:true}],[-1000,230,false],[true,'floating'],'inactive']);
});
