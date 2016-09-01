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

      if (msg.groupJid && msg.type != 'skmsg') {
        // ignore decryption error for non-skmsg group messages, we'll
        // handle these on the skmsg
      } else {
        if (axolLocalReg && (!msg.count || Number(msg.count) < 5)) {
          var count = msg.count ? Number(msg.count) + 1 : 1;
          MI.call('message_retry', [msg.groupJid ? msg.groupJid : msg.remoteJid,
                                    msg.msgId, axolLocalReg.registrationId,
                                    count.toString(),
                                    msg.groupJid ? '1' : msg.v,
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

        allDone.push(axolotlCrypto.deriveHKDFv3Secrets(videoEncKey, CoSeMe.utils.bytesFromHex('576861747341707020566964656f204b657973'), 112).then(function (deriv) {
          var iv = deriv.subarray(0, 16);
          var key = deriv.subarray(16, 48);
          Tools.log('MEDIA ENCRYPTION KEYS', CoSeMe.utils.hex(iv), CoSeMe.utils.hex(key));
          onVideo(videoThumb, video_msg.url, video_msg.file_length.toNumber(), video_msg.mime_type, { iv: CoSeMe.utils.latin1FromBytes(iv), key: CoSeMe.utils.latin1FromBytes(key) });
        }));
      } else if (v2msg.sender_key_distribution_message) {
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
      } else {
        Tools.log('UNHANDLED v2msg');
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
      Lungo.Notification.show('download', _('Synchronizing'), 5);
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
          Lungo.Notification.show('up-sign', _('Uploading'), 3);
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

        if (jid == this.account.core.fullJid) {
          Tools.picThumb(blob, 96, 96, function (url) {
            $('section#main[data-jid="' + jid + '"] footer span.avatar img').attr('src', url);
            $('aside#accounts article#accounts div[data-jid="' + jid + '"] span.avatar img').attr('src', url);
            if (Accounts.current === account) {
              $('section#me .avatar img').attr('src', url);
            }
            Store.save(url, function (index) {
              avatars[jid] = (new Avatar({id: picId, chunk: index})).data;
              App.avatars = avatars;
              gotAvatar (true);
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
              gotAvatar (true);
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
                             [msg.id, from, m.body,
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
      Lungo.Notification.success(_('Removed'), null, 'trash', 3);
    };

    this.events.onGroupEndSuccess = function (gid) {
      Lungo.Notification.success(_('Removed'), null, 'trash', 3);
    };

    this.events.onGroupCreateSuccess = function (gid, idx) {
      Lungo.Notification.show('download', _('Synchronizing'), 5);
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
        msg.receive();
        this.ack(msgId, isGroup ? to : from, null, isGroup ? from : null);
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
  emojis: [
    [ ["people", "icon-people"], [":grinning:", ":grimacing:", ":grin:", ":joy:", ":smiley:", ":smile:", ":sweat_smile:", ":laughing:", ":innocent:", ":wink:", ":blush:", ":slight_smile:", ":upside_down:", ":relaxed:", ":yum:", ":relieved:", ":heart_eyes:", ":kissing_heart:", ":kissing:", ":kissing_smiling_eyes:", ":kissing_closed_eyes:", ":stuck_out_tongue_winking_eye:", ":stuck_out_tongue_closed_eyes:", ":stuck_out_tongue:", ":money_mouth:", ":nerd:", ":sunglasses:", ":hugging:", ":smirk:", ":no_mouth:", ":neutral_face:", ":expressionless:", ":unamused:", ":rolling_eyes:", ":thinking:", ":flushed:", ":disappointed:", ":worried:", ":angry:", ":rage:", ":pensive:", ":confused:", ":slight_frown:", ":frowning2:", ":persevere:", ":confounded:", ":tired_face:", ":weary:", ":triumph:", ":open_mouth:", ":scream:", ":fearful:", ":cold_sweat:", ":hushed:", ":frowning:", ":anguished:", ":cry:", ":disappointed_relieved:", ":sleepy:", ":sweat:", ":sob:", ":dizzy_face:", ":astonished:", ":zipper_mouth:", ":mask:", ":thermometer_face:", ":head_bandage:", ":sleeping:", ":zzz:", ":poop:", ":smiling_imp:", ":imp:", ":japanese_ogre:", ":japanese_goblin:", ":skull:", ":ghost:", ":alien:", ":robot:", ":smiley_cat:", ":smile_cat:", ":joy_cat:", ":heart_eyes_cat:", ":smirk_cat:", ":kissing_cat:", ":scream_cat:", ":crying_cat_face:", ":pouting_cat:", ":raised_hands:", ":clap:", ":wave:", ":thumbsup:", ":thumbsdown:", ":punch:", ":fist:", ":v:", ":ok_hand:", ":raised_hand:", ":open_hands:", ":muscle:", ":pray:", ":point_up:", ":point_up_2:", ":point_down:", ":point_left:", ":point_right:", ":middle_finger:", ":hand_splayed:", ":metal:", ":vulcan:", ":writing_hand:", ":nail_care:", ":lips:", ":tongue:", ":ear:", ":nose:", ":eye:", ":eyes:", ":bust_in_silhouette:", ":busts_in_silhouette:", ":speaking_head:", ":baby:", ":boy:", ":girl:", ":man:", ":woman:", ":person_with_blond_hair:", ":older_man:", ":older_woman:", ":man_with_gua_pi_mao:", ":man_with_turban:", ":cop:", ":construction_worker:", ":guardsman:", ":spy:", ":santa:", ":angel:", ":princess:", ":bride_with_veil:", ":walking:", ":runner:", ":dancer:", ":dancers:", ":couple:", ":two_men_holding_hands:", ":two_women_holding_hands:", ":bow:", ":information_desk_person:", ":no_good:", ":ok_woman:", ":raising_hand:", ":person_with_pouting_face:", ":person_frowning:", ":haircut:", ":massage:", ":couple_with_heart:", ":couple_ww:", ":couple_mm:", ":couplekiss:", ":kiss_ww:", ":kiss_mm:", ":family:", ":family_mwg:", ":family_mwgb:", ":family_mwbb:", ":family_mwgg:", ":family_wwb:", ":family_wwg:", ":family_wwgb:", ":family_wwbb:", ":family_wwgg:", ":family_mmb:", ":family_mmg:", ":family_mmgb:", ":family_mmbb:", ":family_mmgg:", ":womans_clothes:", ":shirt:", ":jeans:", ":necktie:", ":dress:", ":bikini:", ":kimono:", ":lipstick:", ":kiss:", ":footprints:", ":high_heel:", ":sandal:", ":boot:", ":mans_shoe:", ":athletic_shoe:", ":womans_hat:", ":tophat:", ":helmet_with_cross:", ":mortar_board:", ":crown:", ":school_satchel:", ":pouch:", ":purse:", ":handbag:", ":briefcase:", ":eyeglasses:", ":dark_sunglasses:", ":ring:", ":closed_umbrella:"] ],
    [ ["nature", "icon-nature"], [":dog:", ":cat:", ":mouse:", ":hamster:", ":rabbit:", ":bear:", ":panda_face:", ":koala:", ":tiger:", ":lion_face:", ":cow:", ":pig:", ":pig_nose:", ":frog:", ":octopus:", ":monkey_face:", ":see_no_evil:", ":hear_no_evil:", ":speak_no_evil:", ":monkey:", ":chicken:", ":penguin:", ":bird:", ":baby_chick:", ":hatching_chick:", ":hatched_chick:", ":wolf:", ":boar:", ":horse:", ":unicorn:", ":bee:", ":bug:", ":snail:", ":beetle:", ":ant:", ":spider:", ":scorpion:", ":crab:", ":snake:", ":turtle:", ":tropical_fish:", ":fish:", ":blowfish:", ":dolphin:", ":whale:", ":whale2:", ":crocodile:", ":leopard:", ":tiger2:", ":water_buffalo:", ":ox:", ":cow2:", ":dromedary_camel:", ":camel:", ":elephant:", ":goat:", ":ram:", ":sheep:", ":racehorse:", ":pig2:", ":rat:", ":mouse2:", ":rooster:", ":turkey:", ":dove:", ":dog2:", ":poodle:", ":cat2:", ":rabbit2:", ":chipmunk:", ":feet:", ":dragon:", ":dragon_face:", ":cactus:", ":christmas_tree:", ":evergreen_tree:", ":deciduous_tree:", ":palm_tree:", ":seedling:", ":herb:", ":shamrock:", ":four_leaf_clover:", ":bamboo:", ":tanabata_tree:", ":leaves:", ":fallen_leaf:", ":maple_leaf:", ":ear_of_rice:", ":hibiscus:", ":sunflower:", ":rose:", ":tulip:", ":blossom:", ":cherry_blossom:", ":bouquet:", ":mushroom:", ":chestnut:", ":jack_o_lantern:", ":shell:", ":spider_web:", ":earth_americas:", ":earth_africa:", ":earth_asia:", ":full_moon:", ":waning_gibbous_moon:", ":last_quarter_moon:", ":waning_crescent_moon:", ":new_moon:", ":waxing_crescent_moon:", ":first_quarter_moon:", ":waxing_gibbous_moon:", ":new_moon_with_face:", ":full_moon_with_face:", ":first_quarter_moon_with_face:", ":last_quarter_moon_with_face:", ":sun_with_face:", ":crescent_moon:", ":star:", ":star2:", ":dizzy:", ":sparkles:", ":comet:", ":sunny:", ":white_sun_small_cloud:", ":partly_sunny:", ":white_sun_cloud:", ":white_sun_rain_cloud:", ":cloud:", ":cloud_rain:", ":thunder_cloud_rain:", ":cloud_lightning:", ":zap:", ":fire:", ":boom:", ":snowflake:", ":cloud_snow:", ":snowman2:", ":snowman:", ":wind_blowing_face:", ":dash:", ":cloud_tornado:", ":fog:", ":umbrella2:", ":umbrella:", ":droplet:", ":sweat_drops:", ":ocean:"] ],
    [ ["food", "icon-foods"], [":green_apple:", ":apple:", ":pear:", ":tangerine:", ":lemon:", ":banana:", ":watermelon:", ":grapes:", ":strawberry:", ":melon:", ":cherries:", ":peach:", ":pineapple:", ":tomato:", ":eggplant:", ":hot_pepper:", ":corn:", ":sweet_potato:", ":honey_pot:", ":bread:", ":cheese:", ":poultry_leg:", ":meat_on_bone:", ":fried_shrimp:", ":egg:", ":hamburger:", ":fries:", ":hotdog:", ":pizza:", ":spaghetti:", ":taco:", ":burrito:", ":ramen:", ":stew:", ":fish_cake:", ":sushi:", ":bento:", ":curry:", ":rice_ball:", ":rice:", ":rice_cracker:", ":oden:", ":dango:", ":shaved_ice:", ":ice_cream:", ":icecream:", ":cake:", ":birthday:", ":custard:", ":candy:", ":lollipop:", ":chocolate_bar:", ":popcorn:", ":doughnut:", ":cookie:", ":beer:", ":beers:", ":wine_glass:", ":cocktail:", ":tropical_drink:", ":champagne:", ":sake:", ":tea:", ":coffee:", ":baby_bottle:", ":fork_and_knife:", ":fork_knife_plate:"] ],
    [ ["activity", "icon-activity"], [":soccer:", ":basketball:", ":football:", ":baseball:", ":tennis:", ":volleyball:", ":rugby_football:", ":8ball:", ":golf:", ":golfer:", ":ping_pong:", ":badminton:", ":hockey:", ":field_hockey:", ":cricket:", ":ski:", ":skier:", ":snowboarder:", ":ice_skate:", ":bow_and_arrow:", ":fishing_pole_and_fish:", ":rowboat:", ":swimmer:", ":surfer:", ":bath:", ":basketball_player:", ":lifter:", ":bicyclist:", ":mountain_bicyclist:", ":horse_racing:", ":levitate:", ":trophy:", ":running_shirt_with_sash:", ":medal:", ":military_medal:", ":reminder_ribbon:", ":rosette:", ":ticket:", ":tickets:", ":performing_arts:", ":art:", ":circus_tent:", ":microphone:", ":headphones:", ":musical_score:", ":musical_keyboard:", ":saxophone:", ":trumpet:", ":guitar:", ":violin:", ":clapper:", ":video_game:", ":space_invader:", ":dart:", ":game_die:", ":slot_machine:", ":bowling:",] ],
    [ ["travel", "icon-travel"], [":red_car:", ":taxi:", ":blue_car:", ":bus:", ":trolleybus:", ":race_car:", ":police_car:", ":ambulance:", ":fire_engine:", ":minibus:", ":truck:", ":articulated_lorry:", ":tractor:", ":motorcycle:", ":bike:", ":rotating_light:", ":oncoming_police_car:", ":oncoming_bus:", ":oncoming_automobile:", ":oncoming_taxi:", ":aerial_tramway:", ":mountain_cableway:", ":suspension_railway:", ":railway_car:", ":train:", ":monorail:", ":bullettrain_side:", ":bullettrain_front:", ":light_rail:", ":mountain_railway:", ":steam_locomotive:", ":train2:", ":metro:", ":tram:", ":station:", ":helicopter:", ":airplane_small:", ":airplane:", ":airplane_departure:", ":airplane_arriving:", ":sailboat:", ":motorboat:", ":speedboat:", ":ferry:", ":cruise_ship:", ":rocket:", ":satellite_orbital:", ":seat:", ":anchor:", ":construction:", ":fuelpump:", ":busstop:", ":vertical_traffic_light:", ":traffic_light:", ":checkered_flag:", ":ship:", ":ferris_wheel:", ":roller_coaster:", ":carousel_horse:", ":construction_site:", ":foggy:", ":tokyo_tower:", ":factory:", ":fountain:", ":rice_scene:", ":mountain:", ":mountain_snow:", ":mount_fuji:", ":volcano:", ":japan:", ":camping:", ":tent:", ":park:", ":motorway:", ":railway_track:", ":sunrise:", ":sunrise_over_mountains:", ":desert:", ":beach:", ":island:", ":city_sunset:", ":city_dusk:", ":cityscape:", ":night_with_stars:", ":bridge_at_night:", ":milky_way:", ":stars:", ":sparkler:", ":fireworks:", ":rainbow:", ":homes:", ":european_castle:", ":japanese_castle:", ":stadium:", ":statue_of_liberty:", ":house:", ":house_with_garden:", ":house_abandoned:", ":office:", ":department_store:", ":post_office:", ":european_post_office:", ":hospital:", ":bank:", ":hotel:", ":convenience_store:", ":school:", ":love_hotel:", ":wedding:", ":classical_building:", ":church:", ":mosque:", ":synagogue:", ":kaaba:", ":shinto_shrine:"] ],
    [ ["objects", "icon-objects"], [":watch:", ":iphone:", ":calling:", ":computer:", ":keyboard:", ":desktop:", ":printer:", ":mouse_three_button:", ":trackball:", ":joystick:", ":compression:", ":minidisc:", ":floppy_disk:", ":cd:", ":dvd:", ":vhs:", ":camera:", ":camera_with_flash:", ":video_camera:", ":movie_camera:", ":projector:", ":film_frames:", ":telephone_receiver:", ":telephone:", ":pager:", ":fax:", ":tv:", ":radio:", ":microphone2:", ":level_slider:", ":control_knobs:", ":stopwatch:", ":timer:", ":alarm_clock:", ":clock:", ":hourglass_flowing_sand:", ":hourglass:", ":satellite:", ":battery:", ":electric_plug:", ":bulb:", ":flashlight:", ":candle:", ":wastebasket:", ":oil:", ":money_with_wings:", ":dollar:", ":yen:", ":euro:", ":pound:", ":moneybag:", ":credit_card:", ":gem:", ":scales:", ":wrench:", ":hammer:", ":hammer_pick:", ":tools:", ":pick:", ":nut_and_bolt:", ":gear:", ":chains:", ":gun:", ":bomb:", ":knife:", ":dagger:", ":crossed_swords:", ":shield:", ":smoking:", ":skull_crossbones:", ":coffin:", ":urn:", ":amphora:", ":crystal_ball:", ":prayer_beads:", ":barber:", ":alembic:", ":telescope:", ":microscope:", ":hole:", ":pill:", ":syringe:", ":thermometer:", ":label:", ":bookmark:", ":toilet:", ":shower:", ":bathtub:", ":key:", ":key2:", ":couch:", ":sleeping_accommodation:", ":bed:", ":door:", ":bellhop:", ":frame_photo:", ":map:", ":beach_umbrella:", ":moyai:", ":shopping_bags:", ":balloon:", ":flags:", ":ribbon:", ":gift:", ":confetti_ball:", ":tada:", ":dolls:", ":wind_chime:", ":crossed_flags:", ":izakaya_lantern:", ":envelope:", ":envelope_with_arrow:", ":incoming_envelope:", ":e-mail:", ":love_letter:", ":postbox:", ":mailbox_closed:", ":mailbox:", ":mailbox_with_mail:", ":mailbox_with_no_mail:", ":package:", ":postal_horn:", ":inbox_tray:", ":outbox_tray:", ":scroll:", ":page_with_curl:", ":bookmark_tabs:", ":bar_chart:", ":chart_with_upwards_trend:", ":chart_with_downwards_trend:", ":page_facing_up:", ":date:", ":calendar:", ":calendar_spiral:", ":card_index:", ":card_box:", ":ballot_box:", ":file_cabinet:", ":clipboard:", ":notepad_spiral:", ":file_folder:", ":open_file_folder:", ":dividers:", ":newspaper2:", ":newspaper:", ":notebook:", ":closed_book:", ":green_book:", ":blue_book:", ":orange_book:", ":notebook_with_decorative_cover:", ":ledger:", ":books:", ":book:", ":link:", ":paperclip:", ":paperclips:", ":scissors:", ":triangular_ruler:", ":straight_ruler:", ":pushpin:", ":round_pushpin:", ":triangular_flag_on_post:", ":flag_white:", ":flag_black:", ":closed_lock_with_key:", ":lock:", ":unlock:", ":lock_with_ink_pen:", ":pen_ballpoint:", ":pen_fountain:", ":black_nib:", ":pencil:", ":pencil2:", ":crayon:", ":paintbrush:", ":mag:", ":mag_right:"] ],
    [ ["symbols", "icon-symbols"], [":heart:", ":yellow_heart:", ":green_heart:", ":blue_heart:", ":purple_heart:", ":broken_heart:", ":heart_exclamation:", ":two_hearts:", ":revolving_hearts:", ":heartbeat:", ":heartpulse:", ":sparkling_heart:", ":cupid:", ":gift_heart:", ":heart_decoration:", ":peace:", ":cross:", ":star_and_crescent:", ":om_symbol:", ":wheel_of_dharma:", ":star_of_david:", ":six_pointed_star:", ":menorah:", ":yin_yang:", ":orthodox_cross:", ":place_of_worship:", ":ophiuchus:", ":aries:", ":taurus:", ":gemini:", ":cancer:", ":leo:", ":virgo:", ":libra:", ":scorpius:", ":sagittarius:", ":capricorn:", ":aquarius:", ":pisces:", ":id:", ":atom:", ":u7a7a:", ":u5272:", ":radioactive:", ":biohazard:", ":mobile_phone_off:", ":vibration_mode:", ":u6709:", ":u7121:", ":u7533:", ":u55b6:", ":u6708:", ":eight_pointed_black_star:", ":vs:", ":accept:", ":white_flower:", ":ideograph_advantage:", ":secret:", ":congratulations:", ":u5408:", ":u6e80:", ":u7981:", ":a:", ":b:", ":ab:", ":cl:", ":o2:", ":sos:", ":no_entry:", ":name_badge:", ":no_entry_sign:", ":x:", ":o:", ":anger:", ":hotsprings:", ":no_pedestrians:", ":do_not_litter:", ":no_bicycles:", ":non-potable_water:", ":underage:", ":no_mobile_phones:", ":exclamation:", ":grey_exclamation:", ":question:", ":grey_question:", ":bangbang:", ":interrobang:", ":100:", ":low_brightness:", ":high_brightness:", ":trident:", ":fleur-de-lis:", ":part_alternation_mark:", ":warning:", ":children_crossing:", ":beginner:", ":recycle:", ":u6307:", ":chart:", ":sparkle:", ":eight_spoked_asterisk:", ":negative_squared_cross_mark:", ":white_check_mark:", ":diamond_shape_with_a_dot_inside:", ":cyclone:", ":loop:", ":globe_with_meridians:", ":m:", ":atm:", ":sa:", ":passport_control:", ":customs:", ":baggage_claim:", ":left_luggage:", ":wheelchair:", ":no_smoking:", ":wc:", ":parking:", ":potable_water:", ":mens:", ":womens:", ":baby_symbol:", ":restroom:", ":put_litter_in_its_place:", ":cinema:", ":signal_strength:", ":koko:", ":ng:", ":ok:", ":up:", ":cool:", ":new:", ":free:", ":zero:", ":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:", ":ten:", ":1234:", ":arrow_forward:", ":pause_button:", ":play_pause:", ":stop_button:", ":record_button:", ":track_next:", ":track_previous:", ":fast_forward:", ":rewind:", ":twisted_rightwards_arrows:", ":repeat:", ":repeat_one:", ":arrow_backward:", ":arrow_up_small:", ":arrow_down_small:", ":arrow_double_up:", ":arrow_double_down:", ":arrow_right:", ":arrow_left:", ":arrow_up:", ":arrow_down:", ":arrow_upper_right:", ":arrow_lower_right:", ":arrow_lower_left:", ":arrow_upper_left:", ":arrow_up_down:", ":left_right_arrow:", ":arrows_counterclockwise:", ":arrow_right_hook:", ":leftwards_arrow_with_hook:", ":arrow_heading_up:", ":arrow_heading_down:", ":hash:", ":asterisk:", ":information_source:", ":abc:", ":abcd:", ":capital_abcd:", ":symbols:", ":musical_note:", ":notes:", ":wavy_dash:", ":curly_loop:", ":heavy_check_mark:", ":arrows_clockwise:", ":heavy_plus_sign:", ":heavy_minus_sign:", ":heavy_division_sign:", ":heavy_multiplication_x:", ":heavy_dollar_sign:", ":currency_exchange:", ":copyright:", ":registered:", ":tm:", ":end:", ":back:", ":on:", ":top:", ":soon:", ":ballot_box_with_check:", ":radio_button:", ":white_circle:", ":black_circle:", ":red_circle:", ":large_blue_circle:", ":small_orange_diamond:", ":small_blue_diamond:", ":large_orange_diamond:", ":large_blue_diamond:", ":small_red_triangle:", ":black_small_square:", ":white_small_square:", ":black_large_square:", ":white_large_square:", ":small_red_triangle_down:", ":black_medium_square:", ":white_medium_square:", ":black_medium_small_square:", ":white_medium_small_square:", ":black_square_button:", ":white_square_button:", ":speaker:", ":sound:", ":loud_sound:", ":mute:", ":mega:", ":loudspeaker:", ":bell:", ":no_bell:", ":black_joker:", ":mahjong:", ":spades:", ":clubs:", ":hearts:", ":diamonds:", ":flower_playing_cards:", ":thought_balloon:", ":anger_right:", ":speech_balloon:", ":clock1:", ":clock2:", ":clock3:", ":clock4:", ":clock5:", ":clock6:", ":clock7:", ":clock8:", ":clock9:", ":clock10:", ":clock11:", ":clock12:", ":clock130:", ":clock230:", ":clock330:", ":clock430:", ":clock530:", ":clock630:", ":clock730:", ":clock830:", ":clock930:", ":clock1030:", ":clock1130:", ":clock1230:", ":eye_in_speech_bubble:"] ],
    [ ["flags", "icon-flags"], [":flag_ac:", ":flag_af:", ":flag_al:", ":flag_dz:", ":flag_ad:", ":flag_ao:", ":flag_ai:", ":flag_ag:", ":flag_ar:", ":flag_am:", ":flag_aw:", ":flag_au:", ":flag_at:", ":flag_az:", ":flag_bs:", ":flag_bh:", ":flag_bd:", ":flag_bb:", ":flag_by:", ":flag_be:", ":flag_bz:", ":flag_bj:", ":flag_bm:", ":flag_bt:", ":flag_bo:", ":flag_ba:", ":flag_bw:", ":flag_br:", ":flag_bn:", ":flag_bg:", ":flag_bf:", ":flag_bi:", ":flag_cv:", ":flag_kh:", ":flag_cm:", ":flag_ca:", ":flag_ky:", ":flag_cf:", ":flag_td:", ":flag_cl:", ":flag_cn:", ":flag_co:", ":flag_km:", ":flag_cg:", ":flag_cd:", ":flag_cr:", ":flag_hr:", ":flag_cu:", ":flag_cy:", ":flag_cz:", ":flag_dk:", ":flag_dj:", ":flag_dm:", ":flag_do:", ":flag_ec:", ":flag_eg:", ":flag_sv:", ":flag_gq:", ":flag_er:", ":flag_ee:", ":flag_et:", ":flag_fk:", ":flag_fo:", ":flag_fj:", ":flag_fi:", ":flag_fr:", ":flag_pf:", ":flag_ga:", ":flag_gm:", ":flag_ge:", ":flag_de:", ":flag_gh:", ":flag_gi:", ":flag_gr:", ":flag_gl:", ":flag_gd:", ":flag_gu:", ":flag_gt:", ":flag_gn:", ":flag_gw:", ":flag_gy:", ":flag_ht:", ":flag_hn:", ":flag_hk:", ":flag_hu:", ":flag_is:", ":flag_in:", ":flag_id:", ":flag_ir:", ":flag_iq:", ":flag_ie:", ":flag_il:", ":flag_it:", ":flag_ci:", ":flag_jm:", ":flag_jp:", ":flag_je:", ":flag_jo:", ":flag_kz:", ":flag_ke:", ":flag_ki:", ":flag_xk:", ":flag_kw:", ":flag_kg:", ":flag_la:", ":flag_lv:", ":flag_lb:", ":flag_ls:", ":flag_lr:", ":flag_ly:", ":flag_li:", ":flag_lt:", ":flag_lu:", ":flag_mo:", ":flag_mk:", ":flag_mg:", ":flag_mw:", ":flag_my:", ":flag_mv:", ":flag_ml:", ":flag_mt:", ":flag_mh:", ":flag_mr:", ":flag_mu:", ":flag_mx:", ":flag_fm:", ":flag_md:", ":flag_mc:", ":flag_mn:", ":flag_me:", ":flag_ms:", ":flag_ma:", ":flag_mz:", ":flag_mm:", ":flag_na:", ":flag_nr:", ":flag_np:", ":flag_nl:", ":flag_nc:", ":flag_nz:", ":flag_ni:", ":flag_ne:", ":flag_ng:", ":flag_nu:", ":flag_kp:", ":flag_no:", ":flag_om:", ":flag_pk:", ":flag_pw:", ":flag_ps:", ":flag_pa:", ":flag_pg:", ":flag_py:", ":flag_pe:", ":flag_ph:", ":flag_pl:", ":flag_pt:", ":flag_pr:", ":flag_qa:", ":flag_ro:", ":flag_ru:", ":flag_rw:", ":flag_sh:", ":flag_kn:", ":flag_lc:", ":flag_vc:", ":flag_ws:", ":flag_sm:", ":flag_st:", ":flag_sa:", ":flag_sn:", ":flag_rs:", ":flag_sc:", ":flag_sl:", ":flag_sg:", ":flag_sk:", ":flag_si:", ":flag_sb:", ":flag_so:", ":flag_za:", ":flag_kr:", ":flag_es:", ":flag_lk:", ":flag_sd:", ":flag_sr:", ":flag_sz:", ":flag_se:", ":flag_ch:", ":flag_sy:", ":flag_tw:", ":flag_tj:", ":flag_tz:", ":flag_th:", ":flag_tl:", ":flag_tg:", ":flag_to:", ":flag_tt:", ":flag_tn:", ":flag_tr:", ":flag_tm:", ":flag_tv:", ":flag_ug:", ":flag_ua:", ":flag_ae:", ":flag_gb:", ":flag_us:", ":flag_vi:", ":flag_uy:", ":flag_uz:", ":flag_vu:", ":flag_va:", ":flag_ve:", ":flag_vn:", ":flag_wf:", ":flag_eh:", ":flag_ye:", ":flag_zm:", ":flag_zw:", ":flag_re:", ":flag_ax:", ":flag_ta:", ":flag_io:", ":flag_bq:", ":flag_cx:", ":flag_cc:", ":flag_gg:", ":flag_im:", ":flag_yt:", ":flag_nf:", ":flag_pn:", ":flag_bl:", ":flag_pm:", ":flag_gs:", ":flag_tk:", ":flag_bv:", ":flag_hm:", ":flag_sj:", ":flag_um:", ":flag_ic:", ":flag_ea:", ":flag_cp:", ":flag_dg:", ":flag_as:", ":flag_aq:", ":flag_vg:", ":flag_ck:", ":flag_cw:", ":flag_eu:", ":flag_gf:", ":flag_tf:", ":flag_gp:", ":flag_mq:", ":flag_mp:", ":flag_sx:", ":flag_ss:", ":flag_tc:", ":flag_mf:"] ]
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
