'use strict';

var Chat = function (core, account) {

  // Holds only chat data and no functions
  this.core = core;
  this.core.unread = this.core.unread || 0;
  this.core.last = this.core.last || [];
  this.account = account;
  
  // Render last chunk of messages
  this.lastChunkRender = function () {
    var ul = $('section#chat ul#messages');
    ul.empty().append('<li/>');
    var index = this.core.chunks.length - 1;
    if (index >= 0) {
      this.chunkRender(index);
    }
  }
  
  // Render a chunk of messages
  this.chunkRender = function (index) {
    var chat = this;
    var ul = $('section#chat ul#messages');
    if (index >= 0 && ul.children('li[data-chunk="' + index + '"]').length < 1) {
      var stIndex = this.core.chunks[index];
      Store.recover(stIndex, function (chunk) {
        var li = $('<li/>');
        li.addClass('chunk');
        li.data('chunk', index);
        for (var i in chunk) {
          var core = chunk[i];
          var msg = new Message(chat.account, core);
          li.append(msg.preRender());
        }
        ul.prepend(li);
        var onSwipe = function (e) {
          this.chunkRender(index - 1);
        }
        ul.off('swipeDown').on('swipeDown', onSwipe.bind(chat));
        ul[0].scrollTop += li.height();
        if (chunk.length < App.defaults.Chat.chunkSize / 2) {
          chat.chunkRender(index - 1);
        }
      });
    }
  }
  
  // Push messages to this queue to append them to this chat
  this.messageAppend = async.queue(function (task, callback) {
    var msg = task.msg;
    var delay = task.delay;
    var chat = this;
    var chunkListSize = this.core.chunks.length;
    var blockIndex = this.core.chunks[chunkListSize - 1];
    var storageIndex;
    this.core.last = msg;
    if (chunkListSize > 0) {
      Store.recover(blockIndex, function (chunk) {
        if (chunk.length >= App.defaults.Chat.chunkSize) {
          Tools.log('FULL', chunk.length);
          var chunk = [msg];
          blockIndex = Store.save(chunk);
          Tools.log('PUSHING', blockIndex, chunk);
          chat.core.chunks.push(blockIndex, callback);
          storageIndex = [blockIndex, 0];
        } else {
          Tools.log('FITS');
          chunk.push(msg);
          blockIndex = chat.core.chunks[chunkListSize - 1];
          Tools.log('PUSHING', blockIndex, chunk);
          Store.update(blockIndex, chunk, callback);
          storageIndex = [blockIndex, chunk.length-1];
        }
        if (delay) {
          chat.account.toSendQ(storageIndex);
        }
      });
    } else {
      Tools.log('NEW');
      var chunk = [msg];
      blockIndex = Store.save(chunk);
      Tools.log('PUSHING', blockIndex, chunk);
      chat.core.chunks.push(blockIndex);
      storageIndex = [blockIndex, 0];
      if (delay) {
        chat.account.toSendQ(storageIndex);
      }
      callback();
    }
  }.bind(this));
  
  this.messageAppend.drain = function () {
    this.save(null, true);
  }.bind(this);
  
  // Create a chat window for this contact
  this.show = function () {
    var section = $('section#chat');
    var header = section.children('header');
    section.data('jid', this.core.jid);
    section.data('lacks', $('section#main').data('lacks'));
    section.data('muc', this.core.muc || false);
    header.children('.title').html(App.emoji[Providers.data[this.account.core.provider].emoji].fy(this.core.title));
    if (this.core.muc) {
      if (this.core.participants) {
        header.children('.status').text(_('NumParticipants', {number: this.core.participants.length}));
      } else {
        this.account.connector.groupParticipantsGet(this.core.jid);
        header.children('.status').text(' ');
      }
    } else {
      var contact = Lungo.Core.findByProperty(this.account.core.roster, 'jid', this.core.jid);
      var show = contact ? (contact.show || 'na') : 'na';
      var status = contact ? (contact.status || _('show' + show)) : ' ';
      if (this.account.connector.contactPresenceGet) {
        this.account.connector.contactPresenceGet(this.core.jid);
      }
      header.children('.status').text(status);
      section.data('show', show);
    }
    if (App.avatars[this.core.jid]) {
      Store.recover(App.avatars[this.core.jid], function (val) {
        header.children('.avatar').children('img').attr('src', val);
      });
    } else {
      header.children('.avatar').children('img').attr('src', 'img/foovatar.png');
      var method = this.core.muc ? this.account.connector.groupAvatar : this.account.connector.avatar;
      method(function (data) {
        if (data) {
          header.children('.avatar').children('img').attr('src', data);
        }
      }, this.core.jid);
    }
    $('section#chat nav#plus').removeClass('show');
    $('section#chat #typing').hide();
    Lungo.Router.section('chat');
    this.lastChunkRender();
    if (this.core.unread) {
      this.core.unread = 0;
      this.save(this.account.chatFind(this.core.jid), true);
    }
  }
  
  // Save or update this chat in store
  this.save = function (ci, render) {
    if (ci >= 0) {
      this.account.chats.splice(ci, 1);
      this.account.core.chats.splice(ci, 1);
    }
    this.account.chats.push(this);
    this.account.core.chats.push(this.core);    
    this.account.save();
    if (render) {
      this.account.allRender();
    }
  }
    
}
