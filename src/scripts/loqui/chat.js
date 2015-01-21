'use strict';

var Chat = function (core, account) {

  // Holds only chat data and no functions
  this.core = core;
  this.core.unread = this.core.unread || 0;
  this.core.last = this.core.last || {};
  this.core.lastAck = this.core.lastAck || undefined;
  this.account = account;
  this.notification = null;
  this.lastRead = Tools.localize(Tools.stamp());
  this.unread = this.core.unread;
  if (!('settings' in this.core)) {
    this.core.settings = {};
    $.extend(this.core.settings, App.defaults.Chat.core.settings);
  }
  if (!('info' in this.core)) {
    this.core.info = {};
  }
  
  // Render last chunk of messages
  this.lastChunkRender = function () {
    var ul = $('section#chat ul#messages');
    ul.empty();
    var index = this.core.chunks.length - 1;
    if (index >= 0) {
      this.chunkRender(index);
    }
  }
  
  // Render a chunk of messages
  this.chunkRender = function (index) {
    var chat = this;
    var ul = $('section#chat ul#messages');
    if (index >= 0 && ul.children('li[data-index="' + index + '"]').length < 1) {
      var stIndex = this.core.chunks[index];
      var height = ul[0].scrollHeight - ul[0].scrollTop;
      Store.recover(stIndex, function (chunk) {
        if (chunk) {
          var li = $('<li/>');
          var frag = document.createDocumentFragment();
          li.addClass('chunk');
          li[0].dataset.chunk= stIndex;
          li[0].dataset.index= index;
          var prevType, prevTime, prevAck;
          var prevRead = true;
          var lastRead = Tools.unstamp(chat.lastRead || chat.core.lastRead);
          for (var i in chunk) {
            var msg = new Message(chat.account, chunk[i]);
            var type = msg.core.from == chat.account.core.fullJid ? undefined : msg.core.from;
            var time = Tools.unstamp(msg.core.stamp);
            var timeDiff = time - prevTime;
            var ack = chat.core.lastAck ? time < Tools.unstamp(chat.core.lastAck) : false;
            var avatarize = type && type != prevType;
            // Append the message
            // New messages mark
            if (chat.unread && prevRead && time > lastRead) {
              frag.appendChild($('<span/>').addClass('lastRead').text(_('NewMessages', {number: chat.unread}))[0]);
            }
            // Show time stamp if differs in more than 5m
            if (timeDiff > 300000) {
              var conv = Tools.convenientDate(msg.core.stamp);
              frag.appendChild($('<time/>').attr('datetime', msg.core.stamp).text(_('DateTimeFormat', {date: conv[0], time: conv[1]}))[0]);
            }
            frag.appendChild(msg.preRender(i, avatarize));
            if (chat.account.supports('receipts') && !chat.core.muc && !ack && prevAck) {
              frag.appendChild($('<span/>').addClass('lastACK')[0]);
            }
            prevType = type;
            prevTime = time;
            prevAck = ack;
            prevRead = time <= lastRead;
          }
          if (chat.account.supports('receipts') && !chat.core.muc && (index == (chat.core.chunks.length - 1)) && chat.core.lastAck && prevAck) {
            frag.appendChild($('<span/>').addClass('lastACK')[0]);
          }
          li[0].appendChild(frag);
          var more = ul.children('.more');
          if (more.length) {
            more.replaceWith(li);
          } else {
            ul.prepend(li);
          }
          if (index > 0) {
            ul.prepend($('<button/>').addClass('more').html(_('MoreMessages', {number: App.defaults.Chat.chunkSize, total: index * App.defaults.Chat.chunkSize})).on('click', function (e) {
              chat.chunkRender(index - 1);
            }));
          }
          if (chunk.length < App.defaults.Chat.chunkSize / 2) {
            chat.chunkRender(index - 1);
          }
          ul[0].scrollTop += li.height() - 47;
        } else {
          chat.chunkRender(index - 1);
        }
        chat.account.avatarsRender();
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
    chat.core.last = msg;
    if (chunkListSize > 0) {
      Store.recover(blockIndex, function (chunk) {
        if (!chunk || chunk.length >= App.defaults.Chat.chunkSize) {
          Tools.log('FULL OR NULL');
          var chunk = [msg];
          blockIndex = Store.save(chunk);
          Tools.log('PUSHING', blockIndex, chunk);
          chat.core.chunks.push(blockIndex);
          storageIndex = [blockIndex, 0];
          callback(blockIndex);
        } else {
          Tools.log('FITS');
          chunk.push(msg);
          chunk.sort(function (a, b) {
            return Tools.unstamp(a.stamp) > Tools.unstamp(b.stamp);
          });
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
      callback(blockIndex);
    }
  }.bind(this));
  
  // This is runned when the message processing queue drains
  this.messageAppend.drain = function () {
    var chat = this;
    var pic = new Avatar(App.avatars[chat.core.jid]);
    var last = chat.core.last;
    if (!chat.core.settings.muted[0] && (chat.core.muc ? (chat.core.jid == last.to && (last.from != chat.account.core.user)) : (chat.core.jid == last.from))) {
      var callback = function () {
        chat.account.show();
        chat.show();
        App.toForeground();
      }
      var contact = Lungo.Core.findByProperty(chat.account.core.roster, 'jid', Strophe.getBareJidFromJid(last.from));
      var subject = (chat.core.muc && chat.core.unread < 2) ? ((contact ? (contact.name || last.pushName) : last.pushName) + ' @ ' + chat.core.title) : chat.core.title;
      var text = chat.core.unread > 1 ? _('NewMessages', {number: chat.core.unread}) : last.text;
      if (last.media) {
        var text = _('SentYou', {type: _('MediaType_' + last.media.type)});
      }
      if (pic) {
        pic.url.then(function (src) {
          if (src.slice(0, 1) == '/' && chat.core.muc) {
            src = 'https://raw.githubusercontent.com/loqui/im/dev/img/goovatar.png';
          }
          chat.notification = App.notify({ subject: subject, text: text, pic: src, from : chat.core.jid, callback: callback }, 'received');
        }.bind(chat));
      } else {
        chat.notification = App.notify({ subject: subject, text: text, pic: 'img/foovatar.png', from : chat.core.jid, callback: callback }, 'received');
      }
      chat.core.lastAck = last.stamp;
      var section = $('section#chat');
      if (chat.account.supports('receipts') && section.hasClass('show') && section[0].dataset.jid == last.from) {
        var li = section.find('ul li').last();
        section.find('span.lastACK').remove();
        li.append($('<span/>').addClass('lastACK')[0]);
      }
    }
    $('#chat #messages span.lastRead').remove();
    this.core.settings.hidden[0]= false;
    this.save(true);
  }.bind(this);
  
  // Create a chat window for this contact
  this.show = function () {
    var section = $('section#chat');
    var header = section.children('header');
    var contact = Lungo.Core.findByProperty(this.account.core.roster, 'jid', this.core.jid);
    section[0].dataset.jid = this.core.jid;
    section[0].dataset.features = $('section#main')[0].dataset.features;
    //section[0].dataset.caps = contact && contact.presence.caps in App.caps ? App.caps[contact.presence.caps].features.join(' ') : 'false';
    section[0].dataset.muc = this.core.muc || false;
    section[0].dataset.mine = this.core.muc && this.core.info && this.core.info.owner == this.account.core.fullJid;
    header.children('.title').html(App.emoji[Providers.data[this.account.core.provider].emoji].fy(this.core.title));
    section.find('#plus').removeClass('show');
    section.find('#typing').hide();
    section.find('#messages').empty();
    section[0].dataset.otr= ('OTR' in this);
    Lungo.Router.section('chat');
    var avatarize = function (url) {
      header.children('.avatar').children('img').attr('src', url);
    }
    if (App.avatars[this.core.jid]) {
      var existant = $('ul li[data-jid="' + this.core.jid + '"] .avatar img');
      if (existant.length) {
        avatarize(existant.attr('src'));
      } else {
        if (this.core.jid in App.avatars) {
          (new Avatar(App.avatars[this.core.jid])).url.then(function (val) {
            avatarize(val);
          });
        }
      }
    } else {
      header.children('.avatar').children('img').attr('src', 'img/foovatar.png');
      var method = this.core.muc ? this.account.connector.muc.avatar : this.account.connector.avatar;
      method(function (a) {
        a.url.then(function (val) {
          avatarize(val);
        });
      }, this.core.jid);
    }
    if (this.core.settings.otr[0]) {
      Plus.switchOTR(this.core.jid, this.account);
    }
    setTimeout(function () {
      if (this.core.muc) {
        if (this.core.participants) {
          header.children('.status').text(_('NumParticipants', {number: this.core.participants.length}));
        } else {
          this.account.connector.muc.participantsGet(this.core.jid);
          header.children('.status').text(' ');
        }
      } else {
        var show = contact ? (contact.presence.show || 'na') : 'na';
        var status = contact ? (contact.presence.status || _('show' + show)) : ' ';
        if (this.account.connector.presence.get) {
          this.account.connector.presence.get(this.core.jid);
        }
        header.children('.status').html(App.emoji[Providers.data[this.account.core.provider].emoji].fy(status));
        section[0].dataset.show = show;
      }
      this.lastChunkRender();
    }.bind(this), 0);
    this.unread = this.core.unread;
    if (this.core.unread) {
      this.account.unread -= this.core.unread;
      this.core.unread = 0;
      $('section#main ul[data-jid="' + (this.account.core.fullJid || this.account.core.user) + '"] li[data-jid="' + this.core.jid + '"]')[0].dataset.unread = 0;
      //Accounts.unread();
    }
    if (this.notification && 'close' in this.notification){
      this.notification.close();
      this.notification = null;
    }
    this.lastRead = this.core.lastRead;
    this.core.lastRead = Tools.localize(Tools.stamp());
    this.save();
  }
  
  // Save or update this chat in store
  this.save = function (up) {
    this.account.save();
    this.account.singleRender(this, up);
  }
    
}

