/* global Tools, Lungo, App, chrome */

/**
* @file Holds {@link Store}
* @author [Adán Sánchez de Pedro Crespo]{@link https://github.com/aesedepece}
* @author [Jovan Gerodetti]{@link https://github.com/TitanNano}
* @author [Giovanny Andres Gongora Granada]{@link https://github.com/Gioyik}
* @license AGPLv3
*/

'use strict';

/**
 * @namespace
 */
var Store = {

  /**
   * @type {number}
   */
  size: 0,

  /**
   * @type {Chunk[]}
   */
  cache: [],

  /**
   * @type {Object}
   */
  locks : {},

  /**
   * @type {Promise[]}
   */
  waiting : [],

  /**
   * Initializes the IndexedDB
   */
  init: function (){
    return new Promise(function (resolve, reject) {
      Store.recover(0, function (key, size, free) {
        Store.size = size || 0;
        free();
        resolve();
      });
    });
  },

  /**
   * @param {*} value
   */
  block: function (value) {
    this.value = value;
    this.save = function (callback) {
      var index = this.index;
      asyncStorage.setItem('b'+this.index, this.value, function(){
        if (callback) {
          callback(index);
        }
      });
    };
  },

  /**
   * @param {*} value
   * @param {function} callback
   * @return {number}
   */
  save: function (value, callback) {
    var block = new Store.block(JSON.stringify(value));
    var key = Store.lock(0);
    block.index = ++Store.size;
    Store.cache[block.index] = block.value;
    block.save(function (index) {
      delete Store.cache[index];
      if (callback) {
      	callback(index);
      }
    });

    Store.update(key, 0, Store.size);

    Store.unlock(0, key);
    return block.index;
  },

  /**
   * @param {number} index
   * @param {function} callback
   */
  recover: function (index, callback) {
    var stack = stack || Tools.currentStack();

    var promise = new Promise(function(ready){

      if (!this.locks[index]) {
        var key = this.lock(index, stack);

        if (Store.cache[index]) {
          ready([key, JSON.parse(Store.cache[index])]);

        } else {
            asyncStorage.getItem('b'+index, function (value){
              ready([key, JSON.parse(value)]);
            }.bind(this));
        }

      } else {
        this.onUnlock(index, function(){
          var stack = stack;
          Store.recover(index, callback);
        });
      }

    }.bind(this)).then(function(values){
      new Promise(function(release){
        values.push(release);

        callback.apply(null, values);
      }).then(function(){
        Store.unlock(index, values[0]);
      });
    });

  },

  /**
   * @param {object} key
   * @param {number} index
   * @param {*} value
   * @param {function} callback
   */
  update: function (key, index, value, callback) {
    if(this.locks[index] == key){
      var block = new Store.block(JSON.stringify(value));
      block.index = index;
      Store.cache[block.index] = block.value;
      block.save(function (index) {
        delete Store.cache[index];
        if (callback) {
          callback(index);
        }
      });
      return block.index;
    } else {
      console.error('unable to write block '+ index +'! Free the current lock!');
    }
  },

  /**
   * @param {string} key
   * @param {function} callback
   */
  drop: function (key, callback) {
    asyncStorage.removeItem(key, callback);
  },

  /**
   * @param {number} index
   * @param {string[]} [stack]
   */
  lock : function(index, stack) {
    var key = {
      hash : (Date.now() * Math.random() * Date.now()).toString(16),
      createdAt : stack || Tools.currentStack(1)
    };

    if (!this.locks[index]) {
      this.locks[index] = key;
      return key;

    } else {
      console.error('Block ' + index + ' is already locked!');
    }
  },

  /**
   * @param {number} index
   * @param {object} key
   */
  unlock : function(index, key) {
    if (this.locks[index] == key) {
      delete this.locks[index];

      var next = this.waiting.find(function(item){
        return (item.index == index);
      });

      if (next) {
        var i = this.waiting.indexOf(next);

        this.waiting.splice(i, 1);
        next.callback();
      }
    } else {
      console.error('invalide key for current lock!', index);
    }
  },

  /**
   * @param {number} index
   * @param {function} callback
   */
  onUnlock : function(index, callback) {
    this.waiting.push({ index : index, callback : callback });
  },

  /**
   * @param {number} index
   * @param {function} callback
   */
  blockDrop: function (index, callback) {
    this.drop('b' + index, callback);
  },

  /**
   * @param {string} key
   * @param {*} value
   * @param {function} callback
   */
  put: function (key, value, callback) {
    asyncStorage.setItem(key, JSON.stringify(value), callback);
  },

  /**
   * @param {string} key
   * @param {function} callback
   */
  get: function (key, callback) {
    asyncStorage.getItem(key, function (value) {
      callback(JSON.parse(value));
    });
  },

  /**
   * @namespace
   */
  Config: (window.chrome && chrome.storage && chrome.storage.local) ?
    {
      put: function (key, value) {
        return new Promise(function (resolve, reject) {
          var items = {};
          items[key] = value;
          chrome.storage.local.set(items, function () { resolve(); });
        });
      },

      get: function (key) {
        return new Promise(function (resolve, reject) {
          chrome.storage.local.get(key, function (items) {
            var value = items[key];
            resolve((value === undefined) ? null : value);
          });
        });
      },

      remove: function (key) {
        return new Promise(function (resolve, reject) {
          chrome.storage.local.remove(key, function () { resolve(); });
        });
      }
    } : {
      put: function (key, value) {
        return Promise.resolve(window.localStorage.setItem(key, value));
      },

      get: function (key) {
        return Promise.resolve(window.localStorage.getItem(key));
      },

      remove: function (key) {
        return Promise.resolve(window.localStorage.removeItem(key));
      }
    },

  /**
   * @namespace
   */
  SD: {

    /**
     * @instanceof {DeviceStorage}
     * @borrows navigator.getDeviceStorage()
     */
    card: 'getDeviceStorage' in navigator ? navigator.getDeviceStorage('sdcard') : null,

    /**
     * @param {string} path
     * @param {*} content
     * @param {function} onsuccess
     * @param {function} onerror
     * @param {boolean} quiet
     */
    save: function (path, content, onsuccess, onerror, quiet) {
      var type = Tools.getFileType(path.split('.').pop());
      if (this.card) {
        if(!quiet) Tools.log('SAVING', path);
        var file = content instanceof Blob ? content : new Blob(content, {type: type});
        var req = this.card.addNamed(file, path);
        req.onsuccess = function () {
          if (onsuccess) {
            onsuccess(this.result);
          }
        };
        req.onerror = function () {
          if (onerror) {
            onerror(this.error);
            if(!quiet) Lungo.Notification.error(_('Error'), _('NoSDAccess'), 'cloud_download', 5);
          }
        };
      } else {
        if(!quiet) Tools.log('DS IS NOT SUPPORTED');
        Store.put('fakesdcard_' + path, {content: content, type: type}, onsuccess);
      }
    },

    /**
     * @param {string} path
     * @param {function} onsuccess
     * @param {function} onerror
     * @param {boolean} quiet
     */
    recover: function (path, onsuccess, onerror, quiet) {
      if (this.card) {
        var req = this.card.get(path);
        req.onsuccess = function () {
          onsuccess(this.result);
        };
        req.onerror = function () {
          if (onerror) {
            onerror(this.error);
            if(!quiet) Lungo.Notification.error(_('Error'), _('NoSDAccess'), 'cloud_download', 5);
          }
        };
      } else {
        if(!quiet) Tools.log('DS IS NOT SUPPORTED');
        Store.get('fakesdcard_' + path, function (value) {
          if (value) {
            if (App.platform === "FirefoxOS") {
            	//FirefoxOS
				onsuccess(new Blob(value.content, {type: value.type}));
			} else if(App.platform === "UbuntuTouch") {
            	//Ubuntu Touch
				//var input = value.content;
				onsuccess(new Blob([value], {type: value.type}));
            }
          } else {
            if (onerror) {
              onerror();
            }
          }
        });
      }
    },

    /**
     * @param {string} from
     * @param {string} to
     * @param {function} onsuccess
     * @param {function} onerror
     */
    copy : function (from, to, onsuccess, onerror) {
      if (this.card) {
        var req = this.card.get(from);
        req.onsuccess = function () {
          Store.SD.save(to, this.result, onsuccess, onerror);
        };
        req.onerror = function () {
          if (onerror) {
            onerror(this.error);
            Lungo.Notification.error(_('Error'), _('NoSDAccess'), 'cloud_download', 5);
          }
        };
      } else {
        Tools.log('DS IS NOT SUPPORTED');
        Store.get('fakesdcard_' + from, function (value) {
          if (value) {
            Store.put('fakesdcard_' + to, value, onsuccess);
          } else {
            if (onerror) {
              onerror();
            }
          }
        });
      }
    },

    /**
     * @param {string} path
     * @param {function} onsuccess
     * @param {function} onerror
     */
    dir : function(path, onsuccess, onerror){
      if(this.card){
        var list= [];
        var req = this.card.enumerate(path);

        req.onsuccess= function(){
            if(this.result){
                list.push(this.result);
                this.continue();
            }else{
                onsuccess(list);
            }
        };

        req.onerror= function(){
          if(onerror){
            onerror(this.error);
            Lungo.Notification.error(_('Error'), _('NoSDAccess'), 'cloud_download', 5);
          }
        };

      }
    },

    /**
     * @param {string} fileName
     * @param {function} callback
     */
    createFile : function(fileName, callback) {
      if(this.card){
        var card = this.card;

        var request = card.get(fileName);

        request.onerror = function(e){
          if (request.error.name === 'NotFoundError') {
            request = card.addNamed(new Blob([''], {type: "text/plain"}), fileName);

            request.onsuccess = callback;
          }

          callback();
        };

        request.onsuccess = callback;
      }
    },

    /**
     * @param {string} fileName
     * @param {Array} args
     * @param {function} callback
     */
    appendToFile: function(fileName, args, callback){
      if(this.card){
        var card = this.card;
        var request = card.getEditable(fileName);

        request.onsuccess = function(e){
          var fileHandle = request.result.open('readwrite');

          args.forEach(function(item){
            fileHandle.append(item.join(' ') + '\n');
          });

          fileHandle.flush();
          fileHandle.abort();
          callback();
        };

        request.onerror = function(e)　{
          console.log('CAN\'T WRITE TO LOG FILE!!');
          callback();
        };
      }
    },

    /**
     * @param {Array} args
     */
    writeToLog : (function(){
      var buffer = [];
      var fileName = null;
      var flushing = false;

      var callback = function () {
        if (buffer.length > 0) {
          flushBuffer();
        } else {
          flushing = false;
        }
      };

      var flushBuffer = function() {
        if (false) { // if (window.FileHandle || window.IDBMutableFile) {
          fileName = App.pathLogs + (new Date()).toISOString().split('T')[0] + '.log';

          Store.SD.createFile(fileName, function(e){
            Store.SD.appendToFile(fileName, buffer.splice(0, buffer.length), callback);
          });
        } else {
          var lastDate = localStorage.getItem('logFileDate');
          var currentDate = (new Date()).toISOString().split('T')[0];
          var part = ((currentDate === lastDate) ? (parseInt(localStorage.getItem('logFilePart')) || 0) : 0);
          fileName = App.pathLogs + currentDate + '_' + part + '.log';
          var card = Store.SD.card;

          Store.SD.createFile(fileName, function(e){
            Store.SD.recover(fileName, function(file){
              Tools.textUnblob(file, function(fileText){
                console.log('current log file', file.size);

                var appendText = buffer.splice(0, buffer.length).join('\n');

                if (file.size > 1000000) {
                  part += 1;
                  fileName = App.pathLogs + currentDate + '_' + part + '.log';

                  file = new Blob([appendText, '\n'], { type : 'text/plain'});
                } else {
                  file = new Blob([fileText, appendText, '\n'], { type : 'text/plain' });
                }

                var r = card.delete(fileName);

                r.onsuccess = function(){
                  var r = card.addNamed(file, fileName);

                  r.onsuccess = function(){
                    console.log('log saved!', 'new size is: ', file.size);
                    callback();
                  };

                  r.onerror = callback;

                  localStorage.setItem('logFilePart', part);
                  localStorage.setItem('logFileDate', currentDate);
                };

                r.onerror = callback;
              }, callback, true);
            });
          });
        }
      };

      return function (args) {
        buffer.push((new Date()).toTimeString() + '|  ' + args.join(' '));
        if (!flushing) {
          flushing = true;
          setTimeout(flushBuffer, 10);
        }
      };
    })()
  }
};
