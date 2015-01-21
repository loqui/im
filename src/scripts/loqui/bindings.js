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
  for (var i in App.accounts) {
    var account = App.accounts[i];
    if (document.hidden) {
      account.connector.presence.send('away');
    } else {
      App.lastActive = new Date;
      account.connector.presence.send();

      var section = $('section#chat');
      if(section.hasClass('show')){
        var current = section[0].dataset.jid;
        var chat = account.chatGet(current);
        if(chat.notification && 'close' in chat.notification){
            chat.notification.close();
            chat.notification= null;
        }
      }
    }
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
      $('section#chat nav#plus').removeClass('show');
      Messenger.csn('paused');
    }
  } else {
    $('section#chat article#main button#plus').hide();
    $('section#chat article#main button#say').show();
    $('section#chat nav#plus').addClass('show');
    var ul = $('section#chat ul#messages');
    ul[0].scrollTop = ul[0].scrollHeight;
    if ($(this).text().length == 0) {
      Messenger.csn('composing');
    }
  }
}).on('tap', function (e) {
  Lungo.Router.article('chat', 'main');
  $('section#chat nav#plus').addClass('show');
  var ul = $('section#chat ul#messages');
  ul[0].scrollTop = ul[0].scrollHeight + 500;
}).on('blur', function (e) {
  if ($(e.explicitOriginalTarget).closest('[data-control=menu]').length < 1) {
    $('section#chat nav#plus').removeClass('show');
  }
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
    }
    pick.onerror = function() { }
  } else {
    Lungo.Notification.error(_('NoDevice'), _('FxOSisBetter', 'exclamation-sign'));
  }
});

// Change background
$('section#me #card button.background.change').on('click', function (e) {
  var e = new MozActivity({
    name: 'pick',
    data: {
      type: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/bmp']
    }
  });
  e.onsuccess = function () {
    var account = Messenger.account();
    var blob = this.result.blob;
    var sh = window.innerHeight;
    Tools.picThumb(blob, null, sh, function (url) {
      if (account.core.background) {
        Store.update(account.core.background, url);
      } else{
        account.core.background = Store.save(url);
      }
      Store.recover(account.core.background, function (url) {
        $('section#chat ul#messages').style('background', 'url('+url+') no-repeat center center fixed');
        $('section.profile div#card').style('background', 'url('+url+') no-repeat center center fixed'); 
        Lungo.Notification.show('star', _('backChanged'), 3);
      }.bind(this)); 
    });
  }
  e.onerror = function () {
    Tools.log('Picture selection was canceled');
  }
});

$('section#me #card button.background.delete').on('click', function (e) {
  var account = Messenger.account();
  if (account.core.background) {
    Store.blockDrop(account.core.background, function () {
      $('section#chat ul#messages').style('background', 'none');
      $('section.profile div#card').style('background', 'none');
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
}

Strophe.Connection.rawInput = function (data) {
  Tools.log(data);
};

Strophe.Connection.rawOutput = function (data) {
  Tools.log(data);
};

var bindings = function () {
  $('section#success button.start').on('click', function() {
    App.start();
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
  $('section#chat nav#plus a.cancel').on('click', function() {
    $(this).parent().removeClass('show');
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
      option = select.find('[data-reveal]')
      select.siblings('[name="' + option[0].dataset.reveal + '"]').addClass('hidden').val('');
    }
  });
  $("script[type='text/spacebars']").each(function(index, script) {
    var name = script.getAttribute('name');
    UI.insert(UI.render(Template[name]), script.parentNode, script);
  });
}
