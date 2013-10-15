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
      var li = $('<li><a data-view-section="' + provider + '"><img src="img/providers/' + provider + '.svg" />' + data.longname + '</a></li>');
      ul.append(li);
      var section = $('<section id="' + provider + '" class="setup" data-transition="slide"><article class="simple form"></article></section>');
      var article = section.children('article');
      article.append('<h1 style="color: ' + data.color + '" >' + _('SettingUp', { provider: data.longname }) + '</h1>'
        + '<img src="img/providers/' + provider + '.svg" />'
        + '<label for="user">' + _(data.terms['user'], { provider: data.altname }) + '</label><input type="text" name="user" placeholder="' + (data.terms.placeholder || _(data.terms['user'], { provider: data.altname }) ) + '" required />'
        + '<label for="pass">' + _(data.terms['pass']) + '</label><input type="password" name="pass" placeholder="******" required />'
      );
      if (data.notice) {
        article.append('<small>' + _(provider + 'Notice') + '</small>');
      }
      var buttongroup = $('<div class="buttongroup"></div>');
      var back = $('<button data-view-section="back">' + _('GoBack') + '</button>');
      var submit = $('<button data-role="submit" style="background-color: ' + data.color + '">' + _('LogIn') + '</button>');
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
      buttongroup.append(back).append(submit);
      article.append(buttongroup);
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
