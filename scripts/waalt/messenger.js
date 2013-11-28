'use strict';

var Messenger = {

  account: function () {
    var index = Accounts.find($('section#main').data('jid'));
    return App.accounts[index];
  },

  say: function (text) {
    var to = $('section#chat').data('jid');
    var account = this.account();
    var text = text || $("section#chat div#text").text();
    var date = new Date();
  	var stamp = date.getUTCFullYear()+"-"
  	  +("0"+(date.getUTCMonth()+1)).slice(-2)+"-"
  	  +("0"+(date.getUTCDate())).slice(-2)+"T"
  	  +("0"+(date.getUTCHours())).slice(-2)+":"
  	  +("0"+(date.getUTCMinutes())).slice(-2)+":"
  	  +("0"+(date.getUTCSeconds())).slice(-2)+"Z";
    var localstamp = date.getFullYear()+"-"
      +("0"+(date.getMonth()+1)).slice(-2)+"-"
      +("0"+(date.getDate())).slice(-2)+"T"
      +("0"+(date.getHours())).slice(-2)+":"
      +("0"+(date.getMinutes())).slice(-2)+":"
      +("0"+(date.getSeconds())).slice(-2)+"Z";
    if (text.length) {
      var msg = new Message(account, {
        from: account.core.user,
        to: to,
        text: text,
        stamp: localstamp
      });
      msg.send();
      $$("section#chat div#text").empty();
      App.audio('sent');
    }
    $('section#chat article#main button#plus').show();
    $('section#chat article#main button#say').hide();
  },
  
  csn: function (state) {
    var to = $('section#chat').data('jid');
    var account = this.account();
    if (account.supports('csn') && App.settings.csn) {
      account.connector.csnSend(to, state);
    }
  },
  
  avatarSet: function (blob) {
    var account = this.account();
    if (account.supports('avatarChange')) {
      var reader = new FileReader();
      var jid = Strophe.getBareJidFromJid(account.core.jid)
      reader.onload = function (event) {
        var img = new Image();
        img.onload = function () {
          var canvas = document.createElement('canvas');
          canvas.width = 96;
          canvas.height = 96;
          canvas.getContext('2d').drawImage(img, 0, 0, 96, 96);
          var url = canvas.toDataURL();
          if (account.supports('vcard')) {
            $(account.vcard).find('TYPE').text('image/png');
            $(account.vcard).find('BINVAL').text(url.split(',')[1]);
            account.connector.connection.vcard.set(function () {
              $('section#main footer .avatar img').attr('src', url);
            }, account.vcard, jid);
          } else {
            Lungo.Notification.error(_('NoSupport'), _('XMPPisBetter'), 'exclamation-sign', 3);
          }
        }
        img.src = event.target.result;
      }
      reader.readAsDataURL(blob);
    } else {
      Lungo.Notification.error(_('NoSupport'), _('XMPPisBetter'), 'exclamation-sign', 3);
    }
  },
  
  presenceUpdate: function () {
    var account = this.account();
    if (App.online && account.connector.connection.connected) {
      var status = $('section#me #status input').val();
      account.connector.presenceSet(null, status);
    } else {
      Lungo.Notification.error(_('Error'), _('NoWhenOffline'), 'exclamation-sign', 3);
    }
  },
  
  contactProfile: function (jid) {
    var account = this.account();
    var jid = jid || $('section#chat').data('jid');
    var contact = Lungo.Core.findByProperty(account.core.roster, 'jid', jid);
    var name = contact.name || jid;
    var section = $('section#contact');
    section.data('jid', jid);
    section.find('#card .name').text(name == jid ? ' ' : name);
    section.find('#card .user').text(jid);
    section.find('#card .provider').empty().append($('<img/>').attr('src', 'img/providers/' + account.core.provider + '.svg')).append(Providers.data[account.core.provider].longName);
    section.find('#status p').text(contact.status || _('showna'));
    if (App.avatars[jid]) {
      Store.recover(App.avatars[jid], function (val) {
        section.find('#card .avatar').children('img').attr('src', val);
      });
    } else {
      section.find('#card .avatar').children('img').attr('src', 'img/foovatar.png');
    }
    Lungo.Router.section('contact');
  },
  
  contactAdd: function () {
    var account = Messenger.account();
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
          Lungo.Router.back();
          Lungo.Notification.success(_('ContactWasAdded', {name: name}), _('ContactWillAppear', {name: name}), 'check', 3);
        }
      } else {
        Lungo.Notification.error(_('NoSupport'), _('XMPPisBetter'), 'exclamation-sign', 3);
      }
    } else {
      Lungo.Notification.error(_('Error'), _('NoWhenOffline'), 'exclamation-sign', 3);
    }
  },
  
  contactRemove: function (jid) {
    var account = Messenger.account();
    if (App.online && account.connector.connection.connected) {
      if (account.supports('rosterMgmt')) {
        var contact = Lungo.Core.findByProperty(account.core.roster, 'jid', jid);
        var name = contact.name || jid;
        var will = confirm(_('ConfirmContactRemove', {name: name}));
        if (will) {
          account.connector.connection.roster.remove(jid);
          account.connector.connection.roster.get(function(){});
          for (var i in account.core.roster) {
            if (account.core.roster[i].jid == jid) break;
          }
          var index = account.chatFind(jid);
          var chat = account.chats[index];
          for (var i in chat.chunks) {
            var chunk = chat.chunks[i];
            Store.blockDrop(chunk);
          }
          account.chats.splice(index, 1);
          account.core.roster.splice(i, 1);
          account.core.chats.splice(index, 1);
          account.save();
          account.allRender();
          Lungo.Router.section('main');
          Lungo.Notification.success(_('Removed'), null, 'remove', 3);
        }
      } else {
        Lungo.Notification.error(_('NoSupport'), _('XMPPisBetter'), 'exclamation-sign', 3);
      }
    } else {
      Lungo.Notification.error(_('Error'), _('NoWhenOffline'), 'exclamation-sign', 3);
    }
  },
  
  chatRemove: function (jid) {
    var account = Messenger.account();
    var index = account.chatFind(jid);
    if (index >= 0) {
      var contact = Lungo.Core.findByProperty(account.core.roster, 'jid', jid);
        var name = contact.name || jid;
        var will = confirm(_('ConfirmChatRemove', {name: name}));
        if (will) {
          var chat = account.chats[index];
          for (var i in chat.chunks) {
            var chunk = chat.chunks[i];
            Store.blockDrop(chunk);
          }
          account.chats.splice(index, 1);
          account.core.chats.splice(index, 1);
          account.save();
          account.allRender();
          Lungo.Router.section('main');
          Lungo.Notification.success(_('Removed'), null, 'remove', 3);
        }
    } else {
      Lungo.Notification.error(_('Error'), _('NoChatsForContact'), 'exclamation-sign', 3);
    }
  },
  
  accountRemove: function (jid) {
    var account = Messenger.account();
    var will = confirm(_('ConfirmAccountRemove', {account: account.core.user}));
    if (will) {
      var accountIndex = Accounts.find(account.core.user, account.core.provider);
      var chat = account.chats[account.chatFind(jid)];
      if (chat) {
        for (var i in chat.chunks) {
          var chunk = chat.chunks[i];
          Store.blockDrop(chunk);
        }
      }
      App.accounts.splice(accountIndex, 1);
      App.accountsCores.splice(accountIndex, 1);
      App.smartupdate('accountsCores');
      Lungo.Notification.success(_('Wait'), _('WaitLong'), 'exclamation-sign', 3);
      setTimeout(function () {
        window.location.reload();
      }, 3000);
    }
  }
  
}
