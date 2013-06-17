'use strict';

var Chat = function (jid, title, multiuser, msgChunks) {
  
  return {
    
    jid: jid,
    title: title || jid,
    multiuser: multiuser || false,
    msgChunks: msgChunks || [],
    unread: 0,
    
    lastChunkRender: function () {
      var index = this.msgChunks.length-1;
      this.chunkRender(index);
    },
    
    chunkRender: function (index) {
      pType = null;
      if (index >= 0) {
        var stIndex = this.msgChunks[index];
        var ul = $$('section#chat > article#chat > ul#messages');
        var that = this;
        Store.recover(stIndex, function (chunk) {
          ul.prepend('<li class=\'chunk\' data-chunk=\'' + index + '\'></li>');
          for (var i in chunk) {
            var data = chunk[i];
            var msg = new Message(data.from, data.to, data.text, data.stamp);
            ul.find('li[data-chunk=\'' + index + '\']').append(msg.preRender());
          }
          ul.off('swipeDown').on('swipeDown', function (e) {
            var chat = Messenger.chatFind(Messenger.lastChat);
            chat = new Chat(chat.jid, chat.title, chat.multiuser, chat.msgChunks);
            chat.chunkRender(index-1);
          });
          if (chunk.length < App.default.Message.chunkSize / 2) {
            that.chunkRender(index-1);
          }
          ul[0].scrollTop += ul.children('li[data-chunk=\'' + index + '\']').height() * 1.05;
        });
      }
    }
    
  }
  
}
