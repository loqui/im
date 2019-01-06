/* global Accounts, App, Message, Tools, Lungo, Providers, Menu, Store, Make, Chungo */

/**
* @file Holds {@link Connector/XMPP}
* @author [Adán Sánchez de Pedro Crespo]{@link https://github.com/aesedepece}
* @author [Jovan Gerodetti]{@link https://github.com/TitanNano}
* @author [Christof Meerwald]{@link https://github.com/cmeerw}
* @author [Giovanny Andres Gongora Granada]{@link https://github.com/Gioyik}
* @author [Sukant Garg]{@link https://github.com/gargsms}
* @license AGPLv3
*/

'use strict';

var Messenger = {

  account: function () {
    var index = Accounts.find($('section#main')[0].dataset.jid);
    return App.accounts[index];
  },

  add: function (emoji) {
    var textBox = $('article#main div#footbox span#text');
    textBox.append(emoji);
    textBox[0].dispatchEvent(new Event('keydown'));
  },

  say: function (text) {
    var to = $('section#chat')[0].dataset.jid;
    var muc = $('section#chat')[0].dataset.muc == "true";
    var account = Accounts.current;

    if (!text) {
      $('section#chat span#text br').text('\n');
      text = $('section#chat span#text').text();
    }
    text = text.trim();

    if (text.length) {
      var msg = Make(Message)(account,
      {
        from: account.core.user,
        to: to,
        text: text,
        stamp: Tools.localize(Tools.stamp()),
        status : ''
      },
      {
        muc: muc
      });
      msg.send();
      Lungo.Router.article('chat', 'main');
      var ul = $('section#chat ul#messages');
      ul[0].scrollTop = ul[0].scrollHeight;
      $('#chat #messages span.lastRead').remove();
      App.audio('sent');
    }

    this.cleanTextBox();
    this.csn('active');
  },

  csn: function (state) {
    var to = $('section#chat')[0].dataset.jid;
    var account = Accounts.current;
    var muc = account.chatGet(to).core.muc;

    if (account.connector.isConnected() && account.supports('csn') && App.settings.csn && !muc) {
      account.connector.csnSend(to, state);
    }
  },

  avatarSet: function (blob) {
    var account = Accounts.current;
    if (account.supports('avatarChange')) {
      account.connector.avatarSet(blob);
    } else {
      Lungo.Notification.error(_('NoSupport'), _('XMPPisBetter'), 'warning', 3);
    }
  },

  presenceUpdate: function () {
    var account = Accounts.current;
    if (App.online && account.connector.connected) {
      var status = $('section#me #status input').val();
      var nick = $('section#me #nick input').val();
      account.connector.presence.set(null, status, nick);
    } else {
      Lungo.Notification.error(_('Error'), _('NoWhenOffline'), 'warning', 3);
    }
  },

  contactProfile: function (jid) {
	  jid = jid || $('section#chat')[0].dataset.jid;

    var account = Accounts.current;
    var contact = Lungo.Core.findByProperty(account.core.roster, 'jid', jid);
    var chat = account.chatGet(jid);
    var name = contact ? contact.name : jid;
    var status = contact ? contact.presence.status : _('showna');
    var section = $('section#contact');
    var setUl = section.find('#settings ul').empty();

    section[0].dataset.jid= jid;
    section.find('#card .name').text(name == jid ? jid.split('@')[0] : name);
    section.find('#card .user').text(jid);
    section.find('#card .provider').empty().append($('<img/>').attr('src', 'img/providers/squares/' + account.core.provider + '.svg'));
    section.find('#status p').html(App.emoji[Providers.data[account.core.provider].emoji].fy(Tools.HTMLescape(status)));

    var accountSwitch = function (e) {
      var sw = $(this);
      var li = sw.closest('li');
      var key = li[0].dataset.key;
      var chat = account.chatGet(jid);

      if (li[0].dataset.value == 'true') {
        chat.core.settings[key][0] = false;
      } else {
        chat.core.settings[key][0] = true;
      }

      li[0].dataset.value= chat.core.settings[key][0];

      account.save();
      account.singleRender(chat, false);
    };

    if (contact) {
      $('section#contact button[data-menu-onclick="contactRemove"]').removeClass('hidden');
      $('section#contact button[data-menu-onclick="contactAdd"]').addClass('hidden');
    } else {
      $('section#contact button[data-menu-onclick="contactAdd"]').removeClass('hidden');
      $('section#contact button[data-menu-onclick="contactRemove"]').addClass('hidden');
    }

    Object.keys(chat.core.settings).forEach(function(key){
      var value= chat.core.settings[key];
      var li = $('<li/>');
      li[0].dataset.key= key;
      li[0].dataset.value= (value.length > 1 ? value[0] : value);
      li.bind('click', accountSwitch);
      li.append(
        $('<span/>').addClass('caption').text(_('AccountSet' + key))
      ).append(
        $('<div class="switch"><div class="ball"></div><i class="material-icons">check</i></div>')
      );

      if (value.length > 1 && value[1]) {
        li.on('click', function (e) {
          Tools.log(value, value[1]);
          Menu.show(value[1], li[0]);
        });
      }
      setUl.append(li);
    });

    if (App.avatars[jid]) {
      Store.recover(App.avatars[jid].chunk, function (key, val, free) {
        section.find('#card .avatar').children('img').attr('src', val);

        free();
      });
    } else {
      section.find('#card .avatar').children('img').attr('src', 'img/foovatar.png');
    }
    Lungo.Router.section('contact');
  },

  mucProfile: function (jid) {
    var account = Accounts.current;
    jid = jid || $('section#chat')[0].dataset.jid;
    var ci = account.chatFind(jid);
    var section = $('section#muc');
    if (ci >= 0) {
      var chat = account.chats[ci];
      var cdate = new Date(chat.core.info.creation * 1000);
      var sdate = new Date(chat.core.info.subjectTime * 1000);

      section[0].dataset.jid= jid;
      section[0].dataset.mine= (chat.core.info && chat.core.info.owner == account.core.fullJid);
      section.find('#card span.cdate').html(cdate.toDateString());
      section.find('#card span.s_t').html(sdate.toDateString());
      section.find('#card .name').html(App.emoji[Providers.data[account.core.provider].emoji].fy(Tools.HTMLescape(chat.core.title)));
      section.find('#card .provider').empty().append($('<img/>').attr('src', 'img/providers/squares/' + account.core.provider + '.svg'));
      section.find('#participants h2').text(_('NumParticipants', {number: chat.core.participants.length}));

      var partUl = section.find('#participants ul').empty();
      for (var i in chat.core.participants) {
        var participantJid = chat.core.participants[i].jid;
        var contact = Lungo.Core.findByProperty(account.core.roster, 'jid', participantJid);
        var label = "";
        if(contact) {
          label = contact.name;
        } else if ((participantJid == account.core.fullJid) || (participantJid == account.core.fullJid.split('@')[0])){
          label = _('Me');
        } else {
          label = participantJid.split('@')[0];
        }
        var participantLabel = $('<li/>');
        participantLabel.append(label);
        switch(account.core.provider) {
          case "whatsapp":
            section.find("#card div").show();
            if (chat.core.participants[i].admin === true) {
              participantLabel.append($('<i/>', {class:"material-icons"}).text("supervisor_account"));
            }
            if (participantJid === chat.core.info.subjectOwner) {
              participantLabel.append($('<i/>', {class:"material-icons"}).text("label"));
            }
            if (participantJid === chat.core.info.owner) {
              participantLabel.append($('<i/>', {class:"material-icons"}).text("star"));
            }
            break;
          case "xmpp":
            section.find("#card div").hide();
            if (chat.core.participants[i].owner === true) {
              participantLabel.append($('<i/>', {class:"material-icons"}).text("star"));
            }
            participantLabel.append($('<span/>').text(chat.core.participants[i].affiliation)).append($('<i/>', {class:"material-icons"}).text("supervisor_account"));
            participantLabel.append($('<span/>').text(chat.core.participants[i].role)).append($('<i/>', {class:"material-icons"}).text("person"));
            break;
          default:
            break;
        }
        if (label != _('Me')) {
          participantLabel.bind('click', {jid: participantJid}, function(event) {
            Chungo.Router.section('back');
	    if (App.platform === "FirefoxOS")	// FirefoxOS needs the section back router twice!
	    {
	      Chungo.Router.section('back');
	    }
            account.chatGet(event.data.jid).show();
          });
        }
        partUl.append(participantLabel);
      }

      var setUl = section.find('#settings ul').empty();
      var accountSwitch = function (e) {
        var sw = $(this);
        var li = sw.closest('li');
        var key = li[0].dataset.key;
        var chat = account.chatGet(jid);

        if (li[0].dataset.value == 'true') {
          chat.core.settings[key][0] = false;
        } else {
          chat.core.settings[key][0] = true;
        }
        li[0].dataset.value= chat.core.settings[key][0];
        account.save();
        account.singleRender(chat, false);
      };
      Object.keys(chat.core.settings).forEach(function(key){
        var value= chat.core.settings[key];
        var li = $('<li/>');
        li[0].dataset.key= key;
        li.append(
          $('<span/>').addClass('caption').text(_('AccountSet' + key))
        ).append(
          $('<div class="switch"><div class="ball"></div><i class="material-icons">check</i></div>')
        );
        li[0].dataset.value= (value.length > 1 ? value[0] : value);
        li.bind('click', accountSwitch);
        if (value.length > 1 && value[1]) {
          li.on('click', function (e) {
            Tools.log(value, value[1]);
            Menu.show(value[1], li[0]);
          });
        }
        setUl.append(li);
      });
    }
    if (App.avatars[jid]) {
      Store.recover(App.avatars[jid].chunk, function (key, val, free) {
        section.find('#card .avatar').children('img').attr('src', val);

        free();
      });
    } else {
      section.find('#card .avatar').children('img').attr('src', 'img/goovatar.png');
    }
    Lungo.Router.section('muc');
  },

  contactAdd: function () {
    var account = Accounts.current;
    if (App.online && account.connector.connection.connected) {
      if (account.supports('rosterMgmt')) {
        var section = $('section#contactAdd');
        var jid = section.find('input[name="address"]').val();
        var name = section.find('input[name="name"]').val();
        if (jid && name) {
          account.connector.connection.roster.add(jid, name, false, false);
          account.connector.connection.roster.subscribe(jid);
          account.connector.connection.roster.authorize(jid);
          section.find('input').val('');
          account.core.roster.push({
            jid: jid,
            name: name,
            show: undefined,
            status: undefined
          });
          account.core.roster.sort(function (a,b) {
            var aname = a.name ? a.name : a.jid;
            var bname = b.name ? b.name : b.jid;
            return aname > bname;
          });
          account.save();
          account.allRender();
          Lungo.Router.section('main');
          Lungo.Notification.success(_('ContactWasAdded', {name: name}), _('ContactWillAppear', {name: name}), 'check', 5);
        }
      } else {
        Lungo.Notification.error(_('NoSupport'), _('XMPPisBetter'), 'warning', 3);
      }
    } else {
      Lungo.Notification.error(_('Error'), _('NoWhenOffline'), 'warning', 3);
    }
  },

  contactRemove: function (jid) {
    var account = Accounts.current;
    if (App.online && account.connector.connected) {
      if (account.supports('rosterMgmt')) {
        var contact = Lungo.Core.findByProperty(account.core.roster, 'jid', jid);
        var name = contact.name || jid;
        var will = confirm(_('ConfirmContactRemove', {name: name}));
        if (will) {
          account.connector.contacts.remove(jid);
          var ri;
          for (var i in account.core.roster) {
            if (account.core.roster[i].jid == jid) {
              ri = i;
              break;
            }
          }
          var ci = account.chatFind(jid);
          if (ci >= 0) {
            var chat = account.chats[ci];
            for (i in chat.chunks) {
              var chunk = chat.chunks[i];
              Store.blockDrop(chunk);
            }
            account.chats.splice(ci, 1);
            account.core.chats.splice(ci, 1);
          }
          account.core.roster.splice(ri, 1);
          account.save();
          account.allRender();
          Lungo.Router.section('main');
          Lungo.Notification.success(_('Removed'), null, 'remove_circle_outline', 3);
        }
      } else {
        Lungo.Notification.error(_('NoSupport'), _('XMPPisBetter'), 'warning', 3);
      }
    } else {
      Lungo.Notification.error(_('Error'), _('NoWhenOffline'), 'warning', 3);
    }
  },

  chatRemove: function (jid, account, force) {
    account = account || Accounts.current;
    var index = account.chatFind(jid);
    if (index >= 0) {
      var chat = Lungo.Core.findByProperty(account.core.chats, 'jid', jid);
      var name = chat.title || jid;
      var will = force || confirm(_('ConfirmChatRemove', {name: name}));
      if (will) {
        chat = account.chats[index];
        for (var i in chat.chunks) {
          var chunk = chat.chunks[i];
          Store.blockDrop(chunk);
        }
        account.chats.splice(index, 1);
        account.core.chats.splice(index, 1);
        account.save();
        if (!force) {
          account.allRender();
          Lungo.Router.section('back');
          Lungo.Router.section('main');
          Lungo.Notification.success(_('Removed'), null, 'delete', 3);
        }
      }
    } else if (!force) {
      Lungo.Notification.error(_('Error'), _('NoChatsForContact'), 'warning', 3);
    }
  },

  mucClear: function (gid, force) {
    var account = Accounts.current;
    var chat = account.chatGet(gid);
    var index = account.chatFind(gid);
    if (chat) {
      chat = chat.core;
      var title = chat.title || gid;
      var will = force || confirm(_('MucClearConfirm', {title: title}));
      if (will) {
        for (var i in chat.chunks) {
          var chunk = chat.chunks[i];
          Store.blockDrop(chunk);
        }
        chat.chunks = [];
        if (force) {
          account.chats.splice(index, 1);
          account.core.chats.splice(index, 1);
        }
        account.save();
        account.allRender();
        Lungo.Router.section('back');
        Lungo.Router.section('main');
        Lungo.Notification.success(_('Cleared'), null, 'delete', 3);
      }
    } else {
      Lungo.Notification.error(_('Error'), _('NoChatsForContact'), 'warning', 3);
    }
  },

  mucExit: function (gid) {
    var account = Accounts.current;
    var chat = account.chatGet(gid).core;
    var title = chat.title || gid;
    var will = confirm(_('MucExitConfirm', {title: title}));
    if (will) {
      account.connector.muc.expel(gid);
      this.mucClear(gid, true);
    }
  },

  accountRemove: function (jid) {
    var account = Accounts.current;
    var will = confirm(_('ConfirmAccountRemove', {account: account.core.user}));
    if (will) {
      var accountIndex = Accounts.find(account.core.fullJid);
      var chat = account.chats[account.chatFind(jid)];
      if (chat) {
        for (var i in chat.chunks) {
          var chunk = chat.chunks[i];
          Store.blockDrop(chunk);
        }
      }
      App.accounts.splice(accountIndex, 1);
      App.accountsCores.splice(accountIndex, 1);
      App.accounts = App.accounts;
      Lungo.Notification.success(_('Wait'), _('WaitLong'), 'warning', 3);
      setTimeout(function () {
        window.location.reload();
      }, 3000);
    }
  },

  /**
   * Cleans textBox
   */
  cleanTextBox : function() {
    $('section#chat span#text').empty();
    $('#footbox')[0].dataset.dirty = false;
  }

};
