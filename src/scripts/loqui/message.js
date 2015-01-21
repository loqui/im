'use strict';

var Message = function (account, core, options) {
  
  this.account = account;
  this.core = core;
  this.options = {
    send: (options && 'send' in options) ? options.send : true,
    render: (options && 'render' in options) ? options.render : true,
    otr: (options && 'otr' in options) ? options.otr : false,
    logging: (options && 'logging' in options) ? options.logging : true,
    muc: (options && 'muc' in options) ? options.muc : false
  };

  this._formatName = function (name) {
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
  }
  
  this.__defineGetter__('chat', function () {
    var chatJid = Strophe.getBareJidFromJid(this.options.muc ? this.core.to : (this.core.from == (account.core.user || account.core.fullJid) ? this.core.to : this.core.from));
    var ci = this.account.chatFind(chatJid);
    if (ci < 0) {
      var contact = Lungo.Core.findByProperty(this.account.core.roster, 'jid', chatJid);
      var chat = new Chat({
        jid: chatJid, 
        title: contact ? contact.name || chatJid : chatJid,
        chunks: [],
        muc: this.options.muc
      }, this.account);
      this.account.chats.push(chat);
      this.account.core.chats.push(chat.core);
    } else {
      var chat = this.account.chats[ci];
      this.account.chats.push(chat);
      this.account.core.chats.push(chat.core);
      this.account.chats.splice(ci, 1);
      this.account.core.chats.splice(ci, 1);
    }
    return chat;
  }.bind(this));
  
  // Try to send this message
  this.send = function (delay) {
    var message = this;
    var chat = this.chat;
    if (chat.OTR) {
      chat.OTR.sendMsg(message.core.text);
      this.options.send = false;
      this.options.otr = true;
    }
    this.postSend();
  }
  
  this.postSend = function () {
    var triedToSend= false;
    Tools.log('SEND', this.core.text, this.options);
    if (this.account.connector.isConnected() && this.options.send) {
      this.core.id = account.connector.send(this.core.to, this.core.text, {delay: (this.options && 'delay' in this.options) ? this.core.stamp : this.options.delay, muc: this.options.muc});
      triedToSend= true;
	  if(this.core.original){
		  var msg= this;
		  var block= this.core.original[0];
		  var index= this.core.original[1];
		  var sentACK= this.account.supports('sentACK');
		  Store.recover(block, function(chunk){
			  var message= chunk[index];

			  if(!triedToSend){
				  message.status= 'failed';
			  }else if(sentACK){
				  message.status= 'sending';
				  message.id= msg.core.id;
				  msg.core.id= 0;
				  msg.setSendTimeout(block, index);
			  }else{
				  message.status= '';
			  }

			  Store.update(block, chunk, null);
			  (new Message(msg.account, message)).reRender(block);

		  });
	  }
    }
    if (this.options.render) {
      this.addToChat(triedToSend);
    }
  }
  
  // Receive this message, process and store it properly
  this.receive = function () {
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
      this.postReceive()
    }
  }
  
  // Incoming
  this.postReceive = function() {
    var message = this;
    var chat = this.chat;
    chat.messageAppend.push({msg: message.core}, function (blockIndex) {
      if ($('section#chat')[0].dataset.jid == chat.core.jid && $('section#chat').hasClass('show')) {
        var ul = $('section#chat ul#messages');
        var li = ul.children('li[data-chunk="' + blockIndex + '"]');
        var last = ul.children('li[data-chunk]').last().children('div').last();
        var avatarize = last[0].dataset.from != message.core.from;
        var timeDiff = Tools.unstamp(message.core.stamp) - Tools.unstamp(last[0].dataset.stamp) > 300000;
        var conv = Tools.convenientDate(message.core.stamp);
        if (li.length) {
          if (timeDiff) {
            li.append($('<time/>').attr('datetime', message.core.stamp).text(_('DateTimeFormat', {date: conv[0], time: conv[1]}))[0]);
          }
          li.append(message.preRender(false, avatarize));
        } else {
          var li = $('<li/>').addClass('chunk');
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
      } else {
        chat.unread++;
        chat.core.unread++;
      }
    });
  }

  this.setSendTimeout= function(block, index){
	  var message= this.core;
	  var account= this.account;
	  setTimeout(function(){
		  Store.recover(block, function(chunk){
			if(index !== null){
				var msg= chunk[index];
			}else{
				for(var i in chunk){
					if(chunk[i].id == message.id){
						var msg= chunk[i];
					}
				}
			}
			if(msg){
				if(msg.status == 'sending'){
					msg.status= 'failed';
					msg= new Message(account, msg);
					Store.update(block, chunk, null);
					msg.reRender(block);
				}
			}
		  });
	  }, 30000);
  }

  //Outcoming
  this.addToChat = function (triedToSend) {
    var message = this;
    var chat = this.chat;
    var account = this.account;
    var to = this.core.to;
    var sentACK= account.supports('sentACK');

    if(!triedToSend){
      message.core.status= 'failed';
    }else if(sentACK){
      message.core.status= 'sending';
    }
    chat.messageAppend.push({
      msg: message.core,
      delay: !account.connector.isConnected()
    }, function (blockIndex) {
	  if(triedToSend && sentACK){
		  message.setSendTimeout(blockIndex, null);
	  }

      if ($('section#chat')[0].dataset.jid == to && $('section#chat').hasClass('show')) {
        var ul = $('section#chat ul#messages');
        var li = ul.children('li[data-chunk="' + blockIndex + '"]');
        var last = li.children('div').last();
        var timeDiff = Tools.unstamp(message.core.stamp) - Tools.unstamp(last[0].dataset.stamp) > 300000;
        var conv = Tools.convenientDate(message.core.stamp);
        if (li.length) {
          if (timeDiff) {
            li.append($('<time/>').attr('datetime', message.core.stamp).text(_('DateTimeFormat', {date: conv[0], time: conv[1]}))[0]);
          }
          li.append(message.preRender());
        } else {
          var li = $('<li/>').addClass('chunk')[0].dataset.chunk= blockIndex;
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
  }
  
  this.reRender= function(blockIndex){
    if($('section#chat')[0].dataset.jid == this.core.to && $('section#chat').hasClass('show')){
      var element= $('section#chat ul#messages li[data-chunk="' + blockIndex + '"] div[data-id="' + this.core.id + '"]');
      element.replaceWith(this.preRender());
    }
  };
  
  // Represent this message in HTML
  this.preRender = function (index, avatarize) {
    var message = this;
    var account = this.account;
    if (this.core.text) {
      var html = App.emoji[Providers.data[this.account.core.provider].emoji].fy(Tools.urlHL(Tools.HTMLescape(this.core.text)));
    } else if (this.core.media) {
      var html = $('<img/>').attr('src', this.core.media.thumb);
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
          }
          var onClick = function (e) {
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
                  Store.recover(index[0], function (chunk) {
                    Tools.log(chunk, index);
                    chunk[index[1]].media.downloaded = true;
                    Store.update(index[0], chunk, function () {
                      img.dataset.downloaded = true;
                      Tools.log('SUCCESS');
                    });
                  })
                }, function (error) {
                  Tools.log('SAVE ERROR', error);
                });
              });
            }
          };
          break;
      }
      html.bind('click', onClick);
      var onDivClick = function(e) {
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
    div[0].dataset.type = type;
    var index = index || parseInt($('section#chat ul#messages li > div').last()[0].dataset.index) + 1;
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
    if(type == 'out' && this.core.status){
      div[0].dataset.status= this.core.status;
    }
    if (avatarize) {
      var img = $('<img/>');
      img[0].dataset.jid = type == 'in' ? this.core.from : this.account.core.user;
      var pic = $('<span/>').addClass('avatar hideable').append(
        img
      );
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
      Activity('chat', null, $(this).children('.text').text());
    });
  	return div[0];
  }
  
}
