'use strict';

var Plus = {

  bolt: function () {
    $('section#chat nav#plus').removeClass('show');
    var to = $('section#chat').data('jid');
    var index = Accounts.find($('section#main').data('user'), $('section#main').data('provider'));
    var account = App.accounts[index];
    if (to && App.online && account.connector.connection.connected){
      if (account.supports('bolt')) {
        account.connector.attention.request(to);
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
          type: ['image/png', 'image/jpg', 'image/jpeg']
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
  
  rtc: function (constraints) {
    
  }
  
}
