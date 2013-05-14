this.asyncStorage = (function() {

  var DBNAME = 'asyncStorage';
  var DBVERSION = 1;
  var STORENAME = 'keyvaluepairs';
  var db = null;

  function withStore(type, f) {
    if (db) {
      f(db.transaction(STORENAME, type).objectStore(STORENAME));
    } else {
      var openreq = indexedDB.open(DBNAME, DBVERSION);
      openreq.onerror = function withStoreOnError() {
        console.error("asyncStorage: can't open database:", openreq.error.name);
      };
      openreq.onupgradeneeded = function withStoreOnUpgradeNeeded() {
        // First time setup: create an empty object store
        openreq.result.createObjectStore(STORENAME);
      };
      openreq.onsuccess = function withStoreOnSuccess() {
        db = openreq.result;
        f(db.transaction(STORENAME, type).objectStore(STORENAME));
      };
    }
  }

  function getItem(key, callback) {
    withStore('readonly', function getItemBody(store) {
      var req = store.get(key);
      req.onsuccess = function getItemOnSuccess() {
        var value = req.result;
        if (value === undefined)
          value = null;
        callback(value);
      };
      req.onerror = function getItemOnError() {
        console.error('Error in asyncStorage.getItem(): ', req.error.name);
      };
    });
  }

  function setItem(key, value, callback) {
    withStore('readwrite', function setItemBody(store) {
      var req = store.put(value, key);
      if (callback) {
        req.onsuccess = function setItemOnSuccess() {
          callback();
        };
      }
      req.onerror = function setItemOnError() {
        console.error('Error in asyncStorage.setItem(): ', req.error.name);
      };
    });
  }

  function removeItem(key, callback) {
    withStore('readwrite', function removeItemBody(store) {
      var req = store.delete(key);
      if (callback) {
        req.onsuccess = function removeItemOnSuccess() {
          callback();
        };
      }
      req.onerror = function removeItemOnError() {
        console.error('Error in asyncStorage.removeItem(): ', req.error.name);
      };
    });
  }

  function clear(callback) {
    withStore('readwrite', function clearBody(store) {
      var req = store.clear();
      if (callback) {
        req.onsuccess = function clearOnSuccess() {
          callback();
        };
      }
      req.onerror = function clearOnError() {
        console.error('Error in asyncStorage.clear(): ', req.error.name);
      };
    });
  }

  function length(callback) {
    withStore('readonly', function lengthBody(store) {
      var req = store.count();
      req.onsuccess = function lengthOnSuccess() {
        callback(req.result);
      };
      req.onerror = function lengthOnError() {
        console.error('Error in asyncStorage.length(): ', req.error.name);
      };
    });
  }

  function key(n, callback) {
    if (n < 0) {
      callback(null);
      return;
    }

    withStore('readonly', function keyBody(store) {
      var advanced = false;
      var req = store.openCursor();
      req.onsuccess = function keyOnSuccess() {
        var cursor = req.result;
        if (!cursor) {
          // this means there weren't enough keys
          callback(null);
          return;
        }
        if (n === 0) {
          // We have the first key, return it if that's what they wanted
          callback(cursor.key);
        } else {
          if (!advanced) {
            // Otherwise, ask the cursor to skip ahead n records
            advanced = true;
            cursor.advance(n);
          } else {
            // When we get here, we've got the nth key.
            callback(cursor.key);
          }
        }
      };
      req.onerror = function keyOnError() {
        console.error('Error in asyncStorage.key(): ', req.error.name);
      };
    });
  }

  return {
    getItem: getItem,
    setItem: setItem,
    removeItem: removeItem,
    clear: clear,
    length: length,
    key: key
  };
}());
