/* global Chat, CoSeMe, Tools, Plus, App, Providers, Store, Activity, Lungo, Make, axolotlCrypto */

/**
* @file Holds {@link Message}
* @author [Adán Sánchez de Pedro Crespo]{@link https://github.com/aesedepece}
* @author [Jovan Gerodetti]{@link https://github.com/TitanNano}
* @author [Christof Meerwald]{@link https://github.com/cmeerw}
* @author [Giovanny Andres Gongora Granada]{@link https://github.com/Gioyik}
* @author [Sukant Garg]{@link https://github.com/gargsms}
* @license AGPLv3
*/

'use strict';

/**
 * @lends Message.prototype
 */
var Message = {

  /**
   * @constructs
   * @param {Account} account
   * @param {ChatCore} core
   * @param {object} options
   */
  _make : function (account, core, options) {
    options = options || {};

    this.account = account;
    this.core = core;
    this.options = Make(options, MessageOptions)();
  },

  /**
   * @param {string} name
   * @private
   */
  _formatName : function (name) {
    var re = /[A-Za-z-]+/;
    var parts = name.split(' ');
    for (var idx in parts) {
      if (idx >= 2) {
        var info = re.exec(parts[idx]);
        if (info) {
          parts[idx] = info[0][0] + '.';
        }
      }
    }
    return parts.join(' ');
  },

  /**
   * @private
   */
  _replace : function() {
    var msg = this;
    var receipts = this.account.supports('receipts');

    var afterRecover = function(key, block, message, chunk, free){
      var old_id = message.id;

      if (receipts) {
        message.ack = 'sending';
        message.id = msg.core.id;
        msg.core.id = 0;
        msg.setSendTimeout(block, index);
      } else {
        message.ack = '';
      }

      Store.update(key, block, chunk, free);

      message = Make(Message)(msg.account, message);
      message.reRender(block, old_id);

      message.chat.core.last = message.core;
      message.chat.save();
    };

    if(Array.isArray(this.core.original)){
      var block = this.core.original[0];
      var index = this.core.original[1];

      Store.recover(block, function(key, chunk, free){
        var message = chunk[index];

        afterRecover(key, block, message, chunk, free);
      });

    } else {
      this.chat.findMessage(this.core.original, null).then(function(result){
        afterRecover(result.key, result.result.chunkIndex, result.result.message, result.result.chunk, result.free);
      }, function(result){
        Tools.log('HOW SHOULD WE REPLACE A MESSAGE WE CAN\'T FIND?', result);
      });
    }
  },

  /**
   * @alias chat/get
   * @return {Chat}
   * @memberof Message.prototype
   */
  get chat() {
    var chatJid = Strophe.getBareJidFromJid(this.options.muc ? this.core.to : (this.core.from == (this.account.core.user || this.account.core.fullJid) ? this.core.to : this.core.from));
    var ci = this.account.chatFind(chatJid);
    var chat= null;
    if (ci < 0) {
      var contact = Lungo.Core.findByProperty(this.account.core.roster, 'jid', chatJid);
      chat = Make(Chat)({
        jid: chatJid,
        title: (contact ? contact.name : null) || this.core.pushName || chatJid,
        chunks: [],
        muc: this.options.muc
      }, this.account);
      this.account.chats.push(chat);
      this.account.core.chats.push(chat.core);
    } else {
      chat = this.account.chats[ci];
    }
    return chat;
  },

  /**
   * @param {Chat} chat
   */
  read : function(chat){
    var isIncoming = (this.core.from != this.account.core.user && this.core.from != this.account.core.realJid);
    var isUnread = !this.core.viewed;
    var hasId = 'id' in this.core;
    var account = this.account;
    var readReceipts = App.settings.readReceipts;

    chat= chat || this.chat;

    if(hasId && isIncoming && account.supports('readReceipts') && readReceipts && isUnread) {
      chat.findMessage(this.core.id, null, true).then(function(values){
        var message = values.result.message;
        var free = values.free;
        var key = values.key;

        message.viewed= true;

        Store.update(key, values.result.chunkIndex, values.result.chunk, free);

        if (!chat.core.muc && message.to == account.core.fullJid) {
          account.connector.ack(message.id, message.from, 'read');
        }

        Tools.log("VIEWED", message.text, message.id, message.from, values.result);
      });
    }
  },

  /**
   * Try to send this message.
   *
   * @param {number} delay
   */
  send : function (delay) {
    if (this.chat.OTR) {
      this.options.otr = true;
      this.core.id = Date.now() + 'OTR';

      this._sent();
      this.chat.OTR.sendMsg(this.core.id, this.core.text);
    } else {
      this.postSend();
    }
  },

  _sent : function () {
    Tools.log('SEND', this.core.id, this.core.text, this.options);

    if (this.options.render) {
      this.addToChat();
    }
  },

  /**
   * Pushes the message to the network interface to actually send it.
   */
  postSend : function () {
    if (this.account.connector.isConnected()) {
      return this.account.connector.sendAsync(this.core.to, this.core.text, {delay: (this.options && 'delay' in this.options) ? this.core.stamp : this.options.delay, muc: this.options.muc}).then(function (msgId) {
        this.core.id = msgId;

        if (this.core.original) {
          this._replace();
        }

        this._sent();
      }.bind(this));
    } else {
      return new Promise(function (ready) {
        this._sent();
        ready();
      }.bind(this));
    }
  },

  /**
   * Receive this message, process and store it properly.
   *
   * @param {function} callback
   */
  receive : function (callback) {
    Tools.log('RECEIVE', this.core.text, this.options);
    var message = this;
    var chat = this.chat;
    if (this.core.text && this.core.text.substr(0, 4) == "?OTR") {
      if (chat.OTR) {
        chat.OTR.receiveMsg(message.core.text);
      } else {
        chat.core.settings.otr[0] = true;
        chat.save();
        Plus.switchOTR(this.core.from, this.account);
      }
    } else {
      this.postReceive(callback);
    }
  },

  /**
   * Incoming
   *
   * @param {function} callback
   */
  postReceive : function(callback) {
    var message = this;
    var chat = this.chat;
    var lock = navigator.requestWakeLock('cpu');
    var account = this.account;

    chat.messageAppend.push({msg: message.core}, function (blockIndex) {
      if (callback) callback();
      lock.unlock();

      if ($('section#chat')[0].dataset.jid == chat.core.jid) {
        var ul = $('section#chat ul#messages');
        var li = ul.children('li[data-chunk="' + blockIndex + '"]');
        var last = ul.children('li[data-chunk]').last().children('div').last();
        var avatarize = !last.length || last[0].dataset.from != message.core.from;
        var timeDiff = !last.length || (Tools.unstamp(message.core.stamp) - Tools.unstamp(last[0].dataset.stamp) > 300000);
        var conv = Tools.convenientDate(message.core.stamp);
        if (li.length) {
          if (timeDiff) {
            li.append($('<time/>').attr('datetime', message.core.stamp).text(_('DateTimeFormat', {date: conv[0], time: conv[1]}))[0]);
          }
          li.append(message.preRender(false, avatarize));
        } else {
          li = $('<li/>').addClass('chunk');
          li[0].dataset.chunk= blockIndex;
          if (timeDiff) {
            li.append($('<time/>').attr('datetime', message.core.stamp).text(_('DateTimeFormat', {date: conv[0], time: conv[1]}))[0]);
          }
          li.append(message.preRender(false, avatarize));
          ul.append(li);
        }
        if (avatarize) {
          account.avatarsRender();
        }
        $('section#chat #typing').hide();
		    ul[0].scrollTop = ul[0].scrollHeight;
        chat.core.lastRead = Tools.localize(Tools.stamp());
        if (!$('section#chat').hasClass('show')) {
          chat.unread++;
          chat.core.unread++;
          chat.unreadList.push(message);
        }else if(document.hidden){
          chat.unreadList.push(message);
        }else{
          message.read();
        }
      } else {
        chat.unread++;
        chat.core.unread++;
      }
    });
  },

  /**
   * @param {number} block
   * @param {number} index
   */
  setSendTimeout : function(block, index){
	  var message= this.core;
	  var account= this.account;
      var msg= null;
	  setTimeout(function(){
		  Store.recover(block, function(key, chunk, free){
			if(index !== null){
				msg= chunk[index];
			}else{
				for(var i in chunk){
					if(chunk[i].id == message.id){
						msg= chunk[i];
					}
				}
			}
			if(msg){
				if(msg.ack == 'sending'){
					msg.ack = 'failed';
					msg= Make(Message)(account, msg);
					Store.update(key, block, chunk, free);
					msg.reRender(block);
				} else {
                  free();
                }
			} else {
              free();
            }
		  });
	  }, 30000);
  },

  /**
   * Outcoming
   */
  addToChat : function () {
    var message = this;
    var chat = this.chat;
    var account = this.account;
    var to = this.core.to;
    var receipts = account.supports('receipts');

    if (receipts) {
      message.core.ack = 'sending';
    }

    chat.messageAppend.push({
      msg: message.core,
      delay: !account.connector.isConnected()
    }, function (blockIndex) {
      if (receipts) {
	message.setSendTimeout(blockIndex, null);
      }
      if ($('section#chat')[0].dataset.jid == to && $('section#chat').hasClass('show')) {
        var ul = $('section#chat ul#messages');
        var li = ul.children('li[data-chunk="' + blockIndex + '"]');
        var last = ul.children('li[data-chunk]').last().children('div').last();
        var timeDiff = last.length ? Tools.unstamp(message.core.stamp) - Tools.unstamp(last[0].dataset.stamp) > 300000 : true;
        var conv = Tools.convenientDate(message.core.stamp);
        if (li.length) {
          if (timeDiff) {
            li.append($('<time/>').attr('datetime', message.core.stamp).text(_('DateTimeFormat', {date: conv[0], time: conv[1]}))[0]);
          }
          li.append(message.preRender());
        } else {
          li = $('<li/>').addClass('chunk');
          li[0].dataset.chunk = blockIndex;
          if (timeDiff) {
            li.append($('<time/>').attr('datetime', message.core.stamp).text(_('DateTimeFormat', {date: conv[0], time: conv[1]}))[0]);
          }
          li.append(message.preRender());
          ul.append(li);
        }
        ul[0].scrollTop = ul[0].scrollHeight;
        chat.core.lastRead = Tools.localize(Tools.stamp());
      }
    });
  },

  /**
   * @param {number} blockIndex
   * @param {string} old_id
   */
  reRender : function(blockIndex, old_id){
    if($('section#chat')[0].dataset.jid == this.core.to){
      var element= $('section#chat ul#messages li[data-chunk="' + blockIndex + '"] div[data-id="' + (old_id || this.core.id) + '"]');
      element.replaceWith(this.preRender(element[0].dataset.index));
    }
  },

  /**
   * Represent this message in HTML
   * @param {number} index
   * @param {boolean} avatarize
   */
  preRender : function (index, avatarize) {
    var message = this;
    var account = this.account;
    var html= null;
    var onDivClick= null;
    if (this.core.text) {
      html = App.emoji[Providers.data[this.account.core.provider].emoji].fy(Tools.urlHL(Tools.HTMLescape(this.core.text)));
    } else if (this.core.media) {
      html = $('<img/>').attr('src', this.core.media.thumb);
      html[0].dataset.downloaded = this.core.media.downloaded || false;
      switch (this.core.media.type) {
        case 'url':
          html.addClass('maps');
          var onClick = function(e){
            e.preventDefault();
            return new MozActivity({
              name: "view",
              data: {
                type: "url",
                url: message.core.media.url
              }
            });
          };
          break;
        case 'vCard':
          onClick = function(e){
            e.preventDefault();
            return new MozActivity({
              name: 'open',
              data: {
                type: 'text/vcard',
                blob: new Blob([ message.core.media.payload[1] ],
                               { type : 'text/vcard' })
              }
            });
          };
          break;

        default:
          html.addClass(this.core.media.type);
          var open = function (blob) {
            return new MozActivity({
              name: 'open',
              data: {
                type: blob.type,
                blob: blob
              }
            });
          };
          onClick = function (e) {
            var img = e.target;
            var url = message.core.media.url;
            var ext = url.split('.').pop();
            if (message.core.media.mimeType) {
              ext = message.core.media.mimeType.split('/').pop();
            } else if (ext == 'aac') {
              ext = 'mp3';
            }
            var localUrl = App.pathFiles + $(e.target).closest('[data-stamp]')[0].dataset.stamp.replace(/[-:]/g, '') + url.split('/').pop().substring(0, 5).toUpperCase() + '.' + ext;
            if (img.dataset.downloaded == 'true') {
              Store.SD.recover(localUrl, function (blob) {
                open(blob);
              });
            } else {
              Tools.fileGet(url, function (blob) {
                function saveBlob(blob) {
                  Store.SD.save(localUrl, blob, function () {
                    open(blob);
                    var index = [$(img).closest('li[data-chunk]')[0].dataset.chunk, $(img).closest('div[data-index]')[0].dataset.index];
                    Store.recover(index[0], function (key, chunk, free) {
                      Tools.log(chunk, index);
                      chunk[index[1]].media.downloaded = true;
                      Store.update(key, index[0], chunk, function () {
                        img.dataset.downloaded = true;
                        free();
                        Tools.log('SUCCESS');
                      });
                    });
                  }, function (error) {
                    Tools.log('SAVE ERROR', error);
                  });
                }

                var encKey = message.core.media.encKey;
                if (encKey) {
                  var reader = new FileReader();
                  reader.addEventListener("loadend", function() {
                    var key = CoSeMe.utils.bytesFromLatin1(encKey.key);
                    var iv = CoSeMe.utils.bytesFromLatin1(encKey.iv);
                    var ciphertext = reader.result.slice(0, -10);
                    axolotlCrypto.decrypt(key, ciphertext, iv).then(function (data) {
                      Tools.log('MEDIA DECRYPTED', data);
                      saveBlob(new Blob([data], { type: message.core.media.mimeType } ));
                    }, function (err) {
                      Tools.log('MEDIA DECRYPTION FAILED', err);
                    });
                  });
                  reader.readAsArrayBuffer(blob);
                } else {
                  saveBlob(blob);
                }
              });
            }
          };
          break;
      }
      html.bind('click', onClick);
      onDivClick = function(e) {
        e.preventDefault();
        var target = $(e.target);
        var span = target[0].lastChild;
        if (span) {
          var img = span.firstChild;
          img.click();
        }
      };
    }
    var type = (this.core.from == this.account.core.user || this.core.from == this.account.core.realJid) ? 'out' : 'in';
    var contact = Lungo.Core.findByProperty(this.account.core.roster, 'jid', Strophe.getBareJidFromJid(this.core.from));
    var name = type == 'in' ? this._formatName((contact ? (contact.name || contact.jid) : (this.core.name || this.core.pushName || this.core.from))) : _('Me');
    var day = Tools.day(this.core.stamp);
    var div = $('<div/>');
    var last = $('section#chat ul#messages li > div').last();
    div[0].dataset.type = type;
    index = index || (last.length ? parseInt(last[0].dataset.index) + 1 : 0);
    index = index >= App.defaults.Chat.chunkSize ? 0 : index;
    div[0].dataset.index = index;
    div[0].dataset.stamp = this.core.stamp;
    div[0].dataset.from = this.core.from;

    if (this.core.id) {
      div[0].dataset.id = this.core.id;
    }

    if (this.core.media) {
      div[0].dataset.mediaType = this.core.media.type;
    }

    if(type == 'out' && this.core.ack){
      div[0].dataset.ack= this.core.ack;
    }

    if (avatarize && type == 'in') {
      var img = $('<img/>');

      img[0].dataset.jid = this.core.from;

      var pic = $('<span/>').addClass('avatar hideable').append(img);
      var nameSpan = $('<span/>').addClass('name').css('color', Tools.nickToColor(this.core.from)).text(name);

      div.append(pic).append(nameSpan).addClass('extended');
    }

    if (html) {
      var textSpan = $('<span/>').addClass('text').html(html);
      div.append(textSpan);
    }

    if (onDivClick !== undefined) {
      div[0].onclick = onDivClick;
    }

    div.on('hold', function (e) {
      Activity('chat', null, Tools.stripHTML(this));
    });

    return div[0];
  }
};


/**
 * @typedef MessageOptions
 * @type {object}
 * @property {boolean} send
 * @property {boolean} render
 * @property {boolean} otr
 * @property {boolean} logging
 * @property {boolean} muc
 */
var MessageOptions = {
  render: true,
  otr: false,
  logging: true,
  muc: false
};
