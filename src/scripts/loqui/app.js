'use strict';

var App = {

  name: 'Loqui IM',
  shortName: 'Loqui',
  version: 'v0.3.1',
  minorVersion: 'a',
  connectors: [],
  logForms: [],
  emoji: [],
  toSave: [],
  accounts: [],
  accountsCores: [],
  settings: {},
  devsettings: {},
  avatars: {},
  online: true,
  notifications: [],
  pathFiles: 'loqui/files/',
  pathBackup: 'loqui/backup/',
  caps: {},
  
  // Default values
  defaults: {
    App: {
      settings: {
        reconnect: true,
        sound: true,
        disHide: false,
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
          muted: false
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
  
  // This is the main procedure
  run: function () {
    // Initialize Store class
    Store.init();
    // Load settings and data from storage
    App.load(function () {
      // Log in or show wizard 
      App.upgrade();
      App.start();
    });
  },
  
  // Load settings and data from storage
  load: function (callback) {
    async.parallel([
      function (callback) {
        Store.get('accountsCores', function (val) {
          App.accounts = [];
          App.accountsCores = val || [];
          if (App.accountsCores.length) {
            // Inflate accounts
            for (var i in App.accountsCores) {
              var account = new Account(App.accountsCores[i]);
              // Inflate chats
              for (var j in account.core.chats) {
                var chat = new Chat(account.core.chats[j], account);
                account.chats.push(chat);
              }
              App.accounts.push(account);
            }
          }
          callback(null);
        });
      },
      function (callback) {
        Store.get('settings', function (val) {
          App.settings = val && Object.keys(val).length ? val : App.defaults.App.settings;
          callback(null);
        });
      },
      function (callback) {
        Store.get('devsettings', function (val) {
          App.devsettings = val && Object.keys(val).length ? val : App.defaults.App.devsettings;
          callback(null);
        });
      },
      function (callback) {
        Store.get('avatars', function (val) {
          App.avatars = val || {};
          callback(null);
        });
      },
      function (callback) {
        Store.get('caps', function (val) {
          App.caps = val || {};
          callback(null);
        });
      }
    ], function (err, results) {
      callback(null);
    });
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
        Object.keys(App.avatars).map(function (key, i) { App.avatars[key] = {chunk: App.avatars[key]} })
        App.accountsCores.forEach(function (account) {
          account.enabled = App.defaults.Account.core.enabled;
        });
        App.smartupdate('avatars');
        App.smartupdate('accountCores');
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
    // If there is already a configured account
    if (App.accounts.length) {
      App.alarmSet({});
      App.switchesRender();
      App.switchesDevRender();
      this.connect();
      Menu.show('main');
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
    Tools.log('SAVING', key, this[key]);
    Store.put(key, this[key], callback);
  },
  
  // Disconnect from every account
  killAll: function () {
    this.settings.reconnect = false;
    for (var i in this.accounts) {
      this.accounts[i].connector.disconnect();
    }
  },
  
  // Render settings switches
  switchesRender: function () {
    var ul = $('section#settings article#features ul').empty();
    var body = $('body');
    for (var key in App.defaults.App.settings) {
      if (!(key in this.settings)) {
        this.settings[key] = App.defaults.App.settings[key];
      }
      var value = this.settings[key];
      var li = $('<li><span></span><switch/></li>');
      li.children('span').text(_('Set' + key));
      var div = $('<div class="switch"><div class="ball"></div><img src="img/tick.svg" class="tick" /></div>')
      li.children('switch').replaceWith(div);
      li.data('key', key);
      li.data('value', value);
      li.bind('click', function () {
        var key = this.dataset.key;
        var newVal = this.dataset.value == "true" ? false : true;
        this.dataset.value = newVal;
        App.settings[key] = newVal;
        if (newVal) {
          body.addClass(key);
        } else {
          body.removeClass(key);
        }
        App.smartupdate('settings');
      });
      ul.append(li);
      if (value) {
        body.addClass(key);
      } else {
        body.removeClass(key);
      }
    }
    App.smartupdate('settings');
  },

  switchesDevRender: function () {
    var ul = $('section#settings article#devmode ul').empty();
    var body = $('body');
    for (var key in this.devsettings) {
      var value = this.devsettings[key];
      var li = $('<li><span></span><switch/></li>');
      li.children('span').text(_('Set' + key));
      var div = $('<div class="switch"><div class="ball"></div><img src="img/tick.svg" class="tick" /></div>')
      li.children('switch').replaceWith(div);
      li.data('key', key);
      li.data('value', value);
      li.bind('click', function () {
        var key = this.dataset.key;
        var newVal = this.dataset.value == "true" ? false : true;
        this.dataset.value = newVal;
        App.devsettings[key] = newVal;
        if (newVal) {
          body.addClass(key);
        } else {
          body.removeClass(key);
        }
        App.smartupdate('devsettings');
      });
      ul.append(li);
      if (value) {
        body.addClass(key);
      } else {
        body.removeClass(key);
      }
    }
  },
  
  // Display a system notification or play a sound accordingly
  notify: function (core, altSound, force) {
    var alt = function () {
      App.audio(altSound);    
    }
    if (force || navigator.mozNotification && document.hidden) {
      if ('Notification' in window) {
        var notification = new Notification(core.subject, {body: core.text, icon: core.pic});
        notification.onclick = function () {
          core.callback();
          App.notifications.length = 0;
        }
      } else if ('mozNotification' in navigator) {
        var notification = navigator.mozNotification.createNotification(core.subject, core.text, core.pic);
        notification.onclick = function () {
          core.callback();
          App.notifications.length = 0;
        }
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
    if (App.settings.sound) {
      $('audio[src="audio/' + file + '.ogg"]')[0].play();
    }
  },
  
  // Set an alarm for 90 seconds later so that app automatically reopens
  alarmSet: function (data) {
    if (navigator.mozAlarms) {
      var req = navigator.mozAlarms.add(new Date(Date.now()+90000), 'ignoreTimezone', data);
      req.onsuccess = function () { }
      req.onerror = function () { }
    }
  },
  
  // Bring app to foreground
  toForeground: function () {
    navigator.mozApps.getSelf().onsuccess = function (e) {
      var app = e.target.result;
      app.launch('Loqui IM');
    };
  }
  
}
