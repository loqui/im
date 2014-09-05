'use strict';

var Avatar = function (data) {
  
  this.__defineGetter__('url', function () {
    return this.urlWritePromise || new Promise(
      function (res, rej) {
        if (this.chunk) {
          Store.recover(this.chunk, res);
        } else {
          res('/img/foovatar.png');
        }
      }.bind(this)
    );
  }.bind(this));
  
  this.__defineSetter__('url', function (val) {
    if (val) {
      this.urlWritePromise = new Promise(
        function (res, rej) {
          Store.save(val, function (index) {
            this.chunk = index;
            res(val);
          }.bind(this));
        }.bind(this)
      );
      this.urlWritePromise.then(function () {
        delete this.urlWritePromise;
      }.bind(this));
    }
  }.bind(this));
  
  this.__defineGetter__('data', function () {
    return {
      id: this.id,
      stamp: this.stamp,
      chunk: this.chunk
    };
  }.bind(this));
  
  this.id = (data && 'id' in data) ? data.id : false;
  this.stamp = (data && 'stamp' in data) ? data.stamp : Tools.localize(Tools.stamp());
  this.chunk = (data && 'chunk' in data) ? data.chunk : false;
  this.url = (data && 'url' in data) ? data.url : false;
  
}
