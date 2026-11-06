function showProgress(window, browserDisplay = null) {
  if(window.isDestroyed())return;
  if (browserDisplay) {
    // Order the panel on the browser's display without activating the MDM app.
    window.setVisibleOnAllWorkspaces(true, {visibleOnFullScreen:true, skipTransformProcessType:true});
    const [width,height] = window.getSize();
    const {x,y,width:availableWidth,height:availableHeight} = browserDisplay;
    window.setPosition(x + Math.max(0,Math.round((availableWidth-width)/2)),
      y + Math.max(0,Math.round((availableHeight-height)/2)), false);
    window.setAlwaysOnTop(true, 'floating');
    window.showInactive();
    return;
  }
  if(window.isMinimized())window.restore();
  window.show();
  // moveTop changes z-order even when Windows declines an ordinary focus
  // request. The temporary topmost pulse avoids leaving progress windows
  // permanently above every application.
  window.setAlwaysOnTop?.(true);
  window.moveTop?.();
  window.focus();
  window.setAlwaysOnTop?.(false);
}
function closeCancelledProgress(window,download){
  if(!download || download.status==='cancelled'){
    if(!window.isDestroyed())window.close();
    return true;
  }
  return false;
}
module.exports={showProgress,closeCancelledProgress};
