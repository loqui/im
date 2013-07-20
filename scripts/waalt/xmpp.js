'use strict';

var XMPP = {

  login: function () {
    var jid = $("section#login > article#login input[name=\"user\"]").val();
    var pass = $("section#login > article#login input[name=\"pass\"]").val();
    if(jid && pass){
      if (jid != XMPP.settings.jid) {
        Messenger.chats = [];
        Messenger.render('chats');
      }
      XMPP.settings.bosh = App.default.host.bosh;
      XMPP.settings.jid = jid;
      XMPP.settings.password = pass;
      XMPP.settings.reconnect = true;
      Store.simple('xsettings', XMPP.settings);
      App.start();
    }else alert("You didn't fill in the form properly");
  },

  connect: function () {
    if (XMPP.connection) {
      XMPP.connection.reset();
    } else {
      XMPP.connection = new Strophe.Connection(XMPP.settings.bosh);
    }
    if (navigator.onLine){
      console.log('Trying to connect to ' + XMPP.settings.bosh);
      if (XMPP.settings.jid && XMPP.settings.password) {
        XMPP.connection.connect(XMPP.settings.jid + '/' + (XMPP.settings.resource || App.default.XMPP.settings.resource), XMPP.settings.password, XMPP.status, XMPP.settings.timeout || App.default.XMPP.settings.timeout);
      } else {
        alert('NO LOGIN DATA');
      }
    }
  },
  
  status: function (status) {
    switch(status) {
      case Strophe.Status.CONNECTING:
        console.log('CONNECTING');
        break;
      case Strophe.Status.CONNFAIL:
        console.log('CONNFAIL');
        Lungo.Router.section('login');
        App.audio('error');
        break;
      case Strophe.Status.AUTHENTICATING:
        console.log('AUTHENTICATING');
        break;
      case Strophe.Status.AUTHFAIL:
        console.log('AUTHFAIL');
        Lungo.Router.section('login');
        Lungo.Notification.error('Authentication failed!', 'Please check your username and password.', 'warning', 3);
        App.audio('error');
        break;
      case Strophe.Status.CONNECTED:
        console.log('CONNECTED');
        App.connected = true;
        XMPP.goOnline();
        XMPP.attach();
        Lungo.Router.section('main');
        break;
      case Strophe.Status.DISCONNECTED:
        console.log('DISCONNECTED');
        App.connected = false;
        App.light('na');
        App.audio('logout');
        Messenger.presenceRender();
        if (XMPP.settings.reconnect) {
          XMPP.connect();
        }
        break;
      case Strophe.Status.DISCONNECTING:
        console.log('DISCONNECTING');
        break;
      case Strophe.Status.ATTACHED:
        console.log('ATTACHED');
        break;
    }
  },
  
  attach: function () {
    XMPP.connection.addHandler(Messenger.onChatMessage, null, 'message', 'chat', null, null);
    XMPP.connection.addHandler(Messenger.onSubRequest, null, 'presence', 'subscribe', null, null);
    XMPP.discoStart();
  },

  goOnline: function () {
    XMPP.connection.vcard.get(function (data){
      var vCard =  $$(data).find('vCard').get(0);
      if (!XMPP.me.length) {
        XMPP.me = {
          jid: XMPP.settings.jid,
          fn: $$(vCard).find('FN').length ? $$(vCard).find('FN').text() : Strophe.getResourceFromJid(XMPP.settings.jid)
        }
        Store.simple('xme', XMPP.me);
      }
      XMPP.rosterAttach();
      XMPP.connection.roster.get(function (){
        Messenger.presenceStart();
        Messenger.render('me');
        Messenger.render('avatars');
      });
      XMPP.flush();
      XMPP.vcard = $(data).find('vCard').get(0);
      App.audio('login');
    });
  },
  
  rosterAttach: function () {
    XMPP.connection.roster.clearCallbacks();
    XMPP.connection.roster.registerCallback(function (data){
      XMPP.fullRoster = data;
      XMPP.fullRoster.sort(function (a,b) {
        var aname = a.name ? a.name : a.jid;
        var bname = b.name ? b.name : b.jid;
        return aname > bname;
      })
      var newMiniRoster = XMPP.fullRoster.map(XMPP.rosterEntryMinimize);
      if (newMiniRoster.length != XMPP.miniRoster.length) {
        XMPP.miniRoster = newMiniRoster;
        Store.simple('xroster', XMPP.miniRoster, function () {
          console.log('ROSTER UPDATE');
          Messenger.render('chats');
          Messenger.render('contacts');
          Messenger.render('avatars');
          Messenger.render('presence');
        });
      } else {
        console.log('PRESENCE UPDATE');
        Messenger.render('presence');
      }
    });
  },
  
  rosterEntryMinimize: function (entry) {
    return {
      jid: entry.jid,
      name: entry.name
    }
  },
  
  flush: function () {
    if (Messenger.sendQ.length) {
      Store.recover(Messenger.sendQ[0][0], function (data) {
        var content = data[Messenger.sendQ[0][1]];
        var msg = new Message(content.from, content.to, content.text, content.stamp);
        msg.send(true, true);
        Messenger.sendQ.splice(0, 1);
        XMPP.flush();
      });
    } else {
      Store.simple('msendQ', Messenger.sendQ);
    }
  },
  
  discoStart: function () {
    XMPP.connection.disco.addIdentity('client', $$.environment().isMobile ? 'handheld' : 'web', XMPP.settings.resource || App.default.XMPP.settings.resource, 'en_GB');
    XMPP.connection.disco.addFeature(Strophe.NS.XHTML_IM);
    XMPP.connection.disco.addFeature(Strophe.NS.DISCO_INFO);
    XMPP.connection.disco.addFeature(Strophe.NS.DISCO_ITEMS);
    XMPP.connection.disco.addFeature(Strophe.NS.XEP0085);
    XMPP.connection.disco.addFeature(Strophe.NS.XEP0203);
  },
  
  onDisco: function (stanza) {
    console.log(Strophe.serialize(stanza));
  }
  
}
