'use strict';

var Menu = {

  // Tells what menu to open
  map: {
    providers: function () {
      if (!$('section#providers ul li').length) {
        Providers.list();
      }
      Lungo.Router.section('providers');
    },
    main: function () {
      Accounts.aside();
      Accounts.main();
      var last = App.accounts.length - 1;
      App.accounts[last || 0].show();
      Lungo.Router.section('main');
      Lungo.Router._stack[0] = 'main';
    },
    settings: function () {
      Lungo.Router.section('settings');
    },
    me: function () {
      Lungo.Router.section('me');
    },
    contact: function () {
      Messenger.contactProfile();
    },
    muc: function () {
      Messenger.mucProfile();
    },
    mucClear: function (obj) {
      var gid = $(obj).closest('section').data('jid');
      Messenger.mucClear(gid);
    },
    mucExit: function (obj) {
      var gid = $(obj).closest('section').data('jid');
      Messenger.mucExit(gid);
    },
    mucCreateForm: function (obj) {
      Lungo.Router.section('back');
      Lungo.Router.section('mucCreateForm');
      var account = Messenger.account();
      var form = $('section#mucCreateForm article.form');
      var server = Strophe.getDomainFromJid(account.core.fullJid);
      var inList = form.find('option[value$="' + server + '"]');
      if (inList.length < 1) {
        form.find('option#self').val(server).text(server);
      } else {
        inList.parent().val(inList.attr('value'));
      }
      if (account.supports('federation')) {
        form.find('[data-requires=federation]').show();
      } else {
        form.find('[data-requires=federation]').hide();
      }
    },
    mucCreate: function (obj) {
      var account = Messenger.account();
      var form = $('section#mucCreateForm article.form');
      var domain = form.find('[name=custom]').val() || form.find('[name=server]').val();
      var title = form.find('[name=title]').val().trim();
      var members = form.find('ul.listBox').children().map(function (i,e,a) {return e.dataset.jid});
      if (title) {
        account.connector.muc.create(title, domain, members);
      }
    },
    mucSearchForm: function () {
      Lungo.Router.section('back');
      Lungo.Router.section('mucSearchForm');
      var account = Messenger.account();
      var form = $('section#mucSearchForm article.form');
      var server = Strophe.getDomainFromJid(account.core.fullJid);
      var inList = form.find('option[value$="' + server + '"]');
      if (inList.length < 1) {
        form.find('option#self').val(server).text(server);
      } else {
        inList.parent().val(inList.attr('value'));
      }
    },
    mucSearch: function (obj) {
      var account = Messenger.account();
      var form = $('section#mucSearchForm article.form');
      var server = form.find('[name=custom]').val() || form.find('[name=server]').val();
      var ul = form.find('output').children('ul').first().empty();
      var mucJoin = function (e) {
        var jid = $(this).parent().data('jid');
        var title = $(this).siblings('span').text();
        account.connector.muc.join(jid, title);
      }
      if (server) {
        account.connector.muc.explore(server,
          function (jid, name) {
            Tools.log('GOT', jid, name);
            var html = $('<li/>').data('jid', jid).append($('<span/>').text(name)).append($('<a/>').text(_('Join')).on('click', mucJoin));
            ul.append(html);
            Lungo.Notification.hide();
          },
          function (error) {
            Tools.log('REJECTED', error);
          }
        );
        Lungo.Notification.show('search', _('MucSearching', {server: server}), 30);
      }
    },
    mucInvite: function (obj) {
      var cb;
      var account = Messenger.account();
      if (typeof obj == 'object') {
        var obj = $(obj);
        var listBox = obj.parent();
        cb = function (jid, name) {
          var ex = listBox.find('li[data-jid="' + jid + '"]');
          if (ex.length > 0) {
            ex.remove();
          } else {
            listBox.prepend($('<li/>').data('jid', jid).text(name));
          }
        }
      } else {
        cb = obj;
      }
      var options = {
        chats: false,
        groups: false,
        selected: listBox && listBox.children().map(function (i,e,a) {return e.dataset.jid})
      };
      Activity('invite', account, cb, options);
    },
    mucDirectInvite: function (obj) {
      var cb;
      var account = Messenger.account();
      if (typeof obj == 'object') {
        var obj = $(obj);
        cb = function (jid, name) {
          account.connector.muc.invite($('section#muc').data('jid'), [jid], $('section#muc').find('span.name').text());
          Lungo.Router.section('back');
          Lungo.Router.section('back');
          Lungo.Notification.success(_('MucInvited', {name: name}), null, 'check', 3);
        }
      } else {
        cb = obj;
      }
      var options = {
        chats: false,
        groups: false,
      };
      Activity('invite', account, cb, options);
    },
    contactAdd: function (obj) {
      var account = Messenger.account();
      if (account.supports('rosterMgmt')) {
        var selfDomain = Strophe.getDomainFromJid(account.core.user);
        var placeholder = _('User').toLowerCase() + '@' + selfDomain;
        $('section#contactAdd').find('[name=address]').attr('placeholder', placeholder);
        Lungo.Router.section('main');
        Lungo.Router.section('contactAdd');
      } else {
        Lungo.Notification.error(_('NoSupport'), _('XMPPisBetter'), 'exclamation-sign', 3);
      }
    },
    contactRemove: function(obj) {
      var jid = $(obj).closest('section').data('jid');
      Messenger.contactRemove(jid);
    },
    chatAdd: function (obj) {
      var account = Messenger.account();
      Activity('chat', account, null, {
        chats: false,
        groups: account.supports('muc')
      });
    },
    doSearch: function (obj) {
      //Lungo.Router.section('searchBar');
    },
    chatRemove: function (obj) {
      var jid = $(obj).closest('section').data('jid');
      Messenger.chatRemove(jid);
    },
    chatInfo: function (obj) {
      var muc = ($(obj).closest('section').data('muc') == 'true') ? true : false;
      Menu.show(muc ? 'muc' : 'contact');
    },
    accountRemove: function(obj) {
      var jid = $(obj).closest('section').data('jid');
      Messenger.accountRemove(jid);
    },
    plus: function () {
      var menu = $('section#chat nav#plus');
      if (menu.hasClass('show')) {
        menu.removeClass('show');
      } else {
        menu.addClass('show');
      }
    },
    emoji: function () {
      var account = Messenger.account();
      $('section#chat nav#plus').removeClass('show');
      var ul = $('section#chat article#emoji ul');
      var emojiList = App.emoji[Providers.data[account.core.provider].emoji].map;
      if (ul.children('li').length != emojiList.length) {
        Lungo.Notification.show('heart', _('Loading...'));
        ul.empty();
        for (var i in emojiList) {
          var emoji = emojiList[i];
          var li = $('<li/>')
            .on('tap', function () {
              Plus.emoji($(this).children('img').data('emoji'));
            });
          var img = $('<img/>');
          account.connector.emojiRender(img, emoji);
          li.append(img);
          ul.append(li);
        }
        Lungo.Notification.hide();
      }
      Lungo.Router.article('chat', 'emoji');
    },
    imageSend: function () {
      Plus.imageSend();
    },
    videoSend: function () {
      Plus.videoSend();
    },
    audioSend: function () {
      Plus.audioSend();
    },
    locationSend: function () {
      Plus.locationSend();
    },
    bolt: function () {
      Plus.bolt();
    },
    call: function () {
      $('section#chat nav#plus').removeClass('show');
      Lungo.Router.article('chat', 'call');
      Plus.rtc({audio: true, video: false});
    },
    videocall: function () {
      $('section#chat nav#plus').removeClass('show');
      Lungo.Router.article('chat', 'videocall');
      Plus.rtc({audio: true, video: true});
    },
    otrMenu: function(obj) {
      var account = Messenger.account();
      account.OTRMenu();
    },
    goOTR: function(obj) {
      var jid = $(obj).closest('section').data('jid');
      Plus.goOTR(jid, true);
    },
    purchase: function () {
      var number = Messenger.account().core.data.login;
      var openURL = new MozActivity({
        name: "view",
        data: {
          type: "url",
          url: 'http://www.whatsapp.com/payments/cksum_pay.php?phone='+number+'&cksum='+CryptoJS.MD5(number+"abc").toString(CryptoJS.enc.Hex)
        }
      });
    },
    powerOff: function () {
      var will = confirm(_('ConfirmClose'));
      if (will) {
        Lungo.Notification.success(_('Closing'), _('AppWillClose'), 'signout', 3);
        var req = navigator.mozAlarms.getAll();
        req.onsuccess = function () {
          this.result.forEach(function (alarm) {
            navigator.mozAlarms.remove(alarm.id);
          });
          App.killAll();
          setTimeout(function () {
            Tools.log(App.name + ' has been closed');
            window.close();
          }, 3000);
        }
        req.onerror = function () { }
      }
    },
    reloadApp: function () {
      var sure = confirm(_('ConfirmReload'));
      if (sure) {
        Lungo.Notification.success(_('Reloading'), _('AppWillReload'), 'signout', 3);
        App.disconnect();
        App.run();
        Tools.log(App.name + ' has been reloaded')
      } else {
        Tools.log('Upps...');
      }
    }
  },
  
  // Opens a certain menu
  show: function (which, attr, delay) {
    var map = this.map;
    setTimeout(function () { map[which](attr); }, delay );
  }
  
}
