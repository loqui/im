'use strict';

var quickWorker = function (name) {

  this._promises = [];

  this._worker = new Worker('scripts/loqui/workers/' + name + '.worker.js');
  this._worker.onmessage = function (e) {
    if (e.data instanceof Object && 'id' in e.data) {
      var promise = this._promises[e.data.id];
      var i = e.data.success ? 0 : 1;
      console.log('Calling', promise[i], 'with data', e.data.result, this._promises);
      promise[i](e.data.result);
      promise[i](e.data.result);
      delete this._promises[e.data.id];
    }
  }.bind(this);

  this.__noSuchMethod__ = function (method, args) {
    var promise = new Promise(function (resolve, reject) {
      this._promises.push([resolve, reject]);
      var id = this._promises.length - 1;
      this._worker.postMessage([id, method, args]);
    }.bind(this));
    return promise;
  }
  
  this.kill = function () {
    this._worker.terminate();
  }
  
  return this;

}
