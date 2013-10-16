'use strict';

var Providers = {

  // Providers data
  data: {
    'hangouts': {
      longname: 'Google Hangouts',
      altname: 'Gmail',
      BOSH: {
        host: 'https://app.loqui.im/http-bind/',
        timeout: 300
      },
      autodomain: 'gmail.com',
      lacks: ['avatarChange'],
      color: '#4EA43B',
      terms: {
        user: 'ProviderAddress',
        pass: 'Password',
        placeholder: 'username@gmail.com'
      },
      notice: true,
      connector: 'XMPP'
    },
    'facebook': {
      longname: 'Facebook Chat',
      altname: 'Facebook',
      BOSH: {
        host: 'https://app.loqui.im/http-bind/',
        timeout: 300
      },
      autodomain: 'chat.facebook.com',
      lacks: ['multi', 'avatarChange', 'statusChange', 'attention', 'rosterMgmt'],
      color: '#3D539F',
      terms: {
        user: 'ProviderUsername',
        pass: 'Password',
      },
      notice: true,
      connector: 'XMPP'
    },
    'nimbuzz': {
      longname: 'Nimbuzz',
      BOSH: {
        host: 'https://app.loqui.im/http-bind/',
        timeout: 300
      },
      autodomain: 'nimbuzz.com',
      lacks: ['vcard', 'avatarChange', 'attention'],
      color: '#FF8702',
      terms: {
        user: 'Username',
        pass: 'Password'
      },
      connector: 'XMPP'
    },
    'ovi': {
      longname: 'Nokia ovi',
      altname: 'ovi',
      BOSH: {
        host: 'https://app.loqui.im/http-bind/',
        timeout: 300
      },
      autodomain: 'chat.ovi.com',
      lacks: ['avatarChange', 'attention'],
      color: '#39B006',
      terms: {
        user: 'Username',
        pass: 'Password'
      },
      connector: 'XMPP'
    },
    'lync': {
      longname: 'Microsoft Lync',
      altname: 'Lync',
      BOSH: {
        host: 'https://app.loqui.im/http-bind/',
        timeout: 300
      },
      autodomain: false,
      lacks: ['avatarChange', 'attention'],
      color: '#0071C5',
      terms: {
        user: 'ProviderAddress',
        pass: 'Password',
        placeholder: 'username@example.com'
      },
      connector: 'XMPP'
    },
    'xmpp': {
      longname: 'XMPP/Jabber',
      BOSH: {
        host: 'https://app.loqui.im/http-bind/',
        timeout: 300
      },
      autodomain: false,
      color: '#149ED2',
      terms: {
        user: 'FullJID',
        pass: 'Password',
        placeholder: 'username@example.com'
      },
      connector: 'XMPP'
    }
  },
  
  // Dinamically prints the provider list
  list: function () {
    var ul = $('section#providers ul');
    for (var provider in this.data) {
      var data = this.data[provider];
      var li = $('<li/>');
      var a = $('<a/>').data('view-section', provider);
      a.text(data.longname);
      var img = $('<img/>').attr('src', 'img/providers/' + provider + '.svg');
      a.prepend(img);
      li.append(a);
      ul.append(li);
      var section = $('<section/>').attr('id', provider).addClass('setup').data('transition', 'slide');
      var article = $('<article/>').addClass('simple form')
        .append($('<h1/>').style('color', data.color).html(_('SettingUp', { provider: data.longname })))
        .append($('<img/>').attr('src', 'img/providers/' + provider + '.svg'))
        .append($('<label/>').attr('for', 'user').text(_(data.terms['user'], { provider: data.altname })))
        .append($('<input/>').attr('type', 'text').attr('name', 'user').attr('placeholder', (data.terms.placeholder || _(data.terms['user'], { provider: data.altname }) )))
        .append($('<label/>').attr('for', 'pass').text(_(data.terms['pass'])))
        .append($('<input/>').attr('type', 'password').attr('name', 'pass').attr('placeholder', '******'))
      if (data.notice) {
        article.append($('<small/>').text(_(provider + 'Notice')));
      }
      var buttongroup = $('<div/>').addClass('buttongroup');
      var submit = $('<button/>').data('role', 'submit').style('background-color', data.color).text(_('LogIn'));
      var back = $('<button/>').data('view-section', 'back').text(_('GoBack'));
      submit.bind('click', function () {
        var article = this.parentNode.parentNode;
        var provider = article.parentNode.id;
        var user = $(article).children('[name="user"]').val();
        user = Providers.autoComplete(user, provider);
        var pass = $(article).children('[name="pass"]').val();
        if (user && pass) {
          var account = new Account({
            user: user,
            pass: pass,
            provider: provider,
            resource: App.defaults.Account.core.resource,
            chats: [],
          });
          account.test();
        }
      });
      buttongroup.append(submit).append(back);
      article.append(buttongroup);
      section.append(article);
      $('body').append(section);
    }
  },
  
  // Autocompletes adresses with default domain names
  autoComplete: function (user, provider) {
    var bits = user.split('@');
    var autodomain = Providers.data[provider].autodomain;
    if (autodomain) {
      user = bits.length > 1 ? (bits[0] + '@' + autodomain) : (user + '@' + autodomain);
    }
    return user;
  }

};
