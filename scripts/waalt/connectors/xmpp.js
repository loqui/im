'use strict';

App.connectors['XMPP'] = function (account) {
  
  this.account = account;
  this.provider = Providers.data[account.core.provider];
  this.presence = {
    show: App.defaults.Connector.presence.show,
    status: App.defaults.Connector.presence.status
  };
  this.handlers = {};
  this.events = {}
  this.chat = {};
  this.connected = false;
  
  this.connection = new Strophe.Connection(this.provider.connector.host);
  
  this.connect = function (callback) {
    var user = this.account.core.user;
    var pass = this.account.core.pass;
    var handler = function (status) {
     switch (status) {
        case Strophe.Status.CONNECTING:
          console.log('Connecting');
          if (callback.connecting) {
            callback.connecting();
          }
          break;
        case Strophe.Status.CONNFAIL:
          console.log('Connection failed');
          if (callback.connfail) {
            callback.connfail();
          }
          break;
        case Strophe.Status.AUTHENTICATING:
          console.log('Authenticating');
          if (callback.authenticating) {
            callback.authenticating();
          }
          break;
        case Strophe.Status.AUTHFAIL:
          console.log('Authentication failed');
          if (callback.authfail) {
            callback.authfail();
          }
          break;
        case Strophe.Status.CONNECTED:
          console.log('Connected');
          this.connected = true;
          if (callback.connected) {
            callback.connected();
          }
          break;
        case Strophe.Status.DISCONNECTING:
          console.log('Disconnecting');
          if (callback.disconnecting) {
            callback.disconnecting();
          }
          break;
        case Strophe.Status.DISCONNECTED:
          console.log('Disconnected');
          if (callback.disconnected) {
            callback.disconnected();
          }
          break;
      }
    }.bind(this);
    this.connection.connect(user, pass, handler, this.provider.connector.timeout);
  }
  
  this.disconnect = function () {
    this.connected = false;
  }
  
  this.isConnected = function () {
    return App.online && this.connected;
  }
  
  this.start = function () {
    this.presence.set();
    this.handlers.init();
  }
  
  this.sync = function (callback) {
    var account = this.account;
    var connector = this;
    var fullJid = Strophe.getBareJidFromJid(connector.connection.jid);
    if (account.core.fullJid != fullJid) {
      account.core.fullJid = fullJid;
      account.save();
    }
    var rosterCb = function (items, item, to) {
      if (to) {
        var sameOrigin = Strophe.getDomainFromJid(to) == Providers.data[account.core.provider].autodomain;
        var noMulti = !account.supports('multi');
        if (to == account.core.user || (noMulti && sameOrigin)) {
          connector.roster = items;
          connector.roster.sort(function (a,b) {
            var aname = a.name ? a.name : a.jid;
            var bname = b.name ? b.name : b.jid;
            return aname > bname;
          });
          var map = function (entry, cb) {
            var show, status;
            for (var j in entry.resources) {
              show = entry.resources[Object.keys(entry.resources)[0]].show || 'a';
              status = entry.resources[Object.keys(entry.resources)[0]].status || _('show' + show);
              break;
            }
            cb(null, {
              jid: entry.jid,
              name: entry.name,
              show: show,
              status: status
            });
          }
          async.map(connector.roster, map.bind(account), function (err, result) {
            account.core.roster = result;
            account.presenceRender();
          });
        }
      }
    }
    connector.connection.roster.registerCallback(rosterCb.bind(account));
    connector.connection.roster.get( function (ret) {
      rosterCb(ret, null, account.core.user);
      if (account.supports('vcard')) {
        connector.connection.vcard.get( function (data) {
          connector.vcard = $(data).find('vCard').get(0);
          callback();
        });
      } else {
        callback();
      }
    });
  }.bind(this);
  
  this.presence.set = function (show, status) {
    this.presence.show = show || this.presence.show;
    this.presence.status = status || this.presence.status;
    this.presence.send();
  }.bind(this);
  
  this.presence.send = function (show, status, priority) {
    var show = show || this.presence.show;
    var status = status || this.presence.status;
    var priority = priority || '127';
    if (App.online && this.connection.connected) {
      var msg = $pres();
      if (show != 'a') {
        msg.c('show', {}, show);
      }
      if (status) {
        msg.c('status', {}, status);
      }
      msg.c('priority', {}, priority);
      this.connection.send(msg.tree());
    }
    $('section#main').attr('data-show', show);
  }.bind(this);
  
  this.send = function (to, text, delay) {
    this.connection.Messaging.send(to, text, delay);
  }.bind(this);
  
  this.avatar = function (callback, jid) {
    var extract = function (vcard) {
      if (vcard.find('BINVAL').length) {
        var img = vcard.find('BINVAL').text();
        var type = vcard.find('TYPE').text();
        var avatar = 'data:' + type + ';base64,' + img;
      } else {
        var avatar = 'img/foovatar.png';
      }
      if (callback) {
        callback(avatar);
      } 
    }
    if (jid) {
      this.connection.vcard.get(function(data) {
        var vcard = $(data).find('vCard');
        extract(vcard);
      }, jid);
    } else {
      extract($(this.vcard));
    }
  }.bind(this);
  
  this.csnSend = function (to, state) {
      this.connection.Messaging.csnSend(to, state);
  }
  
  this.emojiRender = function (img, emoji) {
    App.emoji[Providers.data[this.account.core.provider].emoji].render(img, emoji);
  }.bind(this);
  
  this.handlers.init = function () {
    if (!this.handlers.onMessage) {
      this.handlers.onMessage = this.connection.addHandler(this.events.onMessage, null, 'message', 'chat', null, null);
    }
    if (!this.handlers.onSubRequest) {
      this.handlers.onSubRequest = this.connection.addHandler(this.events.onSubRequest, null, 'presence', 'subscribe', null, null);
    }
    if (!this.handlers.onAttention) {
      this.attention = new AttentionPlugin(this.connection);
      this.handlers.onAttention = this.attention.setCallback(this.events.onAttention);
    }
  }.bind(this);
  
  this.events.onMessage = function (stanza) {
    var account = this.account;
    var tree = $(stanza);
    var from = Strophe.getBareJidFromJid(tree.attr('from'));
    var to = Strophe.getBareJidFromJid(tree.attr('to'));
    var body = tree.children("body").length ? tree.children("body").text() : null;
    var composing = tree.children("composing").length;
    var paused = tree.children("paused").length || tree.children("active").length;
    if (body) {
      var date = new Date();
      var stamp = tree.children('delay').length
        ? Tools.localize(tree.children('delay').attr('stamp'))
        : Tools.localize(Tools.stamp());
      var msg = new Message(account, {
        from: from,
        to: to,
        text: body,
        stamp: stamp
      });
      msg.receive();
    }
    if (account.supports('csn') && App.settings.csn) {
      if(composing && from == $('section#chat').data('jid')){
        $("section#chat #typing").show();
      }else if(paused && from == $('section#chat').data('jid')){
        $("section#chat #typing").hide();
      }
    }
    return true;
  }.bind(this);
  
  this.events.onSubRequest = function (stanza) {
    this.connection.roster.authorize(Strophe.getBareJidFromJid($(stanza).attr('from')));
    return true;
  }.bind(this);
  
  this.events.onAttention = function (stanza) {
    if (App.settings.boltGet) {
      var from = Strophe.getBareJidFromJid($(stanza).attr('from'));
      var chat = this.account.chats[this.account.chatFind(from)];
      if (!chat) {
        var contact = Lungo.Core.findByProperty(this.account.core.roster, 'jid', from);
        chat = new Chat({
          jid: from,
          title: contact ? contact.name || from : from,
          chunks: []
        }, connector.account);
      }
      window.navigator.vibrate([100,30,100,30,100,200,200,30,200,30,200,200,100,30,100,30,100]);
      App.notify({
        subject: chat.core.title,
        text: _('HasSentYouABolt'),
        pic: 'img/bolt.png',
        callback: function () {
          chat.show();
          App.toForeground();
        }
      }, 'thunder');
    }
    console.log(from, 'sent you a bolt.');
    return true;
  }.bind(this);
  
}

App.logForms['XMPP'] = function (article, provider, data) {
  article
    .append($('<h1/>').style('color', data.color).html(_('SettingUp', { provider: data.longName })))
    .append($('<img/>').attr('src', 'img/providers/' + provider + '.svg'))
    .append($('<label/>').attr('for', 'user').text(_(data.terms['user'], { provider: data.altname })))
    .append($('<input/>').attr('type', 'text').attr('name', 'user').attr('placeholder', (data.terms.placeholder || _(data.terms['user'], { provider: data.altname }) )))
    .append($('<label/>').attr('for', 'pass').text(_(data.terms['pass'])))
    .append($('<input/>').attr('type', 'password').attr('name', 'pass').attr('placeholder', '******'));
  if (data.notice) {
    article.append($('<small/>').html(_(provider + 'Notice')));
  }
  var buttongroup = $('<div/>').addClass('buttongroup');
  var submit = $('<button/>').data('role', 'submit').style('backgroundColor', data.color).text(_('LogIn'));
  var back = $('<button/>').data('view-section', 'back').text(_('GoBack'));
  submit.bind('click', function () {
    var article = this.parentNode.parentNode;
    var provider = article.parentNode.id;
    var user = Providers.autoComplete($(article).children('[name="user"]').val(), provider);
    var pass = $(article).children('[name="pass"]').val();
    var cc = $(article).children('[name="cc"]').val();
    if (user && pass) {
      var account = new Account({
        user: user,
        pass: pass,
        provider: provider,
        resource: App.defaults.Account.core.resource,
        chats: []
      });
      account.test();
    }
  });
  buttongroup.append(submit).append(back);
  article.append(buttongroup);
}

App.emoji['XMPP'] = {
  
  map: [
    ['>:-(', '>:('],
    [';)', ';-)'],
    [':-!', ':!'],
    [':-[', ':['],
    [':-$', ':$'],
    [':-\\'],
    [':\'('],
    [':-(', ':('],
    ['8-)', '8)'],
    [':-D', ':D'],
    ['>:O'],
    [':-O', ':O', '=-O'],
    ['O:-)'],
    [':-)', ':)'],
    [':-P', ':P'],
    [':-X'],
    [':kiss:', ':heart:'],
    [':yes:'],
    [':no:']
  ],

  fy: function (text) {
    var mapped = text;
    var map = this.map;
    if (map.length != undefined) {
      for (var i in map) {
        var original = map[i][0];
        for (var j in map[i]) {
          var token = map[i][j].replace(/([\*\|\(\)\[\]\\\$])/g, '\\$1');
          var rexp = new RegExp('('+token+')', 'g');
          mapped = mapped.replace(rexp, '<img src="img/emoji/xmpp/'+original+'.png" alt="$1" />');
          if (mapped != text) {
            return mapped;
          }
        }
      }
    }
    return text;
  },
  
  render: function (img, emoji) {
    img
      .attr('src', '/img/emoji/xmpp/' + emoji[0] + '.png')
      .data('emoji', emoji[0]);
  }
  
}

App.emoji['FB'] = {
  
  map: [
    [':)'],
    [':('],
    [':P'],
    [':D'],
    [':O'],
    [':3'],
    ['8)'],
    ['8\|'],
    ['>:('],
    [':\\', ':/'],
    [':\'('],
    ['3:)'],
    [':\*'],
    ['<3'],
    ['O.o','o.O'],
    ['>:O','>:o'],
    [':v'],
    [':poop:']
  ],

  fy: function (text) {
    var mapped = text;
    var map = this.map;
    if (map.length != undefined) {
      for (var i in map) {
        var original = map[i][0];
        for (var j in map[i]) {
          var token = map[i][j].replace(/([\*\|\(\)\[\]\\\$])/g, '\\$1');
          var rexp = new RegExp('('+token+')', 'g');
          mapped = mapped.replace(rexp, '<img src="img/emoji/fb/'+original+'.png" alt="$1" />');
          if (mapped != text) {
            return mapped;
          }
        }
      }
    }
    return text;
  },
  
  render: function (img, emoji) {
    img
      .attr('src', '/img/emoji/fb/' + emoji[0] + '.png')
      .data('emoji', emoji[0]);
  }
  
}
