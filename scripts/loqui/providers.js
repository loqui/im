'use strict';

var Providers = {

  // Providers data
  data: {
    'whatsapp': {
      longName: 'WhatsApp',
      connector: {
        type: 'coseme'
      },
      features: ['localContacts', 'receipts', 'imageSend', 'videoSend', 
        'audioSend', 'locationSend', 'pay', 'muc', 'csn', 'avatarChange', 
        'statusChange', 'presence', 'mucCreate'],
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
        host: 'https://bosh.loqui.im/',
        timeout: 300
      },
      autodomain: 'chat.facebook.com',
      features: ['vcard', 'presence', 'easyAvatars', 'csn'],
      color: '#3D539F',
      terms: {
        user: 'ProviderUsername',
        pass: 'Password',
        userInputType: 'text'
      },
      notice: true,
      emoji: 'FB'
    },
    'hangouts': {
      longName: 'Google Hangouts',
      altname: 'Gmail',
      connector: {
        type: 'XMPP',
        host: 'https://bosh.loqui.im/',
        timeout: 300
      },
      autodomain: 'gmail.com',
      features: ['multi', 'presence', 'vcard', 'easyAvatars', 'avatarChange', 
        'rosterMgmt', 'csn', 'delay', 'statusChange', 'attention', 'show'],
      color: '#4EA43B',
      terms: {
        user: 'ProviderAddress',
        pass: 'Password',
        placeholder: 'username@gmail.com',
        userInputType: 'email'
      },
      notice: true,
      emoji: 'GTALK'
    },
    'nimbuzz': {
      longName: 'Nimbuzz',
      connector: {
        type: 'XMPP',
        host: 'https://bosh.loqui.im/',
        timeout: 300
      },
      autodomain: 'nimbuzz.com',
      features: ['multi', 'presence', 'easyAvatars', 'csn'],
      color: '#FF8702',
      terms: {
        user: 'Username',
        pass: 'Password',
        userInputType: 'text'
      },
      emoji: 'XMPP'
    },
    'ovi': {
      longName: 'Nokia ovi',
      altname: 'ovi',
      connector: {
        type: 'XMPP',
        host: 'https://bosh.loqui.im/',
        timeout: 300
      },
      autodomain: 'chat.ovi.com',
      features: ['multi', 'presence', 'easyAvatars', 'csn'],
      color: '#39B006',
      terms: {
        user: 'Username',
        pass: 'Password',
        userInputType: 'text'
      },
      emoji: 'XMPP'
    },
    
    'lync': {
      longName: 'Microsoft Lync',
      altname: 'Lync',
      connector: {
        type: 'XMPP',
        host: 'https://bosh.loqui.im/',
        timeout: 300
      },
      autodomain: false,
      features: ['multi', 'presence', 'easyAvatars', 'csn'],
      color: '#0071C5',
      terms: {
        user: 'ProviderAddress',
        pass: 'Password',
        placeholder: 'username@example.com',
        userInputType: 'email'
      },
      emoji: 'XMPP'
    },
    'xmpp': {
      longName: 'XMPP/Jabber',
      connector: {
        type: 'XMPP',
        host: 'wss://websockets.loqui.im/',
        timeout: 300
      },
      autodomain: false,
      features: ['multi', 'vcard', 'presence', 'easyAvatars', 'rosterMgmt', 
        'avatarChange', 'attention', 'csn', 'delay', 'time', 'statusChange', 
        'show', 'muc', 'mucCreate', 'mucJoin', 'receipts', 'federation'],
      color: '#149ED2',
      terms: {
        user: 'FullJID',
        pass: 'Password',
        placeholder: 'username@example.com',
        userInputType: 'email'
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
      li.on('click', function (e) {
        Lungo.Router.section(e.target.dataset.viewSection);      
      });
      ul.append(li);
      var section = $('<section/>').attr('id', provider).addClass('setup')
        .data('transition', 'horizontal');
      var article = $('<article/>').addClass('headless simple form show');
      App.logForms[data.connector.type](article, provider, data);
      section.append(article);
      section.find('[data-view-section]').each(function () {
        $(this).on('click', function (e) {
          Lungo.Router.section(e.target.dataset.viewSection);      
        });
      });
      section.find('[data-menu-onclick]').each(function () {
        var menu = $(this).data('menu-onclick');
        $(this).on('click', function (e) {
          Menu.show(menu, this);
        });
      });
      $('body').append(section);
    }
  },
  
  // Autocompletes adresses with default domain names
  autoComplete: function (user, provider) {
    var bits = user.split('@');
    var autodomain = Providers.data[provider].autodomain;
    if (autodomain) {
      user = bits.length > 1 ? 
        (bits[0] + '@' + autodomain) : 
        (user + '@' + autodomain);
    }
    return user;
  }

};
