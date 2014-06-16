'use strict';

var Activity = function (action, account, content, options) {
  
  var options = options || {};

  $.extend(options, {
    chats: (options && 'chats' in options) ? options.chats : true,
    groups: (options && 'groups' in options) ? options.groups : true
  });
  
  var actions = {
    chat: function (f, account, content) {
      var click = function (t) {
        var chat = account.chatGet(t.dataset.jid, $(t).children('.name').text());
        Lungo.Router.section('back');
        account.show();
        chat.show();
        if (content) {
          $('#main #footbox #text').text(content).trigger('keydown');
        }
      }
      if (options.chats) {
        account.chatsRender(f, click);
      }
      account.contactsRender(f, click);
      if (options.groups) {
        account.groupsRender(f, click);
      }
    },
    file: function (f, account, content) {
      var click = function (t) {
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
      }
      if (options.chats) {
        account.chatsRender(f, click);
      }
      account.contactsRender(f, click);
      if (options.groups) {
        account.groupsRender(f, click);
      }
    },
    invite: function (f, account, content, options) {
      var click = function (t) {
        var t = $(t);
        t.toggleClass('selected');
        content(t.data('jid'), t.find('.name').text());
      }
      account.contactsRender(f, click, options.selected);
    }
  }
  
  var accountSelect = function (f, title) {
    var article = document.createElement('article');
    article.id = 'accounts';
    var ul = document.createElement('ul');
    ul.classList.add('accounts');
    title = _('Accounts');
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
        Activity(action, App.accounts[ai], content, options);
      });
      ul.appendChild(li);
      article.appendChild(ul);
    }
    f.appendChild(article);
  }
  
  var t = '';
  var f = document.createDocumentFragment();
  var section = $('section#activity');
  var article = section.children('article').empty();
  section.children('article').remove();
  
  if (account) {
    if (action in actions) {
      actions[action](f, account, content, options);
      section[0].appendChild(f);
      section.find('h1').first().text(_('Action' + action));
      section.addClass('extended');
      if (options.groups) {
        section.find('[data-view-article="groups"]').show();
      } else {
        section.find('[data-view-article="groups"]').hide();
      }
      if (options.chats) {
        section.find('[data-view-article="chats"]').show();
        section.find('[data-view-article="chats"]').trigger('click');
      } else {
        section.find('[data-view-article="chats"]').hide();
        section.find('[data-view-article="contacts"]').trigger('click');
      }
    } else {
      Tools.log('No such action!');
    }
  } else {
    accountSelect(f, t);
    section[0].appendChild(f);
    section.find('h1').first().text(t);
    section.removeClass('extended');
    Lungo.Router.article('activity', 'accounts');
  }
  
  Lungo.Router.section('activity');
  
}

if ('mozSetMessageHandler' in navigator) {
  navigator.mozSetMessageHandler('activity', function(a) {
    if (a.source.name === 'share') {
      var file = a.source.data;
      Activity('file', null, file, null);
    }
  });
}
