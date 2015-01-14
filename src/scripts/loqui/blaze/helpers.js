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

UI.registerHelper('chats', function () {
  if (App.accounts.length) {
    return Accounts.current.chats;
  }
});

UI.registerHelper('accounts', function () {
  return App.accounts.map(function(x, i) {
    return {data: x, index: i}
  });
});

UI.registerHelper('account', function () {
  return Accounts.current;
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

UI.registerHelper('_', function (string) {
  return _(string);
});

UI.registerHelper('dateFormat', function (stamp) {
  return Tools.coolDate(stamp);
});
