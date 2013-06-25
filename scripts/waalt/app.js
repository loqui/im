'use strict';

var App;

App = {
  
  version: '009',
  connected: false,
  
  default: {
    App: {
      settings: { muted: false }
    },
    XMPP: {
      settings: {
        reconnect: false,
        resource: 'LOQUI-' + ($$.environment().os ? $$.environment().os.name : 'PC')
      },
      presence: { show: 'a', status: 'Using LOQUI on ' + ($$.environment().os ? $$.environment().os.name : 'my PC') },
      miniRoster: { },
      me: { }
    },
    Messenger: {
      chats: [],
      avatars: { },
      settings: { disHide: false },
      sendQ: []
    },
    Message: {
      chunkSize: 20
    },
    host: {
      "name": "LOQUI",
      "domain": "loqui.im",
      "country": "ES",
      "bosh": "https://app.loqui.im/http-bind"
    },
    shows: {
      chat: 'Talkative',
      a: 'Available',
      away: 'Away',
      xa: 'Extended absence',
      dnd: 'Do not disturb',
      na: 'Not available' 
    }
  },
  
  run: function () {
    async.parallel([
      function (callback) {
        Store.init();
        callback(null);
      },
      function (callback) {
        App.load(callback);
      }
    ], function (err, results) {
      App.start();
    });
  },
  
  load: function (callback) {
    async.parallel([
      function (callback){
        asyncStorage.getItem('asettings', function (val){
          App.settings = val ? JSON.parse(val) : App.default.App.settings;
          callback(null);
        });
      },
      function (callback){
        asyncStorage.getItem('xsettings', function (val){
          XMPP.settings = val ? JSON.parse(val) : App.default.XMPP.settings;
          callback(null);
        });
      },
      function (callback){
        asyncStorage.getItem('xpresence', function (val){
          XMPP.presence = val ? JSON.parse(val) : App.default.XMPP.presence;
          callback(null);
        });
      },
      function (callback){
        asyncStorage.getItem('xroster', function (val){
          XMPP.miniRoster = val ? JSON.parse(val) : App.default.XMPP.miniRoster;
          callback(null);
        });
      },
      function (callback){
        asyncStorage.getItem('xme', function (val){
          XMPP.me = val ? JSON.parse(val) : App.default.XMPP.me;
          callback(null);
        });
      },
      function (callback){
        asyncStorage.getItem('mchats', function (val){
          Messenger.chats = val ? JSON.parse(val) : App.default.Messenger.chats;
          callback(null);
        });
      },
      function (callback){
        asyncStorage.getItem('mavatars', function (val){
          Messenger.avatars = val ? JSON.parse(val) : App.default.Messenger.avatars;
          callback(null);
        });
      },
      function (callback){
        asyncStorage.getItem('msendQ', function (val){
          Messenger.sendQ = val?JSON.parse(val) : App.default.Messenger.sendQ;
          callback(null);
        });
      },
      function (callback){
        asyncStorage.getItem('msettings', function (val){
          Messenger.settings = val ? JSON.parse(val) : App.default.Messenger.settings;
          callback(null);
        });
      },
    ], function (err, results) {
      callback(null);
    });
  },
  
  start: function () {
    if (XMPP.settings.jid) {
      if (XMPP.settings.reconnect) {
        App.light('na');
        App.alarmSet({});
        Messenger.render('chats');
        Messenger.render('contacts');
        Messenger.render('me');
        Messenger.render('avatars');
        XMPP.connect();
        Lungo.Router.section('main');
      }else {
        Lungo.Router.section("login");
      }
    } else {
      // FIRST RUN
      setTimeout(function () {Lungo.Router.section("welcome");}, 1500);
    }
  },
  
  light: function (show) {
  	$$('body').attr('data-show', show);
    $$('section header span.showbar').attr('data-show', show);
  },
  
  audio: function (file) {
    if (!(App.settings.muted || (document.hidden && navigator.mozNotification))) { 
      $$('audio[src=\'audio/' + file + '.ogg\']')[0].play();
    }
  },
  
  notify: function (subject, text, pic, callback) {
    App.lastNot = navigator.mozNotification.createNotification(subject, text, pic);
		App.lastNot.onclick = function(){
      callback();
	  }
		App.lastNot.show();
  },
  
  toForeground: function () {
    navigator.mozApps.getSelf().onsuccess = function (e) {
      var app = e.target.result;
      app.launch('loqui');
    };
  },
  
  alarmSet: function (data) {
    if (navigator.mozAlarms) {
      var req = navigator.mozAlarms.add(new Date(Date.now()+60000), 'ignoreTimezone', data);
      req.onsuccess = function () { }
      req.onerror = function () { }
    } else { }
  },
  
  dialog: function (id) {
    if($$('aside#options').hasClass('show'))Lungo.Router.aside('main', 'options');
    Lungo.Router.section("dialog");
    Lungo.Router.article(id, id);
    Lungo.View.Article.title($$('section#dialog article#' + id).attr('data-title'));
  },
  
  notNow: function (action) {
  	alert('Sorry. You can\'t ' + (action || 'perform this operation') + ' while offline.');
  },
  
  killall: function () {
    asyncStorage.clear();
    document.location.reload();
  }

}

if (navigator.mozAlarms) {
  navigator.mozSetMessageHandler("alarm", function (message) { 
    App.alarmSet(message.data);
  });
}

$$(document).ready(function () {
  App.run();
});
