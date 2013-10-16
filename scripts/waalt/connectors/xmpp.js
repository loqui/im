'use strict';

App.connectors['XMPP'] = function (account) {

  this.account = account;
  this.provider = Providers.data[account.core.provider];
  this.connection = new Strophe.Connection(this.provider.BOSH.host);
  this.roster = [];
  this.presence = App.defaults.Connector.presence;
  
  // Connect to server
  this.connect = function (user, pass, handler) {
    this.connection.connect(user, pass, handler, this.provider.BOSH.timeout);
  }
  
  // Disconnect from server
  this.disconnect = function () {
    this.connection.disconnect();
  }
  
  // Start XMPP presence
  this.presenceStart = function () {
    this.presenceSet();
    this.handle();
    this.capabilize();
    this.connection.caps.sendPres();
  }
  
  // Set and send XMPP presence
  this.presenceSet = function (show, status, priority) {
    this.presence.show = show || this.presence.show;
    this.presence.status = status || this.presence.status;
    this.presenceSend();
  }
  
  // Send XMPP presence
  this.presenceSend = function (show, status, priority) {
    var show = show || this.presence.show;
    var status = status || this.presence.status;
    var priority = priority || '127';
    if (App.online && this.connection.connected) {
      var msg = $pres();
      if (show != 'a') {
        msg.c('show', {}, show);
      }
      if (status) {
        msg.c('status', {}, status);
      }
      msg.c('priority', {}, priority);
      this.connection.send(msg.tree());
    }
    $('section#main').attr('data-show', show);
  }
  
  // Add or recicle handlers
  this.handle = function () {
    this.chatHandler = this.connection.addHandler(this.onChatMessage.bind(this), null, 'message', 'chat', null, null);
    this.subHandler = this.connection.addHandler(this.onSubRequest, null, 'presence', 'subscribe', null, null);
    this.attHandler = this.connection.attention.setCallback(this.onAttention, this);
  }
  
  // Add capabilities using Caps and Disco
  this.capabilize = function () {
    var caps = [
      ['delay', Strophe.NS.XEP0203],
      ['attention', Strophe.NS.XEP0224]
    ];
    for (var i in caps) {
      if (this.account.supports(caps[i][0])) {
        this.connection.disco._features.push(caps[i][1]);
      }
    }
    var connector = this;
  }
  
  // Message receiving
  this.onChatMessage = function (data) {
    var account = this.account;
    var tree = $(data);
    var from = Strophe.getBareJidFromJid(tree.attr('from'));
    var to = Strophe.getBareJidFromJid(tree.attr('to'));
    var body = tree.children("body").length ? tree.children("body").text() : null;
    var composing = tree.children("composing").length;
    var paused = tree.children("paused").length || tree.children("active").length;
    if (body) {
      var date = new Date();
      var stamp = tree.children('delay').length 
        ? Tools.localize(tree.children('delay').attr('stamp')) 
        : date.getFullYear()+'-'
        +('0'+(date.getMonth()+1)).slice(-2)+'-'
        +('0'+(date.getDate())).slice(-2)+'T'
        +('0'+(date.getHours())).slice(-2)+':'
        +('0'+(date.getMinutes())).slice(-2)+':'
        +('0'+(date.getSeconds())).slice(-2)+'Z';
      var msg = new Message(account, {
        from: from,
        to: to,
        text: body,
        stamp: stamp
      });
      msg.receive();
    }
    if (account.supports('csn') && App.settings.csn) {
    	if(composing && from == $('section#chat').data('jid')){
        $("section#chat #typing").show();
      }else if(paused && from == $('section#chat').data('jid')){
        $("section#chat #typing").hide();
      }
    }
    return true;
  }
  
  // Autosusbcription
  this.onSubRequest = function (msg) {
    account.connector.connection.roster.authorize(Strophe.getBareJidFromJid($(msg).attr('from')));
    return true;
  }
  
  // Bolt receive
  this.onAttention = function (stanza, connector) {
    if (App.settings.boltGet) {
      var from = Strophe.getBareJidFromJid($(stanza).attr('from'));
      var chat = connector.account.chats[connector.account.chatFind(from)];
      if (!chat) {
        var contact = Lungo.Core.findByProperty(connector.account.core.roster, 'jid', connector.account.core.jid);
        chat = new Chat({
          jid: from,
          title: contact ? contact.name || from : from,
          chunks: []
        }, connector.account);
      }
      window.navigator.vibrate([100,30,100,30,100,200,200,30,200,30,200,200,100,30,100,30,100]);
      App.notify({
        subject: chat.core.title,
        text: _('HasSentYouABolt'),
        pic: 'img/bolt.png',
        callback: function () {
          chat.show();
          App.toForeground();
        }
      }, 'thunder');
    }
    console.log(from, 'sent you a bolt.');
  }

}
