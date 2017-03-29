/* global App, Menu, Tools, Messenger, Accounts, Store, Plus, UI, Lungo, VoiceRecorder */

/**
* @file Contains all the bindings
* @author [AdÃ¡n SÃ¡nchez de Pedro Crespo]{@link https://github.com/aesedepece}
* @author [Jovan Gerodetti]{@link https://github.com/TitanNano}
* @author [Christof Meerwald]{@link https://github.com/cmeerw}
* @author [Giovanny Andres Gongora Granada]{@link https://github.com/Gioyik}
* @author [Sukant Garg]{@link https://github.com/gargsms}
* @author [Carsten]{@link https://github.com/acidicX}
* @license AGPLv3
*/

'use strict';

document.addEventListener('localized', function(e) {
  App.init().then(function () {
    $("script[type='text/spacebars']").each(function(index, script) {
      var name = script.getAttribute('name');
      UI.insert(UI.render(Template[name]), script.parentNode, script);
    });

    setTimeout(function () {
      $('input[data-l10n-placeholder]').each(function () {
        var original = this.dataset.l10nPlaceholder;
        var local = _(original);
        $(this).attr('placeholder', local);
      });

      bindings();
      Lungo.init({ name: 'Loqui' });

      setTimeout(function () {
        App.run();
      });
    }, 100);
  });
});

if (navigator.mozAlarms) {
  navigator.mozSetMessageHandler('alarm', function (message) {
    App.alarmSet(message.data);
  });

  navigator.mozSetMessageHandler('notification', function(notification){
    var accountJid = notification.tag.split('#')[0];
    var chatJid    = notification.tag.split('#')[1];
    var chat       = Accounts.find(accountJid).chatGet(chatJid);

    chat.account.show();
    chat.show();
    App.toForground();
  });
}

// Reconnect on new WiFi / 3G connection
document.body.addEventListener('online', function () {
  Tools.log('ONLINE AGAIN');
  App.online = true;
  App.connect();
}, false);

// Go to offline mode
document.body.addEventListener('offline', function () {
  Tools.log('OFFLINE');
  App.online = false;
  App.disconnect();
}, false);

// Close connections before quit
$(window).on('beforeunload', function () {
  App.killAll();
});

// Go "away" when app is hidden
document.addEventListener("visibilitychange", function() {
  if (!document.hidden) {
    App.lastActive = new Date();
  }

  App.accounts.forEach(function (account) {
    account.setVisible(!document.hidden);
  });
});

//Avatar handling for non FirefoxOS
$('#avatar_input').change(function() {
    var image = document.getElementById('avatar_input').files[0];
    Messenger.avatarSet(image);
});

// Tap my avatar
$('section#me #card span.avatar').on('click', function (e) {
  if (App.platform === "FirefoxOS") {
    var pick = new MozActivity({
      name: 'pick',
      data: {
        type: ['image/*'],
        width : 500,
        height : 500
      }
    });
    pick.onsuccess = function() {
      var image = this.result;
      Messenger.avatarSet(image.blob);
    };
    pick.onerror = function(){};
  } else if(App.platform === "UbuntuTouch") {
	  //Ubuntu Touch: open contentHub
	  $('#avatar_input').trigger('click');
  } else {
    Lungo.Notification.error(_('NoDevice'), _('FxOSisBetter', 'warning'));
  }
});

// Tap contact or muc avatar
var listener= function(muc){
  var jid= muc ? $('section#muc')[0].dataset.jid : $('section#contact')[0].dataset.jid;
  var section = muc ? $('section#muc header') : $('section#contact header');
  var avatar= App.avatars[jid];

  if(avatar){
    Store.recover((avatar.original || avatar.chunk), function(key, url, free){
      var blob = Tools.b64ToBlob(url.split(',').pop(), url.split(/[:;]/)[1]);
      if (App.platform === "FirefoxOS") {
            	//FirefoxOS
		return new MozActivity({
		  name: 'open',
		  data: {
			type: blob.type,
			blob: blob
		  }
		});
	} else if(App.platform === "UbuntuTouch") {
            	//Ubuntu Touch
		var h = $(window).height() - 60;
		var w = $(window).width();
		var image = document.createElement('img');
		var prop = new Image();
		prop.src = url;
		var propHeight = prop.height;
		var propWidth = prop.width;
		image.setAttribute('id', 'image');
		image.setAttribute('src', url);
		if(propWidth/propHeight > w/(h - 37)) {
			image.setAttribute('width', w);
		} else {
			image.setAttribute('height', h - 37);
		}
		  var notZoomedWidth = image.getAttribute('width');
		  var notZoomedHeight = image.getAttribute('height');
		  var closeButton = document.createElement('i');
		  closeButton.setAttribute('id', 'closeButton');
		  closeButton.setAttribute('class', 'material-icons md-36');
		  closeButton.textContent = 'cancel';
		  var divContainer = document.createElement('div');
		  divContainer.setAttribute('id', 'preview');
		  divContainer.appendChild(image);
		  divContainer.appendChild(closeButton);
		  section.after(divContainer);
		  $(closeButton).click(function () {
			  divContainer.remove();
		  });
		  var zoomed = false;
		  if(propHeight > (h - 37) || propWidth > w) {
			  $('img#image').click(function () {
				  if (zoomed) {
					  closeButton.setAttribute('id', 'closeButton');
					  divContainer.replaceChild(closeButton, closeButton);
					  image.setAttribute('width', notZoomedWidth);
					  image.setAttribute('height', notZoomedHeight);
				  } else {
                      if(propHeight > (h - 37)) {				
                         closeButton.setAttribute('id', 'closeButtonZoomed');
					     divContainer.replaceChild(closeButton, closeButton);
                      }					
                      image.setAttribute('width', propWidth);
					  image.setAttribute('height', propHeight);
				  }
				  zoomed = !zoomed;
			  });
		  }
            }
      free();
    });
  }
};

$('section#contact #card .avatar').on('click', listener.bind(null, false));
$('section#muc #card .avatar').on('click', listener.bind(null, true));

//Background handling for non FirefoxOS
$('#background_input').change(function() {
    var blob = document.getElementById('background_input').files[0];
    var account = Accounts.current;
    var sh = window.innerHeight;
    Tools.picThumb(blob, null, sh, function (url) {
      if (account.core.background) {
        var key = Store.lock(account.core.background);
        Store.update(key, account.core.background, url);
        Store.unlock(account.core.background, key);
      } else {
        account.core.background = Store.save(url);
      }
      Store.recover(account.core.background, function (key, url, free) {
        $('section#chat ul#messages').css('background-image', 'url('+url+')');
        $('section.profile div#card').css('background-image', 'url('+url+')');
        Lungo.Notification.show('star_border', _('backChanged'), 3);

        free();
      }.bind(this));
    });
});

// Change background
$('section#me #card button.background.change').on('click', function (e) {
  if (App.platform === "FirefoxOS") {
    e = new MozActivity({
      name: 'pick',
      data: {
        type: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/bmp']
      }
    });
    e.onsuccess = function () {
      var account = Accounts.current;
      var blob = this.result.blob;
      var sh = window.innerHeight;
      Tools.picThumb(blob, null, sh, function (url) {
        if (account.core.background) {
          var key = Store.lock(account.core.background);

          Store.update(key, account.core.background, url);

          Store.unlock(account.core.background, key);
        } else {
          account.core.background = Store.save(url);
        }
        Store.recover(account.core.background, function (key, url, free) {
          $('section#chat ul#messages').css('background-image', 'url('+url+')');
          $('section.profile div#card').css('background-image', 'url('+url+')');
          Lungo.Notification.show('star_border', _('backChanged'), 3);

          free();
        }.bind(this));
      });
    };
    e.onerror = function () {
      Tools.log('Picture selection was canceled');
    };
  } else if(App.platform === "UbuntuTouch") {
	  //Ubuntu Touch: open contentHub
	  $('#background_input').trigger('click');
  } else {
    Lungo.Notification.error(_('NoDevice'), _('FxOSisBetter', 'warning'));
  }
});

$('section#me #card button.background.delete').on('click', function (e) {
  var account = Accounts.current;
  if (account.core.background) {
    Store.blockDrop(account.core.background, function () {
      $('section#chat ul#messages').css('background-image', 'none');
      $('section.profile div#card').css('background-image', 'none');
      Lungo.Notification.show('star_border', _('backChanged'), 3);
    });
  }
  account.core.background = null;
});

$('section#me #status input').on('blur', function (e) {
  Messenger.presenceUpdate();
}).on('keydown', function (e) {
  if (e.which == 13) {
    e.preventDefault();
    Messenger.presenceUpdate();
  }
});

$('section#me #nick input').on('blur', function (e) {
  Messenger.presenceUpdate();
}).on('keydown', function (e) {
  if (e.which == 13) {
    e.preventDefault();
    Messenger.presenceUpdate();
  }
});

$('[data-var]').each(function () {
  var key = this.dataset.var;
  var value = App[key];
  $(this).text(value);
});

Strophe.Connection.rawInput = function (data) {
  Tools.log(data);
};

Strophe.Connection.rawOutput = function (data) {
  Tools.log(data);
};

var bindings = function () {
  $('[data-menu-onclick]').each(function () {
    var menu = this.dataset.menuOnclick;
    $(this).on('click', function (e) {
      Menu.show(menu, this);
    });
  });

  $('section#success button.start').on('click', function() {
    App.start(true);
  });

  $('section#contactAdd button.add').on('click', function() {
    Messenger.contactAdd();
  });

  $('section#welcome').on('click', function() {
    Menu.show('providers');
  });

  $('section#chat').on('swipeRight', function() {
    Lungo.Router.section('back');
  });

  $('section#chat ul#messages').on('doubleTap', function(e) {
    e.delegateTarget.scrollTop = e.delegateTarget.scrollHeight;
  });

  $('section#chat article#searchbox input').on('input', function(e) {
      if ($(this).val()) {
        $('section#chat article#searchbox span').show();
      }
      else {
        $('section#chat article#searchbox span').hide();
      }
    });

  $('section#main').on('click', function(e) {
    if($(e.target).hasClass('asided')) {
      Lungo.Aside.hide();
    }
  })

  .on('swipeLeft', function(e) {
    if($(e.target).hasClass('asided')){
      Lungo.Aside.hide();
    } else if ($('section#chat[data-jid]').length > 0) {
      Lungo.Router.section('chat');
    }
  })

  .on('swipeRight', function() {
    Lungo.Aside.show('accounts');
  });

  $('#main #chats').on('scroll', Tools.throttle(function(e) {
    if (e.target.scrollTop > 0) {
      $('.floater').addClass('hidden');
    }
    else {
      $('.floater').removeClass('hidden');
    }
  }, 100));

  $('aside').on('swipeLeft', function() {
    Lungo.Aside.hide();
  });

  $('#debugConsole #showConsole').on('click', function() {
    Plus.showConsole();
    $('#debugConsole #showConsole').hide();
    $('#debugConsole #hideConsole').show();
  });

  $('#debugConsole #hideConsole').on('click', function() {
    Plus.hideConsole();
    $('#debugConsole #showConsole').show();
    $('#debugConsole #hideConsole').hide();
  });

  $('#debugConsole #consoleClear').on('click', function() {
    Plus.clearConsole();
  });

  $('select').on('change', function() {
    var select = $(this);
    var option = select.find('option[value="' + select.val() + '"]');
    if (option[0].dataset.reveal) {
      select.siblings('[name="' + option[0].dataset.reveal + '"]').removeClass('hidden');
    }
    else {
      option = select.find('[data-reveal]');
      if (option[0]) {
        select.siblings('[name="' + option[0].dataset.reveal + '"]').addClass('hidden').val('');
      }
    }
  });

  window.addEventListener('touchend', function() {
    VoiceRecorder.stop(duration => {
      if (duration < 1) {
        Lungo.Notification.error(_('HoldToRecordTitle'), _('HoldToRecordBody'), 'info_outline', 10);
      }
    });
  });
};
