chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', { bounds: { height : 570, width : 320 } });
});
