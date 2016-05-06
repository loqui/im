/* global CoSeMe, chrome */

/**
* @file Contains compatibility helpers
* @author [Jovan Gerodetti]{@link https://github.com/TitanNano}
* @author [Christof Meerwald]{@link https://github.com/cmeerw}
* @license AGPLv3
*/

'use strict';

// wakelock shim
if (!navigator.requestWakeLock) {
  navigator.requestWakeLock = function() {
    return {
      unlock : function(){}
    };
  };
}

// emulate mozTCPSocket using chrome.sockets
if (!navigator.mozTCPSocket && chrome && chrome.sockets && chrome.sockets.tcp) {
  (function () {
    function TCPSocket(host, port, options) {
      options = options || {};

      var self = this;
      this.onclose = null;
      this.ondata = null;
      this.onerror = null;
      this.onopen = null;
      this.readyState = 'disconnected';

      this._binaryType = options.binaryType || 'string';
      this._sendQueue = [null];
      this._socketId = null;
      this._onReceive = function (info) {
        if (info.socketId == self._socketId) {
          var data = info.data;
          if (data.byteLength === 0) {
            if (self.onclose) { self.onclose(); }
          } else if (self.ondata) {
            if (self._binaryType === 'string') {
              data = CoSeMe.utils.latin1FromBytes(new Uint8Array(data));
            }

            self.ondata({ data: data });
          }
        }
      };
      this._onReceiveError = function (info) {
        if (info.socketId == self._socketId) {
          if (self.onerror) { self.onerror(info.resultCode); }
        }
      };

      chrome.sockets.tcp.create({}, function (createInfo) {
        self._socketId = createInfo.socketId;
        chrome.sockets.tcp.connect(self._socketId, host, Number(port), function (result) {
          if (result < 0) {
            self.readyState = 'disconnected';
            if (self.onerror) { self.onerror(result); }
          } else {
            self.readyState = 'open';
            self._processSendQueue();
            if (self.onopen) { self.onopen(); }
            chrome.sockets.tcp.onReceive.addListener(self._onReceive);
            chrome.sockets.tcp.onReceiveError.addListener(self._onReceiveError);
          }
        });
      });
    }

    TCPSocket.prototype._processSendQueue = function () {
      var self = this;
      var data = null;
      while (data === null && this._sendQueue.length !== 0) {
        data = this._sendQueue[0];
        if (data === null) {
          this._sendQueue.shift();
        }
      }
      if (data !== null) {
        chrome.sockets.tcp.send(self._socketId, data, function (sendInfo) {
          if (sendInfo.resultCode < 0) {
            self._sendQueue.splice(0);
            self.readyState = 'disconnected';
            if (self.onerror) { self.onerror(sendInfo.resultCode); }
          } else {
            self._sendQueue.shift();
            self._processSendQueue();
          }
        });
      }
    };

    TCPSocket.prototype.close = function () {
      var self = this;
      chrome.sockets.tcp.close(self._socketId, function (result) {
        self.readyState = 'closed';
        chrome.sockets.tcp.onReceive.removeListener(self._onReceive);
        chrome.sockets.tcp.onReceiveError.removeListener(self._onReceiveError);
        if (self.onclose) { self.onclose(); }
      });
    };

    TCPSocket.prototype.send = function (data, offset, len) {
      if (this._binaryType === 'string') {
        data = CoSeMe.utils.bytesFromLatin1(data).buffer;
      }

      if (offset !== undefined || len !== undefined) {
        data = data.slice(offset, (len !== undefined) ? offset + len : data.byteLength);
      }

      this._sendQueue.push(data);
      if (this._sendQueue.length === 1) {
        this._processSendQueue();
      }
    };

    TCPSocket.prototype.suspend = function () {
      chrome.sockets.tcp.setPaused(this._socketId, true);
    };

    TCPSocket.prototype.resume = function () {
      chrome.sockets.tcp.setPaused(this._socketId, false);
    };

    TCPSocket.prototype.upgradeToSecure = function () {
      var self = this;
      this._sendQueue.push(null);
      chrome.sockets.tcp.setPaused(self._socketId, true, function () {
        chrome.sockets.tcp.secure(self._socketId, { }, function (result) {
          if (result < 0) {
            self.readyState = 'disconnected';
            if (self.onerror) { self.onerror(); }
          } else {
            chrome.sockets.tcp.setPaused(self._socketId, false, function () {
              self._processSendQueue();
            });
          }
        });
      });
    };

    navigator.mozTCPSocket = {
      open : function (host, port, options) {
        return new TCPSocket(host, port, options);
      }
    };
  })();
}
