/* global Chat, CoSeMe, Tools, Plus, App, Providers, Store, Activity, Lungo, Make, axolotlCrypto */

/**
* @file Holds {@link Message}
* @author [AdÃ¡n SÃ¡nchez de Pedro Crespo]{@link https://github.com/aesedepece}
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
      this.chat.OTR.sendMsg(this.core.text, this.core.text);
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
    var msgId = this.options.msgId || this.chat.getNextId();

    if (this.account.connector.isConnected()) {
      var options = { msgId: msgId,
                      delay: (this.options && 'delay' in this.options) ? this.core.stamp : this.options.delay,
                      muc: this.options.muc,
                      wantsReceipt : ! this.options.otr || this.core.original };
      this.account.connector.sendAsync(this.core.to, this.core.text, options)
        .then(function (msgId) {
          this.core.id = msgId;

          if (this.core.original) {
            this.core.text = this.core.original;
            this.options.render = true;
          }

          this._sent();
        }.bind(this));
    } else {
      this.core.id = msgId;
      this._sent();
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

      if (blockIndex !== undefined) {
        if ($('section#chat')[0].dataset.jid == chat.core.jid) {
          var ul = $('section#chat ul#messages');
          var li = ul.children('li[data-chunk="' + blockIndex + '"]');
          if (message.core.id && account.supports('receipts')) {
            li.children('div[data-id="' + message.core.id + '"]').remove();
          }
          var last = ul.children('li[data-chunk]').last().children('div').last();
          var avatarize = !last.length || last[0].dataset.from != message.core.from;
          var timeDiff = !last.length || (Tools.unstamp(message.core.stamp) - Tools.unstamp(last[0].dataset.stamp) > 300000);
          var conv = Tools.convenientDate(message.core.stamp);
          if (li.length) {
            if (timeDiff) {
              li.append($('<time/>').attr('datetime', message.core.stamp).text(_('DateTimeFormat', {date: conv[0], time: conv[1]}))[0]);
            }
            li.append(message.preRender(avatarize));
          } else {
            li = $('<li/>').addClass('chunk');
            li[0].dataset.chunk= blockIndex;
            if (timeDiff) {
              li.append($('<time/>').attr('datetime', message.core.stamp).text(_('DateTimeFormat', {date: conv[0], time: conv[1]}))[0]);
            }
            li.append(message.preRender(avatarize));
            ul.append(li);
          }
          if (avatarize) {
            account.avatarsRender();
          }
          $('section#chat #typing').hide();
          chat.core.lastRead = Tools.localize(Tools.stamp());
          if (!$('section#chat').hasClass('show')) {
            chat.unread++;
            chat.core.unread++;
            chat.unreadList.push(message);
          }else if(document.hidden){
            chat.unreadList.push(message);
          }else{
            $('section#chat span.title').addClass('new-message');
            setTimeout(function() {
              $('section#chat span.title').removeClass('new-message');
            }, 2000);
            message.read();
          }
        } else {
          chat.unread++;
          chat.core.unread++;
        }
      }
    });
  },

  /**
   * @param {number} block
   * @param {number} index
   */
  setSendTimeout : function(block) {
    var message= this.core;
    var account= this.account;
    setTimeout(function(){
      Store.recover(block, function(key, chunk, free){
        var pos = chunk.findIndex(function (elem) { return elem.id == message.id; });
        if (pos >= 0) {
	  var msg = chunk[pos];
	  if (msg.ack == 'sending') {
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
	message.setSendTimeout(blockIndex);
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
  reRender : function(blockIndex, old_id) {
    if($('section#chat')[0].dataset.jid == this.core.to) {
      var element = $('section#chat ul#messages li[data-chunk="' + blockIndex + '"] div[data-id="' + (old_id || this.core.id) + '"]');
      element.replaceWith(this.preRender());
    }
  },

  /**
   * Represent this message in HTML
   * @param {number} index
   * @param {boolean} avatarize
   */
  preRender : function (avatarize) {
    var message = this;
    var account = this.account;
    var html= null;
    var onDivClick= null;
    if (this.core.text) {
      html = App.emoji[Providers.data[this.account.core.provider].emoji].fy(Tools.urlHL(Tools.HTMLescape(this.core.text)));
      html = html.replace(/(\*)([A-Za-z0-9\s]+)(\*)/g, '<b>$2</b>');
      html = html.replace(/(_)([A-Za-z0-9\s]+)(_)/g, '<i>$2</i>');
      html = html.replace(/(~)([A-Za-z0-9\s]+)(~)/g, '<s>$2</s>');
    } else if (this.core.media) {
      if (this.core.media.thumb.indexOf('base64') > 0) {
        html = $('<img/>').attr('src', this.core.media.thumb);
      }
      else {
        html = $('<i/>').attr('class', 'material-icons md-48').text(this.core.media.thumb);
      }
      html[0].dataset.downloaded = this.core.media.downloaded || false;
      var onClick;
      switch (this.core.media.type) {
        case 'url':
        html.addClass('maps');
        onClick = function(e){
          if(App.platform === "UbuntuTouch") {
            //Ubuntu Touch
            window.open(message.core.media.url);
          }
          else {
            e.preventDefault();
            //FirefoxOS
            return new MozActivity({
              name: "view",
              data: {
                type: "url",
                url: message.core.media.url
              }
            });
          }
        };
        break;
        case 'vCard':
        onClick = function(e){
          if(App.platform === "FirefoxOS") {
            e.preventDefault();
            return new MozActivity({
              name: 'open',
              data: {
                type: 'text/vcard',
                blob: new Blob([ message.core.media.payload[1] ],            { type : 'text/vcard' })
              }
            });
          }
          else {
            //Ubuntu Touch
            var fullname = message.core.media.payload[0];
            var tel;
            var data = message.core.media.payload[1];
            if(data.includes(':+')) {
              var start = data.indexOf(':+')+1;
              var counter = 1;
              while(data.charAt(start + counter) >= 0 && data.charAt(start + counter) <= 9 || data.charAt(start + counter) == ' ') {
                counter = counter + 1;
              }
              var end = start + counter - 1;
              tel = data.slice(start, end);
            }
            prompt(fullname, tel);
          }
        };
        break;

        default:
        html.addClass(this.core.media.type);
        var propHeight, propWidth;
        var open = function (blob) {
          if (App.platform === "FirefoxOS") {
            //FirefoxOS
            return new MozActivity({
              name: 'open',
              data: {
                type: blob.type,
                blob: blob
              }
            });
          }
          else if(App.platform === "UbuntuTouch") {
            //Ubuntu Touch
            Tools.blobToBase64(blob, function (output) {
              if(output) {
                var type = output.split('/')[0];
                var h = $(window).height() - 60;
                var w = $(window).width();
                var chat = $('section#chat header');
                console.log(output.split(',')[0]);
                var download = function(filename, text) {
                  var pom = document.createElement('a');
                  pom.setAttribute('href', output.split(';')[0] + ';charset=UTF-8,' + encodeURIComponent(text));
                  pom.setAttribute('file_download', filename);

                  if (document.createEvent) {
                    var event = document.createEvent('MouseEvents');
                    event.initEvent('click', true, true);
                    pom.dispatchEvent(event);
                  }
                  else {
                    pom.click();
                  }
                }; // Not working yet
                //download('file.jpg', atob(output.split(',')[1]));
                if (type == 'data:image') {
                  var image = document.createElement('img');
                  var prop = new Image();
                  prop.src = output;
                  propHeight = prop.height;
                  propWidth = prop.width;
                  image.setAttribute('id', 'image');
                  image.setAttribute('src', output);
                  if (propWidth/propHeight > w/(h - 37)) {
                    image.setAttribute('width', w);
                  }
                  else {
                    image.setAttribute('height', h - 37);
                  }
                  var notZoomedWidth = image.getAttribute('width');
                  var notZoomedHeight = image.getAttribute('height');
                  var closeButton = document.createElement('p');
                  closeButton.setAttribute('id', 'closeButton');
                  var closeImage = document.createElement('i');
                  closeImage.setAttribute('class', 'material-icons md-36');
                  closeImage.textContent = 'cancel';
                  closeButton.appendChild(closeImage);
                  var divContainer = document.createElement('div');
                  divContainer.setAttribute('id', 'preview');
                  divContainer.appendChild(closeButton);
                  divContainer.appendChild(image);
                  chat.after(divContainer);
                  $(closeButton).click(function () {
                	  divContainer.remove();
                  });
                  var zoomed = false;
                  if (propHeight > (h - 37) || propWidth > w) {
                    $('img#image').click(function () {
                      if (zoomed) {
                        closeButton.setAttribute('id', 'closeButton');
                        divContainer.replaceChild(closeButton, closeButton);
                        image.setAttribute('width', notZoomedWidth);
                        image.setAttribute('height', notZoomedHeight);
                      }
                      else {
                        if (propHeight > (h - 37)) {
                          closeButton.setAttribute('id', 'closeButtonZoomed');
                          divContainer.replaceChild(closeButton, closeButton);
                        }
                        image.setAttribute('width', propWidth);
                        image.setAttribute('height', propHeight);
                      }
                      zoomed = !zoomed;
                    });
				}}
                  else if (type == 'data:audio') {
                    var audio = document.getElementById('newAudio');
                    audio.setAttribute("src", output);
                    audio.load();
                    var audiobox = $('section#chat article#audiobox');
                    audiobox.show();
                    $('section#chat article#audiobox button#close').click(function () {
                      audio.pause();
                      audio.setAttribute("src", "");
                      audio.load();
                      audiobox.hide();
                    });
                  }
                  else if (type == 'data:video') {
                    var addSourceToVideo = function(element, src, type) {
                      var source = document.createElement('source');
                      source.src = src;
                      source.type = type;
                      element.appendChild(source);
                    };
                    var video = document.createElement('video');
                    video.controls = true;
                    video.setAttribute('id', 'vid');
                    video.controls = true;
                    chat.after(video);
                    addSourceToVideo(video, output, blob.type);
                    propHeight = video.videoHeight;
                    propWidth = video.videoWidth;
                    if (propWidth/propHeight > w/h) {
                      video.setAttribute('width', w);
                    }
                    else {
                      video.setAttribute('height', h);
                    }
                    $("video#vid").on('swipe', function () {
                      video.remove();
                    });
                    $("video#vid").click(function () {
                      if (video.paused == false) {
                        video.pause();
                        video.firstChild.nodeValue = 'Play';
                      }
                      else {
                        video.play();
                        video.firstChild.nodeValue = 'Pause';
                      }
                    });
                  }
                }
            });
          }
        };
        onClick = function (e) {
          var img = e.target;
          var url = message.core.media.url;
          var ext = url.split('.').pop();
          if (message.core.media.mimeType) {
            ext = message.core.media.mimeType.split('/').pop().split(';').shift();
          }
          else if (ext == 'aac') {
            ext = 'mp3';
          }
          var localUrl = App.pathFiles + $(e.target).closest('[data-stamp]')[0].dataset.stamp.replace(/[-:]/g, '') + url.split('/').pop().substring(0, 5).toUpperCase() + '.' + ext;
          if (img.dataset.downloaded == 'true' && App.platform === "FirefoxOS") {
            Store.SD.recover(localUrl, function (blob) {
              open(blob);
            });
          }
          else {
            Tools.fileGet(url, function (blob) {
              function saveBlob(blob) {
                Store.SD.save(localUrl, blob, function () {
                  open(blob);
                  var index = $(img).closest('li[data-chunk]')[0].dataset.chunk;
                  Store.recover(index, function (key, chunk, free) {
                    Tools.log(chunk, index);
                    var pos = chunk.findIndex(function (elem) { return elem.id == message.core.id; });
                    if (pos >= 0) {
                      chunk[pos].media.downloaded = true;
                      Store.update(key, index, chunk, function () {
                        img.dataset.downloaded = true;
                        free();
                        Tools.log('SUCCESS');
                      });
                    }
                    else {
                      free();
                    }
                  });
                },
                function (error) {
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
