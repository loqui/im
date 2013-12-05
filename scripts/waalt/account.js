'use strict';

var Account = function (core) {
  
  // Holds only account data and no functions
  this.core = core;
  this.core.sendQ = this.core.sendQ || [];
  this.connector = new App.connectors[Providers.data[this.core.provider].connector.type](this);
  this.chats = [];
  
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
          if (Accounts.find(this.core.fullJid || this.core.user) < 0) {
            App.accounts.push(this);
            App.smartpush('accountsCores', this.core);
          }
          Lungo.Notification.hide();
          $('section.setup#' + this.core.provider + ' input').val('');
          $('section#success span#imported').text(_('Imported', {number: (this.core.roster && this.core.roster.length) ? this.core.roster.length : 0}));
          this.connector.avatar(function (avatar) {
            $('section#success img#avatar').attr('src', avatar);
          });
          Lungo.Router.section('success');
        }
        this.sync(cb.bind(this));
      }.bind(this),
      authfail: function () {
          Lungo.Notification.error(_('Timeout'), _('TimeoutNotice'), 'signout', 5);
      }
    });
  }
  
  // Connect
  this.connect = function () {
    if (this.connector.isConnected()) {
      this.connector.start();
      this.sendQFlush();
      this.allRender();
    } else {
      if (navigator.onLine){
        this.connector.connect({
          connected: function () {
            var cb = function () {
              App.audio('login');
              this.connector.start();
              this.sendQFlush();
              this.allRender();
            }
            this.sync(cb.bind(this));
          }.bind(this),
          authfail: function () {
          }
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
    var account = this;
    $('section#main').data('jid', this.core.fullJid);
    $('section#main header').style('background', this.connector.provider.color);
    var vCard = $(this.connector.vcard);
    var address = ( vCard.length && vCard.find('FN').length ) ? vCard.find('FN').text() : this.core.user;
    $('section#main footer .address').text(address);
    $('section#main article ul[data-jid="' + this.core.fullJid + '"]').show().siblings('ul').hide();
    var index = Accounts.find(this.core.fullJid);
    $('aside#accounts .indicator').style('top', (6.25+4.5*index)+'rem').show();
    Lungo.Element.count('section#main header nav button[data-view-article="chats"]', this.unread);
    var lacks = Providers.data[this.core.provider].lacks;
    var meSection = $('section#me');
    var mainSection = $('section#main');
    meSection.data('lacks', lacks.join(' '));
    mainSection.data('lacks', lacks.join(' '));
    meSection.find('#status input').val(this.connector.presence.status);
    meSection.find('#card .name').text(address == this.core.user ? '' : address);
    meSection.find('#card .user').text(this.core.user);
    meSection.find('#card .provider').empty().append($('<img/>').attr('src', 'img/providers/' + this.core.provider + '.svg')).append(Providers.data[this.core.provider].longName);
    Store.recover(App.avatars[account.core.fullJid], function (src) {
      var show = function (src) {
        $('section#main footer .avatar img').attr('src', src);
        $('section#me .avatar img').attr('src', src);        
      }
      if (src) {
        show(src);
      } else {
        account.connector.avatar(function (src) {
          show(src);
        });
      }
    });
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
  
  // Changes some styles based on presence and connection status
  this.accountRender = function () {
    var li = $('aside#accounts li[data-jid="' + (this.core.fullJid || this.core.user) + '"]');
    li.data('connected', this.connector.isConnected());
    li.data('show', this.connector.presence.show);
  }
  
  // List all chats for this account
  this.chatsRender = function () {
    var account = this;
    var oldUl = $('section#main article#chats ul[data-jid="' + this.core.fullJid + '"]');
    var ul = $("<ul />");
    ul.data('jid', account.core.fullJid);
    ul.attr('style', oldUl.attr('style'));
    var totalUnread = 0;
    if (this.core.chats && this.core.chats.length) {
      for (var i in this.core.chats) {
        var chat = this.core.chats[i];
        var title = App.emoji[Providers.data[this.core.provider].emoji].fy(chat.title);
        var lastMsg = chat.last.text ? App.emoji[Providers.data[account.core.provider].emoji].fy(chat.last.text) : '';
        var lastStamp = chat.last.stamp ? Tools.convenientDate(chat.last.stamp).join('<br />') : '';
        var li = $('<li/>').data('jid', chat.jid);
        li.append($('<span/>').addClass('avatar').append('<img/>'));
        li.append($('<span/>').addClass('name').html(title));
        li.append($('<span/>').addClass('lastMessage').html(lastMsg));
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
        Lungo.Router.article('main', 'contacts');
      });
      ul.prepend(span);
    }
    oldUl.replaceWith(ul);
    Lungo.Element.count('aside li[data-jid="' + this.core.fullJid + '"]', totalUnread);
    if (ul.style('display') == 'block') {
      Lungo.Element.count('section#main header nav button[data-view-article="chats"]', totalUnread);
    }
    this.unread = totalUnread;
  }

  // List all contacts for this account
  this.contactsRender = function () {
    if (!document.getElementById('searchForm')) {
      var searchForm = $('<fieldset/>')
        .attr('id', 'searchForm')
        .append(
          $('<input/>')
            .attr('type', 'search')
            .attr('placeholder', _('Searchbar'))
        );
      var clear = $('<span/>')
        .addClass('clear')
        .text('✖');
      var sync = $('<span/>')
        .addClass('sync')
        .text('↻');
      searchForm.append(clear).append(sync);
      var searchFormOnKeyUp = function (event) {
        var target = $(event.target);
        var key = target.val().toUpperCase();
        var contactList = document.getElementById('contacts').getElementsByTagName('li');
        var matchContact = function (contact) {
          if (contact.localName == 'li') {
            var name = contact.getElementsByClassName('name').item(0).innerHTML.toUpperCase();
            if (name.indexOf(key) == 0) {
                $(contact).removeClass('hidden');
            } else {
                $(contact).addClass('hidden');
            }
          }
        }
        for (var i in contactList) {
          matchContact(contactList[i]);
        }
        var clear = $('section#main fieldset#searchForm .clear');
        if (target.val().length) {
          clear.show();
        } else {
          clear.hide();
        }
      }
      var clearOnClick = function (event) {
        $('section#main fieldset#searchForm input').val('').trigger('keyup');
      }
      var syncOnClick = function (event) {
        this.connector.contactsSync(function () {
          this.connector.contactsSort(function () {
            this.save();
            this.allRender();
          }.bind(this));
        }.bind(this));
      }.bind(this);
      searchForm.bind('keyup', searchFormOnKeyUp);
      clear.bind('click', clearOnClick);
      sync.bind('click', syncOnClick);
      $('section#main article#contacts').prepend(searchForm);
    }
    var account = this;
    var oldUl = $('section#main article#contacts ul[data-jid="' + this.core.fullJid + '"]');
    var ul = $("<ul />")
      .data('jid', account.core.fullJid)
      .attr('style', oldUl.attr('style'));
    var frag = document.createDocumentFragment();
    this.core.roster.forEach(function (contact, i, roster) {
      var name = contact.name || contact.jid;
      var li = document.createElement('li');
      li.dataset.jid = contact.jid;
      li.innerHTML = 
          '<span class=\'avatar\'><img /></span>'
        + '<span class=\'name\'>' + name + '</span>'
        + '<span class=\'show backchange\'></span>'
        + '<span class=\'status\'></span>';
      li.addEventListener('click', function () {
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
      });
      li.addEventListener('hold', function () {
        window.navigator.vibrate([100]);
        Messenger.contactProfile(this.dataset.jid);
      });
      frag.appendChild(li);
    });
    ul[0].appendChild(frag);
    oldUl.replaceWith(ul);
  }
  
  // Render presence for every contact
  this.presenceRender = function () {
    if (this.connector.isConnected() && this.supports('presence')) {
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
    $('ul[data-jid="' + this.core.fullJid + '"] span.avatar img:not([src])').each(function (i, el) {
      var jid = Strophe.getBareJidFromJid(el.parentNode.parentNode.dataset.jid);
      if (avatars[jid]) {
        Store.recover(avatars[jid], function (val) {
          if (val) {
            $(el).attr('src', val);
          }
        });
      } else if (account.connector.isConnected() && account.supports('easyAvatars')) {
        account.connector.avatar(function (avatar) {
          if (avatar) {
            $(el).attr('src', avatar);
            avatars[jid] = Store.save(avatar, function () {
              Store.put('avatars', avatars);
            });
          }
        }, jid);
      }
    });
    if ($('section#main').data('jid') == account.core.fullJid) {
      Store.recover(avatars[account.core.fullJid], function (src) {
        var show = function (src) {
          $('section#main footer .avatar img').attr('src', src);
          $('section#me .avatar img').attr('src', src);        
        }
        if (src) {
          show(src);
        } else {
          account.connector.avatar(function (src) {
            show(src);
          });
        }
      });
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
    var index = Accounts.find(this.core.fullJid || this.core.user);
    App.accountsCores[index] = this.core;
    App.smartupdate('accountsCores');
  }

}

var Accounts = {

  // Find the index of an account
  find: function (jid) {
    var index = -1;
    for (var i in App.accountsCores) {
      var account = App.accountsCores[i];
      if (account.fullJid ? (account.fullJid == jid) : (account.user == jid)) {
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
      var li = $('<li/>').data('jid', account.core.fullJid || account.core.user);
      var button = $('<button/>').addClass('account').on('click', function () {
        var index = Accounts.find(this.parentNode.dataset.jid);
        console.log('SWITCHING TO ACCOUNT', index, this.parentNode.dataset.jid);
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
      chats.append($("<ul/>").data('jid', account.core.fullJid));
      contacts.append($("<ul/>").data('jid', account.core.fullJid));
      account.allRender();
    }
  }
  
}
