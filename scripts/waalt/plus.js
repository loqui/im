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
        console.log('Sent a bolt to', to);
      } else {
        Lungo.Notification.error(_('NoSupport'), _('XMPPisBetter', 'exclamation-sign'));
      }
    }
  },
  
  emoji: function (emoji) {
    Lungo.Router.article('chat', 'main');
    Messenger.say(emoji);
  },
  
  rtc: function (constraints) {
    
  }
  
}
