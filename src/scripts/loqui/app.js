'use strict';

var App = {

  name: 'Loqui IM',
  shortName: 'Loqui',
  version: 'v0.4.0',
  minorVersion: 'a',
  connectors: [],
  logForms: [],
  emoji: [],
  toSave: [],
  _accounts: new Blaze.Var([]),
  _settings: new Blaze.Var({}),
  _devsettings: new Blaze.Var({}),
  _avatars: new Blaze.Var({}),
  _online: new Blaze.Var(navigator.onLine),
  _notifications: new Blaze.Var([]),
  pathFiles: 'loqui/files/',
  pathBackup: 'loqui/backup/',
  caps: {},
  
  // Default values
  defaults: {
    App: {
      settings: {
        reconnect: true,
        sound: true,
        csn: true,
        boltGet: true,
        devMode: false
      },
      devsettings: {
		    devConsole: false,
        debug: false        
      },
      online: true
    },
    Account: {
      core: {
        enabled: true,
        resource: 'Loqui' + '-' + (Lungo.Core.environment().os ? Lungo.Core.environment().os.name : 'PC'),
        OTR: {
          enabled: false,
          key: null,
          logging: false
        }
      }
    },
    Chat: {
      chunkSize: 30,
      core: {
        settings: {
          muted: [false],
          otr: [false, 'switchOTR'],
          hidden: [false]
        }
      }
    },
    Connector: {
      presence: { 
        show: 'a'
      }
    },
    Provider: {
      BOSH: {
        timeout: 300
      }
    }
  },
  
  get accounts () {
    return this._accounts.get();  
  },
  set accounts (val) {
    this._accounts.set([].concat(val));
    this.accountsCores = [].concat(this.accountsCores);
  },
  
  get accountsCores () {
    return this.accounts.map(function (e, i, a) {
      return e.core;
    });
  },
  set accountsCores (val) {
    Store.put('accountsCores', val);
  },
  
  get settings () {
    return this._settings.get();
  },
  set settings (val) {
    for (var [key, value] in Iterator(val)) {
      $('body')[value ? 'addClass' : 'removeClass'](key);
    }
    Store.put('settings', val);
    this._settings.set($.extend({}, val));
  },
  
  get devsettings () {
    return this._devsettings.get();
  },
  set devsettings (val) {
    for (var [key, value] in Iterator(val)) {
      $('body')[value ? 'addClass' : 'removeClass'](key);
    }
    Store.put('devsettings', val);
    this._devsettings.set($.extend({}, val));
  },
  
  get online () {
    return this._online.get();
  },
  set online (val) {
    this._online.set(val);
    $('body')[0].dataset.online = val;
  },
  
  get avatars () {
    return this._avatars.get();
  },
  set avatars (val) {
    Store.put('avatars', val);
    this._avatars.set($.extend({}, val));
  },

  // This is the main procedure
  run: function () {
    // Initialize Store class
    Store.init();
    // Load settings and data from storage
    App.load().then(function () {
      // Log in or show wizard 
      App.upgrade();
      App.start();
    });
  },
  
  // Load settings and data from storage
  load: function () {
    return Promise.all([
        new Promise(function (callback) {
          Store.get('accountsCores', function (cores) {
            if (cores && cores.length) {
              var accounts = App.accounts;
              // Inflate accounts
              for (let [i, core] in Iterator(cores)) {
                var account = new Account(core);
                for (let [i, core] in Iterator(core.chats)) {
                  let chat = new Chat(core, account);
                  account.chats.push(chat);
                }
                accounts.push(account);
              }
              App.accounts = accounts;
            }
            callback(null);
          });
        }),
        new Promise(function (callback) {
          Store.get('settings', function (val) {
            App.settings = (val && Object.keys(val).length) ? val : App.defaults.App.settings;
            callback(null);
          });
        }),
        new Promise(function (callback) {
          Store.get('devsettings', function (val) {
            App.devsettings = (val && Object.keys(val).length) ? val : App.defaults.App.devsettings;
            callback(null);
          });
        }),
        new Promise(function (callback) {
          Store.get('avatars', function (val) {
            App.avatars = val || {};
            callback(null);
          });
        }),
        new Promise(function (callback) {
          Store.get('caps', function (val) {
            App.caps = val || {};
            callback(null);
          });
        })
      ]);
  },
  
  // Perform special processes if upgrading from older version
  upgrade: function () {
    var last = localStorage.getItem('version');
    var from = {
      'v0.2.5': function () {
        for (var key in App.accounts) {
          var account = App.accounts[key];
          account.core.roster = [];
          account.save();
        }
        from['v0.2.6']();
      },
      'v0.2.6': function () {
        Object.keys(App.avatars).map(function (key, i) { App.avatars[key] = {chunk: App.avatars[key]}; });
        App.accountsCores.forEach(function (account) {
          account.enabled = App.defaults.Account.core.enabled;
        });
        App.smartupdate('avatars');
        App.smartupdate('accountsCores');
        from['v0.3.0']();
      },
      'v0.3.0': function () {
        App.accountsCores.forEach(function (account) {
          var i = 0;
          account.chats.forEach(function (chat) {
            if (chat.muc) {
              Messenger.chatRemove(chat.jid, App.accounts[Accounts.find(account.fullJid)], true);
            }
            i++;
          });
        });
        App.smartupdate('accountsCores');
        from['v0.3.1']();
      },
      'v0.3.1': function () {
        from['v0.3.2']();
      },
      'v0.3.2': function () {
        from['v0.3.3']();
      },
      'v0.3.3': function () {
        for (var ai in App.accounts) {
          var account = App.accounts[ai];
          for (var ci in account.chats) {
            var chat = account.chats[ci];
            var muted = chat.core.settings.muted;
            chat.core.settings = $.extend({}, App.defaults.Chat.core.settings);
            chat.core.settings.muted[0] = muted instanceof Array ? muted[0] : muted;
          }
          account.save();
        }
        from['v0.3.4']();
      },
      'v0.3.4': function(){
        for (var ai in App.accounts) {
          var account = App.accounts[ai];
          for (var ci in account.chats) {
            var chat = account.chats[ci];
            var muted = chat.core.settings.muted;
            chat.core.settings = $.extend(chat.core.settings, App.defaults.Chat.core.settings);
          }
          account.save();
        }
      }
    };
    if (last < App.version && last in from) {
      Lungo.Notification.show('forward', _('Upgrading'), 5);
      from[last]();
    }
    localStorage.setItem('version', App.version);
  },
  
  // Bootstrap logins and so on
  start: function () {
    App.online = App.online;
    // If there is already a configured account
    if (App.accounts.length) {
      App.alarmSet({});
      this.connect();
      Menu.show('main');
      document.dispatchEvent(new Event('appReady'));
      // If there is more than one account, open the account switcher by default
      if (App.accounts.length > 1) {
        setTimeout(function () {
          Lungo.Aside.show('accounts');
        }, 1500);
      }
    } else {
      // Show wizard
      Menu.show('providers', null, 500);
    }
  },
  
  // Connect with every enabled account
  connect: function () {
    for (var i in this.accounts) {
      var account = this.accounts[i];
      if (account.core.enabled) {
        account.connect();
      }
    }
  },
  
  // Disconnect from every account
  disconnect: function () {
    for (var i in this.accounts) {
      var account = this.accounts[i];
      if (account.connector.isConnected()) {
        account.connector.disconnect();
      }
      account.accountRender();
      account.presenceRender();
    }
    $('section#main').attr('data-show', 'na');
  },
  
  // Update an array and put it in storage
  smartpush: function (key, value, callback) {
    this[key].push(value);
    Tools.log('PUSHING', value, 'TO', key, this[key]);
    Store.put(key, this[key], callback);
  },
  
  // Update an object and put it in storage
  smartupdate: function (key, callback) {
    /*Tools.log('SAVING', key, this[key]);
    Store.put(key, this[key], callback);*/
  },
  
  // Disconnect from every account
  killAll: function () {
    this.settings.reconnect = false;
    for (var i in this.accounts) {
      this.accounts[i].connector.disconnect();
    }
  },
  
  // Display a system notification or play a sound accordingly
  notify: function (core, altSound, force) {
    var alt = function () {
      App.audio(altSound);    
    };
    if (force || navigator.mozNotification && document.hidden) {
      if ('Notification' in window) {
        var notification = new Notification(core.subject, {body: core.text, icon: core.pic, tag: core.from});
        notification.onclick = function () {
          core.callback();
          App.notifications.length = 0;
        };
      } else if ('mozNotification' in navigator) {
        var notification = navigator.mozNotification.createNotification(core.subject, core.text, core.pic);
        notification.onclick = function () {
          core.callback();
          App.notifications.length = 0;
        };
        notification.show();
      }
      if (force) {
        alt();
      }
      return notification;
    } else {
      alt();
    }
  },
  
  // Play a sound
  audio: function (file) {
    if (App.settings.sound && !document.hidden) {
      $('audio[src="audio/' + file + '.ogg"]')[0].play();
    }
  },
  
  // Set an alarm for 90 seconds later so that app automatically reopens
  alarmSet: function (data) {
    if (navigator.mozAlarms) {
      var req = navigator.mozAlarms.add(new Date(Date.now()+90000), 'ignoreTimezone', data);
      req.onsuccess = function () { };
      req.onerror = function () { };
    }
  },
  
  // Bring app to foreground
  toForeground: function () {
    navigator.mozApps.getSelf().onsuccess = function (e) {
      var app = e.target.result;
      app.launch('Loqui IM');
    };
  }
  
};
