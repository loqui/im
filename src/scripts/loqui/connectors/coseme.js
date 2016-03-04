/* global IDBKeyRange, App, CoSeMe, Providers, Tools, Avatar, Store, Message, Chat, Account, Accounts, Lungo, Make, async, axolotl */

/**
 * @file Holds {@link Connector/Coseme}
 * @author [Adán Sánchez de Pedro Crespo]{@link https://github.com/aesedepece}
 * @author [Jovan Gerodetti]{@link https://github.com/TitanNano}
 * @author [Christof Meerwald]{@link https://github.com/cmeerw}
 * @author [Giovanny Andres Gongora Granada]{@link https://github.com/Gioyik}
 * @author [Sukant Garg]{@link https://github.com/gargsms}
 * @license AGPLv3
 */

'use strict';

/**
 * @class CoSeMeConnectorHelper
 */
var CosemeConnectorHelper = {
  tokenDataKeys : [ 'v', 'r', 'u', 't', 'd' ],

  axolLoaded : function () {
    function loadScript (src) {
      return new Promise(function (resolve, reject) {
        var s;
        s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }

    return loadScript('scripts/joebandenburg/curve25519.js').then(function () {
      return loadScript('scripts/joebandenburg/axolotl-crypto.js').then(function () {
        return loadScript('scripts/joebandenburg/axolotl.js');
      });
    });
  }(),

  init : function () {
    var self = this;
    return this.axolLoaded.then(function () {
      return new Promise(function (ready) {
        CoSeMe.config.customLogger = Tools;

        for (var i in self.tokenDataKeys) {
          var key = self.tokenDataKeys[i];
          var value = window.localStorage.getItem('CoSeMe.tokenData.' + key);
          CoSeMe.config.tokenData[key] = (value !== null) ? value : CoSeMe.config.tokenData[key];
        }

        var req = window.indexedDB.open('AxolotlStore', 1);
        req.onerror = function(e) {
          Tools.log('init onerror', e);
        };
        req.onsuccess = function(e) {
          ready(req.result);
        };
        req.onupgradeneeded = function(e) {
          var db = req.result;
          var ver = db.version || 0; // version is empty string for a new DB
          Tools.log('init onupgradeneeded', db);

          if (!db.objectStoreNames.contains('localReg'))
          {
            db.createObjectStore('localReg', { keyPath : 'jid' });
          }
          if (!db.objectStoreNames.contains('localKeys'))
          {
            db.createObjectStore('localKeys', { keyPath : [ 'jid', 'id' ] });
          }
          if (!db.objectStoreNames.contains('localSKeys'))
          {
            db.createObjectStore('localSKeys', { keyPath : [ 'jid', 'id' ] });
          }
          if (!db.objectStoreNames.contains('session'))
          {
            db.createObjectStore('session', { keyPath : [ 'jid', 'remoteJid' ] });
          }
        };
      });
    });
  },

  updateTokenData : function (cb, cbUpdated) {
    var self = this;
    var ts = (new Date()).getTime() / 1000;
    if (ts - 3600 > Number(window.localStorage.getItem('CoSeMe.dataUpdated'))) {
      Tools.log("UPDATING token data");
      var xhr = new XMLHttpRequest({mozSystem: true});
      xhr.onload = function() {
        var updated = false;
        window.localStorage.setItem('CoSeMe.dataUpdated', ts);

        if (this.response) {
          Tools.log(this.response);
          for (var i in self.tokenDataKeys) {
            var key = self.tokenDataKeys[i];
            var value = this.response[key];
            if (value) {
              if (CoSeMe.config.tokenData[key] != value) {
                updated = true;
              }
              CoSeMe.config.tokenData[key] = value;
              window.localStorage.setItem('CoSeMe.tokenData.' + key, value);
            }
          }
        }

        Tools.log('Token data ' + (updated ? '' : 'NOT ') + 'updated');

        if (updated && cbUpdated) {
          cbUpdated();
        } else if (cb) {
          cb();
        }
      };
      xhr.onerror = function() {
        window.localStorage.setItem('CoSeMe.dataUpdated', ts);
        if (cb) {
          cb();
        }
      };
      xhr.open('GET', 'https://raw.githubusercontent.com/loqui/im/dev/tokenData.json');
      xhr.overrideMimeType('json');
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'text/json');
      xhr.send();
    } else if (cb) {
      cb();
    }
  }
};


/**
 * @class Connector/CoSeMe
 * @implements Connector
 * @param {Account} account
 */
App.connectors.coseme = function (account) {

  var Yowsup = CoSeMe.yowsup;
  var SI = Yowsup.getSignalsInterface();
  var MI = Yowsup.getMethodsInterface();

  var pulse = null;
  var axol = null;
  var axolDb = null;
  var axolLocalReg = null;
  var axolSendKeys = false;
  var axolEncryptQueues = { };
  var axolDecryptQueue = async.queue(function (task, callback) {
    handleEncryptedMessage(task.self, task.msg, callback);
  });
  var requestData = {};
  var init = CosemeConnectorHelper.init();

  this.account = account;
  this.provider = Providers.data[account.core.provider];
  this.presence = {
    name: this.account.core.presence ? this.account.core.presence.name : '',
    show: this.account.core.presence ? this.account.core.presence.show : App.defaults.Connector.presence.show,
    status: this.account.core.presence ? this.account.core.presence.status : App.defaults.Connector.presence.status
  };
  this.handlers = {};
  this.events = {};
  this.chat = {};
  this.contacts = {};
  this.muc = {
    membersCache: []
  };
  this.connected = false;

  function isNotGroupJid (jid) {
    return (jid.indexOf('@g.us') < 0);
  }

  function sendSetKeys (jid) {
    axol.generatePreKeys(Math.floor(Math.random() * 0xfffffe), 50).then(function (preKeys) {
      var tx = axolDb.transaction(['localKeys'], 'readwrite');
      var objStore = tx.objectStore('localKeys');

      for (var idx in preKeys) {
        preKeys[idx].jid = jid;
        objStore.put(preKeys[idx]);
      }

      axol.generateSignedPreKey(axolLocalReg.identityKeyPair, Math.floor(Math.random() * 0xfffffe)).then(function (signedPreKey) {
        var tx = axolDb.transaction(['localSKeys'], 'readwrite');
        tx.objectStore('localSKeys').put(signedPreKey);
        signedPreKey.jid = jid;

        axolSendKeys = false;
        CoSeMe.yowsup.getMethodsInterface().call('encrypt_setKeys', [
          axolLocalReg.identityKeyPair.public.slice(1),
          axolLocalReg.registrationId,
          '\x05',
          preKeys.map(function (x) {
            return { id: x.id, value: x.keyPair.public.slice(1) }; }),
          { id: signedPreKey.id,
            value : signedPreKey.keyPair.public.slice(1),
            signature : signedPreKey.signature } ]);
      });
    });
  }

  function encryptMessageWorker(task, callback) {
    var cpuLock = navigator.requestWakeLock('cpu');
    var myJid = account.core.fullJid;
    var tx = axolDb.transaction(['session']);
    var req = tx.objectStore('session').get([ myJid, task.remoteJid ]);
    req.onsuccess = function (e) {
      if (req.result) {
        var buffer = CoSeMe.utils.bytesFromLatin1(CoSeMe.utils.utf8FromString(task.plaintext));
        axol.encryptMessage(req.result.session, buffer).then(function (m) {
          Tools.log('ENCRYPTED MESSAGE', m);

          var tx = axolDb.transaction(['session'], 'readwrite');
          var req = tx.objectStore('session').put({ jid: myJid,
                                                    remoteJid : task.remoteJid,
                                                    session: m.session });

          task.ready(m);
          callback();
          cpuLock.unlock();
        }, function (e) {
          Tools.log('ENCRYPT ERROR', e);
          task.reject();
          callback();
          cpuLock.unlock();
        });
      } else {
        task.reject();
        callback();
        cpuLock.unlock();
      }
    };
    req.onerror = function(e) {
      Tools.log('error getting session from db', task.remoteJid);
      cpuLock.unlock();
    };
  }

  function encryptMessage (remoteJid, plaintext) {
    return new Promise(function (ready, reject) {
      var myJid = account.core.fullJid;

      if (axolLocalReg && isNotGroupJid(remoteJid)) {
        if (!(remoteJid in axolEncryptQueues)) {
          var cpuLock = navigator.requestWakeLock('cpu');
          var q = async.queue(encryptMessageWorker);
          q.pause();
          axolEncryptQueues[remoteJid] = q;

          var tx = axolDb.transaction(['session']);
          var req = tx.objectStore('session').get([ myJid, remoteJid ]);
          req.onsuccess = function (e) {
            if (req.result) {
              Tools.log('EXISTING SESSION', req.result);
              q.resume();
            } else {
              var id = MI.call('encrypt_getKeys', [ [ remoteJid ] ]);
              requestData[id] = [ remoteJid ];
            }

            cpuLock.unlock();
          };
          req.onerror = function(e) {
            Tools.log('error getting session from db', remoteJid);
            cpuLock.unlock();
          };
        }

        axolEncryptQueues[remoteJid].push({ remoteJid : remoteJid,
                                            plaintext : plaintext,
                                            ready : ready, reject : reject });
      } else {
        reject();
      }
    });
  }

  function handleEncryptedMessage (self, msg, callback) {
    function onDecryptError(e) {
      Tools.log('ERROR', e);

      if (axolLocalReg && (!msg.count || Number(msg.count) < 1))  {
        MI.call('message_retry', [msg.remoteJid, msg.msgId,
                                  axolLocalReg.registrationId, '1', '1',
                                  msg.author]);
      } else {
        MI.call('message_error', [msg.remoteJid, msg.msgId, 'plaintext-only']);
      }

      callback(e);
    }

    function onDecrypted(plaintext, session) {
      Tools.log('DECRYPTED MESSAGE', plaintext, session);
      self.events.onMessage.bind(self)(msg.msgId, msg.remoteJid, plaintext, msg.timeStamp, true, msg.pushName, false);

      var tx = axolDb.transaction(['session'], 'readwrite');
      var req = tx.objectStore('session').put({ jid : msg.jid,
                                                remoteJid : msg.remoteJid,
                                                session : session });

      callback();
    }

    if (axolLocalReg && (msg.type == 'pkmsg' || msg.type == 'msg')) {
      var tx = axolDb.transaction(['session']);
      var req = tx.objectStore('session').get([ msg.jid, msg.remoteJid ]);
      req.onsuccess = function (e) {
        var session = req.result ? req.result.session : null;
        var decryptFn = (msg.type == 'pkmsg') ? axol.decryptPreKeyWhisperMessage : axol.decryptWhisperMessage;
        decryptFn(session, msg.msgData).then(function (m) {
          var plaintext = CoSeMe.utils.stringFromUtf8(CoSeMe.utils.latin1FromBytes(new Uint8Array(m.message)));
          onDecrypted(plaintext, m.session);
        }, onDecryptError);
      };
      req.onerror = function(e) {
        Tools.log('error getting session from db', msg.remoteJid);
      };
    } else {
      onDecryptError(msg.type);
    }
  }

  this.connect = function (callback) {
    var self = this;
    var method = 'auth_login';
    var params = [this.account.core.data.login, this.account.core.data.pw];

    init.then(function (db) {
      Tools.log('init');

      requestData = {};
      axolDb = db;
      axolSendKeys = false;
      axolDecryptQueue.pause();
      axol = axolotl({
        getLocalIdentityKeyPair : function () {
          Tools.log('getLocalIdentityKeyPair', axolLocalReg.identityKeyPair);
          return axolLocalReg.identityKeyPair;
        },
        getLocalRegistrationId : function () {
          Tools.log('getLocalRegistrationId', axolLocalReg.registrationId);
          return axolLocalReg.registrationId;
        },
        getLocalSignedPreKeyPair : function (signedPreKeyId) {
          Tools.log('getLocalSignedPreKeyPair', signedPreKeyId);

          return new Promise(function (ready) {
            var tx = axolDb.transaction(['localSKeys']);
            var req = tx.objectStore('localSKeys').get([ account.core.fullJid, signedPreKeyId ]);
            req.onsuccess = function (e) {
              ready(req.result ? req.result.keyPair : null);
            };
          });
        },
        getLocalPreKeyPair : function (preKeyId) {
          Tools.log('getLocalPreKeyPair', preKeyId);

          return new Promise(function (ready) {
            var tx = axolDb.transaction(['localKeys']);
            var req = tx.objectStore('localKeys').get([ account.core.fullJid, preKeyId ]);
            req.onsuccess = function (e) {
              ready(req.result ? req.result.keyPair : null);
            };
          });
        }
      });

      var connTimeoutId = setTimeout(function () {
        Tools.log("AUTH TIMED OUT");
        connTimeoutId = null;
        self.disconnect();
        callback.connfail();
      }, 60000);

      Yowsup.connectionmanager.signals.auth_success.length = 0;
      SI.registerListener('auth_success', function() {
        Tools.log("CONNECTED");
        this.connected = true;
        clearTimeout(connTimeoutId);
        connTimeoutId = null;
        var jid = CoSeMe.yowsup.connectionmanager.jid;
        this.account.core.fullJid = jid;

        callback.connected();
        if(!pulse) {
          pulse = setInterval(function(){
            Tools.log('keep alive!');
            MI.call('keepalive', []);
          }, 60000);
        }
      }.bind(self));
      Yowsup.connectionmanager.signals.auth_fail.length = 0;
      SI.registerListener('auth_fail', function(username, _, reason) {
        Tools.log("AUTH FAIL");
        this.connected = false;
        clearTimeout(connTimeoutId);
        connTimeoutId = null;
        if (reason == 'connection-refused') {
          callback.connfail();
        } else {
          CosemeConnectorHelper.updateTokenData(function () {
            callback.authfail(reason);
          }, callback.connfail);
        }
      }.bind(self));
      Yowsup.connectionmanager.signals.disconnected.length = 0;
      SI.registerListener('disconnected', function () {
        this.connected = false;
        if (connTimeoutId) {
          clearTimeout(connTimeoutId);
          connTimeoutId = null;
        }
        if (pulse) {
          clearInterval(pulse);
          pulse = null;
        }
        if (callback.disconnected) {
          callback.disconnected();
        }
      }.bind(self));

      MI.call(method, params);
      callback.connecting();
    });
  };

  this.disconnect = function () {
    this.connected = false;
    var method = 'disconnect';
    var params = ['undefined'];
    if (pulse) {
      clearInterval(pulse);
      pulse = null;
    }
    MI.call(method, params);
  };

  this.isConnected = function () {
    return App.online && this.connected;
  };

  this.start = function () {
    Tools.log('CONNECTOR START');
    this.handlers.init();

    var myJid = this.account.core.fullJid;

    var tx = axolDb.transaction(['localReg']);
    var req = tx.objectStore('localReg').get(myJid);
    req.onsuccess = function (e) {
      axolLocalReg = e.target.result;
      if (! axolLocalReg && window.crypto.subtle) {
        axol.generateIdentityKeyPair().then(function (identityKeyPair) {
          axol.generateRegistrationId(true).then(function (registrationId) {
            axolLocalReg = { jid : myJid,
                             identityKeyPair : identityKeyPair,
                             registrationId : registrationId };

            var tx = axolDb.transaction(['localReg'], 'readwrite');
            tx.objectStore('localReg').put(axolLocalReg);

            sendSetKeys(myJid);
            axolDecryptQueue.resume();
          }, function (e) {
            Tools.log('FAILED generateIdentityKeyPair');
            axolDecryptQueue.resume();
          });
        }, function (e) {
          Tools.log('FAILED generateIdentityKeyPair');
          axolDecryptQueue.resume();
        });
      } else {
        if (axolLocalReg) {
          Tools.log('LOCAL REGISTRATION ID', axolLocalReg.registrationId);
        } else {
          Tools.log('ENCRYPTION NOT SUPPORTED');
        }

        if (axolSendKeys && axolLocalReg) {
          sendSetKeys(myJid);
        }
        axolDecryptQueue.resume();
      }
    };
  };

  this.sync = function (callback) {
    var getStatusesAndPics = function (contacts) {
      contacts = contacts || this.account.core.chats.map(function(e){ return e.jid; });
      var status_contacts= contacts.filter(isNotGroupJid);

      MI.call('contacts_getStatus', [status_contacts]);

      contacts.push(this.account.core.fullJid);
      if ('roster' in this.account.core) {
        this.account.core.roster.forEach(function (item) {
          if (item.jid in App.avatars) { contacts.push(item.jid); }
        });
      }

      contacts = contacts.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
      });

      MI.call('picture_getIds', [contacts]);
    }.bind(this);

    if (!('roster' in this.account.core) || !this.account.core.roster.length) {
      this.contacts.sync(function () {
        callback(getStatusesAndPics);
      });

    } else {
      callback(getStatusesAndPics);
    }
  }.bind(this);

  this.contacts.getStatus = function (jids) {
    MI.call('contacts_getStatus', [jids]);
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
        };
        allContacts.onerror = function (event) {
          Tools.log('CONTACTS ERROR:', event);
          Lungo.Notification.error(_('ContactsGetError'), _('ContactsGetErrorExp'), 'exclamation-sign', 5);
          cb();
        };
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
    };

    this.presence.subscribe = function (jid) {
      MI.call('presence_subscribe', [jid]);
    }.bind(this);

    this.presence.unsubscribe = function (jid) {
      MI.call('presence_unsubscribe', [jid]);
    }.bind(this);

    this.presence.set = function (show, status, name) {
      this.presence.send(show, status, name);
      this.presence.show = show || this.presence.show;
      this.presence.status = status || this.presence.status;
      this.presence.name = name || this.presence.name;
      this.account.core.presence = {
        name: this.presence.name,
        show: this.presence.show,
        status: this.presence.status
      };
      this.account.save();
    }.bind(this);

    this.presence.send = function (show, status, name) {
      if (App.online) {
        show = show || this.presence.show;
        name = name || this.presence.name;
        var method = {
          a: 'presence_sendAvailable',
          away: 'presence_sendUnavailable',
          xa: 'presence_sendUnavailable',
          dnd: 'presence_sendUnavailable',
          chat: 'presence_sendAvailableForChat'
        };
        MI.call(method[show], [name]);

        var newStatus = status || this.presence.status;
        if (newStatus != this.presence.status) {
          MI.call('profile_setStatus', [newStatus]);
        }
      }
    }.bind(this);

    this.sendAsync = function (to, text, options) {
      return new Promise(function (ready, reject) {
        encryptMessage(to, text).then(function (m) {
          Tools.log('SEND ENCRYPTED', m);
          var msgId = MI.call('encrypt_sendMessage',
                              [null, to, m.body,
                               (m.isPreKeyWhisperMessage ? 'pkmsg' : 'msg'),
                               '1']);
          ready(msgId);
        }, function (e) {
          Tools.log('PLAINTEXT FALLBACK', e);
          var method = options.isBroadcast ? 'message_broadcast' : 'message_send';
          var msgId = MI.call(method, [null, to, text]);
          ready(msgId);
        });
      });
    }.bind(this);

    this.ack = function (id, from, type) {
      type = type || 'delivery';
      MI.call('message_ack', [from, id, type]);
    };

    this.avatar = function (callback, id) {
      var method = 'contact_getProfilePicture';
      MI.call(method, [id]);
      if (callback) {
        callback(new Avatar({url: 'img/foovatar.png'}));
      }
    };

    this.muc.avatar = function (callback, id) {
      var method = 'group_getPicture';
      MI.call(method, [id]);
      if (callback) {
        callback(new Avatar({url: 'img/goovatar.png'}));
      }
    };

    this.emojiRender = function (img, emoji) {
      App.emoji[Providers.data[this.account.core.provider].emoji].render(img, emoji);
    }.bind(this);

    this.csnSend = function (to, state) {
      var method = state == 'composing' ? 'typing_send' : 'typing_paused';
      MI.call(method, [to]);
    };

    this.groupsGet = function (type) {
      var method = 'group_getGroups';
      MI.call(method, [type]);
    };

    this.muc.participantsGet = function (jid) {
      var method = 'group_getInfo';
      MI.call(method, [jid]);
    }.bind(this);

    this.muc.create = function (subject, server, members) {
      var method = 'group_create';
      var idx = MI.call(method, [subject]);
      this.muc.membersCache[idx] = members;
    }.bind(this);

    this.muc.expel = function (gid, jid) {
      var [method, params] = jid ?
      ['group_removeParticipants', [gid, jid]] :
      ['group_end', [gid]];
      MI.call(method, params);
    }.bind(this);

    this.muc.invite = function (gid, members, title) {
      var method = 'group_addParticipants';
      MI.call(method, [gid, members]);
    }.bind(this);

    this.fileSend = function (jid, blob) {
      var reader = new FileReader();
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
    };

    this.locationSend = function (jid, loc) {
      var self = this;
      Tools.locThumb(loc, 120, 120, function (thumb) {
        var method = 'message_locationSend';
        MI.call(method, [jid, loc.lat, loc.long, thumb]);
        self.addMediaMessageToChat('url', thumb, 'https://maps.google.com/maps?q=' + loc.lat + ',' + loc.long, [ loc.lat, loc.long ], account.core.user, jid, Math.floor((new Date()).getTime() / 1000) + '-1');
        App.audio('sent');
      });
    };

    this.vcardSend = function (jid, name, vcard) {
      var self = this;
      Tools.vcardThumb(null, 120, 120, function (thumb) {
        var method = 'message_vcardSend';
        MI.call(method, [jid, vcard, name]);
        self.addMediaMessageToChat('vCard', thumb, null, [ name, vcard ], account.core.user, jid, Math.floor((new Date()).getTime() / 1000) + '-1');
      });
    };

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
    };

    this.handlers.init = function () {
      Tools.log('HANDLERS INIT');
      var signals = {
        auth_success: null,
        auth_fail: null,
        message_received: this.events.onMessage,
        image_received: this.events.onImageReceived,
        vcard_received: this.events.onVCardReceived,
        video_received: this.events.onVideoReceived,
        audio_received: this.events.onAudioReceived,
        location_received: this.events.onLocationReceived,
        message_error: this.events.onMessageError,
        receipt_messageSent: this.events.onMessageSent,
        receipt_messageError: this.events.onMessageError,
        receipt_messageRetry: this.events.onMessageRetry,
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
        group_vcardReceived: this.events.onGroupVCardReceived,
        group_videoReceived: this.events.onGroupVideoReceived,
        group_audioReceived: this.events.onGroupAudioReceived,
        group_locationReceived: this.events.onGroupLocationReceived,
        group_setPictureSuccess: null,
        group_setPictureError: null,
        group_gotPicture: this.events.onGroupGotPicture,
        group_gotGroups: null,
        group_gotParticipating: this.events.onGroupGotParticipating,
        notification_contactProfilePictureUpdated: this.events.onContactProfilePictureUpdated,
        notification_contactProfilePictureRemoved: this.events.onContactProfilePictureRemoved,
        notification_groupPictureUpdated: this.events.onGroupPictureUpdated,
        notification_groupPictureRemoved: this.events.onGroupPictureRemoved,
        notification_groupParticipantAdded: this.events.onGroupParticipantAdded,
        notification_groupParticipantRemoved: this.events.onGroupParticipantRemoved,
        notification_groupCreated: this.events.onGroupCreated,
        notification_groupSubjectUpdated: this.events.onGroupSubjectUpdated,
        notification_status: this.events.onContactStatusUpdated,
        notification_encrypt: this.events.onNotificationEncrypt,
        encrypt_gotKeys: this.events.onEncryptGotKeys,
        encrypt_messageReceived: this.events.onEncryptMessageReceived,
        encrypt_groupMessageReceived: this.events.onEncryptGroupMessageReceived,
        contact_gotProfilePictureId: this.events.onAvatar,
        contact_gotProfilePicture: this.events.onAvatar,
        contact_typing: this.events.onContactTyping,
        contact_paused: this.events.onContactPaused,
        contacts_gotStatus: this.events.onContactsGotStatus,
        contacts_sync: this.events.onContactsSync,
        profile_setPictureSuccess: this.events.onProfileSetPictureSuccess,
        profile_setPictureError: this.events.onProfileSetPictureError,
        profile_setStatusSuccess: this.events.onMessageDelivered,
        ping: null,
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

    this.events.onStatusDirty = function (categories) {
      var method = 'cleardirty';
      MI.call(method, [categories]);
    };

    this.events.onContactStatusUpdated = function (jid, msgId, status) {
      this.events.onPresenceUpdated(jid, undefined, status);

      var method = 'notification_ack';
      MI.call(method, [jid, msgId]);
    };

    this.events.onNotificationEncrypt = function (from, id, count) {
      var method = 'notification_ack';
      MI.call(method, [from, id]);

      if (axolLocalReg) {
        sendSetKeys(this.account.core.fullJid);
      } else {
        axolSendKeys = true;
      }
    };

    this.events.onEncryptGotKeys = function (keys, id) {
      Tools.log('GOT KEYS', keys);
      var myJid = this.account.core.fullJid;
      var data = requestData[id] || [];
      delete requestData[id];

      function prependType(type, buf) {
        var result = new Uint8Array(buf.byteLength + 1);
        result.set(new Uint8Array(buf), 1);
        result[0] = type.charCodeAt();
        return result.buffer;
      }

      function noSession(cpuLock, jid) {
        var tx = axolDb.transaction(['session'], 'readwrite');
        var req = tx.objectStore('session').delete([ myJid, jid ]);
        req.onsuccess = function (e) {
          var q = axolEncryptQueues[jid];
          if (q) { q.resume(); }
          cpuLock.unlock();
        };
      }

      for (var idx in keys) {
        var cpuLock = navigator.requestWakeLock('cpu');
        var v = keys[idx];
        var jid = v.jid;

        var dataIdx = data.indexOf(jid);
        if (dataIdx >= 0) {
          data.splice(dataIdx, 1);
        }

        if (v.key && v.skey) {
          axol.createSessionFromPreKeyBundle( {
            identityKey : prependType(v.type, v.identity),
            preKeyId : v.key.id,
            preKey : prependType(v.type, v.key.value),
            signedPreKeyId : v.skey.id,
            signedPreKey : prependType(v.type, v.skey.value),
            signedPreKeySignature : v.skey.signature
          }).then(function (session) {
            Tools.log('session created from pre keys', v.jid, session);
            var tx = axolDb.transaction(['session'], 'readwrite');
            var req = tx.objectStore('session').put({ jid : myJid,
                                                      remoteJid : v.jid,
                                                      session : session });
            req.onsuccess = function (e) {
              var q = axolEncryptQueues[jid];
              if (q) { q.resume(); }
              cpuLock.unlock();
            };
            req.onerror = function(e) {
              Tools.log('error storing session in db', v.jid);
            };
          }, function (e) {
            Tools.log('FAILED create session', v, e);
            noSession(cpuLock, v.jid);
          });
        } else {
          Tools.log('FAILED create session', v);
          noSession(cpuLock, v.jid);
        }
      }

      for (idx in data) {
        noSession(navigator.requestWakeLock('cpu'), data[idx]);
      }
    };

    this.events.onEncryptMessageReceived = function (msgId, from, msgData, type, v, count, timeStamp, pushName) {
      Tools.log('ENCRYPTED MESSAGE', msgData);

      var self = this;
      var msg = { jid : this.account.core.fullJid,
                  remoteJid : from,
                  msgId : msgId,
                  msgData : msgData.buffer,
                  type : type,
                  v : v,
                  count : count,
                  timeStamp : timeStamp,
                  pushName : pushName };

      var cpuLock = navigator.requestWakeLock('cpu');
      axolDecryptQueue.push({ self : self, msg : msg },
                            function () { cpuLock.unlock(); });
    };

    this.events.onEncryptGroupMessageReceived = function (msgId, from, author, msgData, type, v, count, timeStamp, pushName) {
      MI.call('message_error', [from, msgId, 'plaintext-only', author]);
    };

    this.events.onMessage = function (msgId, from, msgData, timeStamp, wantsReceipt, pushName, isBroadcast) {
      Tools.log('MESSAGE', msgId, from, msgData, timeStamp, wantsReceipt, pushName, isBroadcast);
      var account = this.account;
      var to = this.account.user + '@' + CoSeMe.config.domain;
      var body = msgData;
      if (body) {
        var date = new Date(timeStamp);
        var stamp = Tools.localize(Tools.stamp(timeStamp));
        var fromUser = from.split('@')[0];
        var msg = Make(Message)(account, {
          id: msgId,
          from: from,
          to: to,
          text: body,
          stamp: stamp,
          pushName: (pushName && pushName != fromUser) ? (fromUser + ': ' + pushName) : pushName
        });

        if (wantsReceipt) {
          msg.receive(function(){
            this.ack(msgId, from);
          }.bind(this));

        } else {
          msg.receive();
        }
      }
      return true;
    };

    this.events.onMessageError = function (id, from, body, stamp, e, nick, g) {
      Tools.log('MESSAGE NOT RECEIVED', id, from, body, stamp, e, nick, g);
    };

    this.events.onImageReceived = function (msgId, fromAttribute, mediaPreview, mediaUrl, mediaSize, wantsReceipt, isBroadcast, notifyName, timeStamp) {
      var to = this.account.core.fullJid;
      return this.mediaProcess('image',  msgId, fromAttribute, to, mediaPreview, mediaUrl, mediaSize, wantsReceipt, false, notifyName, timeStamp);
    };

    this.events.onVideoReceived = function (msgId, fromAttribute, mediaPreview, mediaUrl, mediaSize, wantsReceipt, isBroadcast, notifyName, timeStamp) {
      var to = this.account.core.fullJid;
      return this.mediaProcess('video', msgId, fromAttribute, to, mediaPreview, mediaUrl, mediaSize, wantsReceipt, false, notifyName, timeStamp);
    };

    this.events.onAudioReceived = function (msgId, fromAttribute, mediaUrl, mediaSize, wantsReceipt, isBroadcast, notifyName, timeStamp) {
      var to = this.account.core.fullJid;
      return this.mediaProcess('audio', msgId, fromAttribute, to, null, mediaUrl, mediaSize, wantsReceipt, false, notifyName, timeStamp);
    };

    this.events.onLocationReceived = function (msgId, fromAttribute, name, mediaPreview, mlatitude, mlongitude, wantsReceipt, isBroadcast, notifyName, timeStamp) {
      var to = this.account.core.fullJid;
      return this.mediaProcess('url', msgId, fromAttribute, to, [mlatitude, mlongitude, name], null, null, wantsReceipt, false, notifyName, timeStamp);
    };

    this.events.onVCardReceived = function (msgId, fromAttribute, vcardName, vcardData, wantsReceipt, isBroadcast, notifyName, timeStamp) {
      var to = this.account.core.fullJid;
      return this.mediaProcess('vCard', msgId, fromAttribute, to, [vcardName, vcardData], null, null, wantsReceipt, false, notifyName, timeStamp);
    };

    this.events.onAvatar = function (jid, picId, blob) {
      var account = this.account;
      var avatars= App.avatars;

      Tools.log(jid, picId, blob);
      if (blob) {
        if (jid == this.account.core.fullJid) {
          Tools.picThumb(blob, 96, 96, function (url) {
            $('section#main[data-jid="' + jid + '"] footer span.avatar img').attr('src', url);
            $('aside#accounts article#accounts div[data-jid="' + jid + '"] span.avatar img').attr('src', url);
            if (Accounts.current === account) {
              $('section#me .avatar img').attr('src', url);
            }
            Store.save(url, function (index) {
              avatars[jid] = (new Avatar({id: picId, chunk: index})).data;
              App.avatars= avatars;
            });
          });
        } else {

          Promise.all([
            new Promise(function(done){ Tools.blobToBase64(blob, done); }),
            new Promise(function(done){ Tools.picThumb(blob, 96, 96, done); })
          ]).then(function(values){
            var original= values[0];
            var tumb= values[1];

            var cb = function (values) {
              avatars[jid] = (new Avatar({id: picId, chunk: values[0], original : values[1]})).data;
              App.avatars= avatars;
            };

            $('ul[data-jid="' + account.core.fullJid + '"] [data-jid="' + jid + '"] span.avatar img').attr('src', tumb);
            $('section#chat[data-jid="' + jid + '"] span.avatar img').attr('src', tumb);

            if (jid in App.avatars) {
              var key = Store.lock(App.avatars[jid].chunk);

              Promise.all([
                new Promise(function(done){
                  Store.update(key, App.avatars[jid].chunk, tumb, done);
                  Store.unlock(App.avatars[jid].chunk, key);
                }),
                new Promise(function(done){
                  if(App.avatars[jid].original){
                    var key_o = Store.lock(App.avatars[jid].original);

                    Store.update(key_o, App.avatars[jid].original, original, function(id){
                      Store.unlock(App.avatars[jid].original, key_o);
                      done(id);
                    });

                  }else{
                    Store.save(original, done);
                  }

                })
              ]).then(cb);
            } else {
              Promise.all([
                new Promise(function(done){ Store.save(tumb, done); }),
                new Promise(function(done){ Store.save(original, done); })
              ]).then(cb);
            }
          });
        }
      } else if (picId) {
        if (!(jid in App.avatars) || App.avatars[jid].id != picId) {
          var method = 'contact_getProfilePicture';
          var params = [jid];
          MI.call(method, params);
        }
      } else {
        if (jid in avatars) {
          delete avatars[jid];
          App.avatars = avatars;
        }
      }
    };

    this.events.onContactTyping = function (from) {
      if (from == $('section#chat')[0].dataset.jid) {
        $("section#chat #typing").show();
      }
    };

    this.events.onContactPaused = function (from) {
      if (from == $('section#chat')[0].dataset.jid) {
        $("section#chat #typing").hide();
      }
    };

    this.events.onMessageSent = function (from, msgId) {
      Tools.log('SENT', from, msgId);
      account.markMessage.push({from : from, msgId : msgId});
    };

    this.events.onMessageError = function (from, msgId, participant, errorType) {
      var cpuLock = navigator.requestWakeLock('cpu');
      Tools.log('ERROR', from, msgId);
      account.findMessage(from, msgId, function (msg) {
        if (errorType == 'plaintext-only') {
          MI.call('message_send', [msg.id, from, msg.text]);
        }
        cpuLock.unlock();
      }.bind(this));

      MI.call('delivered_ack', [from, msgId, 'error']);
    };

    this.events.onMessageRetry = function (from, msgId, participant, count, regId) {
      var cpuLock = navigator.requestWakeLock('cpu');
      var myJid = account.core.fullJid;
      Tools.log('RETRY', from, msgId);
      account.findMessage(from, msgId, function (msg) {
        var q = axolEncryptQueues[from];
        if (!q || !q.paused) {
          if (!q) {
            q = async.queue(encryptMessageWorker);
            axolEncryptQueues[from] = q;
          }

          q.pause();

          var id = MI.call('encrypt_getKeys', [ [ from ] ]);
          requestData[id] = [ from ];
        }

        q.push({ remoteJid : from,
                 plaintext : msg.text,
                 ready : function (m) {
                   var msgId = MI.call('encrypt_sendMessage',
                                       [msg.id, from, m.body,
                                        (m.isPreKeyWhisperMessage ? 'pkmsg' : 'msg'),
                                        '1', '1']);
                 },
                 reject : function (e) {
                   var msgId = MI.call('message_send', [msg.id, from, msg.text]);
                 } });

        cpuLock.unlock();
      }.bind(this));

      MI.call('delivered_ack', [from, msgId, 'retry']);
    };

    this.events.onMessageDelivered = function (from, msgId, type) {
      var account = this.account;
      var chat = account.chatGet(from);
      chat.core.lastAck = Tools.localize(Tools.stamp());
      chat.save();
      account.markMessage.push({from : from, msgId : msgId,
                                type : type || 'delivery'});
      Tools.log('DELIVERED', from, msgId, type);
      MI.call('delivered_ack', [from, msgId, type]);
    };

    this.events.onMessageVisible = function (from, msgId) {
      Tools.log('VISIBLE', from, msgId);
      MI.call('visible_ack', [from, msgId]);
    };

    this.events.onGroupInfoError = function (jid, owner, subject, subjectOwner, subjectTime, creation) {
      Tools.log('ERROR GETTING GROUP INFO', jid, owner, subject, subjectOwner, subjectTime, creation);
    };

    this.events.onGroupGotParticipating = function (groups, id) {
      for (let [i, group] in Iterator(groups)) {
        this.events.onGroupGotInfo.bind(this)(group.gid + '@g.us', group.owner, group.subject, group.subjectOwner, group.subjectT, group.creation, group.participants);
      }
    };

    this.events.onGroupGotInfo = function (jid, owner, subject, subjectOwner, subjectTime, creation, participants) {
      var info = {
        owner: owner,
        subjectOwner: subjectOwner,
        subjectTime: subjectTime,
        creation: creation
      };
      var account = this.account;
      var ci = account.chatFind(jid);
      var chat = null;
      if (ci >= 0) {
        chat = account.chats[ci];
        var newTitle = decodeURIComponent(subject);
        chat.core.title = newTitle;
        chat.core.info = info;
        chat.core.participants = participants;
        chat.save();
      } else {
        chat = Make(Chat)({
          jid: jid,
          title: decodeURIComponent(subject),
          muc: true,
          creation: creation,
          owner: owner,
          participants: participants,
          chunks: [],
          info: info
        }, account);
        account.chats.push(chat);
        account.core.chats.push(chat.core);
        chat.save(true);
      }
    };

    this.events.onGroupGotPicture = function (jid, picId, blob) {
      var account = this.account;
      var avatars= App.avatars;

      if (blob) {
        Promise.all([
          new Promise(function(done){ Tools.picThumb(blob, 96, 96, done); }),
          new Promise(function(done){ Tools.blobToBase64(blob, done); })
        ]).then(function (values) {
          var thumb= values[0];
          var original= values[1];

          $('ul[data-jid="' + account.core.fullJid + '"] li[data-jid="' + jid + '"] span.avatar img').attr('src', thumb);
          $('section#chat[data-jid="' + jid + '"] span.avatar img').attr('src', thumb);
          Promise.all([
            new Promise(function(done){ Store.save(thumb, done); }),
            new Promise(function(done){ Store.save(original, done); })
          ]).then(function(values) {
            avatars[jid] = (new Avatar({id: picId, chunk: values[0], original : values[1]})).data;
            App.avatars= avatars;
          });
        });
      }
    };

    this.events.onGroupGotParticipants = function (jid, participants) {
      var account = this.account;
      var ci = account.chatFind(jid);
      if (ci >= 0) {
        var chat = account.chats[ci];
        if (!chat.core.participants || (JSON.stringify(chat.core.participants) != JSON.stringify(participants))) {
          chat.core.participants = participants;
          chat.save();
          if ($('section#chat').hasClass('show') && $('section#chat')[0].dataset.jid == chat.core.jid) {
            chat.show();
          }
        }
      }
    };

    this.events.onGroupAddParticipantsSuccess = function (jid, participants) {
      var account = this.account;
      var ci = account.chatFind(jid);
      if (ci >= 0) {
        var chat = account.chats[ci];
        chat.core.participants = chat.core.participants.concat(participants);
        chat.save();
        if ($('section#chat').hasClass('show') && $('section#chat')[0].dataset.jid == chat.core.jid) {
          chat.show();
        }
      }
    };

    this.events.onGroupRemoveParticipantsSuccess = function (jid, participants) {
      Lungo.Notification.success(_('Removed'), null, 'trash', 3);
    };

    this.events.onGroupEndSuccess = function (gid) {
      Lungo.Notification.success(_('Removed'), null, 'trash', 3);
    };

    this.events.onGroupCreateSuccess = function (gid, idx) {
      Lungo.Notification.show('download', _('Synchronizing'), 5);
      Lungo.Router.section('back');
      var members = this.muc.membersCache[idx];
      MI.call('group_addParticipants', [gid, members]);
      delete this.muc.membersCache[idx];
    };

    this.events.onGroupMessage = function (msgId, from, author, data, stamp, wantsReceipt, pushName) {
      Tools.log('GROUPMESSAGE', msgId, from, author, data, stamp, wantsReceipt, pushName);
      var account = this.account;
      var to = from;
      from = author;
      var body = data;
      if (body) {
        var date = new Date(stamp);
        stamp = Tools.localize(Tools.stamp(stamp));
        var fromUser = from.split('@')[0];
        var msg = Make(Message)(account, {
          from: from,
          to: to,
          text: body,
          stamp: stamp,
          id : msgId,
          pushName: (pushName && pushName != fromUser) ? (fromUser + ': ' + pushName) : pushName
        }, {
          muc: true
        });
        Tools.log('RECEIVED', msg);
        if (wantsReceipt) {
          msg.receive(function(){
            this.ack(msgId, to);
          }.bind(this));
        } else {
          msg.receive();
        }
      }
      return true;
    };

    this.events.onContactProfilePictureUpdated = function (from, stamp, msgId, pictureId, jid) {
      var method = 'notification_ack';
      MI.call(method, [from, msgId]);
      this.events.onAvatar(from, pictureId);
    };

    this.events.onContactProfilePictureRemoved = function (from, stamp, msgId, pictureId, jid) {
      var method = 'notification_ack';
      MI.call(method, [from, msgId]);
    };

    this.events.onGroupPictureUpdated = function (from, stamp, msgId, pictureId, jid) {
      var method = 'notification_ack';
      MI.call(method, [from, msgId]);
    };

    this.events.onGroupPictureRemoved = function (from, stamp, msgId, pictureId, jid) {
      var method = 'notification_ack';
      MI.call(method, [from, msgId]);
      this.events.onAvatar(from, pictureId);
    };

    this.events.onGroupParticipantAdded = function (from, jid, _, stamp, msgId) {
      var method = 'notification_ack';
      MI.call(method, [from, msgId]);
      this.muc.participantsGet(from);
    };

    this.events.onGroupParticipantRemoved = function (from, jid, _, stamp, msgId) {
      var method = 'notification_ack';
      MI.call(method, [from, msgId]);
      if (jid != this.account.core.fullJid) {
        this.muc.participantsGet(from);
      }
    };

    this.events.onGroupCreated = function (from, stamp, msgId, subject, displayName, author) {
      var method = 'notification_ack';
      MI.call(method, [from, msgId]);
      this.muc.participantsGet(from);
    };

    this.events.onGroupSubjectUpdated = function (from, stamp, msgId, subject, displayName, author) {
      var method = 'notification_ack';
      MI.call(method, [from, msgId]);
      this.muc.participantsGet(from);
    };

    this.events.onGroupImageReceived = function (msgId, group, author, mediaPreview, mediaUrl, mediaSize, wantsReceipt, notifyName, timeStamp) {
      return this.mediaProcess('image', msgId, author, group, mediaPreview, mediaUrl, mediaSize, wantsReceipt, true, notifyName, timeStamp);
    };

    this.events.onGroupVideoReceived = function (msgId, group, author, mediaPreview, mediaUrl, mediaSize, wantsReceipt, notifyName, timeStamp) {
      return this.mediaProcess('video', msgId, author, group, mediaPreview, mediaUrl, mediaSize, wantsReceipt, true, notifyName, timeStamp);
    };

    this.events.onGroupAudioReceived = function (msgId, group, author, mediaUrl, mediaSize, wantsReceipt, notifyName, timeStamp) {
      return this.mediaProcess('audio', msgId, author, group, null, mediaUrl, mediaSize, wantsReceipt, true, notifyName, timeStamp);
    };

    this.events.onGroupLocationReceived = function (msgId, group, author, name, mediaPreview, mlatitude, mlongitude, wantsReceipt, notifyName, timeStamp) {
      return this.mediaProcess('url', msgId, author, group, [mlatitude, mlongitude, name], null, null, wantsReceipt, true, notifyName, timeStamp);
    };

    this.events.onGroupVCardReceived = function (msgId, group, author, vcardName, vcardData, wantsReceipt, notifyName, timeStamp) {
      return this.mediaProcess('vCard', msgId, author, group, [vcardName, vcardData], null, null, wantsReceipt, true, notifyName, timeStamp);
    };

    this.events.onContactsGotStatus = function (id, statuses) {
      var i = Iterator(statuses);
      for (let [jid, status] in i) {
        this.events.onPresenceUpdated(jid, undefined, status);
      }
    };

    this.events.onContactsSync = function (id, positive, negative) {
      this.account.core.roster = [];
      for (var i in positive) {
        var contact = positive[i];
        this.account.core.roster.push({
          jid: contact.jid,
          name: this.contacts._pre[contact.phone],
          presence: {
            last: null,
            show: 'na',
            status: null
          }
        });
        var ci = this.account.chatFind(contact.jid);
        if (ci > -1) {
          var chat = this.account.chats[ci].core;
          chat.title = this.contacts._pre[contact.phone];
        }
      }
      this.contacts.order(this.contacts._cb);
      this.account.save();
      this.account.allRender();
    };

    this.events.onPresenceUpdated = function (jid, lastSeen, msg) {
      var account = this.account;
      var contact = Lungo.Core.findByProperty(this.account.core.roster, 'jid', jid);
      if (contact) {
        if (!('presence' in contact)) {
          contact.presence = {};
        }
        if (msg && msg != contact.presence.status) {
          contact.presence.status = msg;
          account.presenceRender(jid);
        }
      }
    }.bind(this);

    this.events.onPresenceAvailable = function (jid) {
      var contact = Lungo.Core.findByProperty(this.account.core.roster, 'jid', jid);
      if (contact) {
        Tools.log('PRESENCE for', jid, 'WAS', contact.presence.show, 'NOW IS', 'a');
        contact.presence.show = 'a';
        account.presenceRender(jid);
      }
    };

    this.events.onPresenceUnavailable = function (jid, last) {
      var contact = Lungo.Core.findByProperty(this.account.core.roster, 'jid', jid);
      if (contact) {
        Tools.log('PRESENCE for', jid, 'WAS', contact.presence.show, 'NOW IS', 'away');
        contact.presence.show = 'away';
        contact.presence.last = last;
        account.presenceRender(jid);
      }
    };

    this.events.onProfileSetPictureSuccess = function (pictureId) {
      Tools.log('CHANGED AVATAR TO', pictureId);
      this.events.onAvatar(this.account.core.fullJid, pictureId);
    };

    this.events.onProfileSetPictureError = function (err) {
      Lungo.Notification.error(_('NotUploaded'), _('ErrorUploading'), 'warning-sign', 5);
    };

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
          self.addMediaMessageToChat(type, thumb, url, null, account.core.user, toJID, Math.floor((new Date()).getTime() / 1000) + '-1');
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
    };
    this.events.onUploadRequestFailed = function (hash) {
      Lungo.Notification.error(_('NotUploaded'), _('ErrorUploading'), 'warning-sign', 5);
    };
    this.events.onUploadRequestDuplicate = function (hash) {
      Lungo.Notification.error(_('NotUploaded'), _('DuplicatedUpload'), 'warning-sign', 5);
    };
    this.addMediaMessageToChat = function(type, data, url, payload, from, to, id) {
      var account = this.account;
      var msgMedia = {
        type: type,
        thumb: data,
        payload: payload,
        url: url,
        downloaded: true
      };
      var stamp = Tools.localize(Tools.stamp());
      var msg = Make(Message)(account, {
        from: account.core.user,
        id: id,
        to: to,
        media: msgMedia,
        stamp: stamp
      });
      msg.addToChat();
    };

    this.mediaProcess = function (fileType, msgId, from, to, payload, mediaUrl, mediaSize, wantsReceipt, isGroup, notifyName, timeStamp) {
      Tools.log('Processing file of type', fileType);
      var process = function (thumb) {
        var media = {
          type: fileType,
          thumb: thumb,
          payload: mediaUrl ? null : payload,
          url: mediaUrl,
          downloaded: false
        };
        var stamp = Tools.localize(Tools.stamp(timeStamp));
        var name = notifyName ? from.split('@')[0] + ': ' + notifyName : null;
        var msg = {
          id: msgId,
          from: from,
          to: to,
          media: media,
          stamp: stamp,
          sender: name
        };
        if (isGroup) {
          msg.pushName = name || from;
        }
        msg = Make(Message)(this.account, msg, {
          muc: isGroup
        });
        msg.receive();
        this.ack(msgId, isGroup ? to : from);
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
        mediaUrl = 'https://maps.google.com/maps?q=' + payload[0] + ',' + payload[1];
        process('img/location.png');
        break;
        case 'vCard':
        process('img/contact.png');
        break;
      }
    };

  };

  App.logForms.coseme = function (provider, article) {
    var data = Providers.data[provider];
    return {
      get html () {
        var country= null;
        if (article) {
          article
          .append($('<h1/>').css('color', data.color).html(_('SettingUp', { provider: data.longName })))
          .append($('<img/>').attr('src', 'img/providers/' + provider + '.svg'));
          var sms = $('<div/>').addClass('sms')
          .append($('<p/>').text(_('ProviderSMS', { provider: data.longName })))
          .append($('<label/>').attr('for', 'countrySelect').text(_(data.terms.country)));
          var countrySelect = $('<select/>').attr('name', 'countrySelect');
          var countries = Tools.countries();
          countrySelect.append($('<option/>').attr('value', '').text('-- ' + _('YourCountry')));
          for (var i in countries) {
            country = countries[i];
            countrySelect.append($('<option/>').attr('value', country.dial).text(country.name));
          }
          sms
          .append(countrySelect)
          .append($('<label/>').attr('for', 'user').text(_(data.terms.user)))
          .append($('<input/>')
          .attr('type', 'number')
          .attr('name', 'country')
          .attr('disabled', 'true')
          .css('width', '3rem')
          .addClass('spaced')
        )
        .append($('<input/>')
        .attr('type', 'number')
        .attr('name', 'user')
        .css('width', 'calc(100% - 8rem)')
      );
      var smsButtons = $('<div/>').addClass('buttongroup');
      var smsReq = $('<button/>').addClass('smsReq').css('backgroundColor', data.color).text(_('SMSRequest'));
      smsReq[0].dataset.role= 'submit';
      var voiceReq = $('<button/>').addClass('voiceReq').css('backgroundColor', data.color).text(_('VoiceRequest'));
      voiceReq[0].dataset.role= 'submit';
      var codeReady = $('<button/>').addClass('codeReady').css('backgroundColor', data.color).text(_('codeReady'));
      codeReady[0].dataset.role= 'submit';
      var back = $('<button/>').addClass('back').text(_('GoBack'));
      smsButtons.append(smsReq).append(voiceReq).append(codeReady).append(back);
      sms.append(smsButtons);
      var code = $('<div/>').addClass('code hidden')
      .append($('<p>').text(_('recodeLabel')))
      .append($('<input/>')
      .attr('type', 'number')
      .attr('name', 'rCode')
      .attr('placeholder', '123456')
    );
    var codeButtons = $('<div/>').addClass('buttongroup');
    back = $('<button/>').addClass('back').text(_('GoBack'));
    var validate = $('<button/>').addClass('valCode').css('backgroundColor', data.color).text(_('CodeValidate'));
    codeButtons.append(validate);
    codeButtons.append(back);
    code.append(codeButtons);
    var recode = $('<div/>').addClass('recode hidden')
    .append($('<p/>').text(_('recodeSMS', { provider: data.longName })))
    .append($('<label/>').attr('for', 'countrySelect').text(_(data.terms.country)));
    countrySelect = $('<select/>').attr('name', 'countrySelect');
    countries = Tools.countries();
    countrySelect.append($('<option/>').attr('value', '').text('-- ' + _('YourCountry')));
    for (i in countries) {
      country = countries[i];
      countrySelect.append($('<option/>').attr('value', country.dial).text(country.name));
    }
    recode
    .append(countrySelect)
    .append($('<label/>').attr('for', 'user').text(_(data.terms.user)))
    .append($('<input/>')
    .attr('type', 'number')
    .attr('name', 'country')
    .attr('disabled', 'true')
    .css('width', '3rem')
    .addClass('spaced')
  )
  .append($('<input/>')
  .attr('type', 'number')
  .attr('name', 'user')
  .css('width', 'calc(100% - 8rem)')
)
.append($('<label/>').attr('for', 'user').text(_('recodeLabel')))
.append($('<input/>')
.attr('type', 'number')
.attr('name', 'rCode')
.attr('placeholder', '123456')
);
var recodeButtons = $('<div/>').addClass('buttongroup');
var valCode = $('<button/>').addClass('valCode').css('backgroundColor', data.color).text(_('recodeRequest'));
valCode[0].dataset.role= 'submit';
var sback = $('<button/>').addClass('sback').text(_('GoBack'));
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
}
},
events: function (target) {
  var form = target.closest('div:not(.buttongroup)');
  var article = form.closest('article')[0];
  var provider= null;
  var user= null;
  var cc= null;
  var codeGet= null;
  var onhasid= null;
  var onneedsid= null;
  if (target.attr('name') == 'countrySelect') {
    form.find('input[name="country"]').val(target.val());
  } else if (target.hasClass('codeReady')) {
    form.addClass('hidden');
    form.siblings('.recode').removeClass('hidden');
  } else if (target.hasClass('codeReady')) {
    form.addClass('hidden');
    form.siblings('.recode').removeClass('hidden');
  } else if (target.hasClass('sback')) {
    form.addClass('hidden');
    form.siblings('.sms').removeClass('hidden');
  } else if (target.hasClass('smsReq')) {
    provider = article.parentNode.id;
    user = $(article).find('[name="user"]').val();
    cc  = $(article).find('[name="country"]').val();
    if (cc && user) {
      Lungo.Notification.show('envelope', _('SMSsending'));
      codeGet = function (deviceId) {
        $(article)[0].dataset.deviceId= deviceId;
        var onsent = function (data) {
          Tools.log(data);
          if (data.status == 'sent') {
            Tools.log('Sent SMS to', cc, user, 'with DID', deviceId, 'retry after', data.retry_after);
            Lungo.Notification.success(_('SMSsent'), _('SMSsentExp'), 'envelope', 3);
            form.addClass('hidden');
            form.siblings('.code').removeClass('hidden');
          } else if (data.status == 'ok') {
            if (data.type == 'existing' || data.type == 'new') {
              var account = Make(Account)({
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
        };
        var onerror = function (data) {};
        deviceId = CoSeMe.registration.getCode(cc, user, onsent, onerror, deviceId, 0, 0, document.webL10n.getLanguage(), 'sms');
      };
      onhasid = function (file) {
        var onread = function (deviceId) {
          codeGet(deviceId);
        };
        Tools.textUnblob(file, onread);
      };
      onneedsid = function (error) {
        var deviceId = Math.random().toString(36).substring(2);
        Store.SD.save('.coseme.id', [deviceId]);
        codeGet(deviceId);
      };
      CosemeConnectorHelper.updateTokenData(function () {
        Store.SD.recover('.coseme.id', onhasid, onneedsid);
      });
    }
  } else if (target.hasClass('voiceReq')) {
    provider = article.parentNode.id;
    user = $(article).find('[name="user"]').val();
    cc  = $(article).find('[name="country"]').val();
    if (cc && user) {
      Lungo.Notification.show('phone', _('Voicesending'));
      codeGet = function (deviceId) {
        $(article)[0].dataset.deviceId= deviceId;
        var onsent = function (data) {
          Tools.log(data);
          if (data.status == 'sent') {
            Tools.log('Sent phone call to', cc, user, 'with DID', deviceId, 'retry after', data.retry_after);
            Lungo.Notification.success(_('voicesent'), _('voicesentExp'), 'phone', 3);
            form.addClass('hidden');
            form.siblings('.code').removeClass('hidden');
          } else if (data.status == 'ok') {
            if (data.type == 'existing' || data.type == 'new') {
              var account = Make(Account)({
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
            Tools.log('Could not sent phone call', 'Reason:', data.reason, 'with DID', deviceId);
            Lungo.Notification.error(_('VoicenotSent'), _('SMSreason_' + data.reason, {retry: data.retry_after}), 'exclamation-sign', 5);
          }
        };
        var onerror = function (data) {};
        deviceId = CoSeMe.registration.getCode(cc, user, onsent, onerror, deviceId, 0, 0, document.webL10n.getLanguage(), 'voice');
      };
      onhasid = function (file) {
        var onread = function (deviceId) {
          codeGet(deviceId);
        };
        Tools.textUnblob(file, onread);
      };
      onneedsid = function (error) {
        var deviceId = Math.random().toString(36).substring(2);
        Store.SD.save('.coseme.id', [deviceId]);
        codeGet(deviceId);
      };
      CosemeConnectorHelper.updateTokenData(function () {
        Store.SD.recover('.coseme.id', onhasid, onneedsid);
      });
    }
  } else if (target.hasClass('valCode')) {
    provider = article.parentNode.id;
    user = form.find('[name="user"]').val() ||
    form.siblings('.sms').find('[name="user"]').val();
    cc  = form.find('[name="country"]').val() ||
    form.siblings('.sms').find('[name="country"]').val();
    var rCode = form.find('[name="rCode"]').val().replace(/\D/g,'');
    if (rCode) {
      var register = function (deviceId) {
        var onready = function (data) {
          Tools.log(data);
          if (data.type == 'existing' || data.type == 'new') {
            var account = Make(Account)({
              user: user,
              cc: cc,
              data: data,
              provider: provider,
              resource: App.defaults.Account.core.resource,
              enabled: true,
              chats: []
            });
            account.test();
          }
        };
        var onerror = function (error) {
          Tools.log('Not valid', 'Reason:', data.reason);
          Lungo.Notification.error(_('CodeNotValid'), _('CodeReason_' + data.reason, {retry: data.retry_after}), 'exclamation-sign', 5);
        };
        Lungo.Notification.show('copy', _('CodeValidating'));
        CoSeMe.registration.register(cc, user, rCode, onready, onerror, deviceId);
      };
      onhasid = function (file) {
        var onread = function (deviceId) {
          register(deviceId);
        };
        Tools.textUnblob(file, onread);
      };
      onneedsid = function (error) {
        var deviceId = Math.random().toString(36).substring(2);
        Store.SD.save('.coseme.id', [deviceId]);
        register(deviceId);
      };
      Store.SD.recover('.coseme.id', onhasid, onneedsid);
    }
  }
}
};
};

App.emoji.coseme = {

  map: [
    // Smileys
    ["e415","1f604"],["e057","1f603"],["1f600","1f600"],["e056","1f60a"],["e414","263a"],["e405","1f609"],["e106","1f60d"],["e418","1f618"],["e417","1f61a"],["1f617","1f617"],["1f619","1f619"],["e105","1f61c"],["e409","1f61d"],["1f61b","1f61b"],["e40d","1f633"],["e404","1f601"],["e40a","1f614"],["e403","1f60c"],["e40e","1f612"],["e058","1f61e"],["e406","1f623"],["e413","1f622"],["e412","1f602"],["e411","1f62d"],["e408","1f62a"],["e401","1f625"],["e40f","1f630"],["1f605","1f605"],["e108","1f613"],["1f629","1f629"],["1f62b","1f62b"],["e40b","1f628"],["e107","1f631"],["e059","1f620"],["e416","1f621"],["1f624","1f624"],["e407","1f616"],["1f606","1f606"],["1f60b","1f60b"],["e40c","1f637"],["1f60e","1f60e"],["1f634","1f634"],["1f635","1f635"],["e410","1f632"],["1f61f","1f61f"],["1f626","1f626"],["1f627","1f627"],["1f608","1f608"],["e11a","1f47f"],["1f62e","1f62e"],["1f62c","1f62c"],["1f610","1f610"],["1f615","1f615"],["1f62f","1f62f"],["1f636","1f636"],["1f607","1f607"],["e402","1f60f"],["1f611","1f611"],
    // Faces
    ["e516","1f472"],["e517","1f473"],["e152","1f46e"],["e51b","1f477"],["e51e","1f482"],["e51a","1f476"],["e001","1f466"],["e002","1f467"],["e004","1f468"],["e005","1f469"],["e518","1f474"],["e519","1f475"],["e515","1f471"],["e04e","1f47c"],["e51c","1f478"],["1f63a","1f63a"],["1f638","1f638"],["1f63b","1f63b"],["1f63d","1f63d"],["1f63c","1f63c"],["1f640","1f640"],["1f63f","1f63f"],["1f639","1f639"],["1f63e","1f63e"],["1f479","1f479"],["1f47a","1f47a"],["1f648","1f648"],["1f649","1f649"],["1f64a","1f64a"],["e11c","1f480"],["e10c","1f47d"],["e05a","1f4a9"],
    // Elements
    ["e11d","1f525"],["e32e","2728"],["e32f","1f31f"],["1f4ab","1f4ab"],["1f4a5","1f4a5"],["e334","1f4a2"],["e331","1f4a6"],["1f4a7","1f4a7"],["e13c","1f4a4"],["e330","1f4a8"],
    // Parts of the body
    ["e41b","1f442"],["e419","1f440"],["e41a","1f443"],["1f445","1f445"],["e41c","1f444"],["e00e","1f44d"],["e421","1f44e"],["e420","1f44c"],["e00d","1f44a"],["e010","270a"],["e011","270c"],["e41e","1f44b"],["e012","270b"],["e422","1f450"],["e22e","1f446"],["e22f","1f447"],["e231","1f449"],["e230","1f448"],["e427","1f64c"],["e41d","1f64f"],["e00f","261d"],["e41f","1f44f"],["e14c","1f4aa"],["e201","1f6b6"],["e115","1f3c3"],["e51f","1f483"],["e428","1f46b"],["1f46a","1f46a"],["1f46c","1f46c"],["1f46d","1f46d"],["e111","1f48f"],["e425","1f491"],["e429","1f46f"],["e424","1f646"],["e423","1f645"],["e253","1f481"],["1f64b","1f64b"],["e31e","1f486"],["e31f","1f487"],["e31d","1f485"],["1f470","1f470"],["1f64e","1f64e"],["1f64d","1f64d"],["e426","1f647"],
    // Clothes
    ["e503","1f3a9"],["e10e","1f451"],["e318","1f452"],["e007","1f45f"],["1f45e","1f45e"],["e31a","1f461"],["e13e","1f460"],["e31b","1f462"],["e006","1f455"],["e302","1f454"],["1f45a","1f45a"],["e319","1f457"],["1f3bd","1f3bd"],["1f456","1f456"],["e321","1f458"],["e322","1f459"],["e11e","1f4bc"],["e323","1f45c"],["1f45d","1f45d"],["1f45b","1f45b"],["1f453","1f453"],["e314","1f380"],["e43c","1f302"],["e31c","1f484"],
    // Love and social
    ["e32c","1f49b"],["e32a","1f499"],["e32d","1f49c"],["e32b","1f49a"],["e022","2764"],["e023","1f494"],["e328","1f497"],["e327","1f493"],["1f495","1f495"],["1f496","1f496"],["1f49e","1f49e"],["e329","1f498"],["1f48c","1f48c"],["e003","1f48b"],["e034","1f48d"],["e035","1f48e"],["1f464","1f464"],["1f465","1f465"],["1f4ac","1f4ac"],["e536","1f463"],["1f4ad","1f4ad"],
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
    ["1f46e","1f46e"],
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
    ["1f3bf","1f3bf"],
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
    ["1f52b","1f52b"],
    ["e44c","1f308"],
    ["e132","1f3c1"],
    ["e143","1f38c"]
  ],

  charToData: function (char) {
    var data = char;
    for (var i in this.map) {
      var code = this.map[i][0];
      if (code == char) {
        data = 'data:image/gif;base64,' + this.map[i][2];
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
    img.attr('src', '/img/emoji/coseme/' + code + '.png');
    img[0].dataset.emoji= String.fromCodePoint(parseInt(emoji[1], 16));
  }

};
