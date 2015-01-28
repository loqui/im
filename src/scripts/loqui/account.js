'use strict';

var Account = function (core) {
  
  // Holds only account data and no functions
  this.core = core;
  this.core.sendQ = this.core.sendQ || [];
  this.connector = new App.connectors[Providers.data[this.core.provider].connector.type](this);
  this.OTR = {};
  this.contacts = {};
  this.names = [];
  this.jidToNameMap = {};
  this._unread = new Blaze.Var(0);
  this._chats = new Blaze.Var([]);
  this._enabled = new Blaze.Var(false);
  
  this.__defineGetter__('enabled', function () {
    return this._enabled.get();
  });
  this.__defineSetter__('enabled', function (val) {
    this._enabled.set(val);
    if (val != 'loading') {
      this.core.enabled = val;
      if (!val) {
        this.connector.disconnect();
      } else {
        this.connect();
      }
      this.save();
    }
  });
  
  this.__defineGetter__('chats', function () {
    return this._chats.get();
  });
  this.__defineSetter__('chats', function (val) {
    this._chats.set(val);
  });

  Object.defineProperty(this, 'unread', {
      get : function(){
        return this._unread.get();
      },
      set : function(value){
        this._unread.set((value > 0) ? value : 0);
      }
  });
  
  
  if ('OTR' in core) {
    $.extend(this.OTR, core.OTR);
    if (core.OTR.key) { // inflate the packed key
      this.OTR.key = DSA.parsePrivate(core.OTR.key);
    }
  } else {
    $.extend(this.OTR, App.defaults.Account.core.OTR);
  }

  // Test account
  this.test = function () {
    this.connector.connect({
      connecting: function () {
        Lungo.Notification.show('globe', _('Connecting'));
      },
      authenticating: function () {
        Lungo.Notification.show('key', _('SMSsending'));
      },
      connected: function () {
        Lungo.Notification.show('download', _('Synchronizing'));
        var cb = function () {
          // Don't add an account if already set up
          if (Accounts.find(this.core.fullJid) < 0) {
            Tools.log('ADDING ACCOUNT', this);
            App.accounts.push(this);
            Lungo.Notification.hide();
            this.show();
            $('section.setup#' + this.core.provider + ' input').val('');
            $('section#success span#imported').text(_('Imported', {number: (this.core.roster && this.core.roster.length) ? this.core.roster.length : 0}));
            this.connector.avatar(function (avatar) {
              avatar.url.then(function (src) {
                $('section#success img#avatar').attr('src', src);              
              });
            });
            Lungo.Router.section('success');
            this.connector.disconnect();
          } else {
            //Lungo.Notification.error(_('DupliAccount'), _('DupliAccountNotice'), 'warning-sign', 5);
          }
          this.save();
        }.bind(this);
        this.connector.start();
        this.sync(cb);
      }.bind(this),
      authfail: function () {
        Lungo.Notification.error(_('NoAuth'), _('NoAuthNotice'), 'signal', 5);
      }
    });
  }
  
  // Connect
  this.connect = function () {
    if (this.connector.isConnected()) {
      this.connector.start();
      this.sendQFlush();
    } else {
      if (navigator.onLine){
        this.connector.connect({
          connecting: function () {
            this.enabled = 'loading';
          }.bind(this),
          connected: function () {
            this.enabled = true;
            var cb = function (rcb) {
              App.audio('login');
              this.connector.start();
              this.sendQFlush();
              if (rcb) {
                rcb();
              }
            }.bind(this);
            this.sync(cb);
          }.bind(this),
          authenticating: function () {
            this.enabled = 'loading';
          }.bind(this),
          authfail: function () {
            var failStamps = this.connector.failStamps || {};
            failStamps.push(new Date);
            if (failStamps.length > 2 && Math.floor((failStamps.slice(-1)[0] - failStamps.slice(-3)[0])/1000) < 30) {
              location.reload();
            }
            Lungo.Notification.error(_('NoAuth'), _('NoAuthNotice'), 'signal', 5);
          }.bind(this),
          disconnected: function () {
            App.audio('logout');
            this.presenceRender();
            this.connector.connected = false;
            if (App.online && App.settings.reconnect && this.enabled) {
              this.connect();
            }
          }.bind(this)
        });
      }
    }
  }
  
  // Download roster and register callbacks for roster updates handling
  this.sync = function (callback) {
    this.connector.sync(callback);
  }
  
  // Bring account to foreground
  this.show = function () {
    Accounts.current = Accounts.find(this.core.fullJid);
    /*$('section#main').data('jid', this.core.fullJid);
    var vCard = $(this.connector.vcard);
    var address = ( vCard.length && vCard.find('FN').length ) ? vCard.find('FN').text() : this.core.user;
    $('section#main header img').attr('src', 'img/providers/' + this.core.provider + '.svg');
    $('section#main header .provider').text(this.connector.provider.longName);
    $('section#main header .jid').text(address);
    $('section#main article ul[data-jid="' + this.core.fullJid + '"]').show().siblings('ul').hide();
    var index = Accounts.find(this.core.fullJid);
    $('aside#accounts [data-jid="' + this.core.fullJid  + '"]').addClass('active').siblings('li').removeClass('active');
    var features = Providers.data[this.core.provider].features;
    var meSection = $('section#me');
    var mainSection = $('section#main');
    meSection.data('features', features.join(' '));
    mainSection.data('features', features.join(' '));
    meSection.find('#nick input').val(this.connector.presence.name);
    meSection.find('#status input').val(this.connector.presence.status);
    meSection.find('#card .name').text(address == this.core.user ? '' : address);
    meSection.find('#card .user').text(this.core.user);
    meSection.find('#card .provider').empty().append($('<img/>').attr('src', 'img/providers/squares/' + this.core.provider + '.svg'));
    var show = function (a) {
      a.url.then(function (val) {
        $('section#me .avatar img').attr('src', val);
      });
    }
    if (account.core.fullJid in App.avatars) {
      show(new Avatar(App.avatars[account.core.fullJid]));
    } else {
      account.connector.avatar(function (src) {
        show(src);
      });
    }
    Accounts.unread(account.unread);
    Store.recover(account.core.background, function (url) {
      $('section#chat ul#messages').css('background', 'url('+url+') no-repeat center center fixed');
      $('section.profile div#card').css('background', 'url('+url+') no-repeat center center fixed'); 
    }.bind(this)); */
  }
  
  // Render everything for this account
  this.allRender = function () {
    this.accountRender();
    this.chatsRender();
    this.avatarsRender();
    this.presenceRender();
  }
  
  // Changes some styles based on presence and connection status
  this.accountRender = function () {
    var ul = $('section#main ul[data-jid="' + (this.core.fullJid || this.core.user) + '"]');
    ul.show().siblings('ul').hide();
    $('section#main header').css('border-color', this.connector.provider.color);
    $('aside#accounts .cover').css('background-color', this.connector.provider.color);
    $('aside#accounts .cover .avatar img').removeAttr('src');
    $('.floater').css('background-color', this.connector.provider.color);
    var vCard = $(this.connector.vcard);
    var address = ( vCard.length && vCard.find('FN').length ) ? vCard.find('FN').text() : this.core.user;
    var features = Providers.data[this.core.provider].features;
    var meSection = $('section#me');
    var mainSection = $('section#main');
    meSection[0].dataset.features = features.join(' ');
    mainSection[0].dataset.features = features.join(' ');
    meSection.find('#nick input').val(this.connector.presence.name);
    meSection.find('#status input').val(this.connector.presence.status);
    meSection.find('#card .name').text(address == this.core.user ? '' : address);
    meSection.find('#card .user').text(this.core.user);
    meSection.find('#card .provider').empty().append($('<img/>').attr('src', 'img/providers/squares/' + this.core.provider + '.svg'));
    Accounts.unread(this.unread);
    if(this.core.background){
      Store.recover(this.core.background, function (url) {
        $('section#chat ul#messages').css('background-image', 'url('+url+')');
        $('section.profile div#card').css('background-image', 'url('+url+')');
      });
    }else{
        $('section#chat ul#messages').css('background-image', '');
        $('section.profile div#card').css('background-image', '');
    }
  }.bind(this);
  
  this.singleRender = function (chat, up) {
    var ul = $('section#main article#chats ul[data-jid="' + this.core.fullJid + '"]');
    var li = ul.children('li[data-jid="' + chat.core.jid + '"]');
    if (li.length) {
      if (up) {
        li.detach();
        ul.prepend(li);
      }
      li.children('.lastMessage').html(chat.core.last.text ? App.emoji[Providers.data[this.core.provider].emoji].fy(chat.core.last.text) : (chat.core.media ? _('AttachedFile') : ''));
      li.children('.lastStamp date').html(chat.core.last.stamp ? Tools.convenientDate(chat.core.last.stamp).join('<br />') : '');
      li[0].dataset.unread = chat.core.unread;
      li[0].dataset.hidden = chat.core.settings.hidden[0] ? 1 : 0;
    } else {
      this.allRender();
    }
  }.bind(this);
  
  // List all chats for this account
  this.chatsRender = function (f, click, hold) {
    var account = this;
    var oldUl = $('section#main article#chats ul[data-jid="' + this.core.fullJid + '"]');
    var ul = oldUl.clone().empty();
    var media = _('AttachedFile');
    ul[0].dataset.jid = account.core.fullJid;
    if (!f) {
      ul.attr('style', oldUl.attr('style'));
    }
    var totalUnread = 0;
    if (this.core.chats && this.core.chats.length) {
      for (var i in this.core.chats) {
        var chat = this.core.chats[i];
        var title = App.emoji[Providers.data[this.core.provider].emoji].fy(chat.title);
        var lastMsg = chat.last ? (chat.last.text ? (App.emoji[Providers.data[account.core.provider].emoji].fy(chat.last.text)) : (chat.last.media ? media : '')) : ' ';
        var lastStamp = chat.last.stamp ? Tools.convenientDate(chat.last.stamp).join('<br />') : '';
        var li = $('<li/>');
        li[0].dataset.jid = chat.jid;
        li[0].dataset.unread = chat.unread;
        li.append($('<span/>').addClass('avatar').append('<img/>'));
        li.append($('<span/>').addClass('name').html(title));
        li.append($('<span/>').addClass('lastMessage').html(lastMsg));
        li.append($('<span/>').addClass('lastStamp').append($('<date/>').attr('datetime', chat.last.stamp).html(lastStamp)));
        li.append($('<span/>').addClass('show').addClass('backchange'));
        li[0].dataset.unread = chat.unread;
        li[0].dataset.hidden= chat.settings.hidden[0] ? 1 : 0;
        if (!chat.muc && account.supports('muc') && chat.jid.substring(1).match(/\-/)) {
          account.chats[i].core.muc = true;
          account.chats[i].save();
        }
        li[0].dataset.muc = chat.muc ? true : false;
        li.bind('click', click ? function () {click(this)} : function () {
          account.chatGet(this.dataset.jid).show();
        }).bind('hold', hold ? function () {hold(this)} : function () {
          window.navigator.vibrate([100]);
          if (this.dataset.jid.match(/\-/)) {
            Messenger.mucProfile(this.dataset.jid);
          } else {
            Messenger.contactProfile(this.dataset.jid);
          }
        });
        totalUnread += chat.unread;
        ul.prepend(li);
      }
    } else {
      var span = $('<span/>').addClass('noChats')
      .append($('<strong/>').text(_('NoChats')))
      .append($('<p/>').text(_('NoChatsExplanation')));
      span.on('click', function () {
        var account = Accounts.current;
        Activity('chat', account, null, {
          chats: false,
          groups: account.supports('muc')
          });
      });
      ul.prepend(span);
    }
    if (f) {
      f.appendChild($('<article/>').attr('id', 'chats').addClass('scroll').append(ul)[0]);
    } else {
      oldUl.replaceWith(ul);    
    }
  }.bind(this);

  // List all contacts for this account
  this.contactsRender = function (f, click, selected) {
    var account = this;
    console.log(account);
    var article = $('<article/>').attr('id', 'contacts');
    var header = $('<header/>').addClass('beige')
      .append($('<button/>').addClass('new').text(_('ContactAdd')).on('click', function (event) {
        Menu.show('contactAdd');
      }));
    if (account.supports('localContacts')) {
      header.append($('<button/>').addClass('sync').text(_('ContactsSync')).on('click', function (event) {
        delete account.core.roster;
        account.connector.contacts.sync(function (rcb) {
          account.save();
          Lungo.Router.section('main');
        });
      }));
    }
    var ul = $('<ul/>').addClass('list').addClass('scroll');
    var frag = f;
    var account = this;
    this.contacts = {};
    this.core.roster.forEach(function (contact, i, roster) {
      var name = contact.name || contact.jid;
      var nameParts = name.toLowerCase().split(' ');
      for(var _i = 0, _len = nameParts.length; _i < _len; _i++) {
        var part = nameParts[_i];
        if(account.contacts.hasOwnProperty(part))
          account.contacts[part] += ' ' + contact.jid;
        else
          account.contacts[part] = contact.jid;
        account.names.push(part);
        account.jidToNameMap[contact.jid] = contact.name;
      }
      var li = document.createElement('li');
      li.dataset.jid = contact.jid;
      if (selected && selected.indexOf(contact.jid) > -1) {
        li.classList.add('selected');
      }
      li.innerHTML = 
          '<span class=\'name\'>' + name + '</span>'
        + '<span class=\'status\'>' + contact.jid + '</span>';
      li.addEventListener('click', function (e) {
        click(this);
      });
      ul[0].appendChild(li);
    });
    article.append(header).append(ul);
    frag.appendChild(article[0]);
  }.bind(this);
  
  // List all group chats for this account
  this.groupsRender = function (f, click) {
    var account = this;
    var article = $('<article/>').attr('id', 'groups');
    var header = $('<header/>').addClass('beige');
    if (account.supports('mucCreate')) {
      header.append($('<button/>').addClass('new').text(_('GroupNew'))
      .on('click', function (event) {
        Menu.show('mucCreateForm', account);
      }))
    }
    if (account.supports('mucJoin')) {
      header.append($('<button/>').addClass('join').text(_('GroupJoin'))
      .on('click', function (event) {
        Menu.show('mucSearchForm', account);
      }));
    }
    var ul = $('<ul/>').addClass('list').addClass('scroll');
    var frag = f;
    var account = this;
    this.core.chats.forEach(function (chat, i, chats) {
      if (chat.muc) {
        var title = chat.title;
        var li = document.createElement('li');
        li.dataset.jid = chat.jid;
        li.innerHTML = 
            '<span class=\'name\'>'
          +  App.emoji[Providers.data[account.core.provider].emoji].fy(title)
          + '</span>'
          + '<span class=\'status\'>'
          + (chat.participants
             ? _('NumParticipants', {number: chat.participants.length})
             : ' ')
          + '</span>';
        li.addEventListener('click', function (e) {
          click(this);
        });
        ul[0].appendChild(li);
      }
    });
    article.append(header).append(ul);
    frag.appendChild(article[0]);
  }.bind(this);
  
  // Render presence for every contact
  this.presenceRender = function (jid) {
    /*if (this.connector.isConnected() && this.supports('presence')) {
      var contactPresenceRender = function (contact) {
        if (this.supports('show')) {
          var li = $('section#main article ul li[data-jid="'+contact.jid+'"]');
          li.data('show', contact.presence.show || 'na');
          li.find('.status').html(App.emoji[Providers.data[this.core.provider].emoji].fy(contact.presence.status) || _('show' + (contact.presence.show || 'na')));
          var section = $('section#chat');
          if (section[0].dataset.jid == contact.jid) {
            section.data('show', contact.presence.show || 'na');
            section.find('header .status').html(App.emoji[Providers.data[this.core.provider].emoji].fy(contact.presence.status) || _('show' + (contact.presence.show || 'na')));
          }
        }
      }.bind(this);
      if (jid) {
        if (typeof jid == 'object') {
          contactPresenceRender(jid);
        } else {
          contactPresenceRender(Lungo.Core.findByProperty(this.core.roster, 'jid', jid));
        }
      } else{
        for (var i in this.core.roster) {
          contactPresenceRender(this.core.roster[i]);
        }
      }
    }*/
    var contactPresenceRender = function (jid) {
      var contact = Lungo.Core.findByProperty(this.core.roster, 'jid', jid);
      if (this.supports('show')) {
        var li = $('section#main article ul li[data-jid="'+contact.jid+'"]');
        if (li.length > 0) {
          li[0].dataset.show = contact.presence.show || 'na';
        }
      }
      var section = $('section#chat');
      if (section[0].dataset.jid == contact.jid) {
        section[0].dataset.show = contact.presence.show || 'na';
        section.find('header .status').html(App.emoji[Providers.data[this.core.provider].emoji].fy(contact.presence.status) || _('show' + (contact.presence.show || 'na')));
      }
    }.bind(this);
    if (jid) {
      contactPresenceRender(jid);
    } else {
      var ul = $('section#main article#chats ul[data-jid="' + this.core.fullJid + '"]');
      if (ul.length > 0) {
        ul[0].dataset.enabled = this.enabled;
        for (var [key, val] in this.core.chats) {
          if(!val.muc){
            contactPresenceRender(val.jid);
          }
        }
      }
    }
  }.bind(this);
  
  // Render all the avatars
  this.avatarsRender = function () {
    var account = this;
    var avatars = App.avatars;
    $('span.avatar img:not([src])').each(function (i, el) {
      var closest = $(el).closest('[data-jid]');
      var jid = closest.length ? closest[0].dataset.jid : account.core.fullJid;
      var me = jid == account.core.fullJid;
      if (avatars[jid]) {
        (new Avatar(avatars[jid])).url.then(function (val) {
          $(el).attr('src', val);
          if (me) {
            $('section#main footer .avatar img').attr('src', val);
            $('section#me .avatar img').attr('src', val);
          }
        });
      } else if (account.connector.isConnected() && account.supports('easyAvatars')) {
        console.log('REQUESTING AVATAR FOR', jid);
        account.connector.avatar(function (a) {
          a.url.then(function (val) {
            console.log(a.data);
            $(el).attr('src', val);
            if (me) {
              $('section#main footer .avatar img').attr('src', val);
              $('section#me .avatar img').attr('src', val);
            }
            avatars[jid] = a.data;
            App.avatars = avatars;
          });
        }, jid);
      }
    });
  }.bind(this);

  // Manage search through contacts
  this.searchRender = function (f, click) {
    if(!this.contacts)
      return false;
    var account = this;
    var article = $('<article/>').attr('id', 'search');
    var header = $('<header/>').addClass('beige');
    var input = $('<input/>').attr('id', 'searchInput')
                .on('input', function (event) {
                  var ele = event.target;
                  if(ele.value)
                    ele.nextSibling.className = '';
                  else
                    ele.nextSibling.className = 'hidden';
                  account.search(article, this.value, click);
                });
    var reset = $('<span/>').attr('id', 'reset')
                .addClass('hidden')
                .on('click', function (event) {
                  this.previousSibling.value = '';
                  this.className = 'hidden';
                  account.search(article, '', click);
                });
    header.append(input).append(reset);
    article.append(header).append($('<h1/>').text('Type some characters to start searching'));
    var frag = f;
    frag.appendChild(article[0]);
  }

  // Search through contacts for a loose match and append a list
  this.search = function (article, text, click) {
    var account = this;
    if(article[0].lastChild.nodeName === 'UL' || article[0].lastChild.nodeName === 'H1')
      article[0].lastChild.remove();
    if(!text) {
      article.append($('<h1/>').text('Type some characters to start searching'));
      return false;
    }
    text = text.toLowerCase();
    var str = {};
    // forEach is slow, and evil
    for(var _i = 0, _len = account.names.length; _i < _len; _i++) {
      if(account.names[_i].startsWith(text)) {
        str[account.names[_i]] = 1; // Just a placeholder
      }
    }
    var matches = [];
    for(var match in str) {
      if(str.hasOwnProperty(match))
        matches.push(match);
    }
    var ul = $('<ul/>').addClass('list').addClass('scroll');
    for(var _i = 0, _len = matches.length; _i < _len; _i++) {
      var jids = account.contacts[matches[_i]].split(' ');
      for(var _j = 0, _l = jids.length; _j < _l; _j++) {
        var name = account.jidToNameMap[jids[_j]];
        var li = document.createElement('li');
        li.dataset.jid = jids[_j];
        li.innerHTML = '<span class=\'name\'>' + name + '</span>'
                       + '<span class=\'status\'>' + jids[_j] + '</span>';
        li.addEventListener('click', function (e) {
          click(this);
        });
        ul[0].appendChild(li);
      }
    }
    article.append(ul[0]);
  }
  
  this.OTRMenu = function () {
    var account = this;
    function OTRSetup() {
      Lungo.Router.article('otrMenu', 'otrSetup');
      $('button#setupOtr').on('click', function(e) {
        Lungo.Notification.success(_('OTRKeygen'), _('OTRWait'), 'key', 5);
        Lungo.Router.section('back');
        Lungo.Router.section('main');
        DSA.createInWebWorker({
          path: 'scripts/arlolra/dsa-webworker.js'
        }, function (key) {
          account.OTR.enabled = true;
          account.OTR.key = key;
          account.core.OTR = $.extend({}, account.OTR, {
            key: account.OTR.key.packPrivate()
          })
          account.save();
          Lungo.Notification.success(_('OTRKeyReady'), _('OTRKeyReadyDesc'), 'ok', 5);
          OTRSettings();
        });
      });
    }
    function OTRSettings() {
      Lungo.Router.article('otrMenu', 'otrSettings');
      var fingerprint = account.OTR.key.fingerprint();
      $('span#otrKeyFingerprint').html($('<small/>').html(Tools.explode(fingerprint, 8)));
      $('span#otrKeyFingerprint').append($('<img/>').attr('src', Tools.fingerprintToImage(fingerprint)));
      if (account.core.OTR.logging) {
        $('input#logOtrChats').attr('checked', account.OTR.logging);
      }
      $('input#logOtrChats').on('change', function () {
        account.core.OTR.logging = this.checked;
        account.save();
      });
    }
    if (!account.OTR.enabled) {
      OTRSetup();
    } else {
      OTRSettings();
    }
    Lungo.Router.section('otrMenu');
  }
  
  // Push message to sendQ
  this.toSendQ = function (storageIndex) {
    Tools.log('[sendQ] Queued', storageIndex);
    if (!this.core.sendQ) {
      this.core.sendQ = [];
    }
    this.core.sendQ.push(storageIndex);
    this.save();
  }
  
  // Send every message in SendQ
  this.sendQFlush = function () {
    var account = this;
    if (this.core.sendQ.length) {
      var sendQ = this.core.sendQ;
      var block = sendQ[0][0];
      Tools.log('[sendQ] Flushing', sendQ, sendQ[0]);
      Store.recover(block, function (data) {
        var content = data[sendQ[0][1]];
        var msg = new Message(account, {
          from: content.from,
          to: content.to,
          text: content.text,
          stamp: content.stamp
        }, {
          render: false
        });
        msg.send(true, true);
        sendQ.splice(0, 1);
        account.sendQFlush();
      });
    } else {
      this.save();
    }
  }
  
  // Find chat in chat array
  this.chatFind = function (jid) {
    var index = -1;
    for (var i in this.chats) {
      if (this.chats[i].core && this.chats[i].core.jid == jid) {
        index = i;
        break;
      }
    }
    return index;
  }
  
  // Get a chat for a jid (create if none)
  this.chatGet = function (jid, title) {
    var ci = this.chatFind(jid);
    if (ci >= 0) {
      var chat = this.chats[ci];
    } else { 
      var chat = new Chat({
        jid: jid,
        title: title || jid,
        chunks: []
      }, this);
    }
    return chat;
  }
    
  // Check for feature support
  this.supports = function (feature) {
    return this.connector.provider.features.indexOf(feature) >= 0;
  }
  
  // Save to store
  this.save = function () {
    var index = Accounts.find(this.core.fullJid || this.core.user);
	  if (index > -1) {
		  var accounts = App.accounts;
		  accounts[index] = this;
		  App.accounts = accounts;
	  }
  }

}

var Accounts = {

  _current: Blaze.Var(0),

  get current () {
    return App.accounts[this._current.get()];
  },
  set current (i) {
    this._current.set(i);
    setTimeout(function () {this.current.allRender();}.bind(this), 0);
  },

  // Find the index of an account
  find: function (jid) {
    var index = -1;
    for (var i in App.accounts) {
      var account = App.accounts[i].core;
      if (account.fullJid ? (account.fullJid == jid) : (account.user == jid)) {
        index = i;
        break;
      }
    }
    return index;
  },
  
  // Total unread messages
  unread: function (partial) {
    var total = App.accounts.reduce(function(prev, cur){return prev + cur.unread}, 0);
    Lungo.Element.count('section#chat header', total);
    if (partial) {
      total -= partial;
    }
    Lungo.Element.count('section#main header', total);
  }
  
}
