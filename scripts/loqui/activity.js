'use strict';

var Activity = function (action, account, content) {
  
  var actions = {
    chat: function (f, account, content) {
      account.contactsRender(f, function (t) {
        var chat = account.chatGet(t.dataset.jid, $(t).children('.name').text());
        Lungo.Router.section('back');
        chat.show();
      });
    },
    file: function (f, account, content) {
      account.contactsRender(f, function (t) {
        var jid = t.dataset.jid;
        var title = $(t).children('.name').text();
        var chat = account.chatGet(jid, title);
        for (var i in content.blobs) {
          var r = confirm(_('ConfirmMediaSend', {file: content.filenames[i], chat: title}));
          if (r) {
            if ('fileSend' in account.connector && account.supports(content.type.split('/')[0] + 'Send')) {
              account.connector.fileSend(jid, content.blobs[i]);
              Lungo.Router.section('back');
              chat.show();
            } else {
              Lungo.Notification.error(_('NoSupport'), _('XMPPisBetter'), 'exclamation-sign');
              Lungo.Router.section('back');
            }
          }
        }
      });
    }
  }
  
  var accountSelect = function (f) {
    var ul = document.createElement('ul');
    ul.classList.add('accounts');
    
    for (var [i, account] in Iterator(App.accounts)) {
      let li = document.createElement('li');
      let ai = i;

      let icon = document.createElement('img');
      icon.src = 'img/providers/squares/' + account.core.provider + '.svg';
      icon.classList.add('provIcon');

      let provider = document.createElement('span');
      provider.textContent = account.connector.provider.longName;
      provider.classList.add('provider');

      let name = document.createElement('span');
      let vCard = $(account.connector.vcard);
      let address = ( vCard.length && vCard.find('FN').length ) ? vCard.find('FN').text() : account.core.user;
      name.textContent = address;
      name.classList.add('jid');

      li.appendChild(icon);
      li.appendChild(provider);
      li.appendChild(name);
      
      li.addEventListener('click', function (e) {
        Activity(action, App.accounts[ai], content);
      });
      
      ul.appendChild(li);
    }
    f.appendChild(ul);
  }
  
  var f = document.createDocumentFragment();
  
  if (account) {
    if (action in actions) {
      actions[action](f, account, content);
    }
  } else {
    accountSelect(f);
  }
  
  var article = $('section#activity article').empty();
  article[0].appendChild(f);
  Lungo.Router.section('activity');
  
}

navigator.mozSetMessageHandler('activity', function(a) {
  if (a.source.name === "share") {
    console.log(a);
    var file = a.source.data;
    Activity('file', null, a.source.data);
  }
});
