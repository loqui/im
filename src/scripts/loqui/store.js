/* global Tools, Lungo, App */

'use strict';

var Store = {

  size: 0,

  cache: [],

  locks : {},

  waiting : [],

  init: function (){
    Store.recover(0, function (key, size, free) {
      Store.size = size || 0;

      free();
    });
  },

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

  drop: function (key, callback) {
    asyncStorage.removeItem(key, callback);
  },

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

  onUnlock : function(index, callback) {
    this.waiting.push({ index : index, callback : callback });
  },

  blockDrop: function (index, callback) {
    this.drop('b' + index, callback);
  },

  put: function (key, value, callback) {
  	asyncStorage.setItem(key, JSON.stringify(value), callback);
  },

  get: function (key, callback) {
    asyncStorage.getItem(key, function (value) {
      callback(JSON.parse(value));
    });
  },

  SD: {

    card: 'getDeviceStorage' in navigator ? navigator.getDeviceStorage('sdcard') : null,

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
            if(!quiet) Lungo.Notification.error(_('Error'), _('NoSDAccess'), 'cloud-download', 5);
          }
        };
      } else {
        if(!quiet) Tools.log('DS IS NOT SUPPORTED');
        Store.put('fakesdcard_' + path, {content: content, type: type}, onsuccess);
      }
    },

    recover: function (path, onsuccess, onerror, quiet) {
      if (this.card) {
        var req = this.card.get(path);
        req.onsuccess = function () {
          onsuccess(this.result);
        };
        req.onerror = function () {
          if (onerror) {
            onerror(this.error);
            if(!quiet) Lungo.Notification.error(_('Error'), _('NoSDAccess'), 'cloud-download', 5);
          }
        };
      } else {
        if(!quiet) Tools.log('DS IS NOT SUPPORTED');
        Store.get('fakesdcard_' + path, function (value) {
          if (value) {
            onsuccess(new Blob(value.content, {type: value.type}));
          } else {
            if (onerror) {
              onerror();
            }
          }
        });
      }
    },

    copy : function (from, to, onsuccess, onerror) {
      if (this.card) {
        var req = this.card.get(from);
        req.onsuccess = function () {
          Store.SD.save(to, this.result, onsuccess, onerror);
        };
        req.onerror = function () {
          if (onerror) {
            onerror(this.error);
            Lungo.Notification.error(_('Error'), _('NoSDAccess'), 'cloud-download', 5);
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
            Lungo.Notification.error(_('Error'), _('NoSDAccess'), 'cloud-download', 5);
          }
        };

      }
    },

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

    writeToLog : (function(){ 
        var buffer = [];
        var fileName = null;

        var q = async.queue(function(args, callback) {
            buffer.push(args.join(' '));

            setTimeout(callback, 100);
        });

        q.drain = function(){
            fileWriter.push([buffer]);
        };

        var fileWriter = async.queue(function(buffer, callback){
            if (window.FileHandle) {
                fileName = App.pathLogs + (new Date()).toISOString().split('T')[0] + '.log';

                Store.SD.createFile(fileName, function(e){
                    Store.SD.appendToFile(fileName, buffer, callback);
                });
            } else {
                var lastDate = localStorage.getItem('logFileDate');
                var currentDate = (new Date()).toISOString().split('T')[0];
                var part = ((currentDate === lastDate) ? (parseInt(localStorage.getItem('logFilePart')) || 0) : 0);
                fileName = App.pathLogs + currentDate + '_' + part + '.log';
                var card = Store.SD.card;

                Store.SD.createFile(fileName, function(e){
                    Store.SD.recover(fileName, function(file){
                        Tools.textUnblob(file, function(text){
                            console.log('current log file', file.size);

                            if (file.size > 1000000) {
                                part += 1;
                                fileName = App.pathLogs + currentDate + '_' + part + '.log';

                                file = new Blob([buffer.join('\n')], { type : 'text/plain'});
                            } else {
                                file = new Blob([text, buffer.join('\n'), '\n'], { type : 'text/plain' });
                            }

                            var r = card.delete(fileName);

                            r.onsuccess = function(){
                                var r = card.addNamed(file, fileName);

                                r.onsuccess = function(){
                                    console.log('log saved!', 'new size is: ', file.size);
                                    buffer = [];
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
        });

        fileWriter.drain = function(){};

        return q.push.bind(q);
    })()

  }

};
