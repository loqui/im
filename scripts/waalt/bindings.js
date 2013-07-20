document.body.addEventListener('online', function () {
  XMPP.connect();
}, false);

document.body.addEventListener('offline', function () {
  App.connected = false;
  App.light('na');
  Messenger.presenceRender();
}, false);

$$(window).on('beforeunload', function (){
  XMPP.connection.disconnect();
});

$$('section#login article#login button').on('click', function (e) {
  e.preventDefault();
  XMPP.login();
});

$$('section#main article.list ul li').singleTap(function (e){
  Messenger.chatShow(e.currentTarget.dataset.jid);
});

$$('section#main article#chats ul li').hold(function (e){
  var jid = e.currentTarget.dataset.jid;
  var chat = Messenger.chatFind(jid);
  var will = confirm('Do you really want to delete the conversation with "' + chat.title + '"');
  if (will) {
    Messenger.chatDelete(jid);
  }
});

$$('section#main article#contacts ul li').hold(function (e){
  Messenger.contactEdit(e.currentTarget.dataset.jid);
});


/*$$('section#main article#me div#status input#status').on('blur', function (e) {
  Messenger.presenceUpdate();
}).on('keydown', function (e) {
  if (e.which == 13) {
    e.preventDefault();
    Messenger.presenceUpdate();
  }
});*/
$$('section#main article#me div#status div#status[data-pretend=input-text]').on('blur', function (e) {
  Messenger.presenceUpdate();
}).on('keydown', function (e) {
  if (e.which == 13) {
    e.preventDefault();
    Messenger.presenceUpdate();
  }
});

$$('section#main article#me div#status select#show').on('change', function (e) {
  Messenger.presenceUpdate();
});

$$('section#main article#me div#vcard span.avatar').on('click', function (e) {
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
    alert('Sorry, your device does not support "pick" activity yet.');
  }
});

$$('section#dialog header a.right').on('click', function (e) {
  switch ($$('section#dialog article.active')[0].id) {
    case 'contactAdd':      
	    Messenger.contactAdd();
      break;
    case 'contactEdit':
      Messenger.contactSave();
      break;
  }
});

$$('section#chat .totalUnread').on('click', function (e) {
  Lungo.Router.back();
}).on('swipeRight', function (e) {
  Lungo.Router.back();
});
$$('section#chat header span.avatar').on('click', function (e) {
  Messenger.contactEdit(Messenger.lastChat);
});
$$('section#chat article#chat button#say').on('click', function (e) {
  Messenger.say();
});
$$('section#chat article#chat div#text').on('keydown', function (e) {
  if (e.which == 13) {
    e.preventDefault();
    Messenger.say();
  }
});

$$('section#dialog article#contactEdit button#delete').on('click', function (e) {
	Messenger.contactDelete();
});

$$('aside#options li[data-event=contactAdd]').on('click', function (e) {
  App.dialog('contactAdd');  
});

$$('aside#options li[data-event=disHide]').on('click', function (e) {
  $$('section#main article#contacts').toggleClass('disHide');
  Messenger.settings.disHide = !Messenger.settings.disHide;
  Store.simple('msettings', Messenger.settings);
  Lungo.Router.aside('main', 'options');
});

$$('aside#options li[data-event=mute]').on('click', function (e) {
  App.settings.muted = !App.settings.muted;
  Store.simple('asettings', App.settings);
  Lungo.Router.aside('main', 'options');
  Lungo.Notification.show('Sound is now ' + (App.settings.muted ? 'disabled' : 'enabled'), 'music', 1.5);
});

$$('aside#options li[data-event=disconnect]').on('click', function (e) {
  if (App.connected) {
    var will = confirm("Do you really want to disconnect?");
    if (will) {
      XMPP.connection.disconnect();
    }
  }
  Lungo.Router.aside('main', 'options');
});

$$('aside#options li[data-event=reconnect]').on('click', function (e) {
  if (App.connected) {
    var will = confirm("Do you really want to reconnect?");
    if (will) {
      XMPP.connection.disconnect();
    }
  }
  XMPP.connect();
  Lungo.Router.aside('main', 'options');
});

$$('aside#options li[data-event=exit]').on('click', function (e) {
  var will = confirm("Do you really want to exit?");
  if (will) {
    XMPP.settings.reconnect = false;
    XMPP.connection.disconnect();
    Store.simple('xsettings', XMPP.settings);
    Lungo.Router.aside('main', 'options');
    App.start();
  }
});

$$('aside#options li[data-event=forget]').on('click', function (e) {
  var will = confirm("Do you really want to forget everything? This include your whole chat history!");
  if (will) {
    App.killall();
  }
});

document.addEventListener("visibilitychange", function() {
  if (document.hidden) {
    var status = $$('section#main > article#me div#status div#status[data-pretend=input-text]').text();
    var msg = $pres();
    msg.c('show', {}, 'away');
    if (status) {
      msg.c('status', {}, status);
    }
    msg.c('priority', {}, '127');
    XMPP.connection.send(msg.tree());
  } else {
    Messenger.presenceUpdate();
  }
});


/* This is a provisional workaround until misterious bug concerning text inputs is solved */

$$('input:not(.nopretend)').each(function(){
	var id = this.id;
	var type = 'text';
	$$(this).replaceWith('<div contentEditable id=\'' + id + '\' data-pretend=\'input-text\'></div>');
});
