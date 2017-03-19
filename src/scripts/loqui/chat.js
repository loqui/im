/* global Tools, App, Store, Message, Avatar, Providers, Plus, Lungo, Make, hasPrototype */

/**
* @file Holds {@link Chat} and {@link ChatCore}
* @author [Adán Sánchez de Pedro Crespo]{@link https://github.com/aesedepece}
* @author [Jovan Gerodetti]{@link https://github.com/TitanNano}
* @author [Christof Meerwald]{@link https://github.com/cmeerw}
* @author [Giovanny Andres Gongora Granada]{@link https://github.com/Gioyik}
* @license AGPLv3
*/

'use strict';

/**
* @lends Chat.prototype
*/
var Chat = {

  /**
  * Holds a reference to the chats [{ChatCore}]{@link ChatCore} object.
  *
  * @type {ChatCore}
  */
  core : null,

  /**
  * Holds a back refernece to the account this chat is associated with.
  * @type {Account}
  */
  account : null,

  /**
  * Holds a refeence to the latest [{Notification}]{@link external:System.Notification} object of this chat.
  *
  * @type {external:System.Notification}
  */
  notification : null,

  /**
  * Holds a refernece to this chats [{WakeLock}]{@link external:System.WakeLock} in case it's holding one.
  * @type {?external:System.WakeLock}
  */
  wakeLock : null,

  /**
  * @type {string}
  */
  lastRead : null,

  /**
  * Holds the amount of unread messages.
  *
  * @type {number}
  */
  unread : null,

  /**
  * Contains the list all the unread [{Message}]{@link Message}
  *
  * @type {Message[]}
  */
  unreadList : null,

  /**
  * Seed for message ids.
  */
  seed : String(Date.now()),

  /**
  * Counter for message ids.
  */
  nextId : 1,

  /**
  * @constructs
  * @param {ChatCore} core
  * @param {Account} account
  */
  _make : function (core, account) {

    this.core = hasPrototype(core, ChatCore) ? core : Make(core, ChatCore)();
    this.account = account;
    this.notification = null;
    this.wakeLock = null;
    this.lastRead = Tools.localize(Tools.stamp());
    this.unread = this.core.unread;
    this.unreadList= [];

    this.messageAppend = async.queue(this.messageAppendProcessor.bind(this));
    this.messageAppend.drain = this.messageAppendDrain.bind(this);

    if (this.core.jid === null) {
      this.core.jid = Date.now() + '@fakeJid.org';
    }

    if (!this.core.last.id) {
      if(this.core.chunks.length > 0){
        var chunk = this.core.chunks[this.core.chunks.length-1];
        var chat = this;

        Store.recover(chunk, function(key, chunk, free){
          var lastMsg = chunk[chunk.length - 1];

          chat.core.last = lastMsg;

          free();
        });
      }
    }
  },

  /**
  * Render last chunk of messages
  */
  lastChunkRender : function () {
    var ul = $('section#chat ul#messages');
    ul.empty();
    var index = this.core.chunks.length - 1;
    if (index >= 0) {
      this.chunkRender(index);
    }
  },

  /**
  * Render a chunk of messages
  *
  * @param {number} index
  */
  chunkRender : function (index) {
    var chat = this;
    var cb = arguments[1];
    var ul = $('section#chat ul#messages');
    if (index >= 0 && ul.children('li[data-index="' + index + '"]').length < 1) {
      var stIndex = this.core.chunks[index];
      var height = ul[0].scrollHeight - ul[0].scrollTop;
      Store.recover(stIndex, function (key, chunk, free) {
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
            var msg = Make(Message)(chat.account, chunk[i], { muc : chat.core.muc });
            var type = msg.core.from == chat.account.core.fullJid ? undefined : msg.core.from;
            var time = Tools.unstamp(msg.core.stamp);
            var timeDiff = time - prevTime;
            var ack = chat.core.lastAck ? time < Tools.unstamp(chat.core.lastAck) : false;
            var avatarize = type && type != prevType;
            msg.read();
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
        free();
        if (typeof cb === 'function') {
          cb();
        }
      });
    }
  },

  /**
  * Push messages to this queue to append them to this chat
  *
  * @param {Object} task
  * @param {function} callback
  */
  messageAppendProcessor : function (task, callback) {
    var msg = task.msg;
    var delay = task.delay;
    var chat = this;
    var chunkListSize = this.core.chunks.length;
    var blockIndex = this.core.chunks[chunkListSize - 1];
    var storageIndex;

    if (!chat.wakeLock) {
      chat.wakeLock = navigator.requestWakeLock('cpu');
    }

    if (chunkListSize > 0) {
      Store.recover(blockIndex, function (key, chunk, free) {
        var msgPos = (chunk && msg.id)
            ? chunk.findIndex(function (a) { return a.id == msg.id; })
            : -1;

        if (msgPos >= 0) {
          blockIndex = chat.core.chunks[chunkListSize - 1];

          if (msg.volatile) {
            Tools.log('IGNORING VOLATILE MESSAGE');
            free();
            callback(undefined);
          } else {
            Tools.log('UPDATE EXISTING MESSAGE');
            chunk.splice(msgPos, 1, msg);

            Tools.log('PUSHING', blockIndex, chunk);
            Store.update(key, blockIndex, chunk, function(index){
              free();
              callback(index);
            });
          }
          storageIndex = [blockIndex, chunk.length-1];

        } else if (!chunk || chunk.length >= App.defaults.Chat.chunkSize) {
          Tools.log('FULL OR NULL');
          chunk = [msg];
          blockIndex = Store.save(chunk);
          Tools.log('PUSHING', blockIndex, chunk);
          chat.core.chunks.push(blockIndex);
          storageIndex = [blockIndex, 0];

          free();
          callback(blockIndex);

        } else {
          Tools.log('FITS');

          msgPos = chunk.findIndex(function (a) { return Tools.unstamp(a.stamp) > Tools.unstamp(msg.stamp); });
          if (msgPos >= 0) {
            chunk.splice(msgPos, 0, msg);
          } else {
            chunk.push(msg);
          }

          blockIndex = chat.core.chunks[chunkListSize - 1];
          Tools.log('PUSHING', blockIndex, chunk);
          Store.update(key, blockIndex, chunk, function(index){
            free();
            callback(index);
          });
          storageIndex = [blockIndex, chunk.length-1];
        }

        chat.core.last = chunk[chunk.length-1];

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
      chat.core.last = msg;
      if (delay) {
        chat.account.toSendQ(storageIndex);
      }
      callback(blockIndex);
    }
  },

  /**
  * This is runned when the message processing queue drains.
  */
  messageAppendDrain : function () {
    var chat = this;
    var pic = new Avatar(App.avatars[chat.core.jid]);
    var last = chat.core.last;
    if (!chat.core.settings.muted[0] && (chat.core.muc ? (chat.core.jid == last.to && (last.from != chat.account.core.user)) : (chat.core.jid == last.from))) {
      var callback = function () {
        chat.account.show();
        chat.show();
        App.toForeground();
      };
      var contact = Lungo.Core.findByProperty(chat.account.core.roster, 'jid', Strophe.getBareJidFromJid(last.from));
      var subject = (chat.core.muc && chat.core.unread < 2) ? ((contact ? (contact.name || last.pushName) : last.pushName) + ' @ ' + chat.core.title) : chat.core.title;
      var text = chat.core.unread > 1 ? _('NewMessages', {number: chat.core.unread}) : last.text;
      if (last.media) {
        text = _('SentYou', {type: _('MediaType_' + last.media.type)});
      }
      if (pic) {
        pic.url.then(function (src) {
          if (src.slice(0, 1) == '/' && chat.core.muc) {
            src = 'img/goovatar.png';
          }
          chat.notification = App.notify({ subject: subject, text: text, pic: src, from : chat.account.core.fullJid+'#'+chat.core.jid, callback: callback }, 'received');
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
    if (this.wakeLock) {
      this.wakeLock.unlock();
      this.wakeLock = null;
    }
  },

  /**
  * Create a chat window for this contact
  */
  show : function () {
    var section = $('section#chat');
    var account = this.account;

    if (!(section[0].dataset.jid == this.core.jid && section[0].dataset.account == this.account.core.fullJid)) {
      var header = section.children('header');
      var contact = Lungo.Core.findByProperty(this.account.core.roster, 'jid', this.core.jid);
      section[0].dataset.jid = this.core.jid;
      section[0].dataset.account = this.account.core.fullJid;
      section[0].dataset.features = $('section#main')[0].dataset.features;
      //section[0].dataset.caps = contact && contact.presence.caps in App.caps ? App.caps[contact.presence.caps].features.join(' ') : 'false';
      section[0].dataset.muc = this.core.muc || false;
      section[0].dataset.mine = this.core.muc && this.core.info && this.core.info.owner == this.account.core.fullJid;
      section[0].dataset.unread = App.unread - this.core.unread;
      header.children('.title').html(App.emoji[Providers.data[this.account.core.provider].emoji].fy(Tools.HTMLescape(this.core.title)));
      section.find('#plus').removeClass('show');
      section.find('#typing').hide();
      section.find('#messages').empty();
      section[0].dataset.otr= ('OTR' in this);
      var avatarize = function (url) {
        header.children('.avatar').children('img').attr('src', url);
      };
      var avatars = App.avatars;
      var jid = this.core.jid;
      if (avatars[jid]) {
        var existant = $('ul li[data-jid="' + jid + '"] .avatar img');
        if (existant.length) {
          avatarize(existant.attr('src'));
        } else {
          if (this.core.jid in App.avatars) {
            (new Avatar(avatars[jid])).url.then(function (val) {
              avatarize(val);
            });
          }
        }
      } else {
        header.children('.avatar').children('img').attr('src', 'img/foovatar.png');
        var method = this.core.muc ? this.account.connector.muc.avatar : this.account.connector.avatar;
        Tools.log('REQUESTING AVATAR FOR', jid);
        method(function (a) {
          a.url.then(function (val) {
            avatarize(val);
            if (account.supports('easyAvatars')) {
              avatars[jid] = a.data;
              App.avatars = avatars;
            }
          });
        }, jid);
      }
      if (this.core.settings.otr[0]) {
        Plus.switchOTR(this.core.jid, this.account);
      }
      setTimeout(function () {
        if (this.core.muc) {
          header.children('.status').text(_('NumParticipants', {number: this.core.participants.length}));
        } else {
          if (contact && this.account.connector.presence.subscribe) {
            this.account.connector.presence.subscribe(this.core.jid);
          }
          if (contact && this.account.connector.contacts.getStatus && (contact.presence.status === null)) {
            this.account.connector.contacts.getStatus([this.core.jid]);
          }
          this.account.presenceRender(this.core.jid);
        }
        this.lastChunkRender();
        this.unreadList= [];
      }.bind(this), 0);
    }
    this.unread = this.core.unread;
    if (this.core.unread) {
      this.core.unread = 0;
      $('section#main ul[data-jid="' + (this.account.core.fullJid || this.account.core.user) + '"] li[data-jid="' + this.core.jid + '"]')[0].dataset.unread = 0;
    }
    if(this.unreadList.length){
      this.unreadList.forEach(function(msg){
        msg.read();
      });
      this.unreadList= [];
    }
    if (this.notification && 'close' in this.notification){
      this.notification.close();
      this.notification = null;
    }
    this.lastRead = this.core.lastRead;
    this.core.lastRead = Tools.localize(Tools.stamp());
    this.save();
    Lungo.Router.section('chat');
  },

  /**
  * Finds a message in the chat
  *
  * @param {string} msgId
  * @param {number} [chunkIndex]
  * @param {boolean} [exists]
  * @return {external:System.Promise}
  */
  findMessage : function(msgId, chunkIndex, exists){
    var chat= this.core;

    return new Promise(function(success, faild){
      var found= false;

      var checkChunk= function(chunk, chunkIndex){
        var result= null;

        if (chunk) {
          chunk.forEach(function(item, i){
            if((item.id || '').split('-')[0] == msgId.split('-')[0]){
              found= true;
              result= {
                index : i,
                chunk : chunk,
                chunkIndex : chat.chunks[chunkIndex],
                message : item
              };
            }
          });

          return result;
        } else {
          return null;
        }
      };

      if (chunkIndex || chunkIndex === 0) {
        Store.recover(chunkIndex, function(key, chunk, free){
          var result= checkChunk(chunk, chunkIndex);
          if(found){
            success({key : key, result : result, free : free});
          }else{
            free();
            faild();
          }
        });

      } else {
        var currentChunk, lastChunk;

        currentChunk = lastChunk = chat.chunks.length - 1;

        var afterRecover= function(key, chunk, free){
          var result= checkChunk(chunk, currentChunk);

          if (found) {
            success({key : key, result : result, free : free});

          } else if((exists || (lastChunk - currentChunk < 2)) && currentChunk > 0) {
            currentChunk--;
            free();
            Store.recover(chat.chunks[currentChunk], afterRecover);

          } else {
            free();
            faild();
          }
        };

        Store.recover(chat.chunks[currentChunk], afterRecover);
      }
    });
  },

  /**
  * Find text in messages
  *
  * @param {string} [search_text]
  * @return {external:System.Promise}
  */
  findInChat : function(needle) {
    var chat = this.core;
    var needleRegExp = new RegExp(needle.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "i");
    var last_match = $('ul#messages span.text.search-result:first-of-type');

    var chunk_index = chat.chunks.length - 1;   // start search in last chunk
    if (last_match.length > 0) {                // ..or start at last match
      chunk_index = last_match.parent().parent()[0].dataset.index;
    }

    return new Promise(function(resolve, reject) {
      var searchInChunk = function(chunk) {
        for (var chunk_row = chunk.length-1; chunk_row>=0; chunk_row--) {
          if (chunk[chunk_row].text) {
            if (needleRegExp.test(chunk[chunk_row].text) &&
                ($('ul#messages').find('div[data-id="' + chunk[chunk_row].id + '"] span.text.search-result').length == 0)) {
                // found new match
              return {msg_id: chunk[chunk_row].id, chunk_index : chunk_index};
            }
          }
        }
        return null;
      };

      var afterRecover = function(key, chunk, free) {
        var result = searchInChunk(chunk);
        free();                                 // free data block, we do not need it
        if (result !== null) {                  // found match in current chunk
          resolve(({msg_id: result.msg_id, chunk_index: result.chunk_index}));
        }
        else if (chunk_index>0) {               // no match, search in nect chunk
          chunk_index--;
          Store.recover(chat.chunks[chunk_index], afterRecover);
        }
        else {                                  // no match, no more chunks
          reject();
        }
      };

      if (chunk_index >= 0) {                   // start search
        Store.recover(chat.chunks[chunk_index], afterRecover);
      }
      else {                                    // cannot search without chunks
        reject();
      }
    });
  },

  /**
  * Get a unique message id.
  */
  getNextId : function () {
    return MD5.hexdigest(this.seed + ' ' + this.account.core.fullJid + ' ' + this.core.jid).substr(0, 16) + '-' + String(this.nextId++);
  },

  /**
  * Save or update this chat in store
  *
  * @param {boolean} up
  */
  save : function (up) {
    if (up) {
      var ci = this.account.chatFind(this.core.jid);
      if (ci >= 0) {
        // find the index to move the chat to
        var myStamp = new Date((this.core.last && this.core.last.stamp) || 0).getTime();
        var chats = this.account.chats;
        var newIdx = chats.findIndex(function (chat) {
          return (myStamp < new Date((chat.core.last && chat.core.last.stamp) || 0).getTime());
        });

        if (newIdx < 0) {
          newIdx = chats.length - 1;
        } else if (newIdx > ci) {
          newIdx--;
        }

        if (newIdx != ci) {
          // chat has changed position, so move it
          var coreChats = this.account.core.chats;
          chats.splice(newIdx, 0, chats.splice(ci, 1)[0]);
          coreChats.splice(newIdx, 0, coreChats.splice(ci, 1)[0]);
          this.account.chats = chats;
        }
      }
    }

    this.account.save();
    this.account.singleRender(this, up);
  }

};

/**
* Holds only chat data and no functions
*
* @lends ChatCore.prototype
*/
var ChatCore = {

  /**
   * @type {string}
   */
  title : null,

  /**
  * @type {?number}
  */
  lastAck : null,

  /**
  * @type {number}
  */
  unread : 0,

  /**
  * @type {MessageCore}
  */
  last : null,

  /**
  * @type {ChatCore~Settings}
  */
  settings: null,

  /**
  * @type {Object}
  */
  info : null,

  /**
  * @constructs
  */
  _make : function(){

    /**
    * @name Settings
    * @type {Object}
    * @property {Array.<boolean|string>} muted
    * @property {Array.<boolean|string>} otr
    * @property {Array.<boolean|string>} hidden
    * @memberof ChatCore
    * @inner
    */
    var settings = {
      muted: [false],
      otr: [false, 'switchOTR'],
      hidden: [false]
    };

    this.last = this.last || {};
    this.info = this.info || {};
    this.title = ((!this.title || this.title === this.jid) && this.last && this.last.pushName) ? this.last.pushName : this.title;

    this.settings = this.settings || {};

    Object.keys(settings).forEach(function(key){
      if (!Array.isArray(this[key])) {
        this[key]= settings[key];
      }
    }.bind(this.settings));
  }
};
