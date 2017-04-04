/* global App, Providers, Store, Tools, Messenger, Activity, Menu, Avatar, Message, Chat, Lungo, Make */

/**
* @file Holds {@link Account}
* @author [Adán Sánchez de Pedro Crespo]{@link https://github.com/aesedepece}
* @author [Jovan Gerodetti]{@link https://github.com/TitanNano}
* @author [Christof Meerwald]{@link https://github.com/cmeerw}
* @author [Giovanny Andres Gongora Granada]{@link https://github.com/Gioyik}
* @author [Sukant Garg]{@link https://github.com/gargsms}
* @license AGPLv3
*/

'use strict';

var Account = {

  /**
   * @instance {AccountCore}
   */
  core : null,

  /**
   * @instance {Connector}
   */
  connector : null,

  /**
   * @type {AccountCore.OTR}
   */
  OTR : null,

  /**
   * @type {Object}
   */
  contacts : null,

  /**
   * @type{Blaze.Var}
   */
  _unread : null,

  /**
   * @type {Blaze.Var}
   */
  _chats : null,

  /**
   * @type {Blaze.Var}
   */
  _enabled : null,

  /**
   * @type {number}
   */
  _pendingReconnect : null,

  /**
   * @type {number}
   */
  _reconnectBackoff : 1,

  /**
   * @type {boolean}
   */
  _initialConnect : true,

  /**
   * @constructs
   * @param {AccountCore} core
   */
  _make : function (core) {
    this.core = core;
    this.core.sendQ = this.core.sendQ || [];
    this.connector = new App.connectors[Providers.data[this.core.provider].connector.type](this);
    this.contacts = {};
    this._unread = new Blaze.Var(0);
    this._chats = new Blaze.Var([]);
    this._enabled = new Blaze.Var(false);

    this.markMessage = async.queue(this.markMessageWorker.bind(this));
    this.markMessage.drain = this.markMessageDrain.bind(this);

    if ('OTR' in core) {
      this.OTR = $.extend({}, App.defaults.Account.core.OTR, core.OTR);
      if (core.OTR.key) { // inflate the packed key
        this.OTR.key = DSA.parsePrivate(core.OTR.key);
      }
    } else {
      this.OTR = $.extend({}, App.defaults.Account.core.OTR);
    }
  },

  /**
   * schedule reconnect after a short (exponentially increasing timeout)
   */
  _scheduleReconnect : function () {
    if (App.settings.reconnect && ! this._initialConnect && this.enabled) {
      this._reconnectBackoff = Math.min(this._reconnectBackoff * 2, 300);
      this._pendingReconnect = setTimeout(function () {
        if (this._pendingReconnect && App.online && this.enabled) {
          this._pendingReconnect = null;
          this.connect();
        }
      }.bind(this), 1000 * this._reconnectBackoff);
    }
  },

  /**
   * @alias enabled/get
   * @memberof Account.prototype
   */
  get enabled () {
    return this._enabled.get();
  },

  /**
   * @alias enabled/set
   * @memberof Account.prototype
   */
  set enabled (val) {
    this._enabled.set(val);
    if (val != 'loading') {
      this.core.enabled = val;
      if (!val) {
        this.connector.disconnect();
      } else {
        this._initialConnect = true;
        this.connect();
      }
      this.save();
    }
  },

  /**
   * Returns {Chat[]} for this account.
   */
  get chats () {
    return this._chats.get();
  },

  /**
   * Sets the {Chat[]} for this account
   */
  set chats (val) {
    this._chats.set(val);
  },

  /**
   * Returns the amount of unread messages in this account.
   */
  get unread () {
    var val = this.chats.reduce(function (prev, cur) {return prev + cur.core.unread;}, 0);
    this._unread.set(val);
    return this._unread.get();
  },

  /**
   * Tests if the account is working properly account
   */
  test : function () {
    this.connector.connect({
      connecting: function () {
        Lungo.Notification.show('public', _('Connecting'));
      },
      authenticating: function () {
        Lungo.Notification.show('vpn_key', _('SMSsending'));
      },
      connected: function () {
        Lungo.Notification.show('file_download', _('Synchronizing'));
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
            //Lungo.Notification.error(_('DupliAccount'), _('DupliAccountNotice'), 'warning', 5);
          }
          this.save();
        }.bind(this);
        this.connector.start();
        this.sync(cb);
      }.bind(this),
      authfail: function () {
        Lungo.Notification.error(_('NoAuth'), _('NoAuthNotice'), 'settings_input_antenna', 5);
      }
    });
  },

  /**
   * establishes a connection to the accounts provider.
   */
  connect : function (cb) {
    if (this._pendingReconnect) {
      clearTimeout(this._pendingReconnect);
      this._pendingReconnect = null;
    }
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
            this._initialConnect = false;
            this._reconnectBackoff = 1;
            var cb = function (rcb) {
              App.audio('login');
              if (this === Accounts.current) {
                this.accountRender();
                this.avatarsRender();
              }
              this.connector.presence.set(document.hidden ? 'away' : 'a');
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
            this._initialConnect = false;
            Lungo.Notification.error(_('NoAuth'), _('NoAuthNotice'), 'settings_input_antenna', 5);
          }.bind(this),
          connfail: function () {
            if (this.enabled == 'loading') {
              this._scheduleReconnect();
            }
          }.bind(this),
          disconnected: function () {
            App.audio('logout');
            this.presenceRender();
            this._scheduleReconnect();
          }.bind(this)
        });
      }
    }
	if(cb) {
		cb();
	}
  },

  /**
   * Download roster and register callbacks for roster updates handling.
   *
   * @param {function} callback
   */
  sync : function (callback) {
    this.connector.sync(callback);
  },

  /**
   * Bring account to foreground.
   */
  show : function () {
    Accounts.current = Accounts.find(this.core.fullJid);
  },

  /**
   * Render everything for this account.
   */
  allRender : function () {
    this.accountRender();
    this.chatsRender();
    this.avatarsRender();
    this.presenceRender();
  },

  /**
   * Changes some styles based on presence and connection status.
   *
   * @param {null} front
   */
  accountRender : function (front) {
    $('section#main header').css('border-color', this.connector.provider.color);
    $('aside#accounts .cover').css('background-color', this.connector.provider.color);
    $('aside#accounts .cover .avatar img').removeAttr('src');
    $('section#main footer .avatar img').removeAttr('src');
    $('section#me .avatar img').removeAttr('src');
    $('.floater').css('background-color', this.connector.provider.color);
    var vCard = $(this.connector.vcard);
    var address = ( vCard.length && vCard.find('FN').length ) ? vCard.find('FN').text() : this.core.user;
    var features = Providers.data[this.core.provider].features;
    var meSection = $('section#me');
    var mainSection = $('section#main');
    var attachmentSection = $('section#attachment');
    attachmentSection[0].dataset.features = meSection[0].dataset.features = mainSection[0].dataset.features = features.join(' ');
    meSection.find('#nick input').val(this.connector.presence.name);
    meSection.find('#status input').val(this.connector.presence.status);
    meSection.find('#card .name').text(address == this.core.user ? '' : address);
    meSection.find('#card .user').text(this.core.user);
    meSection.find('#card .provider').empty().append($('<img/>').attr('src', 'img/providers/squares/' + this.core.provider + '.svg'));
    if(this.core.background){
      Store.recover(this.core.background, function (key, url, free) {
        $('section#chat ul#messages').css('background-image', 'url('+url+')');
        $('section.profile div#card').css('background-image', 'url('+url+')');

        free();
      });
    }else{
        $('section#chat ul#messages').css('background-image', '');
        $('section.profile div#card').css('background-image', '');
    }
  }, //bind(this) Why??

  /**
   * @param {Chat} chat
   * @param {boolean} up
   */
  singleRender : function (chat, up) {
    var ul = $('section#main article#chats ul[data-jid="' + this.core.fullJid + '"]');
    var li = ul.children('li[data-jid="' + chat.core.jid + '"]');
    if (li.length) {
      if (up) {
        li.detach();
        ul.prepend(li);
      }
	var contact = Lungo.Core.findByProperty(this.core.roster, 'jid', chat.core.last.from);
	var label = "";
	if (contact) {
		label = (contact.name).split(' ')[0] + ': ';
	} else if (chat.core.last.from == this.core.user){
	  label = _('Me') + ': ';
	} else if (chat.core.last.from) {
	  label = (chat.core.last.from).split('@')[0] + ': ';
	}
      var lastMsg = chat.core.last.text ? App.emoji[Providers.data[this.core.provider].emoji].fy(Tools.HTMLescape(chat.core.last.text.replace(/\n/g, ' '))) : (chat.core.last.media ? _('SentYou', {type: _('MediaType_' + chat.core.last.media.type)}) : '');
      lastMsg = lastMsg.replace(/(\*)([A-Za-z0-9\s]+)(\*)/g, '<b>$2</b>');
      lastMsg = lastMsg.replace(/(_)([A-Za-z0-9\s]+)(_)/g, '<i>$2</i>');
      lastMsg = lastMsg.replace(/(~)([A-Za-z0-9\s]+)(~)/g, '<s>$2</s>');
      li.children('.lastMessage').html(label + lastMsg);
      li.children('.lastStamp').children('date').attr('datetime', chat.core.last.stamp).html(chat.core.last.stamp ? Tools.convenientDate(chat.core.last.stamp).join('<br />') : '');
      li[0].dataset.unread = chat.core.unread;
      li[0].dataset.hidden = chat.core.settings.hidden[0] ? 1 : 0;
      li[0].dataset.lastAck = chat.core.last.ack;
    } else {
      this.allRender();
      this.presenceRender(chat.core.jid);
    }
  }, //.bind(this); why?

  /**
   * List all chats for this account
   *
   * @param {function} f
   * @param {function} click
   * @param {function} hold
   */
  chatsRender : function (f, click, hold) {
    var account = this;
    var oldUl = $('section#main article#chats ul[data-jid="' + this.core.fullJid + '"]');
    var ul = oldUl.clone().empty();
    var media = _('AttachedFile');
    ul[0].dataset.jid = account.core.fullJid;
    if (!f) {
      ul.attr('style', oldUl.attr('style'));
    }
    if (this.core.chats && this.core.chats.length) {
      var liClickDefault= function (){
          click(this);
      };
      var liClickFallback= function () {
        account.chatGet(this.dataset.jid).show();
      };
      var liHoldDefault= function (){
          hold(this);
      };
      var liHoldFallback= function () {
        window.navigator.vibrate([100]);
        if (this.dataset.jid.match(/\-/)) {
          Messenger.mucProfile(this.dataset.jid);
        } else {
          Messenger.contactProfile(this.dataset.jid);
        }
      };
      for (var i in this.core.chats) {
        var chat = this.core.chats[i];
        var name = chat.title;
        var title = App.emoji[Providers.data[this.core.provider].emoji].fy(name);
		var contact = Lungo.Core.findByProperty(this.core.roster, 'jid', chat.last.from);
		var label = "";
		if (contact) {
			label = (contact.name).split(' ')[0] + ': ';
        } else if (chat.last.from == this.core.user){
          label = _('Me') + ': ';
        } else if (chat.last.from) {
		  label = (chat.last.from).split('@')[0] + ': ';
        }
        var lastMsg = chat.last ? (chat.last.text ? App.emoji[Providers.data[this.core.provider].emoji].fy(Tools.HTMLescape(chat.last.text.replace(/\n/g, ' '))) : (chat.last.media ? _('SentYou', {type: _('MediaType_' + chat.last.media.type)}) : '')) : '';
        lastMsg = lastMsg.replace(/(\*)([A-Za-z0-9\s]+)(\*)/g, '<b>$2</b>');
        lastMsg = lastMsg.replace(/(_)([A-Za-z0-9\s]+)(_)/g, '<i>$2</i>');
        lastMsg = lastMsg.replace(/(~)([A-Za-z0-9\s]+)(~)/g, '<s>$2</s>');
        var lastStamp = chat.last.stamp ? Tools.convenientDate(chat.last.stamp).join('<br />') : '';
        var li = $('<li/>');
        li[0].dataset.jid = chat.jid;
        li[0].dataset.unread = chat.unread;
        li.append($('<span/>').addClass('avatar').append('<img/>'));
        li.append($('<span/>').addClass('name').html(title));
        li.append($('<span/>').addClass('lastMessage').html(label + lastMsg));
        li.append($('<span/>').addClass('lastStamp').append($('<date/>').attr('datetime', chat.last.stamp).html(lastStamp)));
        li.append($('<span/>').addClass('lastAck'));
        li.append($('<span/>').addClass('show').addClass('backchange'));
        li[0].dataset.unread = chat.unread;
        li[0].dataset.hidden= chat.settings.hidden[0] ? 1 : 0;
        li[0].dataset.lastAck = chat.last.ack;
        if (!chat.muc && account.supports('muc') && chat.jid && chat.jid.substring(1).match(/\-/)) {
          account.chats[i].core.muc = true;
          account.chats[i].save();
        }
        li[0].dataset.muc = chat.muc ? true : false;
        li.bind('click', click ? liClickDefault : liClickFallback).bind('hold', hold ? liHoldDefault : liHoldFallback);
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
  }, //.bind(this); hmmm?

  /**
   * List all contacts for this account.
   *
   * @param {function} f
   * @param {function} click
   * @param {boolean} selected
   */
  contactsRender : function (f, click, selected) {
    var account = this;
    var article = $('<article/>').attr('id', 'contacts');
    var header = $('<header/>').addClass('beige')
      .append($('<button/>').addClass('new').text(_('ContactAdd')).on('click', function (event) {
        Menu.show('contactAdd');
      }));
    if (account.supports('localContacts')) {
      header.append($('<button/>').addClass('sync').text(_('ContactsSync')).on('click', function (event) {
        account.connector.contacts.sync(function (rcb) {
          account.save();
          Lungo.Router.section('main');
        });
      }));
    }
    var ul = $('<ul/>').addClass('list').addClass('scroll');
    var frag = f;
    account = this;
    this.contacts = {};
    if(this.core.roster == undefined && App.platform === "UbuntuTouch"){
    	this.core.roster = [];
    }
    this.core.roster.forEach(function (contact, i, roster) {
      var name = contact.name || contact.jid;
      var nameParts = name.toLowerCase().split(' ');
      for(var _i = 0, _len = nameParts.length; _i < _len; _i++) {
        var part = nameParts[_i];
        if(account.contacts.hasOwnProperty(part))
          account.contacts[part] += ' ' + contact.jid;
        else
          account.contacts[part] = contact.jid;
      }
      var li = document.createElement('li');
      li.dataset.jid = contact.jid;
      if (selected && Object.keys(selected).map(function (key) {
        return selected[key];
      }).indexOf(contact.jid) > -1) {
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
  }, //.bind(this); unnessecary?

  /**
   * List all group chats for this account.
   *
   * @param {function} f
   * @param {function} click
   */
  groupsRender : function (f, click) {
    var account = this;
    var article = $('<article/>').attr('id', 'groups');
    var header = $('<header/>').addClass('beige');
    if (account.supports('mucCreate')) {
      header.append($('<button/>').addClass('new').text(_('GroupNew'))
      .on('click', function (event) {
        Menu.show('mucCreateForm', account);
      }));
    }
    if (account.supports('mucJoin')) {
      header.append($('<button/>').addClass('join').text(_('GroupJoin'))
      .on('click', function (event) {
        Menu.show('mucSearchForm', account);
      }));
    }
    var ul = $('<ul/>').addClass('list').addClass('scroll');
    var frag = f;
    account = this;
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
  },//.bind(this);

  /**
   * Render presence for every contact.
   *
   * @param {string} jid
   */
  presenceRender : function (jid) {
    var contactPresenceRender = function (jid) {
      var section = $('section#chat');
      var header = section.children('header');
      var contact = Lungo.Core.findByProperty(this.core.roster, 'jid', jid);
      if (contact) {
        if (this.supports('show')) {
          var li = $('section#main article ul li[data-jid="'+contact.jid+'"]');
          if (li.length > 0) {
            li[0].dataset.show = contact.presence.show || 'na';
          }
        }
        if (section[0].dataset.jid == contact.jid) {
          section[0].dataset.show = (this.supports('show') && contact.presence.show) || 'na';

          var show =_('show' + (contact.presence.show || 'na'));
          var time = (contact.presence.show != 'a') && contact.presence.last && Tools.convenientDate(Tools.localize(Tools.stamp(contact.presence.last)));
		  var prefix = time
            ? _('LastTime', {time: _('DateTimeFormat', {date: time[0], time: time[1]})})
            : show;

          var status = ( (time || show == _('showa')) ? prefix : '' ) +
            ( (contact.presence.status && (time || show == _('showa')) && App.settings.showstat == true) ? (' - ') : '' ) +
            ( (contact.presence.status && App.settings.showstat == true)
                ? App.emoji[Providers.data[this.core.provider].emoji].fy(Tools.HTMLescape(contact.presence.status))
                  : '' );
          header.find('.status').html(status);
        }
      } else {
        header.find('.status').html(App.emoji[Providers.data[this.core.provider].emoji].fy(' '));
        section[0].dataset.show = 'na';
      }
    }.bind(this);
    if (jid) {
      contactPresenceRender(jid);
    } else {
      var ul = $('section#main article#chats ul[data-jid="' + this.core.fullJid + '"]');
      if (ul.length > 0) {
        ul[0].dataset.enabled = this.enabled;
        Object.keys(this.core.chats).forEach(function(key){
          var val = this[key];

          if(!val.muc){
            contactPresenceRender(val.jid, undefined);
          }
        }.bind(this.core.chats));
      }
    }
  }, //.bind(this);

  /**
   * Render all the avatars.
   */
  avatarsRender : function () {
    var account = this;
    var avatars = App.avatars;
    var contactAvatarRender = function (i, el) {
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
        Tools.log('REQUESTING AVATAR FOR', jid);
        account.connector.avatar(function (a) {
          a.url.then(function (val) {
            Tools.log('RETRIEVED AVATAR', a.data);
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
    };

    $('aside#accounts article#accounts div[data-jid="' + this.core.fullJid + '"] span.avatar img:not([src])').each(contactAvatarRender);
    $('section#main article#chats ul[data-jid="' + this.core.fullJid + '"] span.avatar img:not([src])').each(contactAvatarRender);
    $('section#chat[data-account="' + this.core.fullJid + '"] article#main span.avatar img:not([src])').each(contactAvatarRender);
  }, //.bind(this);

  /**
   * Manage search through contacts.
   *
   * @param {function} f
   * @param {function} click
   */
  searchRender : function (f, click) {
    if(f) {
      $('section#activity nav.on-right button').removeClass('hidden');
    } else {
      $('section#activity nav.on-right button').addClass('hidden');
      return;
    }
    if(!this.contacts)
      return false;
    var account = this;
    var article = $('<article/>').attr('id', 'search');
    var header = $('<header/>').addClass('beige');
    var input = $('<input/>').attr('id', 'searchInput')
                .on('input', function (event) {
                  var ele = $(event.target);
                  if(ele.val())
                    ele.next().removeClass('hidden');
                  else
                    ele.next().addClass('hidden');
                  account.search(article, this.value, click);
                });
    var reset = $('<span/>').attr('id', 'reset')
                .addClass('material-icons hidden').text('cancel')
                .on('click', function (event) {
                  $(this).prev().val('');
                  $(this).addClass('hidden');
                  account.search(article, '', click);
                });
    header.append(input).append(reset);
    article.append(header).append($('<h1/>').text('Type some characters to start searching'));
    var frag = f;
    frag.appendChild(article[0]);
  },

  /**
   * Search through contacts for a loose match and append a list.
   *
   * @param {Node} article
   * @param {string} text
   * @param {function} click
   */
  search : function (article, text, click) {
    var account = this;
    if(article[0].lastChild.nodeName === 'UL' || article[0].lastChild.nodeName === 'H1')
      article[0].lastChild.remove();
    if(!text) {
      article.append($('<h1/>').text('Type some characters to start searching'));
      return false;
    }
    text = text.toLowerCase().split(' ');
    var roster = account.core.roster;
    // forEach is slow, and evil
    // for(var _i = 0, _len = account.names.length; _i < _len; _i++) {
    //   if(account.names[_i].startsWith(text)) {
    //     str[account.names[_i]] = 1; // Just a placeholder
    //   }
    // }
    // var matches = [];
    // for(var match in str) {
    //   if(str.hasOwnProperty(match))
    //     matches.push(match);
    // }

    // Search now for the `text` match
    var matches = roster.filter( function ( contactMap ) {
      return ( text.filter( function ( token ) {
        var regex = new RegExp( token, 'gi' );
        return (contactMap.jid && contactMap.jid.match( regex )) || (contactMap.name && contactMap.name.match( regex ));
      } ) || [ ] ).length;
    } );

    var ul = $('<ul/>').addClass('list').addClass('scroll');
    var _i, _len;
    for(_i = 0, _len = matches.length; _i < _len; _i++) {
      var name = matches[_i].name;
      var jID = matches[_i].jid;
      var li = document.createElement('li');
      li.dataset.jid = jID;
      li.innerHTML = '<span class=\'name\'>' + name + '</span>'
                     + '<span class=\'status\'>' + jID + '</span>';
      li.addEventListener('click', click.bind(li, li));
      ul[0].appendChild(li);
    }
    article.append(ul[0]);
  },

  /**
   * Opens the OTR menu.
   */
  OTRMenu : function () {
    var account = this;
    function OTRSetup() {
      Lungo.Router.article('otrMenu', 'otrSetup');
      $('button#setupOtr').on('click', function(e) {
        Lungo.Notification.success(_('OTRKeygen'), _('OTRWait'), 'vpn_key', 5);
        Lungo.Router.section('back');
        Lungo.Router.section('main');
        DSA.createInWebWorker({
          path: 'scripts/arlolra/dsa-webworker.js'
        }, function (key) {
          account.OTR.enabled = true;
          account.OTR.key = key;
          account.core.OTR = $.extend({}, account.OTR, {
            key: account.OTR.key.packPrivate()
          });
          account.save();
          Lungo.Notification.success(_('OTRKeyReady'), _('OTRKeyReadyDesc'), 'check', 5);
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
  },

  /**
   * Push message to sendQ.
   *
   * @param {number} storageIndex
   */
  toSendQ : function (storageIndex) {
    Tools.log('[sendQ] Queued', storageIndex);
    if (!this.core.sendQ) {
      this.core.sendQ = [];
    }
    this.core.sendQ.push(storageIndex);
    this.save();
  },

  /**
   * Send every message in SendQ.
   */
  sendQFlush : function () {
    var account = this;
    if (this.core.sendQ.length) {
      var sendQ = this.core.sendQ;
      var block = sendQ[0][0];
      Tools.log('[sendQ] Flushing', sendQ, sendQ[0]);
      Store.recover(block, function (key, data, free) {
        var content = data[sendQ[0][1]];
        var msg = Make(Message)(account, {
          from: content.from,
          to: content.to,
          text: content.text,
          original: content.original,
          stamp: content.stamp
        }, {
          render: false,
          msgId: content.id
        });

        free();

        msg.send(true, true);
        sendQ.splice(0, 1);
        account.sendQFlush();
      });
    } else {
      this.save();
    }
  },

  /**
   * Find chat in chat array.
   *
   * @param {string} jid
   */
  chatFind : function (jid) {
    var index = -1;
    for (var i in this.chats) {
      if (this.chats[i].core && this.chats[i].core.jid == jid) {
        index = i;
        break;
      }
    }
    return index;
  },

  /**
   * Get a chat for a jid (create if none).
   *
   * @param {string} jid
   * @param {string} title
   */
  chatGet : function (jid, title) {
    var ci = this.chatFind(jid);
    var chat= null;
    if (ci >= 0) {
      chat = this.chats[ci];
    } else {
      chat = Make(Chat)({
        jid: jid,
        title: title || jid,
        chunks: []
      }, this);
    }
    return chat;
  },

  findMessage : function (from, msgId, callback) {
    var chat = this.chatGet(from);
    chat.findMessage(msgId, null, true).then(function (values) {
      var msg = values.result.message;
      var free = values.free;

      free();
      callback(msg);
    }.bind(this));
  },

  /**
   * @param {Object} task
   * @param {function} callback
   */
  markMessageWorker : function(task, callback){
    var from = task.from;
    var msgId = task.msgId;
    var type = task.type;
    var chat = this.chatGet(from);
    var account = this;

    chat.findMessage(msgId, null, true).then(function(values){
      var msg = values.result.message;
      var free = values.free;
      var key = values.key;

      if (msg.ack != 'viewed' && type == 'delivery') {
        Tools.log('MARKING AS DELIVERED', from, msgId, chat, account, values);
        msg.ack = 'delivered';
      } else if (type == 'read') {
        Tools.log('MARKING AS VIEWED', from, msgId, chat, account, values);
        msg.ack = 'viewed';
      } else if (msg.ack != 'viewed' && msg.ack != 'delivered') {
        Tools.log('MARKING AS SENT', from, msgId, chat, account, values);
        msg.ack = 'sent';
      }
      Store.update(key, values.result.chunkIndex, values.result.chunk, function(){
        free();
        callback(msg);
      });

      if (chat.core.last.id == msg.id) {
        chat.core.last = msg;
      }

      msg = Make(Message)(account, msg);
      msg.reRender(values.result.chunkIndex);
      account.singleRender(chat);

    }, function(e){
        Tools.log('UNABLE TO FIND MESSAGE! CARRY ON', from, msgId, e);
        setTimeout(function(){
            task.retries = task.retries ? task.retries-1 : 2;

            if (task.retries > 0) {
              Tools.log('GOING TO RETRY!', task.retries, 'RETRIES LEFT');
              account.markMessage.push(task);
            }
        }, 200);
        callback();
    });
  }, // bind to account;

  /**
   * Will be executed when all messages in the queue are marked.
   */
  markMessageDrain: function(){
    var account = this;

    account.save();
  }, //.bind(this);

  /**
   * Check for feature support.
   *
   * @param {string} feature
   */
  supports : function (feature) {
    return this.connector.provider.features.indexOf(feature) >= 0;
  },

  /**
   * Save to store.
   */
  save : function () {
    var index = Accounts.find(this.core.fullJid || this.core.user);

    if (index > -1) {
      var accounts = App.accounts;
      accounts[index] = this;
      App.accounts = accounts;
    }
  },

  setVisible : function (status) {
    if (status) {
      this.connector.presence.set('a');

      if (this === Accounts.current) {
        var section = $('section#chat');
        if (section.hasClass('show')) {
          var ci = this.chatFind(section[0].dataset.jid);
          if (ci >= 0) {
            var chat = this.chats[ci];
            if (chat.notification && 'close' in chat.notification) {
              chat.notification.close();
              chat.notification = null;
            }

            chat.unreadList.forEach(function (item) {
              item.read();
            });
            chat.unreadList= [];
          }
        }
      }
    } else {
      this.connector.presence.set('away');
    }
  }
};

/**
 * Holds only account data and no functions.
 */
var AccountCore = {

};

/**
 * @namespace
 */
var Accounts = {

  /**
   * @inner
   */
  _current: Blaze.Var(-1),

  /**
   * @alias current/get
   * @memberof Accounts
   */
  get current () {
    return App.accounts[this._current.get()];
  },

  /**
   * @alias current/set
   * @param {Account} i
   * @memberof Accounts
   */
  set current (i) {
    if (this._current.get() != i) {
      this._current.set(i);
      setTimeout(function () {
        $('section#main header select')[0].selectedIndex = i;
        var ul = $('section#main ul[data-jid="' + (this.core.fullJid || this.core.user) + '"]');
        ul.show().siblings('ul').hide();
        this.allRender();
      }.bind(this.current));
    }
  },

  /**
   * Find the index of an account.
   *
   * @param {string} jid
   * @return {number}
   */
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
  }

};
