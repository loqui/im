'use strict';

var Message = function (account, core) {
  
  this.account = account;
  this.core = core;
  
  // Try to send this message
  this.send = function (delay, justSend) {
    if (App.online && account.connector.connection.connected) {
      account.connector.connection.Messaging.send(this.core.to, this.core.text, delay ? this.core.stamp : delay);
    }
    if (!justSend) {
      var ci = this.account.chatFind(this.core.to);
      if (ci >= 0) {
        var chat = this.account.chats[ci];
      } else {
        // There is no chat for the receiver of the message
        console.log('No chat for ', this.core.to, 'creating new one', this.account);
        var contact = Lungo.Core.findByProperty(this.account.core.roster, 'jid', this.core.to);
        var chat = new Chat({
          jid: this.core.to, 
          title: contact ? contact.name || this.core.to : this.core.to,
          chunks: []
        }, this.account);
      }
      chat.messageAppend(this.core, (App.online && account.connector.connection.connected) ? false : true );
      chat.save(ci, true);
      var ul = $('section#chat ul#messages');
      var li = ul.children('li:last-child');
      li.append(this.preRender());
      ul[0].scrollTop = ul[0].scrollHeight;
    }
  }
  
  // Receive this message, process and store it properly
  this.receive = function () {
    var message = this;
    var ci = this.account.chatFind(this.core.from);
    if (ci >= 0) {
      var chat = this.account.chats[ci];
    } else {
      // There is no chat for the sender of the message
      console.log('No chat for ', this.core.from, 'creating new one', this.account);
      var contact = Lungo.Core.findByProperty(this.account.core.roster, 'jid', this.core.from);
      var chat = new Chat({
        jid: this.core.from, 
        title: contact ? contact.name || this.core.from : this.core.from,
        chunks: []
      }, this.account);
    }
    if (!($('section#chat').hasClass('show') && $('section#chat').data('jid') == this.core.from && !document.hidden)) {
      chat.core.unread++;
    }
    chat.messageAppend(this.core);
    chat.save(ci, true);
    if ($('section#chat').data('jid') == this.core.from) {
      var ul = $('section#chat ul#messages');
      var li = ul.children('li:last-child');
      li.append(this.preRender());
      ul[0].scrollTop = ul[0].scrollHeight;
    }
    var pic = App.avatars[this.core.from];
    var callback = function () {
      chat.show();
		  App.toForeground();
    }
    if (pic) {
      Store.recover(pic, function (src) {
        App.notify({ subject: chat.core.title, text: message.core.text, pic: src, callback: callback }, 'received');
      });
    } else {
      App.notify({ subject: chat.core.title, text: message.core.text, pic: 'img/foovatar.png', callback: callback }, 'received');
    }
  }
  
  // Represent this message in HTML
  this.preRender = function () {
    var text = Tools.emojify(Tools.urlHL(Tools.HTMLescape(this.core.text)), EmojiList);
  	var type = (this.core.from == this.account.core.user || this.core.from == this.account.core.realJid) ? 'out' : 'in';
    var contact = Lungo.Core.findByProperty(this.account.core.roster, 'jid', Strophe.getBareJidFromJid(this.core.from));
    var name = type == 'in' ? (contact ? (contact.name || contact.jid) : this.from) : 'Me';
    var day = Tools.day(this.core.stamp);
    var div = $('<div/>').data('type', type);
    var stampSpan = $('<span/>').addClass('stamp').html(Tools.convenientDate(this.core.stamp).join('<br/>'));
    var textSpan = $('<span/>').addClass('text').html(text);
    div.append(stampSpan).append(textSpan);
  	return div;
  }
  
}
