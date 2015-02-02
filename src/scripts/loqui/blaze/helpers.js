/* global App, Providers, UI, Accounts, Tools */

'use strict';

Template.settings_features.helpers({
  settings: function () {
    var settings = [];
    for (var [key, value] in Iterator(App.settings)) {
      settings.push({
        key: key, 
        value: value,
        caption: _('Set' + key)
      });
    }
    return settings;
  }
});

Template.settings_devmode.helpers({
  settings: function () {
    var settings = [];
    for (var [key, value] in Iterator(App.devsettings)) {
      settings.push({
        key: key, 
        value: value,
        caption: _('Set' + key)
      });
    }
    return settings;
  }
});


Template.providers_setup.helpers({
  form: function (provider) {
    var article = $('<article/>').addClass('headless simple form show');
    var data = Providers.data[provider];
    article.append(App.logForms[data.connector.type](provider, article).html);
    return article[0].outerHTML;
  }
});

UI.registerHelper('app', function () {
  return App;
});

UI.registerHelper('chats', function () {
  if (App.accounts.length) {
    return [].concat(Accounts.current.chats).reverse();
  }
});

UI.registerHelper('accounts', function () {
  return App.accounts.map(function(x, i) {
    return {
      data: x,
      index: i,
      enabled: App.online && x.enabled
    };
  });
});

UI.registerHelper('account', function () {
  var current = Accounts.current;
  if (current) {
    return $.extend(current, {
      othersUnread: App.unread - current.unread
    });
  }
});

UI.registerHelper('providers', function () {
  var providers = [];
  for (var [key, value] in Iterator(Providers.data)) {
    providers.push({
      key: key, 
      value: value
    });
  }
  return providers;
});

UI.registerHelper('_', function (string, data) {
  return _(string, {app: data});
});

UI.registerHelper('emojify', function (string) {
  return App.emoji[Providers.data[Accounts.current.core.provider].emoji].fy(string);
});

UI.registerHelper('ago', function (ts) {
  var string = '';
  if (ts) {
    var now = new Date();
    var then = Tools.unstamp(ts);
    var diff = now - then;
    if (diff < 60000) {
      string = 'right now';
    } else if (diff < 3600000) {
      string = Math.floor(diff / 60000) + ' min.';
    } else if (diff < 7200000) {
      string = '1 hour';
    } else if (now.toLocaleDateString() == then.toLocaleDateString()) {
      string = Math.floor(diff / 3600000) + ' hours';
    } else {
      string = then.toLocaleDateString() + '@' + then.toLocaleTimeString().split(':').slice(0, 2).join(':');
    }
  }
  return string;
});

UI.registerHelper('date', function (ts) {
  var string = '';
  if (ts) {
    var day = Tools.day(ts);
    var today = Tools.day(Tools.localize(Tools.stamp()));
    string =
      day.toString() == today.toString()
      ?
        _('Today')
      :
        _('DateFormat', {day: day[2], month: day[1]});
  }
  return string;
});

UI.registerHelper('time', function (ts) {
  var string = '';
  if (ts) {
    string = Tools.hour(ts);
  }
  return string;
});

UI.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

