'use strict';

var Activity = function (action, account, content) {
  
  var actions = {
    chat: function (f, account, content) {
      account.contactsRender(f);
    }
  }
  
  var accountSelect = function (f) {
    var ul = document.createElement('ul');
    ul.classList.add('accounts');
    
    for (let [i, account] in Iterator(App.accounts)) {
      let li = document.createElement('li');

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
        Activity(action, App.accounts[i], content);
      });
      
      ul.appendChild(li);
    }
    f.appendChild(ul);
  }
  
  var f = document.createDocumentFragment();
  
  if (account) {
    actions[action](f, account, content);
  } else {
    accountSelect(f);
  }
  
  var article = $('section#activity article').empty();
  article[0].appendChild(f);
  Lungo.Router.section('activity');
  
}
