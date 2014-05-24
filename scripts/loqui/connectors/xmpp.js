'use strict';

App.connectors['XMPP'] = function (account) {
  
  this.account = account;
  this.provider = Providers.data[account.core.provider];
  this.presence = {
    show: this.account.core.presence ? this.account.core.presence.show : App.defaults.Connector.presence.show,
    status: this.account.core.presence ? this.account.core.presence.status : App.defaults.Connector.presence.status
  };
  this.handlers = {};
  this.events = {}
  this.chat = {};
  this.contacts = {};
  this.connected = false;
  
  this.connection = new Strophe.Connection(this.provider.connector.host);
  
  this.connect = function (callback) {
    //var user = this.account.core.user + '/' + App.shortName + '-' + Math.random().toString(36).substr(2, 5);
    var user = this.account.core.user + '/' + App.shortName;
    var pass = this.account.core.pass;
    var handler = function (status) {
     switch (status) {
        case Strophe.Status.CONNECTING:
          Tools.log('Connecting');
          if (callback.connecting) {
            callback.connecting();
          }
          break;
        case Strophe.Status.CONNFAIL:
          Tools.log('Connection failed');
          if (callback.connfail) {
            callback.connfail();
          }
          Lungo.Notification.error(_('NoAuth'), _('NoAuthNotice'), 'remove-circle', 5);
          break;
        case Strophe.Status.AUTHENTICATING:
          Tools.log('Authenticating');
          if (callback.authenticating) {
            callback.authenticating();
          }
          break;
        case Strophe.Status.AUTHFAIL:
          Tools.log('Authentication failed');
          if (callback.authfail) {
            callback.authfail();
          }
          break;
        case Strophe.Status.CONNECTED:
          Tools.log('Connected');
          this.connected = true;
          if (callback.connected) {
            callback.connected();
          }
          break;
        case Strophe.Status.DISCONNECTING:
          Tools.log('Disconnecting');
          if (callback.disconnecting) {
            callback.disconnecting();
          }
          break;
        case Strophe.Status.DISCONNECTED:
          Tools.log('Disconnected');
          if (callback.disconnected) {
            callback.disconnected();
          }
          break;
      }
    }.bind(this);
    this.connection.reset();
    this.connection.connect(user, pass, handler, this.provider.connector.timeout);
  }
  
  this.disconnect = function () {
    this.connection.disconnect();
    this.connected = false;
  }
  
  this.isConnected = function () {
    return App.online && this.connected;
  }
  
  this.start = function () {
    this.handlers.init();
    this.capabilize();
    this.presence.set();
  }
  
  this.sync = function (callback) {
    var account = this.account;
    var connector = this;
    var fullJid = Strophe.getBareJidFromJid(connector.connection.jid);
    if (account.core.fullJid != fullJid) {
      account.core.fullJid = fullJid;
      account.save();
    }
    connector.connection.roster.registerCallback(connector.events.onPresence);
    var iqId = connector.connection.roster.get( function (ret) {
      connector.events.onPresence(ret, null, account.core.user);
      if (account.supports('vcard')) {
        connector.connection.vcard.get( function (data) {
          connector.vcard = $(data).find('vCard').get(0);
          callback();
        });
      } else {
        callback();
      }
    });
    // Send initial vcard if none is present (#181)
    connector.connection.addHandler(function () {
      connector.connection.vcard.set(function () {
        callback();
      }, $build('JABBERID').t(fullJid).tree());
    }, null, 'iq', 'error');
  }.bind(this);
  
  this.capabilize = function () {
    var caps = [
      ['attention', Strophe.NS.XEP0224],
      ['csn', Strophe.NS.XEP0085],
      ['delay', Strophe.NS.XEP0203],
      ['time', Strophe.NS.XEP0202],
      ['vcard', Strophe.NS.VCARD]
    ];
    for (var i in caps) {
      if (this.account.supports(caps[i][0])) {
        this.connection.caps.addFeature(caps[i][1]);
      }
    }
  }
  
  this.presence.set = function (show, status) {
    this.presence.show = show || this.presence.show;
    this.presence.status = status || this.presence.status;
    this.presence.send();
    this.account.core.presence = {
      show: this.presence.show,
      status: this.presence.status
    }
    this.account.save();
  }.bind(this);
  
  this.presence.send = function (show, status) {
    var show = show || this.presence.show;
    var status = status || this.presence.status;
    var idle = document.hidden ? new Date - App.lastActive : 0;
    var priority =
      idle < 1000 ? 100 :
      idle < 5000 ? 80 :
      idle < 30000 ? 60 :
      40;      
    priority += {
      chat: -4,
      a: -4,
      dnd: -4,
      away: -8,
      xa: -12
    }[show];
    if (App.online && this.connection.connected) {
      var msg = $pres();
      if (show != 'a') {
        msg.c('show', {}, show);
      }
      if (status) {
        msg.c('status', {}, status);
      }
      msg.c('priority', {}, priority);
      msg.cnode(this.connection.caps.createCapsNode().tree()).up();
      if (this.account.core.avatarHash) {
        var photoNode = this.account.core.avatarHash ? $build('photo').t(this.account.core.avatarHash) : $build('photo');
        msg.cnode(this.connection.vcard.createUpdateNode(photoNode.tree()).tree()).up();
      }
      this.connection.send(msg.tree());
    }
    $('section#main').attr('data-show', show);
  }.bind(this);
  
  this.send = function (to, text, delay) {
    this.connection.Messaging.send(to, text, delay);
  }.bind(this);
  
  this.attentionSend = function (to) {
    this.connection.attention.request(to);
  }
  
  this.avatar = function (callback, jid) {
    var extract = function (vcard) {
      if (vcard.find('BINVAL').length) {
        var img = vcard.find('BINVAL').text();
        var type = vcard.find('TYPE').text();
        var url = 'data:' + type + ';base64,' + img;
      } else {
        var url = 'img/foovatar.png';
      }
      if (callback) {
        var a = new Avatar();
        a.url = url;
        callback(a);
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
  
  this.avatarSet = function(blob) {
    var jid = this.account.core.fullJid;
    Tools.picThumb(blob, 96, 96, function (url) {
      var b64 = url.split(',').pop();
      var vCardEl = $build('PHOTO');
      vCardEl.c('TYPE', {}, 'image/jpg');
      vCardEl.c('BINVAL', {}, b64);
      Store.save(url, function (index) {
        App.avatars[jid] = (new Avatar({chunk: index})).data;
        App.smartupdate('avatars');
      });
      this.connection.vcard.set(function (stanza) {
        this.account.core.avatarHash = b64_sha1(b64);
        this.account.save();
        this.presence.send();
        $('section#main footer .avatar img').attr('src', url);
        $('section#me .avatar img').attr('src', url);
      }.bind(this), vCardEl.tree());
    }.bind(this));
  }
  
  this.csnSend = function (to, state) {
      this.connection.Messaging.csnSend(to, state);
  }
  
  this.emojiRender = function (img, emoji) {
    App.emoji[Providers.data[this.account.core.provider].emoji].render(img, emoji);
  }.bind(this);
  
  this.contacts.remove = function (jid) {
    this.connection.roster.remove(jid);
    this.connection.roster.get(function(){});
  }
  
  this.handlers.init = function () {
    this.connection.handlers.length = 0;
    this.handlers.onMessage = this.connection.addHandler(this.events.onMessage, null, 'message', 'chat', null, null);
    this.handlers.onSubRequest = this.connection.addHandler(this.events.onSubRequest, null, 'presence', 'subscribe', null, null);
    this.handlers.onTime = this.connection.time.handlify(this.events.onTime);
    this.handlers.onAttention = this.connection.attention.handlify(this.events.onAttention);
    this.handlers.onDisco = this.connection.disco.handlify();
  }.bind(this);
  
  this.events.onDisconnected = function () {
  }
  
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
  
  this.events.onPresence = function (items, item, to) {
    var connector = this;
    var account = this.account;
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
          var show, status, photo;
          for (var j in entry.resources) {
            show = entry.resources[Object.keys(entry.resources)[0]].show || 'a';
            status = entry.resources[Object.keys(entry.resources)[0]].status || _('show' + show);
            photo = entry.resources[Object.keys(entry.resources)[0]].photo;
            break;
          }
          if (photo && entry.jid in App.avatars && App.avatars[entry.jid].id != photo) {
            var avatar = new Avatar(App.avatars[entry.jid]);
            connector.avatar(function (a) {
              a.urlWritePromise.then(function (val) {
                Store.drop(avatar.chunk, function () {
                  avatar.id = photo;
                  avatar.chunk = a.chunk;
                  avatar.stamp = a.stamp;
                  App.avatars[entry.jid] = avatar.data;
                  var own = entry.jid == account.core.fullJid;
                  if (own) {
                  
                  } else {
                    $('[data-jid="' + entry.jid + '"] span.avatar img').attr('src', val);
                  }
                });
              });
            }, entry.jid);
          }
          cb(null, {
            jid: entry.jid,
            name: entry.name,
            presence: {
              show: show,
              status: status
            }
          });
        }
        async.map(connector.roster, map.bind(account), function (err, result) {
          account.core.roster = result;
          account.presenceRender();
        });
      }
    }
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
        text: _('SentYou', { type: _('MediaType_bolt') }),
        pic: 'https://raw.github.com/loqui/im/dev/img/bolt.png',
        callback: function () {
          chat.show();
          App.toForeground();
        }
      }, 'thunder', true);
    }
    Tools.log(from, 'sent you a bolt.');
    return true;
  }.bind(this);
  
}

App.logForms['XMPP'] = function (article, provider, data) {
  article
    .append($('<h1/>').style('color', data.color).html(_('SettingUp', { provider: data.longName })))
    .append($('<img/>').attr('src', 'img/providers/' + provider + '.svg'))
    .append($('<label/>').attr('for', 'user').text(_(data.terms['user'], { provider: data.altname })))
    .append($('<input/>').attr('type', data.terms.userInputType).attr('x-inputmode', 'verbatim').attr('name', 'user').attr('placeholder', (data.terms.placeholder || _(data.terms['user'], { provider: data.altname }) )))
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
        enabled: true,
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
    ['emoji1', '>:-(', '>:('],
    ['emoji2', ';)', ';-)'],
    ['emoji3', ':-!', ':!'],
    ['emoji4', ':-[', ':['],
    ['emoji5', ':-$', ':$'],
    ['emoji6', ':-\\'],
    ['emoji7', ':\'('],
    ['emoji8', ':-(', ':('],
    ['emoji9', '8-)', '8)'],
    ['emoji10', ':-D', ':D'],
    ['emoji11', '>:O'],
    ['emoji12', ':-O', ':O', '=-O'],
    ['emoji13', 'O:-)'],
    ['emoji14', ':-)', ':)'],
    ['emoji15', ':-P', ':P'],
    ['emoji16', ':-X'],
    ['emoji17', ':kiss:', ':heart:'],
    ['emoji18', ':yes:'],
    ['emoji19', ':no:']
  ],

  fy: function (text) {
    var mapped = text;
    var map = this.map;
    if (mapped && map.length != undefined) {
      for (var i in map) {
        var original = map[i][0];
        for (var j in map[i].slice(1)) {
          var token = map[i].slice(1)[j].replace(/([\*\|\(\)\[\]\\\$\{\}\.\+\?\^])/g, '\\$1');
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
      .attr('src', 'img/emoji/xmpp/' + emoji[0] + '.png')
      .data('emoji', emoji[1]);
  }
  
}

App.emoji['FB'] = {
  
  map: [
    ['emoji1', ':)'],
    ['emoji2', ':('],
    ['emoji3', ':P'],
    ['emoji4', ':D'],
    ['emoji5', ':O'],
    ['emoji6', ':3'],
    ['emoji7', '8)'],
    ['emoji8', '8|'],
    ['emoji9', '>:('],
    ['emoji10', ':\\', ':/'],
    ['emoji11', ':\'('],
    ['emoji12', '3:)'],
    ['emoji13', ':*'],
    ['emoji14', '<3'],
    ['emoji15', 'O.o','o.O'],
    ['emoji16', '>:O','>:o'],
    ['emoji17', ':v'],
    ['emoji18', ':poop:'],
    ['emoji19', 'O:)'],
    ['emoji20', ';-)', ';)'],
    ['emoji21', '^_^'],
    ['emoji22', '-_-'],
    ['emoji23', ':|]'],
    ['emoji24', ':putnam:'],
    ['emoji25', '(^^^)'],
    ['emoji20', '<(")']
  ],

  fy: function (text) {
    var mapped = text;
    var map = this.map;
    if (mapped && map.length != undefined) {
      for (var i in map) {
        var original = map[i][0];
        for (var j in map[i].slice(1)) {
          var token = map[i].slice(1)[j].replace(/([\*\|\(\)\[\]\\\$\{\}\.\+\?\^])/g, '\\$1');
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
      .attr('src', 'img/emoji/fb/' + emoji[0] + '.png')
      .data('emoji', emoji[1]);
  }
  
}

App.emoji['GTALK'] = {
  
  map: [
    ['angry', 'x-('],
    ['brokenheart', '&lt;/3'],
    ['cool', 'B-)'],
    ['cowbell', '+/\'\\'],
    ['crab', 'V.v.V'],
    ['cry', ':\'('],
    ['devil', '}:-)'],
    ['frown', ':(', '=(', ':-('],
    ['grin', ':D', '=D', ':-D'],
    ['heart', '&lt;3'],
    ['kissstar', ':*', ':-x'],
    ['monkey', ':(|)'],
    ['mustache', ':{'],
    ['pig', ':(:)'],
    ['poop', '~@~'],
    ['robot', ':|]'],
    ['rockout', '\\m/'],
    ['shocked', ':-o'],
    ['slant', ':-/', '=/'],
    ['smile', ':)', '=D', ':-)'],
    ['straightface', ':-\|'],
    ['tongue', ':p', ':P', '=p', '=P', ':-p', ':-P'],
    ['wince', '\\>.\\<'],
    ['wink', ';)', ';-)', ';^)']
  ],

  fy: function (text) {
    var mapped = text;
    var map = this.map;
    if (mapped && map.length != undefined) {
      for (var i in map) {
        var original = map[i][0];
        for (var j in map[i].slice(1)) {
          var token = map[i].slice(1)[j].replace(/([\*\|\(\)\[\]\\\$\{\}\.\+\?\^])/g, '\\$1');
          var rexp = new RegExp('('+token+')', 'g');
          mapped = mapped.replace(rexp, '<img src="img/emoji/gtalk/'+original+'.gif" alt="$1" />');
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
      .attr('src', 'img/emoji/gtalk/' + emoji[0] + '.gif')
      .data('emoji', emoji[1]);
  }
  
}
