'use strict';

var Store = {

  size: 0,
  
  cache: [],
  
  init: function (){
    Store.recover(0, function (size) {
      Store.size = size || 0;
    });
  },
  
  block: function (value) {
    this.value = value;
    this.save = function (callback) {
      var index = this.index;
      asyncStorage.setItem('b'+this.index, this.value, function () {
        if (callback) {
        	callback(index);
        }
      });
    }
  },
  
  save: function (value, callback) {
    var block = new Store.block(JSON.stringify(value));
    block.index = ++Store.size;
    Store.cache[block.index] = block.value;
    block.save(function (index) {
      delete Store.cache[index];
      if (callback) {
      	callback(index);
      }
    });
    Store.update(0, Store.size);
    return block.index;
  },
  
  recover: function (index, callback) {
    if (Store.cache[index]) {
      callback(JSON.parse(Store.cache[index]));
    } else {
      asyncStorage.getItem('b'+index, function (value){ 
        callback(JSON.parse(value));
      });
    }
  },
  
  update: function (index, value, callback) {
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
  },
  
  drop: function (key, callback) {
    asyncStorage.removeItem(key, callback);
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
    
    save: function (path, type, content, onsuccess, onerror) {
      if ('getDeviceStorage' in navigator) {
        Tools.log('DS IS SUPPORTED');
        var file = new Blob(content, {type: type});
        var req = this.card.addNamed(file, path);
        req.onsuccess = function () {
          if (onsuccess) {
            onsuccess(this.result);
          }
        }
        req.onerror = function () {
          if (onerror) {
            onerror(this.error);
          }
        }      
      } else {
        Tools.log('DS IS NOT SUPPORTED');
        Store.put('fakesdcard_' + path, {content: content, type: type}, onsuccess);
      }
    },
    
    recover: function (path, onsuccess, onerror) {
      if ('getDeviceStorage' in navigator) {
        Tools.log('DS IS SUPPORTED');
        var req = this.card.get(path);
        req.onsuccess = function () {
            onsuccess(this.result);
        }
        req.onerror = function () {
          if (onerror) {
            onerror(this.error);
          }
        }
      } else {
        console.log('DS IS NOT SUPPORTED');
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
    }
    
  }
  
}
