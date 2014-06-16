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
    Tools.log('SEND', this.core.text, this.options);
    if (this.account.connector.isConnected() && this.options.send) {
      this.core.id = account.connector.send(this.core.to, this.core.text, {delay: (this.options && 'delay' in this.options) ? this.core.stamp : this.options.delay, muc: this.options.muc});
    }
    if (this.options.render) {
      this.addToChat();
    }
  }
  
  // Receive this message, process and store it properly
  this.receive = function () {
    Tools.log('RECEIVE', this.core.text, this.options);
    var message = this;
    var chat = this.chat;
    if (this.core.text && this.core.text.substr(0, 4) == "?OTR") {
      if (!chat.OTR) {
        Plus.goOTR(this.core.from);
      }
      if (chat.OTR) {
        chat.OTR.receiveMsg(message.core.text);
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
      if ($('section#chat').data('jid') == chat.core.jid && $('section#chat').hasClass('show')) {
        var ul = $('section#chat ul#messages');
        var li = ul.children('li[data-chunk="' + blockIndex + '"]');
        var last = li.children('div').last();
        var avatarize = last.data('from') != message.core.from;
        var timeDiff = Tools.unstamp(message.core.stamp) - Tools.unstamp(last.data('stamp')) > 300000;
        var conv = Tools.convenientDate(message.core.stamp);
        if (li.length) {
          if (timeDiff) {
            li.append($('<time/>').attr('datetime', message.core.stamp).text(_('DateTimeFormat', {date: conv[0], time: conv[1]}))[0]);
          }
          li.append(message.preRender(false, avatarize));
        } else {
          var li = $('<li/>').addClass('chunk').data('chunk', blockIndex);
          if (timeDiff) {
            li.append($('<time/>').attr('datetime', message.core.stamp).text(_('DateTimeFormat', {date: conv[0], time: conv[1]}))[0]);
          }
          li.append(message.preRender(false, avatarize));
          ul.append(li);
        }
        if (avatarize) {
          account.avatarsRender();
        }
        ul[0].scrollTop = ul[0].scrollHeight;
        chat.core.lastRead = Tools.localize(Tools.stamp());
      } else {
        chat.core.unread++;
        chat.account.unread++;
      }
    });
  }

  //Outcoming
  this.addToChat = function () {
    var message = this;
    var chat = this.chat;
    var account = this.account;
    var to = this.core.to;
    chat.messageAppend.push({
      msg: message.core,
      delay: !account.connector.isConnected()
    }, function (blockIndex) {
      if ($('section#chat').data('jid') == to && $('section#chat').hasClass('show')) {
        var ul = $('section#chat ul#messages');
        var li = ul.children('li[data-chunk="' + blockIndex + '"]');
        var last = li.children('div').last();
        var timeDiff = Tools.unstamp(message.core.stamp) - Tools.unstamp(last.data('stamp')) > 300000;
        var conv = Tools.convenientDate(message.core.stamp);
        if (li.length) {
          if (timeDiff) {
            li.append($('<time/>').attr('datetime', message.core.stamp).text(_('DateTimeFormat', {date: conv[0], time: conv[1]}))[0]);
          }
          li.append(message.preRender());
        } else {
          var li = $('<li/>').addClass('chunk').data('chunk', blockIndex);
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
  
  // Represent this message in HTML
  this.preRender = function (index, avatarize) {
    var message = this;
    var account = this.account;
    if (this.core.text) {
      var html = App.emoji[Providers.data[this.account.core.provider].emoji].fy(Tools.urlHL(Tools.HTMLescape(this.core.text)));
    } else if (this.core.media) {
      var html = $('<img/>').attr('src', this.core.media.thumb).data('url', this.core.media.url).data('downloaded', this.core.media.downloaded || false);
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
            var localUrl = App.pathFiles + $(e.target).closest('[data-stamp]').data('stamp').replace(/[-:]/g, '') + url.split('/').pop().substring(0, 5).toUpperCase() + '.' + ext;
            if (img.dataset.downloaded == 'true') {
              Store.SD.recover(localUrl, function (blob) {
                open(blob);
              });
            } else {
              Tools.fileGet(url, function (blob) {
                Store.SD.save(localUrl, blob, function () {
                  open(blob);
                  var index = [$(img).closest('li[data-chunk]').data('chunk'), $(img).closest('div[data-index]').data('index')];
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
    var name = type == 'in' ? ((contact ? (contact.name || contact.jid) : (this.core.pushName || this.core.from))).split(' ').slice(0, 2).join(' ') : _('Me');
    var day = Tools.day(this.core.stamp);
    var div = $('<div/>').data('type', type);
    var index = index || parseInt($('section#chat ul#messages li > div').last().data('index')) + 1;
    index = index >= App.defaults.Chat.chunkSize ? 0 : index;
    div.data('index', index);
    div.data('stamp', this.core.stamp);
    div.data('from', this.core.from);
    if (this.core.id) {
      div.data('id', this.core.id);
    }
    if (this.core.media) {
      div.data('media-type', this.core.media.type);
    }
    if (avatarize) {
      var pic = $('<span/>').addClass('avatar hideable').append(
        $('<img/>').data('jid', type == 'in' ? this.core.from : this.account.core.user)
      );
      var nameSpan = $('<span/>').addClass('name').style('color', Tools.nickToColor(this.core.from)).text(name);
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
