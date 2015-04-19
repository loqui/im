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
        'nickChange', 'statusChange', 'presence', 'mucCreate', 'readReceipts'],
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
        host: 'https://bosh.loqui.im/',
        timeout: 300
      },
      autodomain: false,
      features: ['multi', 'vcard', 'presence', 'easyAvatars', 'rosterMgmt', 
        'avatarChange', 'attention', 'csn', 'delay', 'time', 'statusChange', 
        'show', 'muc', 'mucCreate', 'mucJoin', 'receipts', 'federation', 
        'time'],
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
