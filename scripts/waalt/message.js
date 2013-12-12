'use strict';

var Message = function (account, core) {
  
  this.account = account;
  this.core = core;
  
  // Try to send this message
  this.send = function (delay, justSend) {
    if (this.account.connector.isConnected()) {
      this.core.id = account.connector.send(this.core.to, this.core.text, delay ? this.core.stamp : delay);
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
      var ul = $('section#chat ul#messages');
      var li = ul.children('li:last-child');
      li.append(this.preRender());
      ul[0].scrollTop = ul[0].scrollHeight;
      chat.messageAppend.push({msg: this.core}, function (err) {
        chat.save(ci, true);
      }.bind(this));
    }
  }
  
  // Receive this message, process and store it properly
  this.receive = function (muc) {
    var message = this;
    var chatJid = muc ? this.core.to : this.core.from;
    var ci = this.account.chatFind(chatJid);
    console.log('PROCESSED MESSAGE', muc, this.core.to, this.core.from, ci, this);
    if (ci >= 0) {
      var chat = this.account.chats[ci];
    } else {
      // There is no chat for the sender of the message
      console.log('No chat for ', chatJid, 'creating new one', this.account);
      var contact = Lungo.Core.findByProperty(this.account.core.roster, 'jid', this.core.from);
      var chat = new Chat({
        jid: chatJid, 
        title: contact ? contact.name || chatJid : chatJid,
        chunks: []
      }, this.account);
      chat.save();
    }
    if ($('section#chat').data('jid') == chatJid && $('section#chat').hasClass('show')) {
      var ul = $('section#chat ul#messages');
      var li = ul.children('li:last-child');
      li.append(this.preRender());
      ul[0].scrollTop = ul[0].scrollHeight;
    } else {
      chat.core.unread++;
    }
    var pic = App.avatars[chatJid];
    var callback = function () {
      message.account.show();
      chat.show();
	    App.toForeground();
    }
    var contact = Lungo.Core.findByProperty(this.account.core.roster, 'jid', Strophe.getBareJidFromJid(message.core.from));
    var subject = muc ? ((contact ? (contact.name || message.core.pushName) : message.core.pushName) + ' @ ' + chat.core.title) : chat.core.title;
    console.log(subject, muc, contact, message);
    if (pic) {
      Store.recover(pic, function (src) {
        App.notify({ subject: subject, text: message.core.text, pic: src, callback: callback }, 'received');
      });
    } else {
      App.notify({ subject: subject, text: message.core.text, pic: 'https://raw.github.com/waalt/loqui/master/img/foovatar.png', callback: callback }, 'received');
    }
    chat.messageAppend.push({msg: this.core}, function (err) { });
  }
  
  // Represent this message in HTML
  this.preRender = function () {
    var text = App.emoji[Providers.data[this.account.core.provider].emoji].fy(Tools.urlHL(Tools.HTMLescape(this.core.text)));
  	var type = (this.core.from == this.account.core.user || this.core.from == this.account.core.realJid) ? 'out' : 'in';
    var contact = Lungo.Core.findByProperty(this.account.core.roster, 'jid', Strophe.getBareJidFromJid(this.core.from));
    var name = type == 'in' ? ((contact ? (contact.name || contact.jid) : (this.core.pushName || this.core.from))).split(' ')[0] : _('Me');
    var day = Tools.day(this.core.stamp);
    var div = $('<div/>').data('type', type);
    if (this.core.id) {
      div.data('id', this.core.id);
    }
    var stampSpan = $('<span/>').addClass('stamp').html(Tools.convenientDate(this.core.stamp).join('<br/>'));
    var nameSpan = $('<span/>').addClass('name').text(name);
    var textSpan = $('<span/>').addClass('text').html(text);
    div.append(stampSpan).append(nameSpan).append(textSpan);
  	return div;
  }
  
}
