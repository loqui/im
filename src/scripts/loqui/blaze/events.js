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
  'click .switch': function (e, t) {
    var status = $(e.target).closest('.cover')[0].dataset.value;
    Accounts.current.enabled = (status == 'false' || status == undefined);
  }
});

Template.accounts_list.events({
  'click li': function (e, t) {
    var index = $(e.target).data('accountIndex')
    $('#main header select').val(index);
    Accounts.current = index;
    //Chungo.Aside.hide();
  }
});

Template.chats.events({
  'click .noChats, click .floater': function (e, t) {
    var account = Accounts.current;
    Activity('chat', account, null, {
      chats: false,
      groups: account.supports('muc')
    });
  },
  'click li': function (e, t) {
    var jid = $(e.target).closest('li').data('jid');
    var account = Accounts.current;
    var chat = account.chatGet(jid);
    chat.show();
  }
});
