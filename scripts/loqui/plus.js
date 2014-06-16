'use strict';

var Plus = {

  bolt: function () {
    var account = Messenger.account();
    var to = $('section#chat').data('jid');
    $('section#chat nav#plus').removeClass('show');
    if (to && App.online && account.connector.connection.connected){
      if (account.supports('attention')) {
        account.connector.attentionSend(to);
        window.navigator.vibrate([100,30,100,30,100,200,200,30,200,30,200,200,100,30,100,30,100]);
        App.audio('thunder');
        Tools.log('Sent a bolt to', to);
      } else {
        Lungo.Notification.error(_('NoSupport'), _('XMPPisBetter'), 'exclamation-sign');
      }
    }
  },
  
  emoji: function (emoji) {
    Lungo.Router.article('chat', 'main');
    Messenger.say(emoji);
  },
  
  imageSend: function () {
    var account = Messenger.account();
    if (account.supports('imageSend')) {
    var to = $('section#chat').data('jid');
      var e = new MozActivity({
        name: 'pick',
        data: {
          type: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/bmp']
        }
      });
      e.onsuccess = function () {
        var blob = this.result.blob;
        account.connector.fileSend(to, blob);      
      }
    } else {
      Lungo.Notification.error(_('NoSupport'), _('XMPPisBetter'), 'exclamation-sign');
    }
  },

  videoSend: function () {
    var account = Messenger.account();
    if (account.supports('videoSend')) {
    var to = $('section#chat').data('jid');
      var e = new MozActivity({
        name: 'pick',
        data: {
          type: ['video/webm', 'video/mp4', 'video/3gpp']
        }
      });
      e.onsuccess = function () {
        var blob = this.result.blob;
        account.connector.fileSend(to, blob);      
      }
    } else {
      Lungo.Notification.error(_('NoSupport'), _('XMPPisBetter'), 'exclamation-sign');
    }
  },

  audioSend: function () {
    var account = Messenger.account();
    if (account.supports('audioSend')) {
    var to = $('section#chat').data('jid');
      var e = new MozActivity({
        name: 'pick',
        data: {
          type: ['audio/mpeg', 'audio/ogg', 'audio/mp4']
        }
      });
      e.onsuccess = function () {
        var blob = this.result.blob;
        account.connector.fileSend(to, blob);      
      }
    } else {
      Lungo.Notification.error(_('NoSupport'), _('XMPPisBetter'), 'exclamation-sign');
    }
  },
  
  locationSend: function () {
    var account = Messenger.account();
    if (account.supports('locationSend')) {
      var to = $('section#chat').data('jid');
      Geo.posGet(function (loc) {
        account.connector.locationSend(to, loc);
      });
    } else {
      Lungo.Notification.error(_('NoSupport'), _('XMPPisBetter'), 'exclamation-sign');
    }
  },
  
  rtc: function (constraints) {
    
  },
  
  goOTR: function (jid, start) {
    $('section#chat nav#plus').removeClass('show');
    var account = Messenger.account();
    var ci = account.chatFind(jid);
    if (ci < 0) {
      var contact = Lungo.Core.findByProperty(account.core.roster, 'jid', jid);
      var chat = new Chat({
        jid: jid, 
        title: contact ? contact.name || jid : jid,
        chunks: [],
      }, account);
      account.chats.push(chat);
      account.core.chats.push(chat.core);
    } else {
      var chat = account.chats[ci];
      account.chats.push(chat);
      account.core.chats.push(chat.core);
      account.chats.splice(ci, 1);
      account.core.chats.splice(ci, 1);
    }
    var to = jid;
    if (chat.OTR) {
      chat.OTR.endOtr();
    } else {
      if (account.OTR.enabled) {
        chat.OTR = new OTR({
          priv: account.OTR.key
        });
        chat.OTR.on('ui', function (text) {
          var msg = new Message(account, {
            to: account.core.user,
            from: to,
            text: text,
            stamp: Tools.localize(Tools.stamp()),
          }, {
            otr: true,
            logging: account.OTR.logging
          });
          msg.postReceive();
        });
        chat.OTR.on('io', function (text) {
          var msg = new Message(account, {
            from: account.core.user,
            to: to,
            text: text,
            stamp: Tools.localize(Tools.stamp())
          }, {
            otr: true,
            logging: account.OTR.logging,
            render: false
          });
          msg.postSend();
        });
        chat.OTR.on('error', function (err) {
          Tools.log('OTR-ERROR', err);
        })
        chat.OTR.on('status', function (state) {
          switch (state) {
            case OTR.CONST.STATUS_AKE_SUCCESS:
              if (chat.OTR.msgstate === OTR.CONST.MSGSTATE_ENCRYPTED) {
                // The chat is secure
                $('section#chat[data-jid="' + chat.core.jid + '"]').data('otr', 'true');
              } else {
                // The chat is no longer secure
                $('section#chat[data-jid="' + chat.core.jid + '"]').data('otr', 'false');
                delete chat.OTR;
              }
              break;
            case OTR.CONST.STATUS_END_OTR:
              // The chat is no longer secure
              $('section#chat[data-jid="' + chat.core.jid + '"]').data('otr', 'false');
              delete chat.OTR;
              break;
          }
        });
        if (start) {
          chat.OTR.sendQueryMsg();
        }
      } else {
        account.OTRMenu();
      }
    }
  },

  showConsole: function() {
    $('#console').show();
  },
  
  hideConsole: function() {
    $('#console').hide();
  },
  
  log: function(msg) {
    var node=document.createElement("DIV");
    var textnode=document.createTextNode(msg);
    node.appendChild(textnode);
    document.getElementById('logConsole').appendChild(node);
    while(document.getElementById('logConsole').childNodes.length>15)
    { 
      document.getElementById('logConsole').removeChild(document.getElementById('logConsole').firstChild);
    }
  },
  
  clearConsole: function() {
    document.getElementById('logConsole').innerHTML='';
  }
  
}
