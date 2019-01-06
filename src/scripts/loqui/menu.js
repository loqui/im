/* global Lungo, Accounts, Messenger, Tools, Activity, App, Providers, Plus, Help */

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
      var members = form.find('ul.listBox').children().map(function (i,e,a) {return e.dataset.jid;}).toArray();
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
        Lungo.Notification.error(_('NoSupport'), _('XMPPisBetter'), 'warning', 3);
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
    chatSearchToggle: function(obj) {
      var searchbox = $('section#chat article#searchbox');
      searchbox.toggle();
      if ($(searchbox).is(':visible')) {
        searchbox.children('span').hide();
        searchbox.children('i#search-wait').hide();
        searchbox.children('button#search-next').hide();
        searchbox.children('button#search-start').show();
        searchbox.children('input').val('').focus();
      }
      else {
        $('ul#messages span.text.search-result').removeClass("search-result");
      }
    },
    chatSearchClear: function(obj) {
      var searchbox = $('section#chat article#searchbox');
      searchbox.children('span').hide();
      searchbox.children('i#search-wait').hide();
      searchbox.children('button#search-next').hide();
      searchbox.children('button#search-start').show();
      searchbox.children('input').val('').focus();
      $('ul#messages span.text.search-result').removeClass("search-result");
    },
    chatSearch: function(obj) {
      var jid = $('section#chat')[0].dataset.jid;
      var chat = Accounts.current.chats[Accounts.current.chatFind(jid)];
      var searchbox = $('section#chat article#searchbox');
      var needle = searchbox.children('input').val().trim();

      searchbox.children('i#search-wait').show();
      searchbox.children('button#search-start').hide();
      searchbox.children('input')[0].disable = true;

      chat.findInChat(needle).then(function(found) {
        var msg_id = found.msg_id;
        var chunk_index = found.chunk_index;

        var scrollToMessage = function() {
          var last_index = $('ul#messages > li:first-of-type')[0].dataset.index;
          if (last_index > chunk_index) {
            chat.chunkRender(last_index - 1, scrollToMessage);
          }
          else {
            var message = $('ul#messages').find('div[data-id="' + msg_id + '"]')[0];
            $(message).find("span.text").addClass("search-result");
            message.scrollIntoView(false);
            searchbox.children('i#search-wait').hide();
            searchbox.children('button#search-next').show();
          }
        };

        scrollToMessage(found.chunk_index);
      }, function() {
        searchbox.children('i#search-wait').hide();
        searchbox.children('button#search-next').hide();
        searchbox.children('button#search-start').show();
        Lungo.Notification.show('info_outline', _('NoMatchFound'));
      });
    },
    chatLeave: function(obj) {
      Menu.map.emojiHide();
      $('section#chat article#searchbox').hide();
    },
    accountRemove: function(obj) {
      var jid = $(obj).closest('section')[0].dataset.jid;
      Messenger.accountRemove(jid);
    },
    plus: function () {
      Menu.show('emojiHide');
      Lungo.Router.section('attachment');
    },
    emojiOpen: function () {
      var account = Accounts.current;
      var providerName = Providers.data[account.core.provider].emoji;
      var emojiDiv = $('section#chat article#emoji div#' + providerName);

      $('section#chat article#main').css("bottom", "75vw"); // reduce height for emoji div
      $('section#chat article#emoji').addClass('show');

      if (emojiDiv.length === 0) {
        // Emojis for this provider are not loaded yet
        $('section#chat article#emoji div#emoji-loading').show();
        var providerDiv = $('<div/>', { id: providerName, class: "emoji-provider" }).appendTo('section#chat article#emoji');

        // Create category select toolbar
        var toolbar = $('<ul/>', { class: "category-select" });
        App.emoji[providerName].emojis.forEach(function (category, index) {
          // for each category add selector li and category div
          var li = $('<li/>', { class: category[0][1] }).on('tap', function() {
            var provider = $(this)[0].dataset.provider;
            var active = $(this)[0].dataset.category;
            var categoryDiv = $('div#' + provider + ' div#' + active);

            // activate new li and hide other category divs
            $('div#' + provider + ' ul.category-select li').removeClass("active");
            $(this).addClass("active");
            $('div#' + provider + ' div.emoji-category').hide();

            if (categoryDiv.children().length === 0) {
              // the category emojis are not loaded yet
              $('section#chat article#emoji div#emoji-loading').show();
              App.emoji[provider].emojis[index][1].forEach(function (emoji, eIndex) {
                // loop over every emiji in this category
                var img = account.connector.emojiRender(emoji);
                img.load(function() {
                  if ((App.emoji[provider].emojis[index][1].length - eIndex) === 1) {
                    // when the last image is loaded, hide the loading symbol and how the category
                    $('section#chat article#emoji div#emoji-loading').hide();
                    $('div#' + provider + ' div#' + active).show();
                  }
                });
                img.on('tap', function () {
                  // insert emoji into text input span on tap
                  Plus.emoji($(this)[0].dataset.emoji);
                  $('span#text').trigger("keydown");
                });
                categoryDiv.append(img);
              });
            }
            else {
              // category is already loaded, show it
              $('div#' + provider + ' div#' + active).show();
            }
          });

          li[0].dataset.provider = providerName;
          li[0].dataset.category = category[0][0];
          toolbar.append(li);
          providerDiv.append($('<div/>', {id: category[0][0], class: "emoji-category"}));
        });

        // add backspace button to toolbar
        var backspace = $('<li/>').append($('<i/>', { class: "material-icons" }).append("backspace"));
        backspace.on('tap', function() {
          var input = $('span#text');
          var str = input.html();
          if (str.length > 0) {         // unicode char
            if(/[\uD800-\uDFFF]/.test(str.slice(-1)) && (str.length > 1)) {
              input.html(str.substring(0, str.length - 2));
            }
            else {                      // regular char
              input.html(str.substring(0, str.length - 1));
            }
            $('span#text').trigger("keydown");
          }
        });
        toolbar.append(backspace);
        providerDiv.append(toolbar);
        toolbar.find("li:first-child").trigger("tap"); // activate first category
      }
      else {
        emojiDiv.show();
      }

      $('#emojis').hide();
      $('#keyboard').show();
      $('span#text').prop("contenteditable", false);        // prevent additional popup of the keyboard
    },
    emojiClose: function() {
      Menu.show('emojiHide', "focus_input");
    },
    emojiHide: function(focus_input) {
      $('section#chat span#text').prop("contenteditable", true);   // restore input field
      if ((focus_input !== undefined) && (focus_input === "focus_input")) {
        $('section#chat span#text').focus();                 // activate the keyboard
      }
      $('section#chat article#main').css("bottom", "0");    // restore size
      $('#emoji').removeClass('show');
      $('section#chat article#emoji div#' + Providers.data[Accounts.current.core.provider].emoji).hide();
      $('#emojis').show();
      $('#keyboard').hide();
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
  		if (App.platform === "FirefoxOS") {
	  	  var will = confirm(_('ConfirmClose'));
		    if (will) {
			    Lungo.Notification.success(_('Closing'), _('AppWillClose'), 'cached', 3);
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
      } else {
  		  Lungo.Notification.error(_('NoDevice'), _('FxOSisBetter'), 'warning', 3);
      }
    },
    reloadApp: function () {
      var sure = confirm(_('ConfirmReload'));
      if (sure) {
        Lungo.Notification.success(_('Reloading'), _('AppWillReload'), 'cached', 3);
        App.disconnect();
        App.run();
        Tools.log(App.name + ' has been reloaded');
      } else {
        Tools.log('Upps...');
      }
    },

    showHelp: function (obj) {
      var node = $(obj)[0].dataset.help;

      switch (node) {
        case 'main':    Help.main();          break;
        case 'contact': Help.contact();       break;
        case 'muc':     Help.muc();           break;
        case 'chat':    Help.chat();          break;
        default: break;
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
    setTimeout(this.map[which], delay, attr);
  }

};
