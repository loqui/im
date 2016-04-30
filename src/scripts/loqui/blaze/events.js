/* global App, Providers, Accounts, Menu, Chungo, Activity, Lungo, VoiceRecorder, Messenger, Tools */

'use strict';

Template.settings_features.events({
  'click li': function (e, t) {
    var settings = App.settings;
    var li = $(e.target).closest('li')[0];
    var key = li.dataset.key;
    var newVal = li.dataset.value == 'true' ? false : true;

    if (!li.dataset.type || li.dataset.type == 'switch') {
      settings[key] = newVal;
      App.settings = settings;
    }
  }
});

Template.settings_selects.events({
  'blur li>select': function (e, t) {
    var settings = App.settings;
    var li = $(e.target).closest('li')[0];
    var select = $('select', li)[0];
    var key = li.dataset.key;
    var newVal = select.children[select.selectedIndex].value;

    if (settings[key].value != newVal) {
      settings[key].value = newVal;
      App.settings = settings;

      if (App.events[key]) {
        App.events[key](newVal);
      }
    }
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
  'click button, change select, blur input[name="user"]': function (e, t) {
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
      delete $('section#chat')[0].dataset.jid;
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

Template.footbox.events({
  'touchstart button.voice' : function(e) {
    VoiceRecorder.start();
  },

  'click button.voice' : function(e) {
    var to = $('section#chat')[0].dataset.jid;
    var account = Accounts.current;

    VoiceRecorder.getBlob().then(recording => {
      if (recording && recording.duration > 0) {
        account.connector.fileSend(to, recording.blob);
      }
    });
  },

  'click [data-menu-onclick]' : function (e) {
    var menu = e.target.dataset.menuOnclick;

    Menu.show(menu, e.target);
  },

  'keydown #text' : function (e) {
    if (e.which == 13 && App.settings.sendOnEnter) {
      e.preventDefault();
      Messenger.say();

    } else if (e.which == 8 || e.which == 46) {
      // if user wants to hide keyboard in landscape
      // user can clear the box and press backspace to hide it
      if (e.target.textContent.length === 0 && e.which == 8 && window.matchMedia('(orientation:landscape)').matches) {
        $('section#chat article#main span#text').blur();
      }
    }
  },

  'keydown span#text' : Tools.throttle(function(e){
    var dirtyState = $('#footbox')[0].dataset.dirty;
    var newDirtyState = ((e.which === 8 && e.target.textContent.length > 1) || (e.which !== 8 && e.target.textContent.length >= 0));

    if (dirtyState !== newDirtyState.toString()) {
      $('#footbox')[0].dataset.dirty = newDirtyState;
    }

    if (newDirtyState) {
      Messenger.csn('composing');
    }

  }, 1500),

  'keyup #text' : Tools.debounce(function() {
    Messenger.csn('paused');
  }, 5000),

  'blur #text' : function(e) {
    Messenger.csn('paused');
  },

  'click #say' : () => Messenger.say(),

  'mousedown #say' : (e) => e.preventDefault()
});
