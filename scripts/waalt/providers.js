'use strict';

var Providers = {

  // Providers data
  data: {
    'whatsapp': {
      longName: 'WhatsApp',
      connector: {
        type: 'coseme'
      },
      lacks: ['attention', 'multi', 'presence', 'easyAvatars', 'csn', 'avatarChange', 'statusChange', 'rosterMgmt'],
      color: '#254242',
      terms: {
        user: 'YourNumber',
        country: 'YourCountry'
      },
      logForm: 'coseme',
      emoji: 'coseme'
    },
    'facebook': {
      longName: 'Facebook Chat',
      altname: 'Facebook',
      connector: {
        type: 'XMPP',
        host: 'wss://app.loqui.im/ws-bind/',
        timeout: 300
      },
      autodomain: 'chat.facebook.com',
      lacks: ['multi', 'avatarChange', 'statusChange', 'attention', 'rosterMgmt', 'receipts'],
      color: '#3D539F',
      terms: {
        user: 'ProviderUsername',
        pass: 'Password',
      },
      notice: true,
      emoji: 'XMPP'
    },
    'hangouts': {
      longName: 'Google Hangouts',
      altname: 'Gmail',
      connector: {
        type: 'XMPP',
        host: 'wss://app.loqui.im/ws-bind/',
        timeout: 300
      },
      autodomain: 'gmail.com',
      lacks: ['avatarChange', 'receipts'],
      color: '#4EA43B',
      terms: {
        user: 'ProviderAddress',
        pass: 'Password',
        placeholder: 'username@gmail.com'
      },
      notice: true,
      emoji: 'XMPP'
    },
    'nimbuzz': {
      longName: 'Nimbuzz',
      connector: {
        type: 'XMPP',
        host: 'wss://app.loqui.im/ws-bind/',
        timeout: 300
      },
      autodomain: 'nimbuzz.com',
      lacks: ['vcard', 'avatarChange', 'attention', 'receipts'],
      color: '#FF8702',
      terms: {
        user: 'Username',
        pass: 'Password'
      },
      emoji: 'XMPP'
    },
    'ovi': {
      longName: 'Nokia ovi',
      altname: 'ovi',
      connector: {
        type: 'XMPP',
        host: 'wss://app.loqui.im/ws-bind/',
        timeout: 300
      },
      autodomain: 'chat.ovi.com',
      lacks: ['avatarChange', 'attention', 'receipts'],
      color: '#39B006',
      terms: {
        user: 'Username',
        pass: 'Password'
      },
      emoji: 'XMPP'
    },
    'lync': {
      longName: 'Microsoft Lync',
      altname: 'Lync',
      connector: {
        type: 'XMPP',
        host: 'wss://app.loqui.im/ws-bind/',
        timeout: 300
      },
      autodomain: false,
      lacks: ['avatarChange', 'attention', 'receipts'],
      color: '#0071C5',
      terms: {
        user: 'ProviderAddress',
        pass: 'Password',
        placeholder: 'username@example.com'
      },
      emoji: 'XMPP'
    },
    'xmpp': {
      longName: 'XMPP/Jabber',
      connector: {
        type: 'XMPP',
        host: 'wss://app.loqui.im/ws-bind/',
        timeout: 300
      },
      autodomain: false,
      lacks: ['receipts'],
      color: '#149ED2',
      terms: {
        user: 'FullJID',
        pass: 'Password',
        placeholder: 'username@example.com'
      },
      emoji: 'XMPP'
    }
  },
  
  // Dinamically prints the provider list
  list: function () {
    var ul = $('section#providers ul');
    for (var provider in this.data) {
      var data = this.data[provider];
      var li = $('<li/>');
      var a = $('<a/>').data('view-section', provider);
      a.text(data.longName);
      var img = $('<img/>').attr('src', 'img/providers/' + provider + '.svg');
      a.prepend(img);
      li.append(a);
      ul.append(li);
      var section = $('<section/>').attr('id', provider).addClass('setup').data('transition', 'slide');
      var article = $('<article/>').addClass('simple form');
      App.logForms[data.connector.type](article, provider, data);
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
