'use strict';

var Account = function (core) {
  
  // Holds only account data and no functions
  this.core = core;
  this.core.sendQ = this.core.sendQ || [];
  this.connector = new App.connectors[Providers.data[this.core.provider].connector](this);
  this.chats = [];
  
  // Test account
  this.test = function () {
    var account = this;
    var sameProvider = Lungo.Core.findByProperty(App.accountsCores, 'provider', this.core.provider);
    if (account.supports('multi') || !sameProvider) {
      this.connector.connect(this.core.user, this.core.pass, function (status) {
        switch (status) {
          case Strophe.Status.CONNECTING:
            console.log('CONNECTING');
            Lungo.Notification.show('globe', _('Connecting'));
            break;
          case Strophe.Status.CONNFAIL:
            console.log('CONNFAIL');
            Lungo.Notification.error(_('Connfail'), _('ConnCheck', 'exclamation-sign'));
            break;
          case Strophe.Status.AUTHENTICATING:
            console.log('AUTHENTICATING');
            Lungo.Notification.show('key', _('Authenticating'));
            break;
          case Strophe.Status.AUTHFAIL:
            console.log('AUTHFAIL');
            Lungo.Notification.error(_('Authfail'), _('DataCheck', 'exclamation-sign'));
            break;
          case Strophe.Status.CONNECTED:
            console.log('CONNECTED');
            Lungo.Notification.show('download', _('Synchronizing'));
            account.sync(function () {
              // Don't add an account if already set up
              if (Accounts.find(account.core.user, account.core.provider) < 0) { 
                App.accounts.push(account);
                App.smartpush('accountsCores', account.core);
              }
              Lungo.Notification.hide();
              $('section.setup#' + account.core.provider + ' input').val('');
              $('section#success span#imported').text(account.core.roster.length || 'No');
              var vcard = $(account.vcard);
              if (vcard.find('BINVAL').length) {
                var img = vcard.find('BINVAL').text();
                var type = vcard.find('TYPE').text();
                var avatar = 'data:'+type+';base64,'+img;
              } else {
                var avatar = 'img/foovatar.png';
              }
              $('section#success img#avatar').attr('src', avatar);
              Lungo.Router.section('success');
            });
            break;
          case Strophe.Status.DISCONNECTING:
            console.log('DISCONNECTING');
            break;
          case Strophe.Status.DISCONNECTED:
            console.log('DISCONNECTED');
            break;
        }
      });
    } else {
      Lungo.Notification.error(_('NoMulti'), _('NoMultiExplanation', 'exclamation-sign'));
    }
  }
  
  // Connect
  this.connect = function () {
    var account = this;
    if (account.connector.connection && account.connector.connection.connected) {
      account.connector.presenceStart();
      account.sendQFlush();
      account.allRender();
    } else {
      account.connector.connection = new Strophe.Connection(account.connector.provider.BOSH.host);
      if (navigator.onLine){
        console.log('Trying to connect to ' + account.connector.provider.BOSH.host);
        if (account.core.user && account.core.pass) {
          account.connector.connection.connect(
            account.core.user + '/' + (account.core.resource || App.defaults.Account.core.resource), 
            account.core.pass, 
            account.connectionHandler.bind(account), 
            account.connector.provider.BOSH.timeout || App.defaults.Provider.BOSH.timeout
          );
        }
      }
    }
  }
  
  this.connectionHandler = function (status) {
    var account = this;
    switch (status) {
      case Strophe.Status.CONNECTING:
        console.log('CONNECTING');
        break;
      case Strophe.Status.CONNFAIL:
        console.log('CONNFAIL');
        this.accountRender();
        break;
      case Strophe.Status.AUTHENTICATING:
        console.log('AUTHENTICATING');
        break;
      case Strophe.Status.AUTHFAIL:
        console.log('AUTHFAIL');
        Lungo.Notification.error(_('Authfail'), _('DataCheck', 'exclamation-sign'));
        this.accountRender();
        break;
      case Strophe.Status.CONNECTED:
        console.log('CONNECTED');
        var cb = function () {
          App.audio('login');
          this.connector.presenceStart();
          this.sendQFlush();
          this.allRender();
        };
        this.sync(cb.bind(account));
        break;
      case Strophe.Status.DISCONNECTING:
        console.log('DISCONNECTING');
        break;
      case Strophe.Status.DISCONNECTED:
        console.log('DISCONNECTED');
        this.connector.connection.reset();
        App.audio('logout');
        this.accountRender();
        this.presenceRender();
        if (App.settings.reconnect) {
          this.connect();
        }
        break;
    }
  }
  
  // Download roster and register callbacks for roster updates handling
  this.sync = function (callback) {
    var account = this;
    var connector = account.connector;
    var realJid = Strophe.getBareJidFromJid(this.connector.connection.jid);
    if (account.core.realJid != realJid) {
      account.core.realJid = realJid;
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
          account.vcard = $(data).find('vCard').get(0);
          callback();
        });
      } else {
        callback();
      }
    });
  }
  
  // Bring account to foreground
  this.show = function () {
    $('section#main').data('user', this.core.user);
    $('section#main').data('provider', this.core.provider);
    $('section#main header').style('background', this.connector.provider.color);
    var vCard = $(this.vcard);
    var address = ( vCard.length && vCard.find('FN').length ) ? vCard.find('FN').text() : this.core.user;
    $('section#main footer').data('jid', this.core.user);
    $('section#main footer .address').text(address);
    if (vCard.find('BINVAL').length) {
      var img = vCard.find('BINVAL').text();
      var type = vCard.find('TYPE').text();
      var avatar = 'data:'+type+';base64,'+img;
    } else {
      var avatar = 'img/providers/squares/' + this.core.provider + '.svg';
    }
    $('section#main footer .avatar img').attr('src', avatar);
    $('section#me .avatar img').attr('src', avatar);
    $('section#main article ul[data-provider="' + this.core.provider + '"][data-user="' + this.core.user + '"]').show().siblings('ul').hide();
    var index = Accounts.find(this.core.user, this.core.provider);
    $('aside#accounts .indicator').style('top', (6.25+4.5*index)+'rem').show();
    Lungo.Element.count('section#main header nav button[data-view-article="chats"]', this.unread);
    var lacks = Providers.data[this.core.provider].lacks;
    var meSection = $('section#me').removeClass().addClass('fix head profile');
    for (var i in lacks) {
      var lack = lacks[i];
      meSection.addClass('lacks_' + lack);
    }
    meSection.find('#status input').val(this.connector.presence.status);
    meSection.find('#card .name').text(address == this.core.user ? '' : address);
    meSection.find('#card .user').text(this.core.user);
    meSection.find('#card .provider').empty().append($('<img/>').attr('src', 'img/providers/' + this.core.provider + '.svg')).append(Providers.data[this.core.provider].longname);
  }
  
  // Render everything for this account
  this.allRender = function () {
    this.accountRender();
    this.chatsRender();
    this.contactsRender();
    this.presenceRender();
    if (this.supports('vcard')) {
      this.avatarsRender();
    }
  }
  
  // Changes some styles based on presence and connection
  this.accountRender = function () {
    var li = $('aside#accounts li[data-provider="' + this.core.provider + '"][data-user="' + this.core.user + '"]');
    li.data('connected', this.connector.connection && this.connector.connection.connected);
    li.data('show', this.connector.presence.show);
  }
  
  // List all chats for this account
  this.chatsRender = function () {
    var account = this;
    var oldUl = $('section#main article#chats ul[data-provider="' + this.core.provider + '"][data-user="' + this.core.user + '"]');
    var ul = $("<ul />");
    ul.data('provider', account.core.provider);
    ul.data('user', account.core.user);
    ul.attr('style', oldUl.attr('style'));
    var totalUnread = 0;
    if (this.core.chats.length) {
      for (var i in this.core.chats) {
        var chat = this.core.chats[i];
        var contact = Lungo.Core.findByProperty(this.core.roster, 'jid', chat.jid);
        var title = contact.name || contact.jid;
        var lastMsg = chat.last.text ? chat.last.text : '';
        var lastStamp = chat.last.stamp ? Tools.convenientDate(chat.last.stamp).join('<br />') : '';
        var li = $('<li/>').data('jid', contact.jid);
        li.append($('<span/>').addClass('avatar').append('<img/>'));
        li.append($('<span/>').addClass('name').text(title));
        li.append($('<span/>').addClass('lastMessage').text(lastMsg));
        li.append($('<span/>').addClass('lastStamp').html(lastStamp));
        li.append($('<span/>').addClass('show').addClass('backchange'));
        li.append($('<span/>').addClass('unread').text(chat.unread));
        li.data('unread', chat.unread ? 1 : 0);
        li.bind('click', function () {
          var ci = account.chatFind(this.dataset.jid);
          if (ci >= 0) {
            var chat = account.chats[ci];
          } else { 
            var chat = new Chat({
              jid: this.dataset.jid,
              title: $(this).children('.name').text(),
              chunks: []
            }, account);
          }
          chat.show();
        }).bind('hold', function () {
          window.navigator.vibrate([100]);
          Messenger.contactProfile(this.dataset.jid);
        });
        totalUnread += chat.unread;
        ul.prepend(li);
      }
    } else {
      var span = $('<span/>').addClass('noChats')
        .append($('<strong/>').text(_('NoChats')))
        .append($('<p/>').text(_('NoChatsExplanation')));
      span.on('click', function () {
        Lungo.Router.article('main', 'contacts');
      });
      ul.prepend(span);
    }
    oldUl.replaceWith(ul);
    Lungo.Element.count('aside li[data-provider="' + this.core.provider + '"][data-user="' + this.core.user + '"]', totalUnread);
    if (ul.style('display') == 'block') {
      Lungo.Element.count('section#main header nav button[data-view-article="chats"]', totalUnread);
    }
    this.unread = totalUnread;
  }
  
  // List all contacts for this account
  this.contactsRender = function () {
    var account = this;
    var oldUl = $('section#main article#contacts ul[data-provider="' + this.core.provider + '"][data-user="' + this.core.user + '"]');
    var ul = $("<ul />");
    ul.data('provider', account.core.provider);
    ul.data('user', account.core.user);
    ul.attr('style', oldUl.attr('style'));
    for (var i in this.core.roster) {
      var contact = this.core.roster[i];
      var name = contact.name || contact.jid;
      var li = $('<li data-jid= \'' + contact.jid + '\'>'
        + '<span class=\'avatar\'><img /></span>'
        + '<span class=\'name\'>' + name + '</span>'
        + '<span class=\'show backchange\'></span>'
        + '<span class=\'status\'></span>'
        +'</li>');
      li.bind('click', function () {
        var ci = account.chatFind(this.dataset.jid);
        if (ci >= 0) {
          var chat = account.chats[ci];
        } else { 
          var chat = new Chat({
            jid: this.dataset.jid,
            title: $(this).children('.name').text(),
            chunks: []
          }, account);
        }
        chat.show();
      }).bind('hold', function () {
        window.navigator.vibrate([100]);
        Messenger.contactProfile(this.dataset.jid);
      });
      ul.append(li);
    }
    oldUl.replaceWith(ul);
  }
  
  // Render presence for every contact
  this.presenceRender = function () {
    if (App.online && this.connector.connection.connected) {
      for (var i in this.core.roster) {
        var contact = this.core.roster[i];
        var li = $('section#main article ul li[data-jid="'+contact.jid+'"]');
        li.data('show', contact.show || 'na');
        li.find('.status').show().text(contact.status || _('show' + (contact.show || 'na')));
        var section = $('section#chat');
        if (section.data('jid') == contact.jid) {
          section.data('show', contact.show || 'na');
          section.find('header .status').text(contact.status || _('show' + (contact.show || 'na')));
        }
      }
      $('section#main ul li span.show').show();
    } else {
      $('section#main ul li span.show').hide();
      $('section#main ul li span.status').hide();
    }
  }
  
  // Render all the avatars
  this.avatarsRender = function () {
    var account = this;
    var avatars = App.avatars;
    $('ul[data-provider="' + this.core.provider + '"][data-user="' + this.core.user + '"] span.avatar img:not([src])').each(function (i, el) {
      var jid = Strophe.getBareJidFromJid(el.parentNode.parentNode.dataset.jid);
      if (avatars[jid]) {
        Store.recover(avatars[jid], function (val) {
          if (val) {
            $(el).attr('src', val);
          }
        });
      } else if (navigator.onLine && account.connector.connection.connected) {
        account.connector.connection.vcard.get(function (data) {
          var vCard = $(data).find('vCard');
          if (vCard.find('BINVAL').length) {
            var img = vCard.find('BINVAL').text();
            var type = vCard.find('TYPE').text();
            var avatar = 'data:'+type+';base64,'+img;
            $(el).attr('src', avatar);
            avatars[jid] = Store.save(avatar, function (index) {
              Store.put('avatars', avatars);
            });
          }
        }, jid);
      }
    });
    var vCard = $(this.vcard);
    if ($('section#main').data('provider') == account.core.provider && $('section#main').data('user') == account.core.user) {
      if (vCard.find('BINVAL').length) {
        var img = vCard.find('BINVAL').text();
        var type = vCard.find('TYPE').text();
        var avatar = 'data:'+type+';base64,'+img;
      } else {
        var avatar = 'img/providers/squares/' + this.core.provider + '.svg';
      }
      $('section#main footer .avatar img').attr('src', avatar);
      $('section#me .avatar img').attr('src', avatar);
      var address = ( vCard.length && vCard.find('FN').length ) ? vCard.find('FN').text() : this.core.user;
      $('section#main footer .address').text(address);
      $('section#me #card .name').text(address == this.core.user ? '' : address);
    }
  }
  
  // Push message to sendQ
  this.toSendQ = function (storageIndex) {
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
      Store.recover(block, function (data) {
        var content = data[sendQ[0][1]];
        var msg = new Message(account, {
          from: content.from,
          to: content.to,
          text: content.text,
          stamp: content.stamp
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
      if (this.chats[i].core.jid == jid) {
        index = i;
        break;
      }
    }
    return index;
  }
    
  // Check for feature support
  this.supports = function (feature) {
    return !this.connector.provider.lacks || this.connector.provider.lacks.indexOf(feature) < 0;
  }
  
  // Save to store
  this.save = function () {
    var index = Accounts.find(this.core.user, this.core.provider);
    App.accountsCores[index] = this.core;
    App.smartupdate('accountsCores');
  }

}

var Accounts = {

  // Find the index of an account
  find: function (user, provider) {
    var index = -1;
    for (var i in App.accountsCores) {
      var account = App.accountsCores[i];
      if (account.user == user && account.provider == provider) {
        index = i;
        break;
      }
    }
    return index;
  },
  
  // Create accounts icons
  aside: function () {
    var ul = $('aside#accounts ul');
    ul.empty();
    for (var i in App.accounts) {
      var account = App.accounts[i];
      var li = $('<li/>').data('user', account.core.user).data('provider', account.core.provider);
      var button = $('<button/>').addClass('account').on('click', function () {
        var index = Accounts.find(this.parentNode.dataset.user, this.parentNode.dataset.provider);
        if (index) {
          App.accounts[index].show();
        }
      });
      var img = $('<img/>').attr('src', 'img/providers/squares/' + account.core.provider + '.svg');
      ul.append(li.append(button.append(img)));
    }
  },
  
  // Create main sections 
  main: function () {
    var chats = $('section#main article#chats').empty();
    var contacts = $('section#main article#contacts').empty();
    for (var i in App.accounts) {
      var account = App.accounts[i];
      chats.append($("<ul/>").data('provider', account.core.provider).data('user', account.core.user));
      contacts.append($("<ul/>").data('provider', account.core.provider).data('user', account.core.user));
      account.allRender();
    }
  }
  
}
