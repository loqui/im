/* global IDBKeyRange, App, CoSeMe, Providers, Tools, Avatar, Store, Message, Chat, Account, Accounts, Lungo, Make, async, axolotl, axolotlCrypto, dcodeIO, emojione */

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

  proto : dcodeIO.ProtoBuf.newBuilder({})['import']({
    "package": "com.whatsapp.proto",
    "messages": [
        {
            "name": "Message",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "conversation",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "SenderKeyDistributionMessage",
                    "name": "sender_key_distribution_message",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "ImageMessage",
                    "name": "image_message",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "ContactMessage",
                    "name": "contact_message",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "LocationMessage",
                    "name": "location_message",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "UrlMessage",
                    "name": "url_message",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "DocumentMessage",
                    "name": "document_message",
                    "id": 7
                },
                {
                    "rule": "optional",
                    "type": "AudioMessage",
                    "name": "audio_message",
                    "id": 8
                },
                {
                    "rule": "optional",
                    "type": "VideoMessage",
                    "name": "video_message",
                    "id": 9
                }
            ]
        },
        {
            "name": "SenderKeyDistributionMessage",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "group_id",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "axolotl_sender_key_distribution_message",
                    "id": 2
                }
            ]
        },
        {
            "name": "ImageMessage",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "url",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "mime_type",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "caption",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "file_sha256",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "uint64",
                    "name": "file_length",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "height",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "width",
                    "id": 7
                },
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "media_key",
                    "id": 8
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "jpeg_thumbnail",
                    "id": 16
                }
            ]
        },
        {
            "name": "LocationMessage",
            "fields": [
                {
                    "rule": "required",
                    "type": "double",
                    "name": "degrees_latitude",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "double",
                    "name": "degrees_longitude",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "name",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "address",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "url",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "jpeg_thumbnail",
                    "id": 16
                }
            ]
        },
        {
            "name": "DocumentMessage",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "url",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "mime_type",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "title",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "file_sha256",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "uint64",
                    "name": "file_length",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "page_count",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "media_key",
                    "id": 7
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "jpeg_thumbnail",
                    "id": 16
                }
            ]
        },
        {
            "name": "UrlMessage",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "text",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "matched_text",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "canonical_url",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "description",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "title",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "jpeg_thumbnail",
                    "id": 16
                }
            ]
        },
        {
            "name": "AudioMessage",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "url",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "mime_type",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "file_sha256",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "uint64",
                    "name": "file_length",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "uint64",
                    "name": "duration",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "unk",
                    "id": 6
                },
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "media_key",
                    "id": 7
                }
            ]
        },
        {
            "name": "VideoMessage",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "url",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "mime_type",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "file_sha256",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "uint64",
                    "name": "file_length",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "uint64",
                    "name": "duration",
                    "id": 5
                },
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "media_key",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "caption",
                    "id": 7
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "jpeg_thumbnail",
                    "id": 16
                }
            ]
        },
        {
            "name": "ContactMessage",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "display_name",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "string",
                    "name": "vcard",
                    "id": 16
                }
            ]
        }
    ]
  }).build(),

  _axolLoaded : function () {
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

    return loadScript('scripts/curve25519-js/axlsign.js').then(function () {
      return (window.crypto.subtle ? Promise.resolve(null) : loadScript('scripts/vibornoff/asmcrypto.js')).then(function () {
        return loadScript('scripts/joebandenburg/axolotl-crypto.js').then(function () {
          return loadScript('scripts/joebandenburg/axolotl.js');
        });
      });
    });
  }(),

  _initPromise : null,

  init : function () {
    if (!this._initPromise) {
      var self = this;
      this._initPromise = this._axolLoaded.then(function () {
        CoSeMe.config.customLogger = Tools;
        CoSeMe.config.customStorage = Store.Config;

        return Promise.all(self.tokenDataKeys.map(function (key) {
          return Store.Config.get('CoSeMe.tokenData.' + key)
            .then(function (value) {
              CoSeMe.config.tokenData[key] = (value !== null) ? value : CoSeMe.config.tokenData[key];
            });
        }));
      }).then(function () {
        return new Promise(function (resolve, reject) {
          var req = window.indexedDB.open('AxolotlStore', 2);
          req.onerror = function(e) {
            Tools.log('init onerror', e);
          };
          req.onsuccess = function(e) {
            Tools.log('init onsuccess');
            resolve(req.result);
          };
          req.onupgradeneeded = function(e) {
            var db = req.result;
            Tools.log('init onupgradeneeded', db);

            if (!db.objectStoreNames.contains('localReg'))
            {
              db.createObjectStore('localReg',
                                   { keyPath : 'jid' });
            }
            if (!db.objectStoreNames.contains('localKeys'))
            {
              db.createObjectStore('localKeys',
                                   { keyPath : [ 'jid', 'id' ] });
            }
            if (!db.objectStoreNames.contains('localSKeys'))
            {
              db.createObjectStore('localSKeys',
                                   { keyPath : [ 'jid', 'id' ] });
            }
            if (!db.objectStoreNames.contains('session'))
            {
              db.createObjectStore('session',
                                   { keyPath : [ 'jid', 'remoteJid' ] });
            }
            if (!db.objectStoreNames.contains('sksession'))
            {
              db.createObjectStore('sksession',
                                   { keyPath : [ 'jid', 'groupJid', 'remoteJid' ] });
            }
          };
        });
      });
    }

    return this._initPromise;
  },

  resetTokenData : function () {
    return Promise.all(this.tokenDataKeys.map(function (key) {
      return Store.Config.remove('CoSeMe.tokenData.' + key);
    }));
  },

  updateTokenData : function (cb, cbUpdated) {
    var self = this;
    var ts = (new Date()).getTime() / 1000;

    Store.Config.get('CoSeMe.dataUpdated').then(function (dataUpdated) {
      if (ts - 3600 > Number(dataUpdated)) {
        Tools.log("UPDATING token data");
        Tools.loadJson('https://raw.githubusercontent.com/loqui/im/dev/tokenData.json')
          .then(function (response) {
            var updated = false;
            Store.Config.put('CoSeMe.dataUpdated', ts);

            if (response) {
              Tools.log(response);
              self.tokenDataKeys.forEach(function (key) {
                var value = response[key];
                if (value) {
                  if (CoSeMe.config.tokenData[key] != value) {
                    updated = true;
                  }
                  CoSeMe.config.tokenData[key] = value;
                  Store.Config.put('CoSeMe.tokenData.' + key, value);
                }
              });
            }

            Tools.log('Token data ' + (updated ? '' : 'NOT ') + 'updated');

            if (updated && cbUpdated) {
              cbUpdated();
            } else if (cb) {
              cb();
            }
          }, function () {
            Store.Config.put('CoSeMe.dataUpdated', ts);
            if (cb) {
              cb();
            }
          });
      } else if (cb) {
        cb();
      }
    });
  }
};


/**
 * @class Connector/CoSeMe
 * @implements Connector
 * @param {Account} account
 */
App.connectors.coseme = function (account) {
  Lungo.Notification.show('info_outline', _('WAsupportEndJun30'));

  var Yowsup = CoSeMe.yowsup;
  var SI = Yowsup.getSignalsInterface();
  var MI = Yowsup.getMethodsInterface();

  var axol = null;
  var axolDb = null;
  var axolLocalReg = null;
  var axolSendKeys = false;
  var axolEncryptQueues = { };
  var axolDecryptQueue = async.queue(function (task, callback) {
    handleEncryptedMessage(task.self, task.msg, callback);
  });
  var requestData = {};
  var pendingAvatars = {};
  var lastKeepalive = new Date();
  var init = CosemeConnectorHelper.init();
  var proto = CosemeConnectorHelper.proto.com.whatsapp.proto;

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
  this.UTSyncRegistered = false;

  function isNotGroupJid (jid) {
    return (jid.indexOf('@g.us') < 0);
  }

  function padV2 (buffer) {
    var maxPadding = (buffer.remaining() > 192) ? 31 : (256 - buffer.remaining()) / 2;
    var padding = Math.floor(Math.random() * maxPadding) + 1;

    buffer.resize(buffer.limit + padding);
    buffer.skip(buffer.remaining());
    buffer.limit += padding;
    buffer.fill(padding);
    buffer.flip();
    return buffer;
  }

  function encodeV2Text (text) {
    return padV2(proto.Message.encode({ conversation: text })).toArrayBuffer();
  }

  function encodeV2Contact (name, vcard) {
    return padV2(proto.Message.encode({
      contact_message: { display_name: name,
                         vcard: vcard } })).toArrayBuffer();
  }

  function encodeV2Location (lat, lng, url) {
    return padV2(proto.Message.encode({
      location_message: { degrees_latitude: lat,
                          degrees_longitude: lng,
                          url: url } })).toArrayBuffer();
  }

  function sendSetKeys (jid) {
    axolSendKeys = true;
    axol.generatePreKeys(Math.floor(Math.random() * 0xfffffe), 50).then(function (preKeys) {
      Tools.log('generatePreKeys done', preKeys.length, preKeys);

      var tx = axolDb.transaction(['localKeys'], 'readwrite');
      var objStore = tx.objectStore('localKeys');
      for (var idx in preKeys) {
        preKeys[idx].jid = jid;
        objStore.put(preKeys[idx]);
      }
      Tools.log('generatePreKeys stored');

      axol.generateSignedPreKey(axolLocalReg.identityKeyPair, Math.floor(Math.random() * 0xfffffe)).then(function (signedPreKey) {
        Tools.log('generateSignedPreKey done', signedPreKey);

        var tx = axolDb.transaction(['localSKeys'], 'readwrite');
        signedPreKey.jid = jid;
        tx.objectStore('localSKeys').put(signedPreKey);

        CoSeMe.yowsup.getMethodsInterface().call('encrypt_setKeys', [
          axolLocalReg.identityKeyPair.public.slice(1),
          axolLocalReg.registrationId,
          '\x05',
          preKeys.map(function (x) {
            return { id: x.id, value: x.keyPair.public.slice(1) }; }),
          { id: signedPreKey.id,
            value : signedPreKey.keyPair.public.slice(1),
            signature : signedPreKey.signature } ]);
      }, function (e) {
        Tools.log('ERROR generateSignedPreKey', e);
      });
    }, function (e) {
      Tools.log('ERROR generatePreKeys', e);
    });
  }

  function sendRegistration (myJid) {
    axol.generateIdentityKeyPair().then(function (identityKeyPair) {
      axol.generateRegistrationId(true).then(function (registrationId) {
        axolLocalReg = { jid : myJid,
                         identityKeyPair : identityKeyPair,
                         registrationId : registrationId };
        Tools.log('GENERATED REGISTRATION ID', axolLocalReg.registrationId);

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
  }

  function encryptMessageWorker(task, callback) {
    var cpuLock = navigator.requestWakeLock('cpu');
    var myJid = account.core.fullJid;
    var tx = axolDb.transaction(['session']);
    var req = tx.objectStore('session').get([ myJid, task.remoteJid ]);
    req.onsuccess = function (e) {
      if (req.result) {
        axol.encryptMessage(req.result.session, task.plaintext).then(function (m) {
          Tools.log('ENCRYPTED MESSAGE', m, CoSeMe.utils.hex(m.body));

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
    function onMessage(text) {
      if (msg.groupJid) {
        self.events.onGroupMessage.bind(self)(msg.msgId, msg.groupJid, msg.remoteJid, text, msg.timeStamp, true, msg.pushName);
      } else {
        self.events.onMessage.bind(self)(msg.msgId, msg.remoteJid, text, msg.timeStamp, true, msg.pushName, false);
      }
    }

    function onMessageError(text) {
      if (msg.groupJid) {
        self.events.onGroupMessage.bind(self)(msg.msgId, msg.groupJid, msg.remoteJid, text, msg.timeStamp, false, msg.pushName);
      } else {
        self.events.onMessage.bind(self)(msg.msgId, msg.remoteJid, text, msg.timeStamp, false, msg.pushName, false);
      }
    }

    function onVCard(displayName, vCard) {
      if (msg.groupJid) {
        self.events.onGroupVCardReceived.bind(self)(msg.msgId, msg.groupJid, msg.remoteJid, displayName, vCard, true, msg.pushName, msg.timeStamp);
      } else {
        self.events.onVCardReceived.bind(self)(msg.msgId, msg.remoteJid, displayName, vCard, true, false, msg.pushName, msg.timeStamp);
      }
    }

    function onLocation(locName, locThumb, locUrl, locLat, locLong) {
      if (msg.groupJid) {
        self.events.onGroupLocationReceived.bind(self)(msg.msgId, msg.groupJid, msg.remoteJid, locName, locThumb, locLat, locLong, true, msg.pushName, msg.timeStamp);
      } else {
        self.events.onLocationReceived.bind(self)(msg.msgId, msg.remoteJid, locName, locThumb, locLat, locLong, true, false, msg.pushName, msg.timeStamp);
      }
    }

    function onImage(imgThumb, imgUrl, imgFileLength, imgMimeType, encKey) {
      if (msg.groupJid) {
        self.events.onGroupImageReceived.bind(self)(msg.msgId, msg.groupJid, msg.remoteJid, imgThumb, imgUrl, imgFileLength, true, msg.pushName, msg.timeStamp, imgMimeType, encKey);
      } else {
        self.events.onImageReceived.bind(self)(msg.msgId, msg.remoteJid, imgThumb, imgUrl, imgFileLength, true, false, msg.pushName, msg.timeStamp, imgMimeType, encKey);
      }
    }

    function onVideo(videoThumb, videoUrl, videoFileLength, videoMimeType, encKey) {
      if (msg.groupJid) {
        self.events.onGroupVideoReceived.bind(self)(msg.msgId, msg.groupJid, msg.remoteJid, videoThumb, videoUrl, videoFileLength, true, msg.pushName, msg.timeStamp, videoMimeType, encKey);
      } else {
        self.events.onVideoReceived.bind(self)(msg.msgId, msg.remoteJid, videoThumb, videoUrl, videoFileLength, true, false, msg.pushName, msg.timeStamp, videoMimeType, encKey);
      }
    }

    function onAudio(audioUrl, audioFileLength, audioMimeType, encKey) {
      if (msg.groupJid) {
        self.events.onGroupAudioReceived.bind(self)(msg.msgId, msg.groupJid, msg.remoteJid, audioUrl, audioFileLength, true, msg.pushName, msg.timeStamp, audioMimeType, encKey);
      } else {
        self.events.onAudioReceived.bind(self)(msg.msgId, msg.remoteJid, audioUrl, audioFileLength, true, false, msg.pushName, msg.timeStamp, audioMimeType, encKey);
      }
    }

    function onDecryptError(e) {
      Tools.log('DECRYPT ERROR', e);

      if (msg.groupJid && msg.type != 'skmsg' && !msg.count) {
        // ignore decryption error for non-skmsg group messages, we'll
        // handle these on the skmsg
      } else {
        if (axolLocalReg && (!msg.count || Number(msg.count) < 5)) {
          var count = msg.count ? Number(msg.count) + 1 : 1;
          MI.call('message_retry', [msg.groupJid ? msg.groupJid : msg.remoteJid,
                                    msg.msgId, axolLocalReg.registrationId,
                                    count.toString(),
                                    '1',
                                    msg.timeStamp,
                                    msg.groupJid ? msg.remoteJid : null]);
        } else {
          MI.call('message_error', [msg.groupJid ? msg.groupJid : msg.remoteJid,
                                    msg.msgId, 'plaintext-only',
                                    msg.groupJid ? msg.remoteJid : null]);
        }
      }

      onMessageError('DECRYPT ERROR');
      callback(e);
    }

    function onDecrypted(v2msg, session) {
      Tools.log('DECODED MESSAGE', v2msg, session);
      var allDone = [];
      var msgCaption = null;

      if (v2msg.conversation) {
        onMessage(v2msg.conversation);
      } else if (v2msg.url_message) {
        var url_msg = v2msg.url_message;
        var lines = [];
        ['title', 'description', 'canonical_url', 'text'].forEach(function (e) {
          if (url_msg[e]) {
            lines.push(url_msg[e]);
          }
        });
        onMessage(lines.join('\n'));
      } else if (v2msg.contact_message) {
        var contact_msg = v2msg.contact_message;
        onVCard(contact_msg.display_name, contact_msg.vcard);
      } else if (v2msg.image_message) {
        var img_msg = v2msg.image_message;
        var imgThumb = new Uint8Array(img_msg.jpeg_thumbnail.toArrayBuffer());
        var imgEncKey = new Uint8Array(img_msg.media_key.toArrayBuffer());
        msgCaption = v2msg.image_message.caption;

        allDone.push(axolotlCrypto.deriveHKDFv3Secrets(imgEncKey, CoSeMe.utils.bytesFromHex('576861747341707020496d616765204b657973'), 112).then(function (deriv) {
          var iv = deriv.subarray(0, 16);
          var key = deriv.subarray(16, 48);
          Tools.log('MEDIA ENCRYPTION KEYS', CoSeMe.utils.hex(iv), CoSeMe.utils.hex(key));
          onImage(imgThumb, img_msg.url, img_msg.file_length.toNumber(), img_msg.mime_type, { iv: CoSeMe.utils.latin1FromBytes(iv), key: CoSeMe.utils.latin1FromBytes(key) });
        }));
      } else if (v2msg.location_message) {
        var loc_msg = v2msg.location_message;
        var locThumb = new Uint8Array(loc_msg.jpeg_thumbnail.toArrayBuffer());
        onLocation(loc_msg.name, locThumb, loc_msg.degrees_latitude, loc_msg.degrees_longitude);
      } else if (v2msg.document_message) {
        var doc_msg = v2msg.document_message;
        var docThumb = new Uint8Array(doc_msg.jpeg_thumbnail.toArrayBuffer());
        var docEncKey = new Uint8Array(doc_msg.media_key.toArrayBuffer());
        msgCaption = v2msg.document_message.caption;

        allDone.push(axolotlCrypto.deriveHKDFv3Secrets(docEncKey, CoSeMe.utils.bytesFromHex('576861747341707020446f63756d656e74204b657973'), 112).then(function (deriv) {
          var iv = deriv.subarray(0, 16);
          var key = deriv.subarray(16, 48);
          Tools.log('MEDIA ENCRYPTION KEYS', CoSeMe.utils.hex(iv), CoSeMe.utils.hex(key));
          onImage(docThumb, doc_msg.url, doc_msg.file_length.toNumber(), doc_msg.mime_type, { iv: CoSeMe.utils.latin1FromBytes(iv), key: CoSeMe.utils.latin1FromBytes(key) });
        }));
      } else if (v2msg.audio_message) {
        var audio_msg = v2msg.audio_message;
        var audioEncKey = new Uint8Array(audio_msg.media_key.toArrayBuffer());

        allDone.push(axolotlCrypto.deriveHKDFv3Secrets(audioEncKey, CoSeMe.utils.bytesFromHex('576861747341707020417564696f204b657973'), 112).then(function (deriv) {
          var iv = deriv.subarray(0, 16);
          var key = deriv.subarray(16, 48);
          Tools.log('MEDIA ENCRYPTION KEYS', CoSeMe.utils.hex(iv), CoSeMe.utils.hex(key));
          onAudio(audio_msg.url, audio_msg.file_length.toNumber(), audio_msg.mime_type, { iv: CoSeMe.utils.latin1FromBytes(iv), key: CoSeMe.utils.latin1FromBytes(key) });
        }));
      } else if (v2msg.video_message) {
        var video_msg = v2msg.video_message;
        var videoThumb = new Uint8Array(video_msg.jpeg_thumbnail.toArrayBuffer());
        var videoEncKey = new Uint8Array(video_msg.media_key.toArrayBuffer());
        msgCaption = v2msg.video_message.caption;

        allDone.push(axolotlCrypto.deriveHKDFv3Secrets(videoEncKey, CoSeMe.utils.bytesFromHex('576861747341707020566964656f204b657973'), 112).then(function (deriv) {
          var iv = deriv.subarray(0, 16);
          var key = deriv.subarray(16, 48);
          Tools.log('MEDIA ENCRYPTION KEYS', CoSeMe.utils.hex(iv), CoSeMe.utils.hex(key));
          onVideo(videoThumb, video_msg.url, video_msg.file_length.toNumber(), video_msg.mime_type, { iv: CoSeMe.utils.latin1FromBytes(iv), key: CoSeMe.utils.latin1FromBytes(key) });
        }));
      } else if (!v2msg.sender_key_distribution_message) {
        Tools.log('UNHANDLED v2msg');
      }

      if (v2msg.sender_key_distribution_message) {
        var skdm_msg = v2msg.sender_key_distribution_message;
        var skdm_axolotl = new Uint8Array(skdm_msg.axolotl_sender_key_distribution_message.toArrayBuffer());
        Tools.log('SKDM', skdm_msg.group_id, CoSeMe.utils.hex(skdm_axolotl));

        allDone.push(new Promise(function (resolve, reject) {
          var skreq = axolDb.transaction(['sksession'])
              .objectStore('sksession').get([ msg.jid, msg.groupJid, msg.remoteJid]);
          skreq.onsuccess = function (e) {
            var sksession = skreq.result ? skreq.result.session : null;

            sksession = axol.processSenderKeyDistributionMessage(sksession, skdm_axolotl.buffer);
            Tools.log('new sender key session', sksession);

            var req = axolDb.transaction(['sksession'], 'readwrite')
                .objectStore('sksession').put({ jid : msg.jid,
                                                groupJid : msg.groupJid,
                                                remoteJid : msg.remoteJid,
                                                session : sksession });
            req.onsuccess = resolve;
            req.onerror = reject;
          };
          skreq.onerror = function (e) {
            Tools.log('error getting sksession from db', msg.groupJid, msg.remoteJid);
            reject(e);
          };
        }));
      }

      if (msg.type == 'skmsg') {
        allDone.push(new Promise(function (resolve, reject) {
          var skreq = axolDb.transaction(['sksession'], 'readwrite')
              .objectStore('sksession').put({ jid : msg.jid,
                                              groupJid : msg.groupJid,
                                              remoteJid : msg.remoteJid,
                                              session : session });
          skreq.onsuccess = resolve;
          skreq.onerror = reject;
        }));
      } else {
        allDone.push(new Promise(function (resolve, reject) {
          var req = axolDb.transaction(['session'], 'readwrite')
              .objectStore('session').put({ jid : msg.jid,
                                            remoteJid : msg.remoteJid,
                                            session : session });
          req.onsuccess = resolve;
          req.onerror = reject;
        }));
      }

      Promise.all(allDone).then(function (v) {
        Tools.log('DONE onDecrypted', v);
        if (msgCaption !== null) {
          if (msg.groupJid) {
            self.events.onMessage.bind(self)(msg.msgId+"c", msg.groupJid, msgCaption, (msg.timeStamp+1), false, msg.pushName, false);
          }
          else {
            self.events.onMessage.bind(self)(msg.msgId+"c", msg.remoteJid, msgCaption, (msg.timeStamp+1), false, msg.pushName, false);
          }
        }
        callback();
      }, function (e) {
        Tools.log('ERROR onDecrypted', e);
        callback();
      });
    }

    if (axolLocalReg && (msg.type == 'pkmsg' || msg.type == 'msg')) {
      var req = axolDb.transaction(['session'])
          .objectStore('session').get([ msg.jid, msg.remoteJid ]);
      req.onsuccess = function (e) {
        var session = req.result ? req.result.session : null;
        var decryptFn = (msg.type == 'pkmsg') ? axol.decryptPreKeyWhisperMessage : axol.decryptWhisperMessage;
        decryptFn(session, msg.msgData).then(function (m) {
          var data = new Uint8Array(m.message);
          Tools.log('DECRYPTED MESSAGE', CoSeMe.utils.hex(data));

          try {
            var v2msg;
            if (msg.v == '2') {
              v2msg = proto.Message.decode(data.subarray(0, -data[data.length - 1]));
            } else {
              v2msg = { conversation : CoSeMe.utils.stringFromUtf8(CoSeMe.utils.latin1FromBytes(data)) };
            }

            onDecrypted(v2msg, m.session);
          } catch (e) {
            onDecryptError(e);
          }
        }, onDecryptError);
      };
      req.onerror = function(e) {
        Tools.log('error getting session from db', msg.remoteJid);
      };
    } else if (axolLocalReg && (msg.type == 'skmsg')) {
      var skreq = axolDb.transaction(['sksession'])
          .objectStore('sksession').get([ msg.jid, msg.groupJid, msg.remoteJid ]);
      skreq.onsuccess = function (e) {
        var session = skreq.result ? skreq.result.session : null;
        if (session) {
          axol.decryptSenderKeyMessage(session, msg.msgData).then(function (m) {
            var data = new Uint8Array(m.message);
            Tools.log('DECRYPTED MESSAGE', CoSeMe.utils.hex(data));

            try {
              var v2msg = proto.Message.decode(data.subarray(0, -data[data.length - 1]));

              onDecrypted(v2msg, m.session);
            } catch (e) {
              onDecryptError(e);
            }
          }, onDecryptError);
        } else {
          onDecryptError(null);
        }
      };
      skreq.onerror = function(e) {
        Tools.log('error getting sksession from db', msg.groupJid, msg.remoteJid);
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
      pendingAvatars = {};
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
              var signedPreKeyPair = req.result ? req.result.keyPair : null;
              Tools.log('getLocalSignedPreKeyPair', signedPreKeyPair);
              ready(signedPreKeyPair);
            };
          });
        },
        getLocalPreKeyPair : function (preKeyId) {
          Tools.log('getLocalPreKeyPair', preKeyId);

          return new Promise(function (ready) {
            var tx = axolDb.transaction(['localKeys']);
            var req = tx.objectStore('localKeys').get([ account.core.fullJid, preKeyId ]);
            req.onsuccess = function (e) {
              var preKeyPair = req.result ? req.result.keyPair : null;
              Tools.log('getLocalPreKeyPair', preKeyPair);
              ready(preKeyPair);
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
    MI.call(method, params);
  };

  this.isConnected = function () {
    return App.online && this.connected;
  };

  this.keepAlive = function () {
    if (this.isConnected()) {
      // send keep-alives less frequently if we are hidden (phone is sleeping)
      if (!document.hidden || (new Date() - lastKeepalive) > 300 * 1000) {
        lastKeepalive = new Date();
        Tools.log('keep alive!');
        MI.call('keepalive', []);
      }
    }
  };

  this.start = function () {
    Tools.log('CONNECTOR START');
    this.handlers.init();

    var myJid = this.account.core.fullJid;

    var tx = axolDb.transaction(['localReg']);
    var req = tx.objectStore('localReg').get(myJid);
    req.onsuccess = function (e) {
      axolLocalReg = e.target.result;
      if (! axolLocalReg) {
        sendRegistration(myJid);
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
      Lungo.Notification.show('file_download', _('Synchronizing'), 5);
      var account = this.account;
      var contacts = this.contacts;
      contacts._pre = [];
      var allContacts = navigator.mozContacts.getAll({sortBy: 'givenName', sortOrder: 'ascending'});
      allContacts.onsuccess = function (event) {
        if (this.result) {
          try {
            var result = this.result;
            var fullname = (result.givenName
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
          Lungo.Notification.error(_('ContactsGetError'), _('ContactsGetErrorExp'), 'warning', 5);
          cb();
        };
        if(App.platform === "UbuntuTouch") {
        	// Ubuntu Touch
        	console.log('trigger content hub for contacts import');
        	var UTcs = this.contacts.UTContactSync;
        	if(!this.UTSyncRegistered) {
        		$('#contacts_input').change(function() {
        			UTcs(cb);
        		});
        		this.UTSyncRegistered = true;
        	}
        	$('#contacts_input').trigger('click');
        }
      } else {
        Lungo.Notification.error(_('ContactsGetError'), _('NoWhenOffline'), 'warning', 5);
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

    this.contacts.UTContactSync = function(cb) {
		var account = this.account;
		var contacts = this.contacts;
		contacts._pre = [];
		var c;
		function number(input) {
			for(var i = 0; i < c.tel.length; i++) {
				var output = input[i].value;
			}
			output = output.replace('+', '');
			output = output.replace(/ /g, '');
			return output;
				}
		var cif = document.getElementById('contacts_input').files;
		if(cif.length > 0) {
			var contactsFile = cif[0];
			var fileReader = new FileReader();
			fileReader.onloadend = function() {
				VCF.parse(fileReader.result, function(vc) {
					c = vc.toJCard();
					try {
						var fullname = c.fn ? c.fn : (c.givenName && c.givenName[0] ?
										((c.familyName && c.familyName[0])
										? c.givenName[0] + c.familyName[0] : c.givenName[0]) : ''
										).trim();
						if(c.tel && number(c.tel) != account.core.fullJid.split('@')[0]) {
							for(var i = 0; i < c.tel.length; i++) {
								contacts._pre[c.tel[i].value] = fullname;
							}
						}
					} catch (e) {
						Tools.log('CONTACT NORMALIZATION ERROR:', e);
					}
				});
				if(cb) {
					MI.call('contacts_sync', [Object.keys(contacts._pre)]);
					contacts._cb = cb;
				}
			};
			fileReader.readAsText(contactsFile);
		} else if(cb) {
			MI.call('contacts_sync', [Object.keys(contacts._pre)]);
			contacts._cb = cb;
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
        if (options.isBroadcast) {
          ready(MI.call('message_broadcast', [null, to, text]));
        } else {
          encryptMessage(to, encodeV2Text(text)).then(function (m) {
            ready(MI.call('encrypt_sendMessage',
                          [options.msgId, to, m.body, null,
                           (m.isPreKeyWhisperMessage ? 'pkmsg' : 'msg'),
                           '2']));
          }, function (e) {
            Tools.log('PLAINTEXT FALLBACK', e);
            ready(MI.call('message_send', [options.msgId, to, text]));
          });
        }
      });
    }.bind(this);

    this.ack = function (id, from, type, participant) {
      type = type || 'delivery';
      MI.call('message_ack', [from, id, type, participant]);
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

    this.emojiRender = function (emoji) {
      return App.emoji[Providers.data[this.account.core.provider].emoji].render(emoji);
    };

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
          Lungo.Notification.show('file_upload', _('Uploading'), 3);
          var method = 'media_requestUpload';
          MI.call(method, [aB64Hash, aT, aSize]);
        });
      });
      reader.readAsBinaryString(blob);
    };

    this.locationSend = function (jid, loc) {
      var self = this;
      var url = 'https://maps.google.com/maps?q=' + loc.lat + ',' + loc.long;
      Tools.locThumb(loc, 120, 120, function (thumb) {
        encryptMessage(jid, encodeV2Location(loc.lat, loc.long, url)).then(function (m) {
          return MI.call('encrypt_sendMessage',
                         [null, jid, m.body, 'location',
                         (m.isPreKeyWhisperMessage ? 'pkmsg' : 'msg'),
                         '2']);
        }, function (e) {
          Tools.log('PLAINTEXT FALLBACK', e);
          return MI.call('message_locationSend', [jid, loc.lat, loc.long, thumb]);
        }).then(function (msgId) {
          self.addMediaMessageToChat('url', thumb, url, [ loc.lat, loc.long ], account.core.user, jid, msgId);
        });
      });
    };

    this.vcardSend = function (jid, name, vcard) {
      var self = this;
      Tools.vcardThumb(null, 120, 120, function (thumb) {
        encryptMessage(jid, encodeV2Contact(name, vcard)).then(function (m) {
          return MI.call('encrypt_sendMessage',
                         [null, jid, m.body, 'contact',
                         (m.isPreKeyWhisperMessage ? 'pkmsg' : 'msg'),
                         '2']);
        }, function (e) {
          Tools.log('PLAINTEXT FALLBACK', e);
          return MI.call('message_vcardSend', [jid, vcard, name]);
        }).then(function (msgId) {
          self.addMediaMessageToChat('vCard', thumb, null, [ name, vcard ], account.core.user, jid, msgId);
        });
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
        message_error: this.events.onErrorMessage,
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
        notification_groupParticipantsAdded: this.events.onGroupParticipantsAdded,
        notification_groupParticipantsRemoved: this.events.onGroupParticipantsRemoved,
        notification_groupCreated: this.events.onGroupCreated,
        notification_groupSubjectUpdated: this.events.onGroupSubjectUpdated,
        notification_status: this.events.onContactStatusUpdated,
        notification_encrypt: this.events.onNotificationEncrypt,
        encrypt_keysGot: this.events.onEncryptKeysGot,
        encrypt_keysSet: this.events.onEncryptKeysSet,
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
          Tools.log('REGISTER', signal);
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

      if (!axolSendKeys && axolLocalReg) {
        sendSetKeys(this.account.core.fullJid);
      } else {
        axolSendKeys = true;
      }
    };

    this.events.onEncryptKeysGot = function (keys, id) {
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

    this.events.onEncryptKeysSet = function (id, errorCode) {
      Tools.log('SET KEYS', errorCode);
      if (errorCode) {
        // keys weren't accepted, so reschedule
        axolLocalReg = null;
        axolDecryptQueue.pause();
        setTimeout(function () {
          if (this.connected && axolSendKeys && !axolLocalReg) {
            sendRegistration(this.account.core.fullJid);
          }
        }.bind(this), 120000);
      } else {
        axolSendKeys = false;
      }
    };

    this.events.onEncryptMessageReceived = function (msgId, from, msgData, type, v, count, timeStamp, pushName) {
      Tools.log('ENCRYPTED MESSAGE', type, v, count);

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
      Tools.log('ENCRYPTED GROUP MESSAGE', type, v, count);

      var self = this;
      var msg = { jid : this.account.core.fullJid,
                  remoteJid : author,
                  groupJid : from,
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

    this.events.onMessage = function (msgId, from, msgData, timeStamp, wantsReceipt, pushName, isBroadcast) {
      Tools.log('MESSAGE', msgId, from, msgData, timeStamp, wantsReceipt, pushName, isBroadcast);
      var account = this.account;
      var to = account.core.fullJid;
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
          viewed: !wantsReceipt,
          volatile: !wantsReceipt,
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

    this.events.onErrorMessage = function (id, from, body, stamp, e, nick, g) {
      Tools.log('MESSAGE NOT RECEIVED', id, from, body, stamp, e, nick, g);
    };

    this.events.onImageReceived = function (msgId, fromAttribute, mediaPreview, mediaUrl, mediaSize, wantsReceipt, isBroadcast, notifyName, timeStamp, mimeType, encKey) {
      var to = this.account.core.fullJid;
      return this.mediaProcess('image', msgId, fromAttribute, to, mediaPreview, mediaUrl, mediaSize, wantsReceipt, false, notifyName, timeStamp, mimeType, encKey);
    };

    this.events.onVideoReceived = function (msgId, fromAttribute, mediaPreview, mediaUrl, mediaSize, wantsReceipt, isBroadcast, notifyName, timeStamp, mimeType, encKey) {
      var to = this.account.core.fullJid;
      return this.mediaProcess('video', msgId, fromAttribute, to, mediaPreview, mediaUrl, mediaSize, wantsReceipt, false, notifyName, timeStamp, mimeType, encKey);
    };

    this.events.onAudioReceived = function (msgId, fromAttribute, mediaUrl, mediaSize, wantsReceipt, isBroadcast, notifyName, timeStamp, mimeType, encKey) {
      var to = this.account.core.fullJid;
      return this.mediaProcess('audio', msgId, fromAttribute, to, null, mediaUrl, mediaSize, wantsReceipt, false, notifyName, timeStamp, mimeType, encKey);
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
      function gotAvatar (saved) {
        var pendingInfo = (jid in pendingAvatars) && pendingAvatars[jid];
        if (pendingInfo && pendingInfo.id != picId && pendingInfo.refetch) {
          pendingInfo.refetch = false;
          MI.call('contact_getProfilePicture', [jid]);
          return true;
        } else if (saved) {
          delete pendingAvatars[jid];
        }

        return false;
      }

      var account = this.account;
      var avatars= App.avatars;

      Tools.log(jid, picId, blob);
      if (blob) {
        if (gotAvatar (false)) {
          return;
        }

        var savedAvatar = function (values) {
          avatars[jid] = (new Avatar({ id: picId, chunk: values[0],
                                       original : values[1] })).data;
          App.avatars = avatars;
          gotAvatar (true);
        };

        if (jid == this.account.core.fullJid) {
          Tools.picThumb(blob, 96, 96, function (url) {
            $('section#main[data-jid="' + jid + '"] footer span.avatar img').attr('src', url);
            $('aside#accounts article#accounts div[data-jid="' + jid + '"] span.avatar img').attr('src', url);
            if (Accounts.current === account) {
              $('section#me .avatar img').attr('src', url);
            }
            Store.save(url, function (index) { savedAvatar([index, null]); });
          });
        } else {

          Promise.all([
            new Promise(function(done){ Tools.blobToBase64(blob, done); }),
            new Promise(function(done){ Tools.picThumb(blob, 96, 96, done); })
          ]).then(function(values){
            var original= values[0];
            var tumb= values[1];

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
              ]).then(savedAvatar);
            } else {
              Promise.all([
                new Promise(function(done){ Store.save(tumb, done); }),
                new Promise(function(done){ Store.save(original, done); })
              ]).then(savedAvatar);
            }
          });
        }
      } else if (picId) {
        if (!(jid in App.avatars) || App.avatars[jid].id != picId) {
          if (!(jid in pendingAvatars)) {
            pendingAvatars[jid] = { id: picId, refetch: true };
            MI.call('contact_getProfilePicture', [jid]);
          } else {
            pendingAvatars[jid] = { id: picId, refetch: true };
          }
        }
      } else {
        delete pendingAvatars[jid];
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
      Tools.log('MESSAGE ERROR', from, msgId);
      account.findMessage(from, msgId, function (msg) {
        if ((errorType == 'plaintext-only') || (errorType == 'enc-v1')) {
          MI.call('message_send', [msg.id, from, msg.text]);
        }
        cpuLock.unlock();
      }.bind(this));

      MI.call('delivered_ack', [from, msgId, 'error']);
    };

    this.events.onMessageRetry = function (from, msgId, participant, count, regId) {
      var cpuLock = navigator.requestWakeLock('cpu');
      var myJid = account.core.fullJid;
      Tools.log('RETRY', from, participant, msgId, count, regId);
      account.findMessage(from, msgId, function (msg) {
        if (Number(count) >= 5) {
          MI.call('message_send', [msg.id, from, msg.text]);
        } else {
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
                   plaintext : encodeV2Text(msg.text),
                   ready : function (m) {
                     MI.call('encrypt_sendMessage',
                             [msg.id, from, m.body, null,
                              (m.isPreKeyWhisperMessage ? 'pkmsg' : 'msg'),
                              '2', count || '1']);
                   },
                   reject : function (e) {
                     MI.call('message_send', [msg.id, from, msg.text]);
                   } });
        }

        cpuLock.unlock();
      }.bind(this));

      MI.call('delivered_ack', [from, msgId, 'retry', participant]);
    };

    this.events.onMessageDelivered = function (from, msgId, type, participant) {
      var account = this.account;
      var chat = account.chatGet(from);
      chat.core.lastAck = Tools.localize(Tools.stamp());
      chat.save();
      account.markMessage.push({from : from, msgId : msgId,
                                type : type || 'delivery'});
      Tools.log('DELIVERED', from, msgId, type);
      MI.call('delivered_ack', [from, msgId, type, participant]);
    };

    this.events.onMessageVisible = function (from, msgId) {
      Tools.log('VISIBLE', from, msgId);
      MI.call('visible_ack', [from, msgId]);
    };

    this.events.onGroupInfoError = function (jid, owner, subject, subjectOwner, subjectTime, creation) {
      Tools.log('ERROR GETTING GROUP INFO', jid, owner, subject, subjectOwner, subjectTime, creation);
    };

    this.events.onGroupGotParticipating = function (groups, id) {
      var self = this;
      groups.forEach(function (group) {
        self.events.onGroupGotInfo.bind(self)(group.gid + '@g.us', group.owner, group.subject, group.subjectOwner, group.subjectT, group.creation, group.participants);
      });
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
      Lungo.Notification.success(_('Removed'), null, 'delete', 3);
    };

    this.events.onGroupEndSuccess = function (gid) {
      Lungo.Notification.success(_('Removed'), null, 'delete', 3);
    };

    this.events.onGroupCreateSuccess = function (gid, idx) {
      Lungo.Notification.show('file_download', _('Synchronizing'), 5);
      Lungo.Router.section('back');
      var members = this.muc.membersCache[idx];
      if (members.length) {
        MI.call('group_addParticipants', [gid, members]);
      }
      delete this.muc.membersCache[idx];
    };

    this.events.onGroupMessage = function (msgId, from, author, data, stamp, wantsReceipt, pushName) {
      Tools.log('GROUPMESSAGE', msgId, from, author, data, stamp, wantsReceipt, pushName);
      var account = this.account;
      var isBroadcast = from.endsWith('@broadcast');
      var body = data;
      if (body) {
        var date = new Date(stamp);
        stamp = Tools.localize(Tools.stamp(stamp));
        var fromUser = author.split('@')[0];
        var msg = Make(Message)(account, {
          from: author,
          to: from,
          text: body,
          stamp: stamp,
          viewed: !wantsReceipt,
          volatile: !wantsReceipt,
          id : msgId,
          pushName: (pushName && pushName != fromUser) ? (fromUser + ': ' + pushName) : pushName
        }, {
          muc: ! isBroadcast
        });
        Tools.log('RECEIVED', msg);
        if (wantsReceipt) {
          msg.receive(function(){
            this.ack(msgId, from, null, author);
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
      this.events.onAvatar(from);
    };

    this.events.onGroupPictureUpdated = function (from, stamp, msgId, pictureId, jid) {
      var method = 'notification_ack';
      MI.call(method, [from, msgId]);
      this.events.onAvatar(from, pictureId);
    };

    this.events.onGroupPictureRemoved = function (from, stamp, msgId, pictureId, jid) {
      var method = 'notification_ack';
      MI.call(method, [from, msgId]);
      this.events.onAvatar(from);
    };

    this.events.onGroupParticipantsAdded = function (jid, stamp, msgId, participants) {
      var method = 'notification_ack';
      MI.call(method, [jid, msgId]);

      var ci = account.chatFind(jid);
      if (ci >= 0) {
        var chat = account.chats[ci];
        chat.core.participants = chat.core.participants.concat(participants);
        chat.save();
      }
    };

    this.events.onGroupParticipantsRemoved = function (jid, stamp, msgId, participants) {
      var method = 'notification_ack';
      MI.call(method, [jid, msgId]);

      var ci = account.chatFind(jid);
      if (ci >= 0) {
        var chat = account.chats[ci];
        chat.core.participants = chat.core.participants.filter(function (elem) {
          return participants.indexOf(elem.jid) == -1;
        });
        chat.save();
      }
    };

    this.events.onGroupCreated = function (jid, stamp, msgId, owner, subject, subjectOwner, subjectTime, creation, participants) {
      var method = 'notification_ack';
      MI.call(method, [jid, msgId]);

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

    this.events.onGroupSubjectUpdated = function (jid, stamp, msgId, subject, displayName, author) {
      var method = 'notification_ack';
      MI.call(method, [jid, msgId]);

      var ci = account.chatFind(jid);
      if (ci >= 0) {
        var chat = account.chats[ci];
        var newTitle = decodeURIComponent(subject);
        chat.core.title = newTitle;
        chat.save();
      }
    };

    this.events.onGroupImageReceived = function (msgId, group, author, mediaPreview, mediaUrl, mediaSize, wantsReceipt, notifyName, timeStamp, mimeType, encKey) {
      return this.mediaProcess('image', msgId, author, group, mediaPreview, mediaUrl, mediaSize, wantsReceipt, true, notifyName, timeStamp, mimeType, encKey);
    };

    this.events.onGroupVideoReceived = function (msgId, group, author, mediaPreview, mediaUrl, mediaSize, wantsReceipt, notifyName, timeStamp, mimeType, encKey) {
      return this.mediaProcess('video', msgId, author, group, mediaPreview, mediaUrl, mediaSize, wantsReceipt, true, notifyName, timeStamp, mimeType, encKey);
    };

    this.events.onGroupAudioReceived = function (msgId, group, author, mediaUrl, mediaSize, wantsReceipt, notifyName, timeStamp, mimeType, encKey) {
      return this.mediaProcess('audio', msgId, author, group, null, mediaUrl, mediaSize, wantsReceipt, true, notifyName, timeStamp, mimeType, encKey);
    };

    this.events.onGroupLocationReceived = function (msgId, group, author, name, mediaPreview, mlatitude, mlongitude, wantsReceipt, notifyName, timeStamp) {
      return this.mediaProcess('url', msgId, author, group, [mlatitude, mlongitude, name], null, null, wantsReceipt, true, notifyName, timeStamp);
    };

    this.events.onGroupVCardReceived = function (msgId, group, author, vcardName, vcardData, wantsReceipt, notifyName, timeStamp) {
      return this.mediaProcess('vCard', msgId, author, group, [vcardName, vcardData], null, null, wantsReceipt, true, notifyName, timeStamp);
    };

    this.events.onContactsGotStatus = function (id, statuses) {
      for (let jid in statuses) {
        let status = statuses[jid];
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
      Lungo.Notification.error(_('NotUploaded'), _('ErrorUploading'), 'warning', 5);
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
        Lungo.Notification.show('file_upload', _('Uploaded'), 1);
        $('#main #footbox progress').val('0');
      };
      var onError = function (error) {
        Lungo.Notification.error(
          _('NotUploaded'),
          _('ErrorUploading'),
          'warning', 5
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
      Lungo.Notification.error(_('NotUploaded'), _('ErrorUploading'), 'warning', 5);
    };
    this.events.onUploadRequestDuplicate = function (hash) {
      Lungo.Notification.error(_('NotUploaded'), _('DuplicatedUpload'), 'warning', 5);
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

    this.mediaProcess = function (fileType, msgId, from, to, payload, mediaUrl, mediaSize, wantsReceipt, isGroup, notifyName, timeStamp, mimeType, encKey) {
      Tools.log('Processing file of type', fileType);
      var process = function (thumb) {
        var media = {
          type: fileType,
          thumb: thumb,
          payload: mediaUrl ? null : payload,
          url: mediaUrl,
          mimeType: mimeType,
          encKey : encKey,
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
          muc: isGroup && !to.endsWith('@broadcast')
        });
        msg.receive(function(){
          this.ack(msgId, isGroup ? to : from, null, isGroup ? from : null);
        }.bind(this));
        Tools.log('Finished processing file of type', fileType);
      }.bind(this);
      switch (fileType) {
        case 'image':
        Tools.picThumb(((payload.buffer !== undefined) ?
                        new Blob([payload], {type: 'i'}) :
                        CoSeMe.utils.aToBlob(payload, 'i')),
                       120, null, process);
        break;
        case 'video':
        process('videocam');
        break;
        case 'audio':
        process('audiotrack');
        break;
        case 'url':
        mediaUrl = 'https://maps.google.com/maps?q=' + payload[0] + ',' + payload[1];
        process('location_on');
        break;
        case 'vCard':
        process('contact_phone');
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
          .append($('<p/>').css('color', 'red').text(_('WAsupportEndJun30')))
          .append($('<p/>').text(_('ProviderSMS', { provider: data.longName })))
          .append($('<label/>').attr('for', 'countrySelect').text(_(data.terms.country)));
          var countrySelect = $('<select/>').attr('name', 'countrySelect');
          var countries = Tools.countries;
          countrySelect.append($('<option/>').attr('value', '').text('-- ' + _('YourCountry')));
          countries.forEach(function (country) {
            countrySelect.append($('<option/>').attr('value', country.dial).text(country.name));
          });
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
    countries = Tools.countries;
    countrySelect.append($('<option/>').attr('value', '').text('-- ' + _('YourCountry')));
    countries.forEach(function (country) {
      countrySelect.append($('<option/>').attr('value', country.dial).text(country.name));
    });
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
      Lungo.Notification.show('textsms', _('SMSsending'));
      codeGet = function (deviceId) {
        $(article)[0].dataset.deviceId= deviceId;
        var onsent = function (data) {
          Tools.log(data);
          if (data.status == 'sent') {
            Tools.log('Sent SMS to', cc, user, 'with DID', deviceId, 'retry after', data.retry_after);
            Lungo.Notification.success(_('SMSsent'), _('SMSsentExp'), 'textsms', 3);
            form.addClass('hidden');
            form.siblings('.code').removeClass('hidden');
          } else if (data.status == 'check') {
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
              Lungo.Notification.error(_('CodeNotValid'), _('CodeReason_' + data.reason, {retry: data.retry_after}), 'warning', 5);
            }
          } else {
            Tools.log('Could not sent SMS', 'Reason:', data.reason, 'with DID', deviceId);
            Lungo.Notification.error(_('SMSnotSent'), _('SMSreason_' + data.reason, {retry: data.retry_after}), 'warning', 5);
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
          } else if (data.status == 'check') {
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
              Lungo.Notification.error(_('CodeNotValid'), _('CodeReason_' + data.reason, {retry: data.retry_after}), 'warning', 5);
            }
          } else {
            Tools.log('Could not sent phone call', 'Reason:', data.reason, 'with DID', deviceId);
            Lungo.Notification.error(_('VoicenotSent'), _('SMSreason_' + data.reason, {retry: data.retry_after}), 'warning', 5);
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
          Lungo.Notification.error(_('CodeNotValid'), _('CodeReason_' + data.reason, {retry: data.retry_after}), 'warning', 5);
        };
        Lungo.Notification.show('content_copy', _('CodeValidating'));
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
  emojis: [
    [ ["people", "icon-people"], [":grinning:", ":grin:", ":joy:", ":rofl:", ":smiley:", ":smile:", ":sweat_smile:", ":laughing:", ":wink:", ":blush:", ":yum:", ":sunglasses:", ":heart_eyes:", ":kissing_heart:", ":kissing:", ":kissing_smiling_eyes:", ":kissing_closed_eyes:", ":relaxed:", ":slight_smile:", ":hugging:", ":thinking:", ":neutral_face:", ":expressionless:", ":no_mouth:", ":rolling_eyes:", ":smirk:", ":persevere:", ":disappointed_relieved:", ":open_mouth:", ":zipper_mouth:", ":hushed:", ":sleepy:", ":tired_face:", ":sleeping:", ":relieved:", ":nerd:", ":stuck_out_tongue:", ":stuck_out_tongue_winking_eye:", ":stuck_out_tongue_closed_eyes:", ":drooling_face:", ":unamused:", ":sweat:", ":pensive:", ":confused:", ":upside_down:", ":money_mouth:", ":astonished:", ":frowning2:", ":slight_frown:", ":confounded:", ":disappointed:", ":worried:", ":triumph:", ":cry:", ":sob:", ":frowning:", ":anguished:", ":fearful:", ":weary:", ":grimacing:", ":cold_sweat:", ":scream:", ":flushed:", ":dizzy_face:", ":rage:", ":angry:", ":innocent:", ":cowboy:", ":clown:", ":lying_face:", ":mask:", ":thermometer_face:", ":head_bandage:", ":nauseated_face:", ":sneezing_face:", ":smiling_imp:", ":imp:", ":japanese_ogre:", ":japanese_goblin:", ":skull:", ":ghost:", ":alien:", ":robot:", ":poop:", ":smiley_cat:", ":smile_cat:", ":joy_cat:", ":heart_eyes_cat:", ":smirk_cat:", ":kissing_cat:", ":scream_cat:", ":crying_cat_face:", ":pouting_cat:", ":boy:", ":girl:", ":man:", ":woman:", ":older_man:", ":older_woman:", ":baby:", ":angel:", ":cop:", ":spy:", ":guardsman:", ":construction_worker:", ":man_with_turban:", ":person_with_blond_hair:", ":santa:", ":mrs_claus:", ":princess:", ":prince:", ":bride_with_veil:", ":man_in_tuxedo:", ":pregnant_woman:", ":man_with_gua_pi_mao:", ":person_frowning:", ":person_with_pouting_face:", ":no_good:", ":ok_woman:", ":information_desk_person:", ":raising_hand:", ":bow:", ":face_palm:", ":shrug:", ":massage:", ":haircut:", ":walking:", ":runner:", ":dancer:", ":man_dancing:", ":dancers:", ":speaking_head:", ":bust_in_silhouette:", ":busts_in_silhouette:", ":couple:", ":two_men_holding_hands:", ":two_women_holding_hands:", ":couplekiss:", ":kiss_mm:", ":kiss_ww:", ":couple_with_heart:", ":couple_mm:", ":couple_ww:", ":family:", ":family_mwg:", ":family_mwgb:", ":family_mwbb:", ":family_mwgg:", ":family_mmb:", ":family_mmg:", ":family_mmgb:", ":family_mmbb:", ":family_mmgg:", ":family_wwb:", ":family_wwg:", ":family_wwgb:", ":family_wwbb:", ":family_wwgg:", ":muscle:", ":selfie:", ":point_left:", ":point_right:", ":point_up:", ":point_up_2:", ":middle_finger:", ":point_down:", ":v:", ":fingers_crossed:", ":vulcan:", ":metal:", ":call_me:", ":hand_splayed:", ":raised_hand:", ":ok_hand:", ":thumbsup:", ":thumbsdown:", ":fist:", ":punch:", ":left_facing_fist:", ":right_facing_fist:", ":raised_back_of_hand:", ":wave:", ":clap:", ":writing_hand:", ":open_hands:", ":raised_hands:", ":pray:", ":handshake:", ":nail_care:", ":ear:", ":nose:", ":footprints:", ":eyes:", ":eye:", ":tongue:", ":lips:", ":kiss:", ":zzz:", ":eyeglasses:", ":dark_sunglasses:", ":necktie:", ":shirt:", ":jeans:", ":dress:", ":kimono:", ":bikini:", ":womans_clothes:", ":purse:", ":handbag:", ":pouch:", ":school_satchel:", ":mans_shoe:", ":athletic_shoe:", ":high_heel:", ":sandal:", ":boot:", ":crown:", ":womans_hat:", ":tophat:", ":mortar_board:", ":helmet_with_cross:", ":lipstick:", ":ring:", ":closed_umbrella:", ":briefcase:" ] ],
    [ ["nature", "icon-nature"], [":see_no_evil:", ":hear_no_evil:", ":speak_no_evil:", ":sweat_drops:", ":dash:", ":monkey_face:", ":monkey:", ":gorilla:", ":dog:", ":dog2:", ":poodle:", ":wolf:", ":fox:", ":cat:", ":cat2:", ":lion_face:", ":tiger:", ":tiger2:", ":leopard:", ":horse:", ":racehorse:", ":deer:", ":unicorn:", ":cow:", ":ox:", ":water_buffalo:", ":cow2:", ":pig:", ":pig2:", ":boar:", ":pig_nose:", ":ram:", ":sheep:", ":goat:", ":dromedary_camel:", ":camel:", ":elephant:", ":rhino:", ":mouse:", ":mouse2:", ":rat:", ":hamster:", ":rabbit:", ":rabbit2:", ":chipmunk:", ":bat:", ":bear:", ":koala:", ":panda_face:", ":feet:", ":turkey:", ":chicken:", ":rooster:", ":hatching_chick:", ":baby_chick:", ":hatched_chick:", ":bird:", ":penguin:", ":dove:", ":eagle:", ":duck:", ":owl:", ":frog:", ":crocodile:", ":turtle:", ":lizard:", ":snake:", ":dragon_face:", ":dragon:", ":whale:", ":whale2:", ":dolphin:", ":fish:", ":tropical_fish:", ":blowfish:", ":shark:", ":octopus:", ":shell:", ":crab:", ":shrimp:", ":squid:", ":butterfly:", ":snail:", ":bug:", ":ant:", ":bee:", ":beetle:", ":spider:", ":spider_web:", ":scorpion:", ":bouquet:", ":cherry_blossom:", ":rosette:", ":rose:", ":wilted_rose:", ":hibiscus:", ":sunflower:", ":blossom:", ":tulip:", ":seedling:", ":evergreen_tree:", ":deciduous_tree:", ":palm_tree:", ":cactus:", ":ear_of_rice:", ":herb:", ":shamrock:", ":four_leaf_clover:", ":maple_leaf:", ":fallen_leaf:", ":leaves:", ":mushroom:", ":chestnut:", ":earth_africa:", ":earth_americas:", ":earth_asia:", ":new_moon:", ":waxing_crescent_moon:", ":first_quarter_moon:", ":waxing_gibbous_moon:", ":full_moon:", ":waning_gibbous_moon:", ":last_quarter_moon:", ":waning_crescent_moon:", ":crescent_moon:", ":new_moon_with_face:", ":first_quarter_moon_with_face:", ":last_quarter_moon_with_face:", ":sunny:", ":full_moon_with_face:", ":sun_with_face:", ":star:", ":star2:", ":cloud:", ":partly_sunny:", ":thunder_cloud_rain:", ":white_sun_small_cloud:", ":white_sun_cloud:", ":white_sun_rain_cloud:", ":cloud_rain:", ":cloud_snow:", ":cloud_lightning:", ":cloud_tornado:", ":fog:", ":wind_blowing_face:", ":umbrella2:", ":umbrella:", ":zap:", ":snowflake:", ":snowman2:", ":snowman:", ":comet:", ":fire:", ":droplet:", ":ocean:", ":jack_o_lantern:", ":christmas_tree:", ":sparkles:", ":tanabata_tree:", ":bamboo:" ] ],
    [ ["food", "icon-food"], [":grapes:", ":melon:", ":watermelon:", ":tangerine:", ":lemon:", ":banana:", ":pineapple:", ":apple:", ":green_apple:", ":pear:", ":peach:", ":cherries:", ":strawberry:", ":kiwi:", ":tomato:", ":avocado:", ":eggplant:", ":potato:", ":carrot:", ":corn:", ":hot_pepper:", ":cucumber:", ":peanuts:", ":bread:", ":croissant:", ":french_bread:", ":pancakes:", ":cheese:", ":meat_on_bone:", ":poultry_leg:", ":bacon:", ":hamburger:", ":fries:", ":pizza:", ":hotdog:", ":taco:", ":burrito:", ":stuffed_flatbread:", ":egg:", ":cooking:", ":shallow_pan_of_food:", ":stew:", ":salad:", ":popcorn:", ":bento:", ":rice_cracker:", ":rice_ball:", ":rice:", ":curry:", ":ramen:", ":spaghetti:", ":sweet_potato:", ":oden:", ":sushi:", ":fried_shrimp:", ":fish_cake:", ":dango:", ":icecream:", ":shaved_ice:", ":ice_cream:", ":doughnut:", ":cookie:", ":birthday:", ":cake:", ":chocolate_bar:", ":candy:", ":lollipop:", ":custard:", ":honey_pot:", ":baby_bottle:", ":milk:", ":coffee:", ":tea:", ":sake:", ":champagne:", ":wine_glass:", ":cocktail:", ":tropical_drink:", ":beer:", ":beers:", ":champagne_glass:", ":tumbler_glass:", ":fork_knife_plate:", ":fork_and_knife:", ":spoon:" ] ],
    [ ["activity", "icon-activity"], [":space_invader:", ":levitate:", ":fencer:", ":horse_racing:", ":skier:", ":snowboarder:", ":golfer:", ":surfer:", ":rowboat:", ":swimmer:", ":basketball_player:", ":lifter:", ":bicyclist:", ":mountain_bicyclist:", ":cartwheel:", ":wrestlers:", ":water_polo:", ":handball:", ":juggling:", ":circus_tent:", ":performing_arts:", ":art:", ":slot_machine:", ":bath:", ":reminder_ribbon:", ":tickets:", ":ticket:", ":military_medal:", ":trophy:", ":medal:", ":first_place:", ":second_place:", ":third_place:", ":soccer:", ":baseball:", ":basketball:", ":volleyball:", ":football:", ":rugby_football:", ":tennis:", ":8ball:", ":bowling:", ":cricket:", ":field_hockey:", ":hockey:", ":ping_pong:", ":badminton:", ":boxing_glove:", ":martial_arts_uniform:", ":goal:", ":dart:", ":golf:", ":ice_skate:", ":fishing_pole_and_fish:", ":running_shirt_with_sash:", ":ski:", ":video_game:", ":game_die:", ":musical_score:", ":microphone:", ":headphones:", ":saxophone:", ":guitar:", ":musical_keyboard:", ":trumpet:", ":violin:", ":drum:", ":clapper:", ":bow_and_arrow:" ] ],
    [ ["travel", "icon-travel"], [":race_car:", ":motorcycle:", ":japan:", ":mountain_snow:", ":mountain:", ":volcano:", ":mount_fuji:", ":camping:", ":beach:", ":desert:", ":island:", ":park:", ":stadium:", ":classical_building:", ":construction_site:", ":homes:", ":cityscape:", ":house_abandoned:", ":house:", ":house_with_garden:", ":office:", ":post_office:", ":european_post_office:", ":hospital:", ":bank:", ":hotel:", ":love_hotel:", ":convenience_store:", ":school:", ":department_store:", ":factory:", ":japanese_castle:", ":european_castle:", ":wedding:", ":tokyo_tower:", ":statue_of_liberty:", ":church:", ":mosque:", ":synagogue:", ":shinto_shrine:", ":kaaba:", ":fountain:", ":tent:", ":foggy:", ":night_with_stars:", ":sunrise_over_mountains:", ":sunrise:", ":city_dusk:", ":city_sunset:", ":bridge_at_night:", ":milky_way:", ":carousel_horse:", ":ferris_wheel:", ":roller_coaster:", ":steam_locomotive:", ":railway_car:", ":bullettrain_side:", ":bullettrain_front:", ":train2:", ":metro:", ":light_rail:", ":station:", ":tram:", ":monorail:", ":mountain_railway:", ":train:", ":bus:", ":oncoming_bus:", ":trolleybus:", ":minibus:", ":ambulance:", ":fire_engine:", ":police_car:", ":oncoming_police_car:", ":taxi:", ":oncoming_taxi:", ":red_car:", ":oncoming_automobile:", ":blue_car:", ":truck:", ":articulated_lorry:", ":tractor:", ":bike:", ":scooter:", ":motor_scooter:", ":busstop:", ":motorway:", ":railway_track:", ":fuelpump:", ":rotating_light:", ":traffic_light:", ":vertical_traffic_light:", ":construction:", ":anchor:", ":sailboat:", ":canoe:", ":speedboat:", ":cruise_ship:", ":ferry:", ":motorboat:", ":ship:", ":airplane:", ":airplane_small:", ":airplane_departure:", ":airplane_arriving:", ":seat:", ":helicopter:", ":suspension_railway:", ":mountain_cableway:", ":aerial_tramway:", ":rocket:", ":satellite_orbital:", ":stars:", ":rainbow:", ":fireworks:", ":sparkler:", ":rice_scene:", ":checkered_flag:" ] ],
    [ ["objects", "icon-objects"], [":skull_crossbones:", ":love_letter:", ":bomb:", ":hole:", ":shopping_bags:", ":prayer_beads:", ":gem:", ":knife:", ":amphora:", ":map:", ":barber:", ":frame_photo:", ":bellhop:", ":door:", ":sleeping_accommodation:", ":bed:", ":couch:", ":toilet:", ":shower:", ":bathtub:", ":hourglass:", ":hourglass_flowing_sand:", ":watch:", ":alarm_clock:", ":stopwatch:", ":timer:", ":clock:", ":thermometer:", ":beach_umbrella:", ":balloon:", ":tada:", ":confetti_ball:", ":dolls:", ":flags:", ":wind_chime:", ":ribbon:", ":gift:", ":joystick:", ":postal_horn:", ":microphone2:", ":level_slider:", ":control_knobs:", ":radio:", ":iphone:", ":calling:", ":telephone:", ":telephone_receiver:", ":pager:", ":fax:", ":battery:", ":electric_plug:", ":computer:", ":desktop:", ":printer:", ":keyboard:", ":mouse_three_button:", ":trackball:", ":minidisc:", ":floppy_disk:", ":cd:", ":dvd:", ":movie_camera:", ":film_frames:", ":projector:", ":tv:", ":camera:", ":camera_with_flash:", ":video_camera:", ":vhs:", ":mag:", ":mag_right:", ":microscope:", ":telescope:", ":satellite:", ":candle:", ":bulb:", ":flashlight:", ":izakaya_lantern:", ":notebook_with_decorative_cover:", ":closed_book:", ":book:", ":green_book:", ":blue_book:", ":orange_book:", ":books:", ":notebook:", ":ledger:", ":page_with_curl:", ":scroll:", ":page_facing_up:", ":newspaper:", ":newspaper2:", ":bookmark_tabs:", ":bookmark:", ":label:", ":moneybag:", ":yen:", ":dollar:", ":euro:", ":pound:", ":money_with_wings:", ":credit_card:", ":envelope:", ":e-mail:", ":incoming_envelope:", ":envelope_with_arrow:", ":outbox_tray:", ":inbox_tray:", ":package:", ":mailbox:", ":mailbox_closed:", ":mailbox_with_mail:", ":mailbox_with_no_mail:", ":postbox:", ":ballot_box:", ":pencil2:", ":black_nib:", ":pen_fountain:", ":pen_ballpoint:", ":paintbrush:", ":crayon:", ":pencil:", ":file_folder:", ":open_file_folder:", ":dividers:", ":date:", ":calendar:", ":notepad_spiral:", ":calendar_spiral:", ":card_index:", ":chart_with_upwards_trend:", ":chart_with_downwards_trend:", ":bar_chart:", ":clipboard:", ":pushpin:", ":round_pushpin:", ":paperclip:", ":paperclips:", ":straight_ruler:", ":triangular_ruler:", ":scissors:", ":card_box:", ":file_cabinet:", ":wastebasket:", ":lock:", ":unlock:", ":lock_with_ink_pen:", ":closed_lock_with_key:", ":key:", ":key2:", ":hammer:", ":pick:", ":hammer_pick:", ":tools:", ":dagger:", ":crossed_swords:", ":gun:", ":shield:", ":wrench:", ":nut_and_bolt:", ":gear:", ":compression:", ":alembic:", ":scales:", ":link:", ":chains:", ":syringe:", ":pill:", ":smoking:", ":coffin:", ":urn:", ":moyai:", ":oil:", ":crystal_ball:", ":shopping_cart:", ":triangular_flag_on_post:", ":crossed_flags:", ":flag_black:", ":flag_white:", ":rainbow_flag:" ] ],
    [ ["symbols", "icon-symbols"], [":eye_in_speech_bubble:", ":cupid:", ":heart:", ":heartbeat:", ":broken_heart:", ":two_hearts:", ":sparkling_heart:", ":heartpulse:", ":blue_heart:", ":green_heart:", ":yellow_heart:", ":purple_heart:", ":black_heart:", ":gift_heart:", ":revolving_hearts:", ":heart_decoration:", ":heart_exclamation:", ":anger:", ":boom:", ":dizzy:", ":speech_balloon:", ":speech_left:", ":anger_right:", ":thought_balloon:", ":white_flower:", ":globe_with_meridians:", ":hotsprings:", ":octagonal_sign:", ":clock12:", ":clock1230:", ":clock1:", ":clock130:", ":clock2:", ":clock230:", ":clock3:", ":clock330:", ":clock4:", ":clock430:", ":clock5:", ":clock530:", ":clock6:", ":clock630:", ":clock7:", ":clock730:", ":clock8:", ":clock830:", ":clock9:", ":clock930:", ":clock10:", ":clock1030:", ":clock11:", ":clock1130:", ":cyclone:", ":spades:", ":hearts:", ":diamonds:", ":clubs:", ":black_joker:", ":mahjong:", ":flower_playing_cards:", ":mute:", ":speaker:", ":sound:", ":loud_sound:", ":loudspeaker:", ":mega:", ":bell:", ":no_bell:", ":musical_note:", ":notes:", ":chart:", ":currency_exchange:", ":heavy_dollar_sign:", ":atm:", ":put_litter_in_its_place:", ":potable_water:", ":wheelchair:", ":mens:", ":womens:", ":restroom:", ":baby_symbol:", ":wc:", ":passport_control:", ":customs:", ":baggage_claim:", ":left_luggage:", ":warning:", ":children_crossing:", ":no_entry:", ":no_entry_sign:", ":no_bicycles:", ":no_smoking:", ":do_not_litter:", ":non-potable_water:", ":no_pedestrians:", ":no_mobile_phones:", ":underage:", ":radioactive:", ":biohazard:", ":arrow_up:", ":arrow_upper_right:", ":arrow_right:", ":arrow_lower_right:", ":arrow_down:", ":arrow_lower_left:", ":arrow_left:", ":arrow_upper_left:", ":arrow_up_down:", ":left_right_arrow:", ":leftwards_arrow_with_hook:", ":arrow_right_hook:", ":arrow_heading_up:", ":arrow_heading_down:", ":arrows_clockwise:", ":arrows_counterclockwise:", ":back:", ":end:", ":on:", ":soon:", ":top:", ":place_of_worship:", ":atom:", ":om_symbol:", ":star_of_david:", ":wheel_of_dharma:", ":yin_yang:", ":cross:", ":orthodox_cross:", ":star_and_crescent:", ":peace:", ":menorah:", ":six_pointed_star:", ":aries:", ":taurus:", ":gemini:", ":cancer:", ":leo:", ":virgo:", ":libra:", ":scorpius:", ":sagittarius:", ":capricorn:", ":aquarius:", ":pisces:", ":ophiuchus:", ":twisted_rightwards_arrows:", ":repeat:", ":repeat_one:", ":arrow_forward:", ":fast_forward:", ":track_next:", ":play_pause:", ":arrow_backward:", ":rewind:", ":track_previous:", ":arrow_up_small:", ":arrow_double_up:", ":arrow_down_small:", ":arrow_double_down:", ":pause_button:", ":stop_button:", ":record_button:", ":eject:", ":cinema:", ":low_brightness:", ":high_brightness:", ":signal_strength:", ":vibration_mode:", ":mobile_phone_off:", ":recycle:", ":name_badge:", ":fleur-de-lis:", ":beginner:", ":trident:", ":o:", ":white_check_mark:", ":ballot_box_with_check:", ":heavy_check_mark:", ":heavy_multiplication_x:", ":x:", ":negative_squared_cross_mark:", ":heavy_plus_sign:", ":heavy_minus_sign:", ":heavy_division_sign:", ":curly_loop:", ":loop:", ":part_alternation_mark:", ":eight_spoked_asterisk:", ":eight_pointed_black_star:", ":sparkle:", ":bangbang:", ":interrobang:", ":question:", ":grey_question:", ":grey_exclamation:", ":exclamation:", ":wavy_dash:", ":copyright:", ":registered:", ":tm:", ":hash:", ":asterisk:", ":zero:", ":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:", ":keycap_ten:", ":100:", ":capital_abcd:", ":abcd:", ":1234:", ":symbols:", ":abc:", ":a:", ":ab:", ":b:", ":cl:", ":cool:", ":free:", ":information_source:", ":id:", ":m:", ":new:", ":ng:", ":o2:", ":ok:", ":parking:", ":sos:", ":up:", ":vs:", ":koko:", ":sa:", ":u6708:", ":u6709:", ":u6307:", ":ideograph_advantage:", ":u5272:", ":u7121:", ":u7981:", ":accept:", ":u7533:", ":u5408:", ":u7a7a:", ":congratulations:", ":secret:", ":u55b6:", ":u6e80:", ":black_small_square:", ":white_small_square:", ":white_medium_square:", ":black_medium_square:", ":white_medium_small_square:", ":black_medium_small_square:", ":black_large_square:", ":white_large_square:", ":large_orange_diamond:", ":large_blue_diamond:", ":small_orange_diamond:", ":small_blue_diamond:", ":small_red_triangle:", ":small_red_triangle_down:", ":diamond_shape_with_a_dot_inside:", ":radio_button:", ":black_square_button:", ":white_square_button:", ":white_circle:", ":black_circle:", ":red_circle:", ":blue_circle:" ] ],
    [ ["flags", "icon-flags"], [":flag_ac:", ":flag_ad:", ":flag_ae:", ":flag_af:", ":flag_ag:", ":flag_ai:", ":flag_al:", ":flag_am:", ":flag_ao:", ":flag_aq:", ":flag_ar:", ":flag_as:", ":flag_at:", ":flag_au:", ":flag_aw:", ":flag_ax:", ":flag_az:", ":flag_ba:", ":flag_bb:", ":flag_bd:", ":flag_be:", ":flag_bf:", ":flag_bg:", ":flag_bh:", ":flag_bi:", ":flag_bj:", ":flag_bl:", ":flag_bm:", ":flag_bn:", ":flag_bo:", ":flag_bq:", ":flag_br:", ":flag_bs:", ":flag_bt:", ":flag_bv:", ":flag_bw:", ":flag_by:", ":flag_bz:", ":flag_ca:", ":flag_cc:", ":flag_cd:", ":flag_cf:", ":flag_cg:", ":flag_ch:", ":flag_ci:", ":flag_ck:", ":flag_cl:", ":flag_cm:", ":flag_cn:", ":flag_co:", ":flag_cp:", ":flag_cr:", ":flag_cu:", ":flag_cv:", ":flag_cw:", ":flag_cx:", ":flag_cy:", ":flag_cz:", ":flag_de:", ":flag_dg:", ":flag_dj:", ":flag_dk:", ":flag_dm:", ":flag_do:", ":flag_dz:", ":flag_ea:", ":flag_ec:", ":flag_ee:", ":flag_eg:", ":flag_eh:", ":flag_er:", ":flag_es:", ":flag_et:", ":flag_eu:", ":flag_fi:", ":flag_fj:", ":flag_fk:", ":flag_fm:", ":flag_fo:", ":flag_fr:", ":flag_ga:", ":flag_gb:", ":flag_gd:", ":flag_ge:", ":flag_gf:", ":flag_gg:", ":flag_gh:", ":flag_gi:", ":flag_gl:", ":flag_gm:", ":flag_gn:", ":flag_gp:", ":flag_gq:", ":flag_gr:", ":flag_gs:", ":flag_gt:", ":flag_gu:", ":flag_gw:", ":flag_gy:", ":flag_hk:", ":flag_hm:", ":flag_hn:", ":flag_hr:", ":flag_ht:", ":flag_hu:", ":flag_ic:", ":flag_id:", ":flag_ie:", ":flag_il:", ":flag_im:", ":flag_in:", ":flag_io:", ":flag_iq:", ":flag_ir:", ":flag_is:", ":flag_it:", ":flag_je:", ":flag_jm:", ":flag_jo:", ":flag_jp:", ":flag_ke:", ":flag_kg:", ":flag_kh:", ":flag_ki:", ":flag_km:", ":flag_kn:", ":flag_kp:", ":flag_kr:", ":flag_kw:", ":flag_ky:", ":flag_kz:", ":flag_la:", ":flag_lb:", ":flag_lc:", ":flag_li:", ":flag_lk:", ":flag_lr:", ":flag_ls:", ":flag_lt:", ":flag_lu:", ":flag_lv:", ":flag_ly:", ":flag_ma:", ":flag_mc:", ":flag_md:", ":flag_me:", ":flag_mf:", ":flag_mg:", ":flag_mh:", ":flag_mk:", ":flag_ml:", ":flag_mm:", ":flag_mn:", ":flag_mo:", ":flag_mp:", ":flag_mq:", ":flag_mr:", ":flag_ms:", ":flag_mt:", ":flag_mu:", ":flag_mv:", ":flag_mw:", ":flag_mx:", ":flag_my:", ":flag_mz:", ":flag_na:", ":flag_nc:", ":flag_ne:", ":flag_nf:", ":flag_ng:", ":flag_ni:", ":flag_nl:", ":flag_no:", ":flag_np:", ":flag_nr:", ":flag_nu:", ":flag_nz:", ":flag_om:", ":flag_pa:", ":flag_pe:", ":flag_pf:", ":flag_pg:", ":flag_ph:", ":flag_pk:", ":flag_pl:", ":flag_pm:", ":flag_pn:", ":flag_pr:", ":flag_ps:", ":flag_pt:", ":flag_pw:", ":flag_py:", ":flag_qa:", ":flag_re:", ":flag_ro:", ":flag_rs:", ":flag_ru:", ":flag_rw:", ":flag_sa:", ":flag_sb:", ":flag_sc:", ":flag_sd:", ":flag_se:", ":flag_sg:", ":flag_sh:", ":flag_si:", ":flag_sj:", ":flag_sk:", ":flag_sl:", ":flag_sm:", ":flag_sn:", ":flag_so:", ":flag_sr:", ":flag_ss:", ":flag_st:", ":flag_sv:", ":flag_sx:", ":flag_sy:", ":flag_sz:", ":flag_ta:", ":flag_tc:", ":flag_td:", ":flag_tf:", ":flag_tg:", ":flag_th:", ":flag_tj:", ":flag_tk:", ":flag_tl:", ":flag_tm:", ":flag_tn:", ":flag_to:", ":flag_tr:", ":flag_tt:", ":flag_tv:", ":flag_tw:", ":flag_tz:", ":flag_ua:", ":flag_ug:", ":flag_um:", ":flag_us:", ":flag_uy:", ":flag_uz:", ":flag_va:", ":flag_vc:", ":flag_ve:", ":flag_vg:", ":flag_vi:", ":flag_vn:", ":flag_vu:", ":flag_wf:", ":flag_ws:", ":flag_xk:", ":flag_ye:", ":flag_yt:", ":flag_za:", ":flag_zm:", ":flag_zw:" ] ]
  ],

// called to convert unicode symbols to emoji images
  fy: function (text) {
    return emojione.unicodeToImage(text);
  },

// turn shortname into img object for the emoji category div
  render: function (emoji) {
    var img = $(emojione.shortnameToImage(emoji));
    img[0].dataset.emoji = emojione.shortnameToUnicode(emoji);

    return img;
  }

};
