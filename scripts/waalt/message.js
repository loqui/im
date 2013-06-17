'use strict';

var Message = function (from, to, text, stamp) {

  return {
  
	  from: from,
	  to: to,
	  text: text,
	  stamp: stamp,
	  
	  send: function (delayed, justSend) {
	    var stIndex = [];
      if (App.connected) {
		    XMPP.connection.Messaging.send(this.to, this.text, delayed ? this.stamp : delayed);
		  }
      var chat = Messenger.chatFind(this.to);
		  if (!justSend) {
	      // Is there a chat for this contact?
	      if (chat) {
	        var lastChunkIndex = chat.msgChunks[chat.msgChunks.length-1];
	        var msg = this;
	        Store.recover(lastChunkIndex, function (chunk) {
	          // Is last chunk full?
	          if (chunk.length > App.default.Message.chunkSize) {
	            // Create new chunk
	            chunk = [msg];
	            var newLastChunkIndex = Store.save(chunk);
	            chat.msgChunks.push(newLastChunkIndex);
	            stIndex = [newLastChunkIndex, 0];
	          } else {
	            // Update chunk
	            chunk.push(msg);
	            Store.update(lastChunkIndex, chunk);
	            stIndex = [lastChunkIndex, chunk.length-1];
	          }
	          if (!App.connected) {
              Messenger.toSendQ(stIndex);
            }
	        });
	      } else {
	        var contact = Lungo.Core.findByProperty(XMPP.miniRoster, 'jid', this.to);
	        var chat = new Chat(this.to, contact ? contact.name : this.to);
	        var msgChunk = [this];
	        var msgChunkIndex = Store.save(msgChunk);
	        stIndex = [msgChunkIndex, 0];
	        chat.msgChunks.push(msgChunkIndex);
	        Messenger.chats.push(chat);
	        if (contact) {
	          var curAvatar = $$('section#main > article#contacts li[data-jid=\'' + chat.jid + '\'] span.avatar img').attr('src');
	        }
          $$('section#main > article#chats ul').prepend('<li data-jid= \'' + chat.jid + '\' data-unread=\'0\' class=\'person\'>'
            + '<span class=\'avatar\'><img id=\'' + chat.jid + '\' ' + (curAvatar ? ('src=\'' + curAvatar + '\'') : '') + ' /></span>'
            + '<span class=\'name\'>' + chat.title + '</span>'
            + '<span class=\'show\'></span>'
            + '<span class=\'last\'></span>'
            + '<span class=\'unread\'></span>'
          + '</li>');
	        Messenger.render('presence');
	        if (!App.connected) {
            Messenger.toSendQ(stIndex);
	        }
	        $$('section#chat > article#chat > ul#messages').append('<li class=\'chunk\' data-chunk=\'' + stIndex + '\'></li>');
	      }
        this.render();
        App.audio('sent');
	    }
      chat.last = '→ ' + this.text;
      Messenger.render('last');
      Store.simple('mchats', Messenger.chats);
	  },
	  
	  process: function () {
	    var stIndex = [];
	    var chat = Messenger.chatFind(this.from);
	    if (chat) {
        var lastChunkIndex = chat.msgChunks[chat.msgChunks.length-1];
        var msg = this;
        Store.recover(lastChunkIndex, function (chunk) {
          if (chunk.length > App.default.Message.chunkSize) {
            chunk = [msg];
            var newLastChunkIndex = Store.save(chunk);
            chat.msgChunks.push(newLastChunkIndex);
            stIndex = [newLastChunkIndex, 0];
          } else {
            chunk.push(msg);
            Store.update(lastChunkIndex, chunk);
            stIndex = [lastChunkIndex, chunk.length-1];
          }
        });
	      App.audio('received');
	    } else {
	      var contact = Lungo.Core.findByProperty(XMPP.miniRoster, 'jid', this.from);
	      var chat = new Chat(this.from, contact ? contact.name : this.from);
	      var msgChunk = [this];
        var msgChunkIndex = Store.save(msgChunk);
        stIndex = [msgChunkIndex, 0];
        chat.msgChunks.push(msgChunkIndex);
        Messenger.chats.push(chat);
        if (contact) {
          var curAvatar = $$('section#main > article#contacts li[data-jid=\'' + chat.jid + '\'] span.avatar img').attr('src');
        }
        $$('section#main > article#chats ul').prepend('<li data-jid= \'' + chat.jid + '\' data-unread=\'0\' class=\'person\'>'
          + '<span class=\'avatar\'><img id=\'' + chat.jid + '\' ' + (curAvatar ? ('src=\'' + curAvatar + '\'') : '') + ' /></span>'
          + '<span class=\'name\'>' + chat.title + '</span>'
          + '<span class=\'show\'></span>'
          + '<span class=\'last\'></span>'
          + '<span class=\'unread\'></span>'
        + '</li>');
        Messenger.render('presence');
        App.audio('newchat');
	    }
	    if(document.hidden && navigator.mozNotification){
	      var from = this.from;
	      var subject = chat ? chat.title : from;
	      var text = this.text;
				var pic = Messenger.avatars[from];
				var callback = function () {
				  Messenger.chatShow(from);
				  App.toForeground();
				}
				if (pic) {
				  Store.recover(pic, function (src) {
            App.notify(subject, text, src, callback);
				  });
				} else {
		      App.notify(subject, text, 'img/foovatar.png', callback);
		    }
			}
			chat.last = '← ' + this.text;
	    if ($$('section#chat').hasClass('show') && Messenger.lastChat == this.from) {
  	    this.render();
	    } else {
	      chat.unread++;
	    }
      Messenger.render('last');
	  },
	  
	  render: function () {
      var ul = $$('section#chat > article#chat > ul#messages');
      var li = ul.children('li.chunk').last();
			li.append(this.preRender());
			ul[0].scrollTop = ul[0].scrollHeight;
	  },
	  
	  preRender: function () {
	    var text = Tool.urlHL(this.text.replace(/&(?!\w+([;\s]|$))/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
			var type = this.from == Strophe.getBareJidFromJid(XMPP.me.jid) ? 'out' : 'in';
		  var contact = Lungo.Core.findByProperty(XMPP.miniRoster, 'jid', Strophe.getBareJidFromJid(this.from));
		  var name = type == 'in' ? (contact ? (contact.name || contact.jid) : this.from) : 'Me';
			var day = Tool.day(this.stamp);
			var html = '<div data-type=\'' + type + '\' class=\'' + (type == pType ? 'same' : 'change') + '\' >'
		  	+ '<span class=\'stamp\'>' + Tool.hour(this.stamp) + '</span>'
			  + '<span class=\'text\'>' + text + '</span>'
			+ '</div>';
			pType = type;
			return html;
	  }
	  
	}
}

var pType;
