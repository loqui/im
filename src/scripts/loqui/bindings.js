/* global App, Menu, Tools, Messenger, Accounts, Store, Plus, UI, Lungo */

'use strict';

Lungo.init({
  name: 'Loqui'
});

$('document').ready(function(){
  document.addEventListener('localized', function(e) {
    $('section#welcome article#main h1').removeClass('hidden');
  });
  
  setTimeout(function(){
    $('input[data-l10n-placeholder]').each(function () {
      var original = this.dataset.l10nPlaceholder;
      var local = _(original);
      $(this).attr('placeholder', local);
    });
    $('[data-menu-onclick]').each(function () {
      var menu = this.dataset.menuOnclick;
      $(this).on('click', function (e) {
        Menu.show(menu, this);
      });
    });

    App.defaults.Connector.presence.status = _('DefaultStatus', {
      app: App.name,
      platform: (Lungo.Core.environment().os ? Lungo.Core.environment().os.name : 'PC')
    });

    App.defaults.Selects.language[0] = { caption : _('Default'), value : 'default' };


//  wakelock shim
    navigator.requestWakeLock = navigator.requestWakeLock || function(){
      return {
        unlock : function(){}
      };
    };

    bindings();
    App.run();
  });
});

if (navigator.mozAlarms) {
  navigator.mozSetMessageHandler('alarm', function (message) {
    App.alarmSet(message.data);
  });
}

setInterval(function () {
  $('time[datetime].ago').each(function () {
    var ts = $(this).attr('datetime');
    var now = new Date();
    var then = Tools.unstamp(ts);
    var diff = now - then;
    var string;
    if (diff < 60000) {
      string = 'right now';
    } else if (diff < 3600000) {
      string = Math.floor(diff / 60000) + ' min.';
    } else if (diff < 7200000) {
      string = '1 hour';
    } else if (now.toLocaleDateString() == then.toLocaleDateString()) {
      string = Math.floor(diff / 3600000) + ' hours';
    } else {
      string = then.toLocaleDateString() + '@' + then.toLocaleTimeString().split(':').slice(0, 2).join(':');
    }
    $(this).text(string);
  });
}, 60000);

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
  var chat= null;
  for (var i in App.accounts) {
    var account = App.accounts[i];
    if (document.hidden) {
      account.connector.presence.set('away');
    } else {
      App.lastActive = new Date();
      account.connector.presence.set('a');

      var section = $('section#chat');
      if(section.hasClass('show')){
        var current = section[0].dataset.jid;
        chat = account.chatGet(current);
        if(chat.notification && 'close' in chat.notification){
            chat.notification.close();
            chat.notification= null;
        }
      }
    }
  }
  if(!document.hidden){
    var jid = $('section#chat')[0].dataset.jid;
    chat = Accounts.current.chatGet(jid);
    chat.unreadList.forEach(function(item){
        item.read();
    });
    chat.unreadList= [];
  }
});

// Type in chat text box
$('section#chat article#main div#text').on('keydown', function (e) {
  if (e.which == 13) {
    e.preventDefault();
    Messenger.say();
    Messenger.csn('active');
  } else if (e.which == 8 || e.which == 46) {
    if (this.textContent.length < 2) {
      $('section#chat article#main button#plus').show();
      $('section#chat article#main button#say').hide();
      Messenger.csn('paused');
    }
    // if user wants to hide keyboard in landscape
    // user can clear the box and press backspace to hide it
    if (this.textContent.length === 0 && e.which == 8 && window.matchMedia('(orientation:landscape)').matches) {
      $('section#chat article#main div#text').blur();
    }
  } else {
    $('section#chat article#main button#plus').hide();
    $('section#chat article#main button#say').show();

    var ul = $('section#chat ul#messages');
    ul[0].scrollTop = ul[0].scrollHeight;
    Messenger.csn('composing');
  }
}).on('tap', function (e) {
  Lungo.Router.article('chat', 'main');

  var ul = $('section#chat ul#messages');
  ul[0].scrollTop = ul[0].scrollHeight + 500;
}).on('blur', function (e) {
  Messenger.csn('paused');
});

// Tap my avatar
$('section#me #card span.avatar').on('click', function (e) {
  if (typeof MozActivity != 'undefined') {
    var pick = new MozActivity({
      name: 'pick',
      data: {
        type: ['image/png', 'image/jpg', 'image/jpeg']
      }
    });
    pick.onsuccess = function() {
      var image = this.result;
      Messenger.avatarSet(image.blob);
    };
    pick.onerror = function(){};
  } else {
    Lungo.Notification.error(_('NoDevice'), _('FxOSisBetter', 'exclamation-sign'));
  }
});

// Tap contact or muc avatar
var listener= function(muc){
  var jid= muc ? $('section#muc')[0].dataset.jid : $('section#contact')[0].dataset.jid;
  var avatar= App.avatars[jid];

  if(avatar){
    Store.recover((avatar.original || avatar.chunk), function(key, url, free){
      var blob = Tools.b64ToBlob(url.split(',').pop(), url.split(/[:;]/)[1]);
      new MozActivity({
        name: "open",
        data: {
          type: blob.type,
          blob: blob
        }
      });

      free();
    });
  }
};

$('section#contact #card .avatar').on('click', listener.bind(null, false));
$('section#muc #card .avatar').on('click', listener.bind(null, true));

// Change background
$('section#me #card button.background.change').on('click', function (e) {
  if (typeof MozActivity != 'undefined') {
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
          Lungo.Notification.show('star', _('backChanged'), 3);

          free();
        }.bind(this)); 
      });
    };
    e.onerror = function () {
      Tools.log('Picture selection was canceled');
    };
  } else {
    Lungo.Notification.error(_('NoDevice'), _('FxOSisBetter', 'exclamation-sign'));
  }
});

$('section#me #card button.background.delete').on('click', function (e) {
  var account = Accounts.current;
  if (account.core.background) {
    Store.blockDrop(account.core.background, function () {
      $('section#chat ul#messages').css('background-image', 'none');
      $('section.profile div#card').css('background-image', 'none');
      Lungo.Notification.show('star', _('backChanged'), 3); 
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

if (navigator.mozAlarms) {
  navigator.mozSetMessageHandler("alarm", function (message) {
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

Strophe.Connection.rawInput = function (data) {
  Tools.log(data);
};

Strophe.Connection.rawOutput = function (data) {
  Tools.log(data);
};

var bindings = function () {
  $('section#success button.start').on('click', function() {
    App.start(true);
  });
  $('section#contactAdd button.add').on('click', function() {
    Messenger.contactAdd();
  });
  $('section#chat #footbox #say').on('click', function(e) {
    Messenger.say();
  }).on('mousedown', function(e){
    e.preventDefault();
    e.target.classList.add('active');
  });
  $('section#welcome').on('click', function(){
     Menu.show('providers');
  });
  $('section#chat').on('swipeRight', function () {
    Lungo.Router.section('back');
  });
  $('section#main').on('click', function(e){
    if($(e.target).hasClass('asided')){
      Lungo.Aside.hide();
    }
  }).on('swipeLeft', function(e){
    if($(e.target).hasClass('asided')){
      Lungo.Aside.hide();
    } else if($('section#chat[data-jid]').length > 0) {
      Lungo.Router.section('chat');
    }
  }).on('swipeRight', function () {
    Lungo.Aside.show('accounts');
  }).on('swipeUp', function () {
    $('.floater').addClass('hidden');
  }).on('swipeDown', function () {
    $('.floater').removeClass('hidden');
  });
  $('aside').on('swipeLeft', function () {
    Lungo.Aside.hide();
  });
  $('#debugConsole #showConsole').on('click', function () {
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
  $('select').on('change', function () {
    var select = $(this);
    var option = select.find('option[value="' + select.val() + '"]');
    if (option[0].dataset.reveal) {
      select.siblings('[name="' + option[0].dataset.reveal + '"]').removeClass('hidden');
    } else {
      option = select.find('[data-reveal]');
      select.siblings('[name="' + option[0].dataset.reveal + '"]').addClass('hidden').val('');
    }
  });
  $("script[type='text/spacebars']").each(function(index, script) {
    var name = script.getAttribute('name');
    UI.insert(UI.render(Template[name]), script.parentNode, script);
  });
};
