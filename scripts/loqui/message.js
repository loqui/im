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
      this.addToChat();
    }
  }
  
  // Receive this message, process and store it properly
  this.receive = function (muc) {
    var message = this;
    var chatJid = muc ? this.core.to : this.core.from;
    var ci = this.account.chatFind(chatJid);
    Tools.log('PROCESSED MESSAGE', muc, this.core.to, this.core.from, ci, this);
    if (ci >= 0) {
      var chat = this.account.chats[ci];
      this.account.chats.push(chat);
      this.account.core.chats.push(chat.core);
      this.account.chats.splice(ci, 1);
      this.account.core.chats.splice(ci, 1);
    } else {
      // There is no chat for the sender of the message
      Tools.log('No chat for ', chatJid, 'creating new one', this.account);
      var contact = Lungo.Core.findByProperty(this.account.core.roster, 'jid', this.core.from);
      var chat = new Chat({
        jid: chatJid, 
        title: contact ? contact.name || chatJid : chatJid,
        chunks: [],
        muc: muc || false
      }, this.account);
      this.account.chats.push(chat);
      this.account.core.chats.push(chat.core);
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
    Tools.log(subject, muc, contact, message);
    if (this.core.media) {
      var altText = _('SentYou', {type: _('MediaType_' + this.core.media.type)});
    }
    if (pic) {
      Store.recover(pic, function (src) {
        App.notify({ subject: subject, text: message.core.text || altText, pic: src, callback: callback }, 'received');
      });
    } else {
      App.notify({ subject: subject, text: message.core.text || altText, pic: 'https://raw.github.com/loqui/im/master/img/foovatar.png', callback: callback }, 'received');
    }
    chat.messageAppend.push({msg: message.core}, function (err) { });
  }

  this.addToChat = function () {
    var self = this;
    var account = this.account;
    var to = this.core.to;
    var chatIndex = account.chatFind(to);
    var chat = null;

    if (chatIndex >= 0) {
      chat = account.chats[chatIndex];
      account.chats.splice(chatIndex, 1);
      account.core.chats.splice(chatIndex, 1);
    } else {
      var contact = Lungo.Core.findByProperty(account.core.roster, 'jid', to);
      chat = new Chat({
        jid: to,
        title: contact ? contact.name || to : to,
        chunks: []
      }, account);
    }
    account.chats.push(chat);
    account.core.chats.push(chat.core);

    var ul = $('section#chat ul#messages');
    var li = ul.children('li:last-child');
    li.append(self.preRender(self.core.id));
    ul[0].scrollTop = ul[0].scrollHeight;
    
    chat.messageAppend.push({msg: self.core}, function (err) { });
  }
  
  // Represent this message in HTML
  this.preRender = function (index) {
    var self = this;
    var account = this.account;
    if (this.core.text) {
      var html = App.emoji[Providers.data[this.account.core.provider].emoji].fy(Tools.urlHL(Tools.HTMLescape(this.core.text)));
    } else if (this.core.media) {
      var html = $('<img/>').attr('src', this.core.media.thumb).data('url', this.core.media.url).data('downloaded', this.core.media.downloaded || false);
      if (index) {
        html.data('index', index);
      }
      switch (this.core.media.type) {
        case 'url':
          html.addClass('maps');
          var onClick = function(e){
            e.preventDefault();
            return new MozActivity({
              name: "view",
              data: {
                type: "url",
                url: self.core.media.url
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
            var localUrl = App.pathFiles + $(e.target).parent().siblings('.stamp').data('stamp').replace(/[-:]/g, '') + url.split('/').pop().substring(0, 5).toUpperCase() + '.' + ext;
            if (img.dataset.downloaded == 'true') {
              Store.SD.recover(localUrl, function (blob) {
                open(blob);
              });
            } else {
              Tools.fileGet(url, function (blob) {
                Store.SD.save(localUrl, blob, function () {
                  open(blob);
                  var index = [$(img).closest('li[data-chunk]').data('chunk'), img.dataset.index];
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
    }
  	var type = (this.core.from == this.account.core.user || this.core.from == this.account.core.realJid) ? 'out' : 'in';
    var contact = Lungo.Core.findByProperty(this.account.core.roster, 'jid', Strophe.getBareJidFromJid(this.core.from));
    var name = type == 'in' ? ((contact ? (contact.name || contact.jid) : (this.core.pushName || this.core.from))).split(' ')[0] : _('Me');
    var day = Tools.day(this.core.stamp);
    var div = $('<div/>').data('type', type);
    if (this.core.id) {
      div.data('id', this.core.id);
    }
    if (this.core.media) {
      div.data('media-type', this.core.media.type);
    }
    var stampSpan = $('<span/>').addClass('stamp').html(Tools.convenientDate(this.core.stamp).join('<br/>')).data('stamp', this.core.stamp);
    var nameSpan = $('<span/>').addClass('name').text(name);
    var textSpan = $('<span/>').addClass('text').html(html);
    if (html) {
      div.append(stampSpan).append(nameSpan).append(textSpan);
    }
  	return div;
  }
  
}
