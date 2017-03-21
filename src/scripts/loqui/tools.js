/* global App, Plus, Store */

/**
* @file Holds {@link Tools}
* @author [Adán Sánchez de Pedro Crespo]{@link https://github.com/aesedepece}
* @author [Jovan Gerodetti]{@link https://github.com/TitanNano}
* @author [Giovanny Andres Gongora Granada]{@link https://github.com/Gioyik}
* @license AGPLv3
*/

'use strict';

var Tools = {
  init: function () {
    return this.loadJson('scripts/goles/countries.json')
      .then(function (response) {
        Tools.countries = response;
      }, function (e) {
        console.log('Tools.init error', e);
      });
  },

  log: function (...args) {
    if (App.devsettings.debug) {
      console.log.apply(console, args);

      if (App.devsettings.writeLogFiles) {
        Store.SD.writeToLog([args]);
      }

      if (App.devsettings.stackTrace) {
        console.groupCollapsed('StackTrace');
        console.log(Tools.currentStack(1).join('\n'));
        console.groupEnd();
      }

      Plus.log(args);
    }
  },

  convenientDate: function (stamp) {
    var day = this.day(stamp);
    var today = this.day(this.localize(this.stamp()));
	var yesterday = this.day(this.localize(this.stamp(((new Date().getTime()) / 1000) - 86400)));
    var dayString =
      (day.toString() == today.toString()) ?
        _('Today') : (
          (day.toString() == yesterday.toString()) ?
            _('Yesterday') :
              _('DateFormat', {day: day[2], month: day[1]})
        );
    return [
      dayString,
      this.hour(stamp)
    ];
  },

  hour: function (stamp) {
    var hour = stamp.split('T');
    hour = hour[1].split(':');
    return hour[0]+':'+hour[1];
  },

  day: function (stamp) {
    var day = stamp.split('T');
    day = day[0].split('-');
    return day;
  },

  stamp: function (date) {
    date = date ? new Date(parseInt(date)*1000) : new Date();
    return date.getUTCFullYear()+"-"
  	  +("0"+(date.getUTCMonth()+1)).slice(-2)+"-"
  	  +("0"+(date.getUTCDate())).slice(-2)+"T"
  	  +("0"+(date.getUTCHours())).slice(-2)+":"
  	  +("0"+(date.getUTCMinutes())).slice(-2)+":"
  	  +("0"+(date.getUTCSeconds())).slice(-2)+"Z";
  },

  unstamp: function (stamp) {
    if (typeof stamp == 'string') {
      var ymdhms = stamp.split('T');
      var ymd = ymdhms[0].split('-');
      var hms = ymdhms[1].substr(0, ymdhms[1].length-1).split(':');
      return new Date(ymd[0], ymd[1]-1, ymd[2], hms[0], hms[1], hms[2]);
    }
  },

  localize: function (utc) {
    var offset = new Date().getTimezoneOffset();
    var ymdhms = utc.split('T');
    var ymd = ymdhms[0].split('-');
    var hms = ymdhms[1].substr(0, ymdhms[1].length-1).split(':');
    var date = new Date(ymd[0], ymd[1]-1, ymd[2], hms[0], hms[1], hms[2]);
    date.setTime(date.getTime()-60000*offset);
    return date.getFullYear()+'-'
      +('0'+(date.getMonth()+1)).slice(-2)+'-'
      +('0'+(date.getDate())).slice(-2)+'T'
      +('0'+(date.getHours())).slice(-2)+':'
      +('0'+(date.getMinutes())).slice(-2)+':'
      +('0'+(date.getSeconds())).slice(-2)+'Z';
  },

  unlocalize: function (local) {
    var offset = new Date().getTimezoneOffset();
    var ymdhms = local.split('T');
    var ymd = ymdhms[0].split('-');
    var hms = ymdhms[1].substr(0, ymdhms[1].length-1).split(':');
    var date = new Date(ymd[0], ymd[1]-1, ymd[2], hms[0], hms[1], hms[2]);
    date.setTime(date.getTime()+60000*offset);
    return date.getFullYear()+'-'
      +('0'+(date.getMonth()+1)).slice(-2)+'-'
      +('0'+(date.getDate())).slice(-2)+'T'
      +('0'+(date.getHours())).slice(-2)+':'
      +('0'+(date.getMinutes())).slice(-2)+':'
      +('0'+(date.getSeconds())).slice(-2)+'Z';
  },

  urlHL: function (text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(exp,'<a href=\'$1\' target=\'_blank\'>$1</a>');
  },

  // By BMintern https://gist.github.com/BMintern/1795519
  HTMLescape: function (str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML.replace(/\n/g, '<br>');
  },

  fileGet: function (url, cb) {
    var progress = function (event) {
      if (event.lengthComputable) {
        var percentComplete = (event.loaded / event.total) * 100;
        percentComplete = percentComplete.toFixed(0);
        $('progress').val(percentComplete.toString());
      }
    };
    var type = Tools.getFileType(url.split('.').pop());
    var xhr = new XMLHttpRequest({
      mozAnon: true,
      mozSystem: true
    });
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.onload = function (e) {
      $('progress').val('0');
      cb(xhr.response);
    };
    xhr.onprogress = progress;
    xhr.send();
  },

  /**
   *
   * @param num
   * @param cc country code
   * @returns {string|void}
   */
  numSanitize: function (cc, num) {
    var country = i18n.phonenumbers.metadata.countryCodeToRegionCodeMap[cc][0];
    return formatE164(country, num).replace(/[\s\-\+]/g, '');
  },

  loadJson: function (url) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest({mozSystem: true});

      xhr.onload = function() {
        resolve(this.response);
      };
      xhr.onerror = function() {
        reject();
      };

      xhr.open('GET', url);
      xhr.overrideMimeType('application/json');
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();
    });
  },

  countries: [ ],

  textBlob: function (text) {
    return new Blob([text], {type: 'text/plain'});
  },

  textUnblob: function (blob, cb) {
    var fr = new FileReader();
    fr.addEventListener('loadend', function () {
      var text = fr.result;
      cb(text);
    });
    fr.readAsText(blob);
  },

  picThumb: function (blob, width, height, callback) {
    var reader = new FileReader();
    reader.onloadend = function (e) {
      var img = new Image();
      img.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = width || (height ? height / img.height * img.width : 150);
        canvas.height = height || (width ? width / img.width * img.height : 150);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        var url = canvas.toDataURL('image/jpeg');
        callback(url);
      };
      img.onerror = function (e) {
        Tools.log('image onerror', e);
        callback('about:blank');
      };
      img.src = reader.result;
    };
    reader.onerror = function (e) {
      Tools.log(e);
    };
    reader.readAsDataURL(blob);
  },

  vidThumb: function (blob, width, height, callback) {
    callback('videocam');
  },

  audThumb: function (blob, width, height, callback) {
    callback('audiotrack');
  },

  locThumb: function (blob, width, height, callback) {
    callback('location_on');
  },

  vcardThumb: function (blob, width, height, callback) {
    callback('account_circle');
  },

  getFileType: function(type) {
    var fileType = null;
    switch (type) {
      case 'jpeg':
      case 'jpg':
        fileType = 'image/jpeg';
        break;
      case 'png':
        fileType = 'image/png';
        break;
      case 'gif':
        fileType = 'image/gif';
        break;
      case 'bmp':
        fileType = 'image/bmp';
        break;
      case 'webm':
        fileType = 'video/webm';
        break;
      case 'mp4':
        fileType = 'video/mp4';
        break;
      case '3gpp':
        fileType = 'video/3gpp';
        break;
      case 'mpeg':
      	fileType = 'audio/mpeg';
      	break;
      case 'ogg':
      	fileType = 'audio/ogg';
      	break;
    	case 'mp3':
    	  fileType = 'audio/mp3';
    	  break;
    	case 'aac':
    	  fileType = 'audio/mp3';
    	  break;
      default:
        fileType = 'text/plain';
        break;
    }
    return fileType;
  },

  b64ToBlob: function(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset+= sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  },

  blobToBase64: function (blob, cb) {
    var reader = new FileReader();
    reader.onloadend = function (e) {
      var res = e.target.result;
      cb(res);
    };
    reader.readAsDataURL(blob);
  },

  modifyLungoNotification: function ( newText ) {
    var notificationDiv = $('div.notification');
    notificationDiv.children('div').children('strong').html(newText);
  },

  guid: function () {
    var s4 = function() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + '-' + s4() + s4() + s4();
  },

  nickToColor: function (nick) {
    var hash = MD5.hash(nick);
    var segSize = Math.floor(hash.length / 3);
    var r = (hash.substr(0, segSize).split('').reduce(function (prev, cur) {return prev + parseInt(cur.charCodeAt(0));}, 0) % 255).toString(16);
    var g = (hash.substr(segSize, segSize).split('').reduce(function (prev, cur) {return prev + parseInt(cur.charCodeAt(0));}, 0) % 255).toString(16);
    var b = (hash.substr(segSize * 2).split('').reduce(function (prev, cur) {return prev + parseInt(cur.charCodeAt(0));}, 0) % 255).toString(16);
    return '#' + (r.length < 2 ? '0' + r : r) + (g.length < 2 ? '0' + g : g) + (b.length < 2 ? '0' + b : b);
  },

  explode: function (str, len) {
    if (str.length < len) return str;
    return str.slice(0, len) + '<br />' + Tools.explode(str.slice(len), len);
  },

  fingerprintToImage: function (fingerprint) {
    var canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 100;
    var ctx = canvas.getContext('2d');
    for (var i = 0; i < 40; i++) {
      let compo = fingerprint.substr(i, 1);
      let color = '#' + compo + compo + compo + compo + 'ff';
      ctx.fillStyle = color;
      ctx.fillRect((i%8)*20, Math.floor(i/8)*20, 20, 20);
    }
    return canvas.toDataURL('image/png');
  },

  toArray: function (o) {
    var a = [];
    for (var i in o) {
      a.push(o[i]);
    }
    return a;
  },

  stripHTML : function(element) {
    var result = '';

    var strip = function(element) {
      if (element.firstChild === null) {
        if (element.nodeName == 'IMG') {
          result+= element.alt;

        } else {
          result+= element.textContent;
        }

      } else {
        Array.prototype.forEach.apply(element.childNodes, [strip]);
      }
    };

    strip(element);

    return result;
  },

  currentStack : function(offset) {
    offset = offset || 0;

    try { throw Error(''); } catch (e) {
      var stack = e.stack.split('\n');

      stack.shift();
      stack.pop();

      for (var i= 0; i < offset; i++) {
        stack.shift();
      }

      return stack;
    }
  },

  debounce: function(func, wait, immediate) {
	var timeout;
	return function() {
	  var context = this, args = arguments;
      var callNow = immediate && !timeout;

      var later = function() {
	    timeout = null;
		if (!immediate) func.apply(context, args);
	  };

	  clearTimeout(timeout);
	  timeout = setTimeout(later, wait);

      if (callNow) func.apply(context, args);
	};
  },

  throttle: function(callback, wait) {
    var time,
        go = true,
        again = null;

    return function(e) {
      if(go) {
        go = false;
        time = setTimeout(function(){
          time = null;
          go = true;

          if(again) {
            callback.apply(this, again);
          }

          again = null;
        }.bind(this), wait);

        callback.apply(this, arguments);
      } else {
        again = arguments;
      }
    };
  }

};
