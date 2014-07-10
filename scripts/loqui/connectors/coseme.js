'use strict';

App.connectors['coseme'] = function (account) {

  var Yowsup = CoSeMe.yowsup;
  var SI = Yowsup.getSignalsInterface();
  var MI = Yowsup.getMethodsInterface();
  
  this.account = account;
  this.provider = Providers.data[account.core.provider];
  this.presence = {
    show: this.account.core.presence ? this.account.core.presence.show : App.defaults.Connector.presence.show,
    status: this.account.core.presence ? this.account.core.presence.status : App.defaults.Connector.presence.status
  };
  this.handlers = {};
  this.events = {}
  this.chat = {};
  this.contacts = {};
  this.muc = {
    membersCache: []
  };
  this.connected = false;
  this.failStamps = [];
  
  this.connect = function (callback) {
    var callback = callback;
    var method = 'auth_login';
    var params = [this.account.core.data.login, this.account.core.data.pw];
    SI.registerListener('auth_success', function() {
      Tools.log("CONNECTED");
      this.connected = true;
      this.account.core.fullJid = CoSeMe.yowsup.connectionmanager.jid;
      callback.connected();
    }.bind(this));
    SI.registerListener('auth_fail', function() {
      Tools.log("AUTH FAIL");
      this.connected = false;
      callback.authfail();
    }.bind(this));
    SI.registerListener('disconnected', function () {
      if (callback.disconnected) {
        callback.disconnected();
      }
    });
    MI.call(method, params);
    callback.connecting();
  }
  
  this.disconnect = function () {
    this.connected = false;
    var method = 'disconnect';
    var params = ['undefined'];
    MI.call(method, params);
  }
  
  this.isConnected = function () {
    return App.online && this.connected;
  }
  
  this.start = function () {
    Tools.log('CONNECTOR START');
    this.handlers.init();
    this.presence.set();
  }
  
  this.sync = function (callback) {
    var getStatusesAndPics = function () {
      var contacts = this.account.core.roster.map(function(e){return e.jid;});
      MI.call('contacts_getStatus', [contacts]);
      this.avatar(null, [contacts]);
    }.bind(this);
    if (!('roster' in this.account.core) || !this.account.core.roster.length) {
      this.contacts.sync(function () {
        callback(getStatusesAndPics);
      });
    } else {
      callback(getStatusesAndPics);
    }
  }.bind(this);
  
  
  this.contacts.sync = function (cb) {
    if (App.online) {
      Tools.log('SYNCING CONTACTS');
      Lungo.Notification.show('download', _('Synchronizing'), 5);
      var account = this.account;
      var contacts = this.contacts;
      contacts._pre = [];
      var allContacts = navigator.mozContacts.getAll({sortBy: 'givenName', sortOrder: 'ascending'});
      allContacts.onsuccess = function (event) {
        if (this.result) {
          try {
            var result = this.result;
            var fullname = (result.givenName[0] 
              ? result.givenName[0] + ' ' + (result.familyName 
                ? (result.familyName[0] || '') : 
                ''
              ) 
              : (result.familyName ? 
                  result.familyName[0] 
                : (result.tel 
                  ? result.tel[0] 
                  : ''
                )
              )).trim();
            if (result.tel) {
              for (var i = 0; i < result.tel.length; i++) {
                contacts._pre[result.tel[i].value] = fullname;
              }
            }
          } catch (e) {
            Tools.log('CONTACT NORMALIZATION ERROR:', e);
          }
          this.continue();
        } else if (cb){
          Tools.log('CONTACT ACQUIRE ERROR');
          MI.call('contacts_sync', [Object.keys(contacts._pre)]);
          contacts._cb = cb;
        }
      }
      allContacts.onerror = function (event) {
        Tools.log('CONTACTS ERROR:', event);
        Lungo.Notification.error(_('ContactsGetError'), _('ContactsGetErrorExp'), 'exclamation-sign', 5);
        cb();
      }
    } else {
      Lungo.Notification.error(_('ContactsGetError'), _('NoWhenOffline'), 'exclamation-sign', 5);
    }
  }.bind(this);
  
  this.contacts.order = function (cb) {
    this.account.core.roster.sort(function (a,b) {
      var aname = a.name ? a.name : a.jid;
      var bname = b.name ? b.name : b.jid;
      return aname > bname;
    });
    if (cb) {
      cb();
    }
  }.bind(this);
  
  this.contacts.remove = function () {
  }
    
  this.presence.get = function (jid) {
    var method = 'presence_request';
    MI.call(method, [jid]);
  }
  
  this.presence.set = function (show, status) {
    this.presence.show = show || this.presence.show;
    this.presence.status = status || this.presence.status;
    this.presence.send();
    this.account.core.presence = {
      show: this.presence.show,
      status: this.presence.status
    }
    this.account.save();
  }.bind(this);
  
  this.presence.send = function (show, status, priority) {
    var show = show || this.presence.show;
    var status = status || this.presence.status;
    var priority = priority || '127';
    if (App.online) {
      var method = {
        a: 'presence_sendAvailable',
        away: 'presence_sendUnavailable',
        xa: 'presence_sendUnavailable',
        dnd: 'presence_sendUnavailable',
        chat: 'presence_sendAvailableForChat'
      };
      MI.call(method[show], []);
      MI.call('profile_setStatus', [status]);
    }
  }.bind(this);
  
  this.send = function (to, text, options) {
    var method = 'message_send';
    var params = [to, text];
    return MI.call(method, params);
  }.bind(this);
  
  this.ack = function (id, from) {
    MI.call('message_ack', [from, id]);
  }
  
  this.avatar = function (callback, id) {
    var method = 'picture_getIds';
    var params = id instanceof Array ? id : [[id || this.account.core.fullJid]];
    MI.call(method, params);
    if (callback) {
      callback(new Avatar({url: 'img/foovatar.png'}));
    }
  }.bind(this);
  
  this.muc.avatar = function (callback, id) {
    var method = 'group_getPicture';
    MI.call(method, [id]);
    if (callback) {
      callback(new Avatar({url: 'img/goovatar.png'}));
    }
  }
  
  this.emojiRender = function (img, emoji) {
    App.emoji[Providers.data[this.account.core.provider].emoji].render(img, emoji);
  }.bind(this);
  
  this.csnSend = function (to, state) {
    var method = state == 'composing' ? 'typing_send' : 'typing_paused';
    MI.call(method, [to]);
  }
  
  this.groupsGet = function (type) {
    var method = 'group_getGroups';
    MI.call(method, [type]);
  }
  
  this.muc.participantsGet = function (jid) {
    var method = 'group_getParticipants';
    MI.call(method, [jid]);
  }.bind(this)
  
  this.muc.create = function (subject, server, members) {
    var method = 'group_create';
    var idx = MI.call(method, [subject]);
    this.muc.membersCache[idx] = members;
  }.bind(this)
  
  this.muc.expel = function (gid, jid) {
    var [method, params] = jid ? 
      ['group_removeParticipants', [gid, jid]] :
      ['group_end', [gid]];
    MI.call(method, params);
  }.bind(this);
  
  this.muc.invite = function (gid, members, title) {
    var method = 'group_addParticipants';
    MI.call(method, [gid, members]);
  }.bind(this)
  
  this.fileSend = function (jid, blob) {
    var reader = new FileReader;
    reader.addEventListener("loadend", function () {
      var aB64Hash = CryptoJS.SHA256(reader.result).toString(CryptoJS.enc.Base64);
      var aT = blob.type.split("/")[0];
      var aSize = blob.size;
      var type = blob.type;
      Tools.blobToBase64(blob, function (aB64OrigHash) {
        Store.cache[aB64Hash] = {
          to: jid,
          data: aB64OrigHash
        };
        Tools.log('TEMP_STORING', aB64Hash, Store.cache[aB64Hash].data);
        Lungo.Notification.show('up-sign', _('Uploading'), 3);
        var method = 'media_requestUpload';
        MI.call(method, [aB64Hash, aT, aSize]);
      });
    });
    reader.readAsBinaryString(blob);
  }
  
  this.locationSend = function (jid, loc) {
    var self = this;
    Tools.locThumb(loc, 120, 120, function (thumb) {
      var method = 'message_locationSend';
      MI.call(method, [jid, loc.lat, loc.long, thumb]);
      self.addMediaMessageToChat('url', thumb, 'https://maps.google.com/maps?q=' + loc.lat + ',' + loc.long, account.core.user, jid, Math.floor((new Date).getTime() / 1000) + '-1');
      App.audio('sent');
    });
  }
  
  this.avatarSet = function (blob) {
    function UrlToBin (url, cb) {
      var reader = new FileReader();
      reader.addEventListener('loadend', function() {
        cb(reader.result);
      });
      reader.readAsBinaryString(Tools.b64ToBlob(url.split(',').pop(), 'image/jpg'));
    }
    Tools.picThumb(blob, 480, 480, function (url) {
      UrlToBin(url, function (bin) {
        var picBin = bin;
        Tools.picThumb(blob, 96, 96, function (url) {
          UrlToBin(url, function (bin) {
            var thumbBin = bin;
            var method = 'profile_setPicture';
            MI.call(method, [thumbBin, picBin]);
          });
        });
      });
    });
  }
  
  this.handlers.init = function () {
    Tools.log('HANDLERS INIT');
    var signals = {
      auth_success: null,
      auth_fail: null,
      message_received: this.events.onMessage,
      image_received: this.events.onImageReceived,
      vcard_received: null,
      video_received: this.events.onVideoReceived,
      audio_received: this.events.onAudioReceived,
      location_received: this.events.onLocationReceived,
      message_error: this.events.onMessageError,
      receipt_messageSent: this.events.onMessageSent,
      receipt_messageDelivered: this.events.onMessageDelivered,
      receipt_visible: this.events.onMessageVisible,
      receipt_broadcastSent: null,
      status_dirty: this.events.onStatusDirty,
      presence_updated: this.events.onPresenceUpdated,
      presence_available: this.events.onPresenceAvailable,
      presence_unavailable: this.events.onPresenceUnavailable,
      group_subjectReceived: null,
      group_createSuccess: this.events.onGroupCreateSuccess,
      group_createFail: null,
      group_endSuccess: this.events.onGroupEndSuccess,
      group_gotInfo: this.events.onGroupGotInfo,
      group_infoError: this.events.onGroupInfoError,
      group_addParticipantsSuccess: this.events.onGroupAddParticipantsSuccess,
      group_removeParticipantsSuccess: this.events.onGroupRemoveParticipantsSuccess,
      group_gotParticipants: this.events.onGroupGotParticipants,
      group_setSubjectSuccess: null,
      group_messageReceived: this.events.onGroupMessage,
      group_imageReceived: this.events.onGroupImageReceived,
      group_vcardReceived: null,
      group_videoReceived: this.events.onGroupVideoReceived,
      group_audioReceived: this.events.onGroupAudioReceived,
      group_locationReceived: this.events.onGroupLocationReceived,
      group_setPictureSuccess: null,
      group_setPictureError: null,
      group_gotPicture: this.events.onGroupGotPicture,
      group_gotGroups: null,
      group_gotParticipating: this.events.onGroupGotParticipating,
      notification_contactProfilePictureUpdated: this.events.onNotification,
      notification_contactProfilePictureRemoved: this.events.onNotification,
      notification_groupPictureUpdated: this.events.onNotification,
      notification_groupPictureRemoved: this.events.onNotification,
      notification_groupParticipantAdded: this.events.onNotification,
      notification_groupParticipantRemoved: this.events.onNotification,
      notification_status: this.events.onNotification,
      contact_gotProfilePictureId: this.events.onAvatar,
      contact_gotProfilePicture: this.events.onAvatar,
      contact_typing: this.events.onContactTyping,
      contact_paused: this.events.onContactPaused,
      contacts_gotStatus: this.events.onContactsGotStatus,
      contacts_sync: this.events.onContactsSync,
      profile_setPictureSuccess: this.events.onProfileSetPictureSuccess,
      profile_setPictureError: this.events.onProfileSetPictureError,
      profile_setStatusSuccess: this.events.onMessageDelivered,
      ping: this.events.onPing,
      pong: null,
      disconnected: null,
      media_uploadRequestSuccess: this.events.onUploadRequestSuccess,
      media_uploadRequestFailed: this.events.onUploadRequestFailed,
      media_uploadRequestDuplicate: this.events.onUploadRequestDuplicate
    };
    Object.keys(signals).forEach(function(signal) {
      var customCallback = signals[signal];
      if (customCallback) {
        Tools.log('REGISTER', signal, customCallback);
        Yowsup.connectionmanager.signals[signal].length = 0;
        SI.registerListener(signal, customCallback.bind(this));
      }
    }.bind(this));
  }.bind(this);

  this.events.onPing = function (idx) {
    MI.call('pong', [idx]);
  }
  
  this.events.onStatusDirty = function (categories) {
    var method = 'cleardirty';
    MI.call(method, [categories]);
  }
  
  this.events.onNotification = function (jid, msgId) {
    var method = 'notification_ack';
    MI.call(method, [jid, msgId]);
  }
  
  this.events.onMessage = function (msgId, from, msgData, timeStamp, wantsReceipt, pushName, isBroadcast) {
    Tools.log('MESSAGE', msgId, from, msgData, timeStamp, wantsReceipt, pushName, isBroadcast);
    var account = this.account;
    var from = from;
    var to = this.account.user + '@' + CoSeMe.config.domain;
    var body = msgData;
    if (body) {
      var date = new Date(timeStamp);
      var stamp = Tools.localize(Tools.stamp(stamp));
      var msg = new Message(account, {
        id: msgId,
        from: from,
        to: to,
        text: body,
        stamp: stamp
      });
      msg.receive();
      if (wantsReceipt) {
        this.ack(msgId, from);
      }
    }
    return true;
  }

  this.events.onMessageError = function (id, from, body, stamp, e, nick, g) {
    Tools.log('MESSAGE NOT RECEIVED', id, from, body, stamp, e, nick, g);
  }

  this.events.onImageReceived = function (msgId, fromAttribute, mediaPreview, mediaUrl, mediaSize, wantsReceipt, isBroadcast) {
    var to = this.account.core.fullJid;
    var isGroup = false;
    return this.mediaProcess('image', msgId, fromAttribute, to, mediaPreview, mediaUrl, mediaSize, isGroup);
  }

  this.events.onVideoReceived = function (msgId, fromAttribute, mediaPreview, mediaUrl, mediaSize, wantsReceipt, isBroadcast) {
    var to = this.account.core.fullJid;
    return this.mediaProcess('video', msgId, fromAttribute, to, mediaPreview, mediaUrl, mediaSize, false);
  }

  this.events.onAudioReceived = function (msgId, fromAttribute, mediaUrl, mediaSize, wantsReceipt, isBroadcast) {
    var to = this.account.core.fullJid;
    return this.mediaProcess('audio', msgId, fromAttribute, to, null, mediaUrl, mediaSize, false);
  }

  this.events.onLocationReceived = function (msgId, fromAttribute, name, mediaPreview, mlatitude, mlongitude, wantsReceipt, isBroadcast) {
    var to = this.account.core.fullJid;
    return this.mediaProcess('url', msgId, fromAttribute, to, [mlatitude, mlongitude, name], null, null, false);
  }
  
  this.events.onAvatar = function (jid, picId, blob) {
    var account = this.account;
    Tools.log(jid, picId, blob);
    if (blob) {
      if (jid == this.account.core.fullJid) {
        Tools.picThumb(blob, 96, 96, function (url) {
          $('section#main[data-jid="' + jid + '"] footer span.avatar img').attr('src', url);
          $('section#me .avatar img').attr('src', url);
          Store.save(url, function (index) {
            App.avatars[jid] = (new Avatar({id: picId, chunk: index})).data;
            App.smartupdate('avatars');
          });
        });
      } else {
        Tools.picThumb(blob, 96, 96, function (url) {
          $('ul[data-jid="' + account.core.fullJid + '"] [data-jid="' + jid + '"] span.avatar img').attr('src', url);
          $('section#chat[data-jid="' + jid + '"] span.avatar img').attr('src', url);
          var cb = function (index) {
            App.avatars[jid] = (new Avatar({id: picId, chunk: index})).data;
            App.smartupdate('avatars');
          }
          if (jid in App.avatars) {
            Store.update(App.avatars[jid].chunk, url, cb);
          } else {
            Store.save(url, cb);
          }
        });
      }
    } else {
      if (!(jid in App.avatars) || App.avatars[jid].id != picId) {
        var method = 'contact_getProfilePicture';
        var params = [jid || this.account.core.fullJid];
        MI.call(method, params);
      }
    }
  }

  this.events.onContactTyping = function (from) {
    if (from == $('section#chat').data('jid')) {
      $("section#chat #typing").show();
    }
  }

  this.events.onContactPaused = function (from) {
    if (from == $('section#chat').data('jid')) {
      $("section#chat #typing").hide();
    }
  }
  
  this.events.onMessageSent = function (from, msgId) {
    Tools.log('SENT', from, msgId);
  }

  this.events.onMessageDelivered = function (from, msgId) {
    var account = this.account;
    var chat = account.chatGet(from);
    chat.core.lastAck = Tools.localize(Tools.stamp());
    chat.save();
    var section = $('section#chat');
    if (section.hasClass('show') && section.data('jid') == from) {
      var li = section.find('ul li').last();
      section.find('span.lastACK').remove();
      li.append($('<span/>').addClass('lastACK')[0]);
    }
    Tools.log('DELIVERED', from, msgId);
    MI.call('delivered_ack', [from, msgId]);
  }
  
  this.events.onMessageVisible = function (from, msgId) {
    Tools.log('VISIBLE', from, msgId);
    MI.call('visible_ack', [from, msgId]);
  }

  this.events.onGroupInfoError = function (jid, owner, subject, subjectOwner, subjectTime, creation) {
    Tools.log('ERROR GETTING GROUP INFO', jid, owner, subject, subjectOwner, subjectTime, creation);
  }

  this.events.onGroupGotParticipating = function (groups, id) {
    for (let [i, group] in Iterator(groups)) {
      let account = this.account;
      let ci = account.chatFind(group.gid + '@g.us');
      if (ci >= 0) {
        let chat = account.chats[ci];
        let newTitle = group.subject;
        if (chat.core.title != newTitle) {
          chat.core.title = newTitle;
          chat.save(ci, true);
        }
      } else {
        MI.call('group_getInfo', [group.gid + '@g.us']);
      }
    }
  }

  this.events.onGroupGotInfo = function (jid, owner, subject, subjectOwner, subjectTime, creation) {
    var info = {
      owner: owner,
      subjectOwner: subjectOwner,
      subjectTime: subjectTime,
      creation: creation
    };
    var account = this.account;
    var ci = account.chatFind(jid);
    if (ci >= 0) {
      var chat = account.chats[ci];
      var newTitle = decodeURIComponent(subject);
      if (chat.core.title != newTitle) {
        chat.core.title = newTitle;
        chat.core.info = info;
        chat.save(ci, true);
      }
    } else {
      var chat = new Chat({
        jid: jid,
        title: decodeURIComponent(subject),
        muc: true,
        creation: creation,
        owner: owner,
        chunks: [],
        info: info
      }, account);
      account.chats.push(chat);
      account.core.chats.push(chat.core);
      chat.save(ci);
    }
  }
  
  this.events.onGroupGotPicture = function (jid, picId, blob) {
    var account = this.account;
    Tools.picThumb(blob, 96, 96, function (url) {
      $('ul[data-jid="' + account.core.fullJid + '"] li[data-jid="' + jid + '"] span.avatar img').attr('src', url);
      $('section#chat[data-jid="' + jid + '"] span.avatar img').attr('src', url);
      Store.save(url, function (index) {
        App.avatars[jid] = (new Avatar({id: picId, chunk: index})).data;
        App.smartupdate('avatars');
      });
    });
  }
  
  this.events.onGroupGotParticipants = function (jid, participants) {
    var account = this.account;
    var ci = account.chatFind(jid);
    if (ci >= 0) {
      var chat = account.chats[ci];
      if (!chat.core.participants || (JSON.stringify(chat.core.participants) != JSON.stringify(participants))) {
        chat.core.participants = participants;
        chat.save();
        if ($('section#chat').hasClass('show') && $('section#chat').data('jid') == chat.core.jid) {
          chat.show();
        }
      }
    }
  }
  
  this.events.onGroupAddParticipantsSuccess = function (jid, participants) {
    var account = this.account;
    var ci = account.chatFind(jid);
    if (ci >= 0) {
      var chat = account.chats[ci];
      chat.core.participants = chat.core.participants.concat(participants);
      chat.save();
      if ($('section#chat').hasClass('show') && $('section#chat').data('jid') == chat.core.jid) {
        chat.show();
      }
    }
  }
  
  this.events.onGroupRemoveParticipantsSuccess = function (jid, participants) {
    Lungo.Notification.success(_('Removed'), null, 'trash', 3);
  }
  
  this.events.onGroupEndSuccess = function (gid) {
    Lungo.Notification.success(_('Removed'), null, 'trash', 3);
  }
  
  this.events.onGroupCreateSuccess = function (gid, idx) {
    Lungo.Notification.show('download', _('Synchronizing'), 5);
    Lungo.Router.section('back');
    MI.call('group_getGroups', ['participating']);
    var members = this.muc.membersCache[idx];
    MI.call('group_addParticipants', [gid, members]);
    delete this.muc.membersCache[idx];
  }
  
  this.events.onGroupMessage = function (msgId, from, author, data, stamp, wantsReceipt, pushName) {
    Tools.log('GROUPMESSAGE', msgId, from, author, data, stamp, wantsReceipt, pushName);
    var account = this.account;
    var to = from;
    var from = author;
    var body = data;
    if (body) {
      var date = new Date(stamp);
      var stamp = Tools.localize(Tools.stamp(stamp));
      var msg = new Message(account, {
        from: from,
        to: to,
        text: body,
        stamp: stamp,
        pushName: pushName
      }, {
        muc: true
      });
      Tools.log('RECEIVED', msg);
      msg.receive();
      if (wantsReceipt) {
        this.ack(msgId, to);
      }
    }
    return true;
  }

  this.events.onGroupImageReceived = function (msgId, fromAttribute, author, mediaPreview, mediaUrl, mediaSize, wantsReceipt) {
    var to = fromAttribute;
    var fromAttribute = author;
    return this.mediaProcess('image', msgId, fromAttribute, to, mediaPreview, mediaUrl, mediaSize, wantsReceipt, true);
  }

  this.events.onGroupVideoReceived = function (msgId, fromAttribute, author, mediaPreview, mediaUrl, mediaSize, wantsReceipt) {
    var to = fromAttribute;
    var fromAttribute = author;
    return this.mediaProcess('video', msgId, fromAttribute, to, mediaPreview, mediaUrl, mediaSize, wantsReceipt, true);
  }

  this.events.onGroupAudioReceived = function (msgId, fromAttribute, author, mediaUrl, mediaSize, wantsReceipt) {
    var to = fromAttribute;
    var fromAttribute = author;
    return this.mediaProcess('audio', msgId, fromAttribute, to, null, mediaUrl, mediaSize, wantsReceipt, true);
  }

  this.events.onGroupLocationReceived = function (msgId, fromAttribute, author, name, mediaPreview, mlatitude, mlongitude, wantsReceipt) {
    var to = fromAttribute;
    var fromAttribute = author;
    return this.mediaProcess('url', fromAttribute, to, [mlatitude, mlongitude, name], null, null, wantsReceipt, true);
  }
  
  this.events.onContactsGotStatus = function (id, statuses) {
    var i = Iterator(statuses);
    for (let [jid, status] in i) {
      this.events.onPresenceUpdated(jid, undefined, status);
    }
  }
  
  this.events.onContactsSync = function (id, positive, negative) {
    this.account.core.roster = [];
    for (var i in positive) {
      var contact = positive[i];
      this.account.core.roster.push({
        jid: contact.jid,
        name: this.contacts._pre[contact.phone],
        presence: {
          show: 'na',
          status: null
        }
      });
      var ci = this.account.chatFind(contact.jid);
      if (ci > -1) {
        var chat = this.account.chats[ci].core;
        chat.title = this.contacts._pre[contact.phone]
      }
    }
    this.contacts.order(this.contacts._cb);
    this.account.save();
    this.account.allRender()
  }
  
  this.events.onPresenceUpdated = function (jid, lastSeen, msg) {
    var account = this.account;
    var contact = Lungo.Core.findByProperty(this.account.core.roster, 'jid', jid);
    if (contact) {
      var time = Tools.convenientDate(Tools.localize(Tools.stamp( Math.floor((new Date).valueOf()/1000) - parseInt(lastSeen) )));
      if (!('presence' in contact)) {
        contact.presence = {};
      }
      if (msg) {
        if (msg != contact.presence.status) {
          contact.presence.status = msg;
          if (msg == 'Hey there! I am using WhatsApp.') {
            contact.presence.show = 'na';
          } else {
            contact.presence.show = contact.presence.show != 'na' ? contact.presence.show : 'away';
          }
          account.presenceRender(jid);
        }
      } else {
        contact.presence.show = parseInt(lastSeen) < 300 ? 'a' : 'away';
        account.presenceRender(jid);
        var chatSection = $('section#chat[data-jid="' + jid + '"]');
        if (chatSection.length) {
          var status = chatSection.find('header .status');
          status.html((parseInt(lastSeen) < 300 ? _('showa') : _('LastTime', {time: _('DateTimeFormat', {date: time[0], time: time[1]})})) +  ' - ' + status.html());
        }
      }
    }
  }.bind(this)
  
  this.events.onPresenceAvailable = function (jid) {
    var contact = Lungo.Core.findByProperty(this.account.core.roster, 'jid', jid);
    if (contact) {
      contact.presence.show = 'a';
      account.presenceRender(jid);
    }
  }
  
  this.events.onPresenceUnavailable = function (jid) {
    var contact = Lungo.Core.findByProperty(this.account.core.roster, 'jid', jid);
    if (contact) {
      contact.presence.show = 'away';
      account.presenceRender(jid);
    }
  }
  
  this.events.onProfileSetPictureSuccess = function (pictureId) {
    Tools.log('CHANGED AVATAR TO', pictureId);
    this.avatar();
  }
  
  this.events.onProfileSetPictureError = function (err) {
    Lungo.Notification.error(_('NotUploaded'), _('ErrorUploading'), 'warning-sign', 5);
  }
  
  this.events.onUploadRequestSuccess = function (hash, url, resumeFrom) {
    Tools.log('onUploadRequest!');
    var self = this;
    var media = CoSeMe.media;
    var account = this.account;
    Tools.log('TEMP_RETRIEVING', hash, Store.cache[hash].data);
    var obj = Store.cache[hash];
    var type, method, thumbnailer = null;
    if (obj.data.indexOf(':image') > 0) {
      type = 'image';
      method = 'message_imageSend';
      thumbnailer = Tools.picThumb;
    } else if (obj.data.indexOf(':video') > 0) {
      type = 'video';
      method = 'message_videoSend';
      thumbnailer = Tools.vidThumb;
    } else if (obj.data.indexOf(':audio') > 0) {
      type = 'audio';
      method = 'message_audioSend';
      thumbnailer = Tools.audThumb;
    }
    var toJID = obj.to;
    var blob = Tools.b64ToBlob(obj.data.split(',').pop(), obj.data.split(/[:;]/)[1]);
    var uploadUrl = url;
    var onSuccess = function (url) {
      thumbnailer(blob, 120, null, function(thumb) {
        var id = MI.call(
          method,
          [toJID, url, hash, '0', thumb.split(',').pop()]
        );
        self.addMediaMessageToChat(type, thumb, url, account.core.user, toJID, Math.floor((new Date).getTime() / 1000) + '-1');
        App.audio('sent');
        var ext = url.split('.').pop();
        var localUrl = App.pathFiles + Tools.localize(Tools.stamp(id)).replace(/[-:]/g, '') + url.split('/').pop().substring(0, 5).toUpperCase() + '.' + ext;
        Store.SD.save(localUrl, blob);
        delete Store.cache[hash];
      });
      Lungo.Notification.show('up-sign', _('Uploaded'), 1);
      $('#main #footbox progress').val('0');
    };
    var onError = function (error) {
      Lungo.Notification.error(
        _('NotUploaded'),
        _('ErrorUploading'),
        'warning-sign', 5
      );
      Tools.log(error);
      $('#main #footbox progress').val('0');
    };
    var onProgress = function(value) {
      $('#main #footbox progress').val(value.toString());
    };
    media.upload(toJID, blob, uploadUrl, onSuccess, onError, onProgress);
  }
  this.events.onUploadRequestFailed = function (hash) {
    Lungo.Notification.error(_('NotUploaded'), _('ErrorUploading'), 'warning-sign', 5);
  }
  this.events.onUploadRequestDuplicate = function (hash) {
    Lungo.Notification.error(_('NotUploaded'), _('DuplicatedUpload'), 'warning-sign', 5);
  }
  this.addMediaMessageToChat = function(type, data, url, from, to, id) {
    var account = this.account;
    var msgMedia = {
      type: type,
      thumb: data,
      url: url,
      downloaded: true
    };
    var stamp = Tools.localize(Tools.stamp());
    var msg = new Message(account, {
      from: account.core.user,
      id: id,
      to: to,
      media: msgMedia,
      stamp: stamp
    });
    msg.addToChat();
  }

  this.mediaProcess = function (fileType, msgId, fromAttribute, to, payload, mediaUrl, mediaSize, wantsReceipt, isGroup) {
    Tools.log('Processing file of type', fileType);
    var process = function (thumb) {
      var media = {
        type: fileType,
        thumb: thumb,
        url: mediaUrl,
        downloaded: false
      };
      var stamp = Tools.localize(Tools.stamp());
      var msg = {
        id: msgId,
        from: fromAttribute,
        to: to,
        media: media,
        stamp: stamp
      };
      if (isGroup) {
        msg.pushName = fromAttribute;
      }
      var msg = new Message(this.account, msg, {
        muc: isGroup
      });
      msg.receive();
      this.ack(msgId, fromAttribute);
      Tools.log('Finished processing file of type', fileType);
    }.bind(this);
    switch (fileType) {
      case 'image':
        Tools.picThumb(CoSeMe.utils.aToBlob(payload, 'i'), 120, null, process);
        break;
      case 'video':
        process('img/video.png');
        break;
      case 'audio':
        process('img/audio.png');
        break;
      case 'url':
        mediaUrl = 'https://maps.google.com/maps?q=' + payload[0] + ',' + payload[1],
        process('img/blank.jpg');
        break;
    }
  }
    
}

App.logForms['coseme'] = function (article, provider, data) {
  article
    .append($('<h1/>').style('color', data.color).html(_('SettingUp', { provider: data.longName })))
    .append($('<img/>').attr('src', 'img/providers/' + provider + '.svg'))
  var sms = $('<div/>').addClass('sms')
    .append($('<p/>').text(_('ProviderSMS', { provider: data.longName })))
    .append($('<label/>').attr('for', 'countrySelect').text(_(data.terms['country'])));
  var countrySelect = $('<select/>').attr('name', 'countrySelect');
  var countries = Tools.countries();
  countrySelect.append($('<option/>').attr('value', '').text('-- ' + _('YourCountry')));
  for (var i in countries) {
    var country = countries[i];
    countrySelect.append($('<option/>').attr('value', country.dial).text(country.name));
  }
  sms
    .append(countrySelect)
    .append($('<label/>').attr('for', 'user').text(_(data.terms['user'])))
    .append($('<input/>')
      .attr('type', 'number')
      .attr('name', 'country')
      .attr('disabled', 'true')
      .style('width', '3rem')
      .addClass('spaced')
    )
    .append($('<input/>')
      .attr('type', 'number')
      .attr('name', 'user')
      .style('width', 'calc(100% - 4.5rem)')
    );
  countrySelect.bind('change', function () {
    sms.find('input[name="country"]').val(this.value);
  });
  var smsButtons = $('<div/>').addClass('buttongroup');
  var smsReq = $('<button/>').data('role', 'submit').style('backgroundColor', data.color).text(_('SMSRequest'));
  var codeReady = $('<button/>').data('role', 'submit').style('backgroundColor', data.color).text(_('codeReady'));
  var back = $('<button/>').data('view-section', 'back').text(_('GoBack'));
  smsButtons.append(smsReq).append(codeReady).append(back);
  sms.append(smsButtons);
  var code = $('<div/>').addClass('code hidden')
    .append('<p>Enter the 6-digits code you have received by SMS.</p>')
    .append($('<input/>')
      .attr('type', 'number')
      .attr('name', 'rCode')
      .attr('placeholder', '123456')
    );
  var codeButtons = $('<div/>').addClass('buttongroup');
  var retry = $('<button/>')
    .data('role','back')
    .bind('click', function () {
      code.addClass('hidden');
      sms.removeClass('hidden');
    })
    .text(_('Back'));
  var validate = $('<button/>').data('role', 'submit').style('backgroundColor', data.color).text(_('CodeValidate'));
  codeButtons.append(validate);
  codeButtons.append(retry);
  code.append(codeButtons);
  var recode = $('<div/>').addClass('recode hidden')
    .append($('<p/>').text(_('recodeSMS', { provider: data.longName })))
    .append($('<label/>').attr('for', 'countrySelect').text(_(data.terms['country'])));
  var countrySelect = $('<select/>').attr('name', 'countrySelect');
  var countries = Tools.countries();
  countrySelect.append($('<option/>').attr('value', '').text('-- ' + _('YourCountry')));
  for (var i in countries) {
    var country = countries[i];
    countrySelect.append($('<option/>').attr('value', country.dial).text(country.name));
  }
  recode
    .append(countrySelect)
    .append($('<label/>').attr('for', 'user').text(_(data.terms['user'])))
    .append($('<input/>')
      .attr('type', 'number')
      .attr('name', 'country')
      .attr('disabled', 'true')
      .style('width', '3rem')
      .addClass('spaced')
    )
    .append($('<input/>')
      .attr('type', 'number')
      .attr('name', 'user')
      .style('width', 'calc(100% - 4.5rem)')
    )
    .append($('<label/>').attr('for', 'user').text(_('recodeLabel')))
    .append($('<input/>')
      .attr('type', 'number')
      .attr('name', 'rCode')
      .attr('placeholder', '123456')
    );
  countrySelect.bind('change', function () {
    recode.find('input[name="country"]').val(this.value);
  });
  var recodeButtons = $('<div/>').addClass('buttongroup');
  var valCode = $('<button/>').data('role', 'submit').style('backgroundColor', data.color).text(_('recodeRequest'));
  var sback = $('<button/>').text(_('GoBack'));
  recodeButtons.append(valCode).append(sback);
  recode.append(recodeButtons);
  var progress = $('<div/>').addClass('progress hidden')
    .append('<span/>')
    .append($('<progress/>').attr('value', '0'));
  article
    .append(sms)
    .append(code)
    .append(recode)
    .append(progress);
  codeReady.bind('click', function () {
    Tools.log('Move faster, we like Whatsapp right now!');
    sms.addClass('hidden');
    recode.removeClass('hidden');
  });
  sback.bind('click', function () {
    Tools.log('Move faster, we like Whatsapp right now!');
    recode.addClass('hidden');
    sms.removeClass('hidden');
  });
  smsReq.bind('click', function () {
    var article = this.parentNode.parentNode.parentNode;
    var provider = article.parentNode.id;
    var user = $(article).find('[name="user"]').val();
    var cc  = $(article).find('[name="country"]').val();
    if (cc && user) {
      Lungo.Notification.show('envelope', _('SMSsending'));
      var codeGet = function (deviceId) {
        $(article).data('deviceId', deviceId);
        var onsent = function (data) {
          Tools.log(data);
          if (data.status == 'sent') {
            Tools.log('Sent SMS to', cc, user, 'with DID', deviceId, 'retry after', data.retry_after);
            Lungo.Notification.success(_('SMSsent'), _('SMSsentExp'), 'envelope', 3);
            sms.addClass('hidden');
            code.removeClass('hidden');
          } else if (data.status == 'ok') {
            if (data.type == 'existing') {
                var account = new Account({
                  user: user,
                  cc: cc,
                  data: data,
                  provider: provider,
                  resource: App.defaults.Account.core.resource,
                  enabled: true,
                  chats: []
                }); 
                account.test();  
            } else {
              Tools.log('Not valid', 'Reason:', data.reason, 'with DID', deviceId);
              Lungo.Notification.error(_('CodeNotValid'), _('CodeReason_' + data.reason, {retry: data.retry_after}), 'exclamation-sign', 5);
            }
          } else {
            Tools.log('Could not sent SMS', 'Reason:', data.reason, 'with DID', deviceId);
            Lungo.Notification.error(_('SMSnotSent'), _('SMSreason_' + data.reason, {retry: data.retry_after}), 'exclamation-sign', 5);
          }        
        }
        var onerror = function (data) {}
        var deviceId = CoSeMe.registration.getCode(cc, user, onsent, onerror, deviceId);      
      }
      var onhasid = function (file) {
        var onread = function (deviceId) {
          codeGet(deviceId);
        }
        Tools.textUnblob(file, onread);
      }
      var onneedsid = function (error) {
        var deviceId = Math.random().toString(36).substring(2);
        Store.SD.save('.coseme.id', [deviceId]);
        codeGet(deviceId);
      }
      Store.SD.recover('.coseme.id', onhasid, onneedsid);
    }
  });

  validate.bind('click', function () {
    var article = this.parentNode.parentNode.parentNode;
    var provider = article.parentNode.id;
    var user = $(article).find('[name="user"]').val();
    var cc  = $(article).find('[name="country"]').val();
    var rCode = $(article).find('[name="rCode"]').val().replace(/\D/g,'');
    var deviceId = $(article).data('deviceId');
    if (cc && user && rCode && deviceId) {
      var onready = function (data) {
        Tools.log(data);
        if (data.type == 'existing') {
          var account = new Account({
            user: user,
            cc: cc,
            data: data,
            provider: provider,
            resource: App.defaults.Account.core.resource,
            chats: []
          });  
          account.test();    
        } else {
          Tools.log('Not valid', 'Reason:', data.reason);
          Lungo.Notification.error(_('CodeNotValid'), _('CodeReason_' + data.reason, {retry: data.retry_after}), 'exclamation-sign', 5);
        }
      }
      var onerror = function (error) {}
      Lungo.Notification.show('copy', _('CodeValidating'));
      CoSeMe.registration.register(cc, user, rCode, onready, onerror, deviceId);
    } 
  });

  valCode.bind('click', function () {
    var article = this.parentNode.parentNode.parentNode;
    var provider = article.parentNode.id;
    var user = $(article).find('[name="user"]').val();
    var cc  = $(article).find('[name="country"]').val();
    var rCode = $(article).find('[name="rCode"]').val().replace(/\D/g,'');
    var deviceId = $(article).data('deviceId');
    if (cc && user && rCode && deviceId) {
      var onready = function (data) {
        Tools.log(data);
        if (data.type == 'existing') {
          var account = new Account({
            user: user,
            cc: cc,
            data: data,
            provider: provider,
            resource: App.defaults.Account.core.resource,
            chats: []
          });  
          account.test();    
        } else {
          Tools.log('Not valid', 'Reason:', data.reason);
          Lungo.Notification.error(_('CodeNotValid'), _('CodeReason_' + data.reason, {retry: data.retry_after}), 'exclamation-sign', 5);
        }
      }
      var onerror = function (error) {}
      Lungo.Notification.show('copy', _('CodeValidating'));
      CoSeMe.registration.register(cc, user, rCode, onready, onerror, deviceId);
    } 
  });
}

App.emoji['coseme'] = {

  map: [
    // Smileys
    ["e415","1f604"],["e057","1f603"],["1f600","1f600"],["e056","1f60a"],["e414","263a"],["e405","1f609"],["e106","1f60d"],["e418","1f618"],["e417","1f61a"],["1f617","1f617"],["1f619","1f619"],["e105","1f61c"],["e409","1f61d"],["1f61b","1f61b"],["e40d","1f633"],["e404","1f601"],["e40a","1f614"],["e403","1f60c"],["e40e","1f612"],["e058","1f61e"],["e406","1f623"],["e413","1f622"],["e412","1f602"],["e411","1f62d"],["e408","1f62a"],["e401","1f625"],["e40f","1f630"],["1f605","1f605"],["e108","1f613"],["1f629","1f629"],["1f62b","1f62b"],["e40b","1f628"],["e107","1f631"],["e059","1f620"],["e416","1f621"],["1f624","1f624"],["e407","1f616"],["e40a","1f606"],["1f60b","1f60b"],["e40c","1f637"],["1f60e","1f60e"],["1f634","1f634"],["1f635","1f635"],["e410","1f632"],["1f61f","1f61f"],["1f626","1f626"],["1f627","1f627"],["1f608","1f608"],["e11a","1f47f"],["1f62e","1f62e"],["1f62c","1f62c"],["1f610","1f610"],["1f615","1f615"],["1f62f","1f62f"],["1f636","1f636"],["1f607","1f607"],["e402","1f60f"],["1f611","1f611"],
    // Faces
    ["e516","1f472"],["e517","1f473"],["e152","1f46e"],["e51b","1f477"],["e51e","1f482"],["e51a","1f476"],["e001","1f466"],["e002","1f467"],["e004","1f468"],["e005","1f469"],["e518","1f474"],["e519","1f475"],["e515","1f471"],["e04e","1f47c"],["e51c","1f478"],["1f63a","1f63a"],["1f638","1f638"],["e106","1f63b"],["1f63d","1f63d"],["1f63c","1f63c"],["1f640","1f640"],["1f63f","1f63f"],["1f639","1f639"],["e416","1f63e"],["1f479","1f479"],["1f47a","1f47a"],["1f648","1f648"],["1f649","1f649"],["1f64a","1f64a"],["e11c","1f480"],["e10c","1f47d"],["e05a","1f4a9"],
    // Elements
    ["e11d","1f525"],["e32e","2728"],["e32f","1f31f"],["e407","1f4ab"],["1f4a5","1f4a5"],["e334","1f4a2"],["e331","1f4a6"],["e331","1f4a7"],["e13c","1f4a4"],["e330","1f4a8"],
    // Parts of the body
    ["e41b","1f442"],["e419","1f440"],["e41a","1f443"],["1f445","1f445"],["e41c","1f444"],["e00e","1f44d"],["e421","1f44e"],["e420","1f44c"],["e00d","1f44a"],["e010","270a"],["e011","270c"],["e41e","1f44b"],["e012","270b"],["e422","1f450"],["e22e","1f446"],["e22f","1f447"],["e231","1f449"],["e230","1f448"],["e427","1f64c"],["e41d","1f64f"],["e00f","261d"],["e41f","1f44f"],["e14c","1f4aa"],["e201","1f6b6"],["e115","1f3c3"],["e51f","1f483"],["e428","1f46b"],["1f46a","1f46a"],["1f46c","1f46c"],["1f46d","1f46d"],["e111","1f48f"],["e425","1f491"],["e429","1f46f"],["e424","1f646"],["e423","1f645"],["e253","1f481"],["e012","1f64b"],["e31e","1f486"],["e31f","1f487"],["e31d","1f485"],["1f470","1f470"],["1f64e","1f64e"],["1f64d","1f64d"],["e426","1f647"],
    // Clothes
    ["e503","1f3a9"],["e10e","1f451"],["e318","1f452"],["e007","1f45f"],["e007","1f45e"],["e31a","1f461"],["e13e","1f460"],["e31b","1f462"],["e006","1f455"],["e302","1f454"],["e006","1f45a"],["e319","1f457"],["1f3bd","1f3bd"],["1f456","1f456"],["e321","1f458"],["e322","1f459"],["e11e","1f4bc"],["e323","1f45c"],["1f45d","1f45d"],["1f45b","1f45b"],["1f453","1f453"],["e314","1f380"],["e43c","1f302"],["e31c","1f484"],
    // Love and social
    ["e32c","1f49b"],["e32a","1f499"],["e32d","1f49c"],["e32b","1f49a"],["e022","2764"],["e023","1f494"],["e328","1f497"],["e327","1f493"],["e327","1f495"],["1f496","1f496"],["e327","1f49e"],["e329","1f498"],["1f48c","1f48c"],["e003","1f48b"],["e034","1f48d"],["e035","1f48e"],["1f464","1f464"],["1f465","1f465"],["1f4ac","1f4ac"],["e536","1f463"],["1f4ad","1f4ad"],
    // Buildings
    ["e036","1f3e0"],["1f3e1","1f3e1"],["e157","1f3eb"],["e038","1f3e2"],["e153","1f3e3"],["e155","1f3e5"],["e14d","1f3e6"],["e156","1f3ea"],["e501","1f3e9"],["e158","1f3e8"],["e43d","1f492"],["e037","26ea"],["e504","1f3ec"],["1f3ea","1f3e4"],
    // Places
    ["e44a","1f307"],["e146","1f306"],["e505","1f3ef"],["e506","1f3f0"],["e122","26fa"],["e508","1f3ed"],["e509","1f5fc"],["1f5fe","1f5fe"],["e03b","1f5fb"],["e04d","1f304"],["e449","1f305"],["e44b","1f303"],["e51d","1f5fd"],["1f309","1f309"],["1f3a0","1f3a0"],["e124","1f3a1"],["e121","26f2"],["e433","1f3a2"],
    // Means of transport
    ["e202","1f6a2"],["e01c","26f5"],["e135","1f6a4"],["1f6a3","1f6a3"],["2693","2693"],["e10d","1f680"],["e01d","2708"],["e11f","1f4ba"],["1f681","1f681"],["1f682","1f682"],["1f68a","1f68a"],["e039","1f689"],["1f69e","1f69e"],["1f686","1f686"],["e435","1f684"],["1f688","1f688"],["e434","1f687"],["1f69d","1f69d"],["1f68b","1f68b"],["e01e","1f683"],["1f68e","1f68e"],["e159","1f68c"],["1f68d","1f68d"],["e42e","1f699"],["1f698","1f698"],["e01b","1f697"],["e15a","1f695"],["1f696","1f696"],["1f69b","1f69b"],["e42f","1f69a"],["1f6a8","1f6a8"],["e432","1f693"],["1f694","1f694"],["e430","1f692"],["e431","1f691"],["1f690","1f690"],["e136","1f6b2"],["1f6a1","1f6a1"],["1f69f","1f69f"],["1f6a0","1f6a0"],["1f69c","1f69c"],
    // Street objects
    ["e320","1f488"],["e150","1f68f"],["e125","1f3ab"],["1f6a6","1f6a6"],["e14e","1f6a5"],["e252","26a0"],["e137","1f6a7"],["e209","1f530"],["e03a","26fd"],["1f3ee","1f3ee"],["e133","1f3b0"],["e123","2668"],["1f5ff","1f5ff"],["1f3aa","1f3aa"],["1f3ad","1f3ad"],["1f4cd","1f4cd"],["1f6a9","1f6a9"],
    // Country flags
    ["e50b",["1f1ef","1f1f5"]],["e514",["1f1f0","1f1f7"]],["e513",["1f1e8","1f1f3"]],["e50c",["1f1fa","1f1f8"]],["e50d",["1f1eb","1f1f7"]],["e511",["1f1ea","1f1f8"]],["e50f",["1f1ee","1f1f9"]],["e512",["1f1f7","1f1fa"]],["e510",["1f1ec","1f1e7"]],["e50e",["1f1e9","1f1ea"]],
    // Numbers and arrows
    ["e21c",["31","20e3"]],["e21d",["32","20e3"]],["e21e",["33","20e3"]],["e21f",["34","20e3"]],["e220",["35","20e3"]],["e221",["36","20e3"]],["e222",["37","20e3"]],["e223",["38","20e3"]],["e224",["39","20e3"]],["e225",["30","20e3"]],["1f51f","1f51f"],["1f522","1f522"],["e210",["23","20e3"]],["1f523","1f523"],["e232","2b06"],["e233","2b07"],["e235","2b05"],["e234","27a1"],["1f520","1f520"],["1f521","1f521"],["1f524","1f524"],["e236","2197"],["e237","2196"],["e238","2198"],["e239","2199"],["2194","2194"],["2195","2195"],["1f504","1f504"],["e23b","25c0"],["e23a","25b6"],["1f53c","1f53c"],["1f53d","1f53d"],["21a9","21a9"],["21aa","21aa"],["2139","2139"],["e23d","23ea"],["e23c","23e9"],["23eb","23eb"],["23ec","23ec"],["2935","2935"],["2934","2934"],["e24d","1f197"],["1f500","1f500"],["1f501","1f501"],["1f502","1f502"],
    // Ideograph and horoscope
    ["e212","1f195"],["e213","1f199"],["e214","1f192"],["1f193","1f193"],["1f196","1f196"],["e20b","1f4f6"],["e507","1f3a6"],["e203","1f201"],["e22c","1f22f"],["e22b","1f233"],["e22a","1f235"],["1f234","1f234"],["1f232","1f232"],["e226","1f250"],["e227","1f239"],["e22d","1f23a"],["e215","1f236"],["e216","1f21a"],["e151","1f6bb"],["e138","1f6b9"],["e139","1f6ba"],["e13a","1f6bc"],["e309","1f6be"],["1f6b0","1f6b0"],["1f6ae","1f6ae"],["e14f","1f17f"],["e20a","267f"],["e208","1f6ad"],["e217","1f237"],["e218","1f238"],["e228","1f202"],["24c2","24c2"],["1f6c2","1f6c2"],["1f6c4","1f6c4"],["1f6c5","1f6c5"],["1f6c3","1f6c3"],["1f251","1f251"],["e315","3299"],["e30d","3297"],["1f191","1f191"],["1f198","1f198"],["e229","1f194"],["1f6ab","1f6ab"],["e207","1f51e"],["1f4f5","1f4f5"],["1f6af","1f6af"],["1f6b1","1f6b1"],["1f6b3","1f6b3"],["1f6b7","1f6b7"],["1f6b8","1f6b8"],["26d4","26d4"],["e206","2733"],["2747","2747"],["274e","274e"],["2705","2705"],["e205","2734"],["e204","1f49f"],["e12e","1f19a"],["e250","1f4f3"],["e251","1f4f4"],["e532","1f170"],["e533","1f171"],["e534","1f18e"],["e535","1f17e"],["1f4a0","1f4a0"],["e211","27bf"],["267b","267b"],["e23f","2648"],["e240","2649"],["e241","264a"],["e242","264b"],["e243","264c"],["e244","264d"],["e245","264e"],["e246","264f"],["e247","2650"],["e248","2651"],["e249","2652"],["e24a","2653"],["e24b","26ce"],["e23e","1f52f"],["e154","1f3e7"],["e14a","1f4b9"],
    // Signs and clocks
    ["1f4b2","1f4b2"],["e149","1f4b1"],["e24e","00a9"],["e24f","00ae"],["e537","2122"],["e12c","303d"],["3030","3030"],["e24c","1f51d"],["1f51a","1f51a"],["1f519","1f519"],["1f51b","1f51b"],["1f51c","1f51c"],["e333","274c"],["e332","2b55"],["2757","2757"],["2753","2753"],["e337","2755"],["e336","2754"],["1f503","1f503"],["e02f","1f55b"],["1f567","1f567"],["e024","1f550"],["1f55c","1f55c"],["e025","1f551"],["1f55d","1f55d"],["e026","1f552"],["1f55e","1f55e"],["e027","1f553"],["1f55f","1f55f"],["e028","1f554"],["1f560","1f560"],["e029","1f555"],["e02a","1f556"],["e02b","1f557"],["e02c","1f558"],["e02d","1f559"],["e02e","1f55a"],["1f561","1f561"],["1f562","1f562"],["1f563","1f563"],["1f564","1f564"],["1f565","1f565"],["1f566","1f566"],["2716","2716"],["2795","2795"],["2796","2796"],["2797","2797"],["e20e","2660"],["e20c","2665"],["e20f","2663"],["e20d","2666"],["1f4ae","1f4ae"],["1f4af","1f4af"],["2714","2714"],["2611","2611"],["1f518","1f518"],["1f517","1f517"],["27b0","27b0"],["e031","1f531"],["e21a","1f532"],["e21b","1f533"],["25fc","25fc"],["25fb","25fb"],["25fe","25fe"],["25fd","25fd"],["25aa","25aa"],["25ab","25ab"],["1f53a","1f53a"],["2b1c","2b1c"],["2b1b","2b1b"],["26ab","26ab"],["26aa","26aa"],["e219","1f534"],["1f535","1f535"],["1f53b","1f53b"],["1f536","1f536"],["1f537","1f537"],["1f538","1f538"],["1f539","1f539"],["2049","2049"],["203c","203c"],
    // UNCATEGORIZED
["e326","1f3b6"],
["e03e","1f3b5"],
["e152","1f46e"],
["e04a","2600"],
["e04b","2614"],
["e049","2601"],
["e048","26c4"],
["e04c","1f319"],
["e13d","26a1"],
["e443","1f300"],
["e43e","1f30a"],
["e04f","1f431"],
["e052","1f436"],
["e053","1f42d"],
["e524","1f439"],
["e52c","1f430"],
["e52a","1f43a"],
["e531","1f438"],
["e050","1f42f"],
["e527","1f428"],
["e051","1f43b"],
["e10b","1f437"],
["e52b","1f42e"],
["e52f","1f417"],
["e109","1f435"],
["e528","1f412"],
["e01a","1f434"],
["e134","1f40e"],
["e530","1f42b"],
["e529","1f411"],
["e526","1f418"],
["e52d","1f40d"],
["e521","1f426"],
["e523","1f424"],
["e52e","1f414"],
["e055","1f427"],
["e525","1f41b"],
["e10a","1f419"],
["e522","1f420"],
["e019","1f41f"],
["e054","1f433"],
["e520","1f42c"],
["e306","1f490"],
["e030","1f338"],
["e304","1f337"],
["e110","1f340"],
["e032","1f339"],
["e303","1f33a"],
["e305","1f33b"],
["e118","1f341"],
["e447","1f343"],
["e119","1f342"],
["e307","1f334"],
["e308","1f335"],
["e444","1f33e"],
["e441","1f41a"],
["e436","1f38d"],
["e437","1f49d"],
["e438","1f38e"],
["e43a","1f392"],
["e439","1f393"],
["e43b","1f38f"],
["e117","1f386"],
["e440","1f387"],
["e442","1f390"],
["e446","1f391"],
["e445","1f383"],
["e11b","1f47b"],
["e448","1f385"],
["e033","1f384"],
["e112","1f381"],
["e325","1f514"],
["e312","1f389"],
["e310","1f388"],
["e126","1f4bf"],
["e127","1f4c0"],
["e008","1f4f7"],
["e03d","1f3a5"],
["e00c","1f4bb"],
["e12a","1f4fa"],
["e00a","1f4f1"],
["e00b","1f4e0"],
["e009","260e"],
["e316","1f4bd"],
["e129","1f4fc"],
["e141","1f50a"],
["e142","1f4e2"],
["e317","1f4e3"],
["e128","1f4fb"],
["e14b","1f4e1"],
["e114","1f50d"],
["e145","1f513"],
["e144","1f512"],
["e03f","1f511"],
["e313","2702"],
["e116","1f528"],
["e10f","1f4a1"],
["e104","1f4f2"],
["e103","1f4e9"],
["e101","1f4eb"],
["e102","1f4ee"],
["e13f","1f6c0"],
["e140","1f6bd"],
["e12f","1f4b0"],
["e30e","1f6ac"],
["e311","1f4a3"],
["e113","1f52b"],
["e30f","1f48a"],
["e13b","1f489"],
["e42b","1f3c8"],
["e42a","1f3c0"],
["e018","26bd"],
["e016","26be"],
["e015","1f3be"],
["e013","26f3"],
["e42c","1f3b1"],
["e42d","1f3ca"],
["e017","1f3c4"],
["e013","1f3bf"],
["e131","1f3c6"],
["e12b","1f47e"],
["e130","1f3af"],
["e12d","1f004"],
["e324","1f3ac"],
["e301","1f4dd"],
["e148","1f4d3"],
["e502","1f3a8"],
["e03c","1f3a4"],
["e30a","1f3a7"],
["e040","1f3b7"],
["e042","1f3ba"],
["e041","1f3b8"],
["e045","2615"],
["e338","1f375"],
["e047","1f37a"],
["e30c","1f37b"],
["e044","1f378"],
["e30b","1f376"],
["e043","1f374"],
["e120","1f354"],
["e33b","1f35f"],
["e33f","1f35d"],
["e341","1f35b"],
["e34c","1f371"],
["e344","1f363"],
["e342","1f359"],
["e33d","1f358"],
["e33e","1f35a"],
["e340","1f35c"],
["e34d","1f372"],
["e339","1f35e"],
["e147","1f373"],
["e343","1f362"],
["e33c","1f361"],
["e33a","1f366"],
["e43f","1f367"],
["e34b","1f382"],
["e046","1f370"],
["e345","1f34e"],
["e346","1f34a"],
["e348","1f349"],
["e347","1f353"],
["e34a","1f346"],
["e349","1f345"],
["e50a","1f52b"],
["e44c","1f308"],
["e132","1f3c1"],
["e143","1f38c"]
],
  
  charToData: function (char) {
    var data = char;
    for (var i in this.map) {
      var code = map[i][0];
      if (code == char) {
        data = 'data:image/gif;base64,' + map[i][2];
        break;
      }
    }
    return data;
  },
   
  fy: function (text) {
    var mapped = text;
    if (mapped && mapped.match(/[\ue000-\ue999]|[\u1f000-\u1f999]|[\u00aa-\uffff]/g)) {
      var map = this.map;
      for (var i in map) {
        var codeA = String.fromCodePoint(parseInt(map[i][0], 16));
        var codeB = map[i][1] instanceof Array ? (String.fromCodePoint(parseInt(map[i][1][0], 16)) + String.fromCodePoint(parseInt(map[i][1][1], 16))) : String.fromCodePoint(parseInt(map[i][1], 16));
        var rexp = new RegExp('(' + codeA + '|' + codeB + ')', 'g');
        mapped = mapped.replace(rexp, '<img src="/img/emoji/coseme/' + map[i][1] + '.png" alt="$1" />');
      }
    }
    return mapped;
  },
  
  render: function (img, emoji) {
    var code = typeof emoji[1] == 'string' ? emoji[1] : emoji[1].join('-');
    img
      .attr('src', '/img/emoji/coseme/' + code + '.png')
      .data('emoji', String.fromCodePoint(parseInt(emoji[1], 16)));
  }
  
}
