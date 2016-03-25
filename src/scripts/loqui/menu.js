/* global Lungo, Accounts, Messenger, Tools, Activity, App, Providers, Plus */

/**
* @file Holds {@link Menu}
* @author [Adán Sánchez de Pedro Crespo]{@link https://github.com/aesedepece}
* @author [Jovan Gerodetti]{@link https://github.com/TitanNano}
* @author [Giovanny Andres Gongora Granada]{@link https://github.com/Gioyik}
* @author [Sukant Garg]{@link https://github.com/gargsms}
* @license AGPLv3
*/

'use strict';

/**
 * @namespace
 */
var Menu = {

  /**
   * Tells what menu to open.
   *
   * @namespace
   */
  map: {

    /**
     * Opens the providers section.
     */
    providers: function () {
      Lungo.Router.section('providers');
    },

    /**
     * Opens the main section.
     */
    main: function () {
      Accounts.current = 0;
      Lungo.Router.section('main');
      Lungo.Router._stack[0] = 'main';
    },

    /**
     * Opens the settings section.
     */
    settings: function () {
      Lungo.Router.section('settings');
    },

    /**
     * Opens the me section.
     */
    me: function () {
      Lungo.Router.section('me');
    },

    /**
     * Opens the contact section.
     */
    contact: function () {
      Messenger.contactProfile();
    },

    /**
     * Opens the muc section.
     */
    muc: function () {
      Messenger.mucProfile();
    },

    /**
     * Removes all participants from the active group
     *
     * @param {Object} obj
     */
    mucClear: function (obj) {
      var gid = $(obj).closest('section')[0].dataset.jid;
      Messenger.mucClear(gid);
    },

    /**
     * Removes the active accout form the active group.
     *
     * @param {Object} obj
     */
    mucExit: function (obj) {
      var gid = $(obj).closest('section')[0].dataset.jid;
      Messenger.mucExit(gid);
    },

    /**
     * Opens the group creation from.
     *
     * @param {Object} obj
     */
    mucCreateForm: function (obj) {
      Lungo.Router.section('back');
      Lungo.Router.section('mucCreateForm');
      var account = Accounts.current;
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
      var account = Accounts.current;
      var form = $('section#mucCreateForm article.form');
      var domain = form.find('[name=custom]').val() || form.find('[name=server]').val();
      var title = form.find('[name=title]').val().trim();
      var members = form.find('ul.listBox').children().map(function (i,e,a) {return e.dataset.jid;});
      if (title) {
        account.connector.muc.create(title, domain, members);
      }
    },
    mucSearchForm: function () {
      Lungo.Router.section('back');
      Lungo.Router.section('mucSearchForm');
      var account = Accounts.current;
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
      var account = Accounts.current;
      var form = $('section#mucSearchForm article.form');
      var server = form.find('[name=custom]').val() || form.find('[name=server]').val();
      var ul = form.find('output').children('ul').first().empty();
      var mucJoin = function (e) {
        var jid = $(this).parent()[0].dataset.jid;
        var title = $(this).siblings('span').text();
        account.connector.muc.join(jid, title);
      };
      if (server) {
        account.connector.muc.explore(server,
          function (jid, name) {
            Tools.log('GOT', jid, name);
            var html = $('<li/>').append($('<span/>').text(name)).append($('<a/>').text(_('Join')).on('click', mucJoin));
            html[0].dataset.jid= jid;
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
      var account = Accounts.current;
      var listBox= null;
      if (typeof obj == 'object') {
        obj = $(obj);
        listBox = obj.parent();
        cb = function (jid, name) {
          var ex = listBox.find('li[data-jid="' + jid + '"]');
          if (ex.length > 0) {
            ex.remove();
          } else {
            var item= $('<li/>').text(name);
            item[0].dataset.jid= jid;
            listBox.prepend(item);
          }
        };
      } else {
        cb = obj;
      }
      var options = {
        chats: false,
        groups: false,
        selected: listBox && listBox.children().map(function (i,e,a) {return e.dataset.jid;})
      };
      $('#mucCreateForm').removeClass('show');
      $('#activity').find('button.remove').click(function () {
        $('#mucCreateForm').addClass('show');
        $('#activity').find('button.remove').off("click");
      });
      Activity('invite', account, cb, options);
    },
    mucDirectInvite: function (obj) {
      var cb;
      var account = Accounts.current;
      if (typeof obj == 'object') {
        obj = $(obj);
        cb = function (jid, name) {
          account.connector.muc.invite($('section#muc')[0].dataset.jid, [jid], $('section#muc').find('span.name').text());
          Lungo.Router.section('back');
          Lungo.Router.section('back');
          Lungo.Notification.success(_('MucInvited', {name: name}), null, 'check', 3);
        };
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
      var account = Accounts.current;
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
      var jid = $(obj).closest('section')[0].dataset.jid;
      Messenger.contactRemove(jid);
    },
    chatAdd: function (obj) {
      var account = Accounts.current;
      Activity('chat', account, null, {
        chats: false,
        groups: account.supports('muc')
      });
    },
    doSearch: function (obj) {
      Lungo.Router.article('activity', 'search');
    },
    chatRemove: function (obj) {
      var jid = $(obj).closest('section')[0].dataset.jid;
      Messenger.chatRemove(jid);
    },
    chatInfo: function (obj) {
      var muc = ($(obj).closest('section')[0].dataset.muc == 'true') ? true : false;
      Menu.show(muc ? 'muc' : 'contact');
    },
    accountRemove: function(obj) {
      var jid = $(obj).closest('section')[0].dataset.jid;
      Messenger.accountRemove(jid);
    },
    plus: function () {
      Lungo.Router.section('attachment');
    },
    emoji: function () {
      var account = Accounts.current;
      var providerName = Providers.data[account.core.provider].emoji;
      var emojiDiv = $('section#chat article#emoji div#' + providerName);

      if (emojiDiv.length == 0) {
        // Emojis for this provider are not loaded yet
        Lungo.Notification.show('heart', _('Loading...'));
        setTimeout(function () {
          var div = $('<div/>', { id: providerName, class: "emoji-provider" }).appendTo('section#chat article#emoji');

          // Add category select bar
          var toolbar = $('<ul/>', { class: "category-select" }).appendTo($(div));
          for each (var category in App.emoji[Providers.data[account.core.provider].emoji].emojis) {
            // loop over each category and add selector li with category image
            var li = $('<li/>', { class: category[0][1] }).on('tap', function() {
              $('ul.category-select li').removeClass("active");
              $(this).addClass("active");
              $('section#chat article#emoji div.emoji-category').hide();
              var active = $(this)[0].dataset.category;
              $('section#chat article#emoji div#' + active).show();
            });
            li[0].dataset.category = category[0][0];
            toolbar.append(li);

            // add category divs
            var emojidiv = $('<div/>', {id: category[0][0], class: "emoji-category"} );
            for each (var emoji in category[1]) {
              var img = account.connector.emojiRender(emoji);
              img.on('tap', function () {
                  Plus.emoji($(this)[0].dataset.emoji);
                });
              emojidiv.append(img);
            }
            div.append(emojidiv);
          }
          toolbar.find("li:first-child").trigger("tap"); // activate first category

          // add backspace button to toolbar
          var li = $('<li/>').append($('<i/>', { class: "material-icons" }).append("backspace"));
          li.on('tap', function() {
            var input = $('section#chat article#main div#footbox div#text');
            var str = input.html();
            if (str.length > 0) {         // unicode char
              if(/[\uD800-\uDFFF]/.test(str.slice(-1)) && (str.length > 1)) {
                input.html(str.substring(0, str.length - 2));
              }
              else {                      // regular char
                input.html(str.substring(0, str.length - 1));
              }
            }
          });
          toolbar.append(li);
          Lungo.Notification.hide();
        });
      }

      $('#emoji').addClass('show');
      $('section#chat article#main').css("bottom", "75vw"); // reduce height for emoji div
      $('#screenBlocker').addClass('show');
    },
    emojiClose: function(){
      $('section#chat div#text').focus();                   // activate the keyboard
      $('section#chat article#main').css("bottom", "0");    // restore size
      $('#emoji').removeClass('show');
      $('#screenBlocker').removeClass('show');
    },
    fileSend: function () {
      Lungo.Router.section('back');
      Plus.fileSend();
    },
    locationSend: function () {
      Lungo.Router.section('back');
      Plus.locationSend();
    },
    vcardSend: function () {
      Lungo.Router.section('back');
      Plus.vcardSend();
    },
    bolt: function () {
      Lungo.Router.section('back');
      Plus.bolt();
    },
    call: function () {
      Lungo.Router.section('back');
      Lungo.Router.article('chat', 'call');
      Plus.rtc({audio: true, video: false});
    },
    videocall: function () {
      Lungo.Router.section('back');
      Lungo.Router.article('chat', 'videocall');
      Plus.rtc({audio: true, video: true});
    },
    otrMenu: function(obj) {
      var account = Accounts.current;
      account.OTRMenu();
    },
    switchOTR: function(obj) {
      var jid = $(obj).closest('section')[0].dataset.jid;
      Plus.switchOTR(jid);
    },
    purchase: function () {
      var number = Accounts.current.core.data.login;
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
        };
        req.onerror = function () { };
      }
    },
    reloadApp: function () {
      var sure = confirm(_('ConfirmReload'));
      if (sure) {
        Lungo.Notification.success(_('Reloading'), _('AppWillReload'), 'signout', 3);
        App.disconnect();
        App.run();
        Tools.log(App.name + ' has been reloaded');
      } else {
        Tools.log('Upps...');
      }
    }
  },

  /**
   * Opens a certain menu.
   *
   * @param {string} which
   * @param {*} attr
   * @param {number} delay
   */
  show: function (which, attr, delay) {
    Tools.log('SHOW', which, attr, delay);
    var map = this.map;
    setTimeout(function () { map[which](attr); }, delay );
  }

};
