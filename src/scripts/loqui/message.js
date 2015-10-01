/* global Chat, Tools, Plus, App, Providers, Store, Activity, Lungo, Make */

'use strict';

var Message = {
  _make : function (account, core, options) {
    options = options || {};

    this.account = account;
    this.core = core;
    this.options = Make(options, MessageOptions)();
  },

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
        console.log('HOW SHOULD WE REPLACE A MESSAGE WE CAN\'T FIND?', result);
      });
    }
  },

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

        if(!chat.core.muc){
          account.connector.ack(message.id, message.from, 'read');
        }

        Tools.log("VIEWED", message.text, message.id, message.from, values.result);
      });
    }
  },
  
  // Try to send this message
  send : function (delay) {
    var message = this;
    var chat = this.chat;
    if (chat.OTR) {
      this.options.send = false;
      this.options.otr = true;
      this.core.id = Date.now() + 'OTR';

      this.postSend();

      chat.OTR.sendMsg(this.core.id, message.core.text);
    } else {
      this.postSend();
    }
  },
  
  postSend : function () {
    if (this.account.connector.isConnected() && this.options.send) {
      this.core.id = this.account.connector.send(this.core.to, this.core.text, {delay: (this.options && 'delay' in this.options) ? this.core.stamp : this.options.delay, muc: this.options.muc});

      if (this.core.original) {
        this._replace();
      }
    }

    Tools.log('SEND', this.core.id, this.core.text, this.options);

    if (this.options.render) {
      this.addToChat();
    }
  },
  
  // Receive this message, process and store it properly
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
  
  // Incoming
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

  //Outcoming
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

  reRender : function(blockIndex, old_id){
    if($('section#chat')[0].dataset.jid == this.core.to){
      var element= $('section#chat ul#messages li[data-chunk="' + blockIndex + '"] div[data-id="' + (old_id || this.core.id) + '"]');
      element.replaceWith(this.preRender());
    }
  },

  // Represent this message in HTML
  preRender : function (index, avatarize) {
    var message = this;
    var account = this.account;
    var html= null;
    var onDivClick= null;
    if (this.core.text) {
      html = App.emoji[Providers.data[this.account.core.provider].emoji].fy(Tools.urlHL(Tools.HTMLescape(this.core.text)));
    } else if (this.core.media) {
      html = $('<img/>').attr('src', this.core.media.thumb);
      html[0].dataset.url = this.core.media.url;
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
            return alert('vCard');
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
            var url = img.dataset.url;
            var ext = url.split('.').pop();
            if (ext == 'aac') {
              ext = 'mp3';
            }
            var localUrl = App.pathFiles + $(e.target).closest('[data-stamp]')[0].dataset.stamp.replace(/[-:]/g, '') + url.split('/').pop().substring(0, 5).toUpperCase() + '.' + ext;
            if (img.dataset.downloaded == 'true') {
              Store.SD.recover(localUrl, function (blob) {
                open(blob);
              });
            } else {
              Tools.fileGet(url, function (blob) {
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
    var name = type == 'in' ? this._formatName((contact ? (contact.name || contact.jid) : (this.core.pushName || this.core.from))) : _('Me');
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

var MessageOptions = {
  send: true,
  render: true,
  otr: false,
  logging: true,
  muc: false
};
