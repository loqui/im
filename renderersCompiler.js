var fs = require('fs');
var jsdom = require('jsdom');

jsdom.env('src/index.html', {
  scripts: ['scripts/meteor/blaze.js'],
  done: function (errors, window) {
    var renderers = '/* jshint -W069 */\nRenderers = {};';
    var scripts = window.document.getElementsByTagName('script');
    for (var i in scripts) {
      var script = scripts[i];
      if (script.type == 'text/spacebars') {
        var name = script.getAttribute('name');
        var renderer = '\nRenderers[\'' + name + '\'] = ' +
          window.Spacebars.compile(script.innerHTML) + ';';
        renderers += renderer;
      }
    }
    fs.writeFileSync('src/scripts/loqui/blaze/renderers.js', renderers);
  }
});
