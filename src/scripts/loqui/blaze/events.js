/* global App, Providers, Accounts, Menu, Chungo, Activity, Lungo */

'use strict';

Template.settings_features.events({
  'click li': function (e, t) {
    var settings = App.settings;
    var li = $(e.target).closest('li')[0];
    var key = li.dataset.key;
    var newVal = li.dataset.value == 'true' ? false : true;
    settings[key] = newVal;
    App.settings = settings;
  }
});

Template.settings_devmode.events({
  'click li': function (e, t) {
    var settings = App.devsettings;
    var li = $(e.target).closest('li')[0];
    var key = li.dataset.key;
    var newVal = li.dataset.value == 'true' ? false : true;
    settings[key] = newVal;
    App.devsettings = settings;
  }
});

Template.providers_setup.events({
  'click button, change select': function (e, t) {
    var target = $(e.target);
    if (target.hasClass('back')) {
      Lungo.Router.article('back');
    } else {
      var provider = target.closest('section')[0].id;
      App.logForms[Providers.data[provider].connector.type](provider).events(target);
    }
  }
});

Template.account_header.events({
  'change select': function (e, t) {
    Accounts.current = $(e.target).val();
  }
});

Template.account_cover.events({
  'click': function (e, t) {
    Menu.show('me');
  }
});

Template.accounts_list.events({
  'click li': function (e, t) {
    var closestSwitch = $(e.target).closest('.switch');
    var li = $(e.target).closest('li')[0];
    var index = li.dataset.accountIndex;
    if (closestSwitch.length > 0) {
      var status = li.dataset.value;
      App.accounts[index].enabled = (status == 'false' || status === undefined);
    } else {
      $('#main header select').val(index);
      Accounts.current = index;
      Chungo.Aside.hide();    
    }
  }
});

Template.chats.events({
  'click .noChats, click .floater': function (e, t) {
    var account = Accounts.current;
    Activity('chat', account, null, {
      chats: false,
      groups: account.supports('muc')
    });
  }
});
