'use strict';

var Tools = {

  log: function () {
    if (App.settings.debug) {
      console.log.apply(console, [].slice.call(arguments));
    }
  },

  convenientDate: function (stamp) {
    var day = this.day(stamp);
    var today = this.day(this.localize(this.stamp()));
    var dayString = 
      day.toString() == today.toString()
      ?
        _('Today')
      :
        _('DateFormat', {day: day[2], month: day[1]})
    ;
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
    var date = date ? new Date(parseInt(date)*1000) : new Date();
    return date.getUTCFullYear()+"-"
  	  +("0"+(date.getUTCMonth()+1)).slice(-2)+"-"
  	  +("0"+(date.getUTCDate())).slice(-2)+"T"
  	  +("0"+(date.getUTCHours())).slice(-2)+":"
  	  +("0"+(date.getUTCMinutes())).slice(-2)+":"
  	  +("0"+(date.getUTCSeconds())).slice(-2)+"Z";
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
  
  urlHL: function (text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(exp,'<a href=\'$1\' target=\'_blank\'>$1</a>');
  },
  
  // By BMintern https://gist.github.com/BMintern/1795519
  HTMLescape: function (str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  },
  
  fileGet: function (url, cb) {
    var type = Tools.getFileType(url.split('.').pop());
    var xhr = new XMLHttpRequest({
      mozAnon: true,
      mozSystem: true
    });
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.onload = function (e) {
      cb(xhr.response);
    }
    xhr.send();
  },

  /**
   *
   * @param num
   * @param cc country code
   * @returns {string|void}
   */
  numSanitize: function (num, cc) {
    var region =  PHONE_NUMBER_META_DATA[cc] instanceof Array
                  ? (
                    PHONE_NUMBER_META_DATA[cc][0] instanceof Object
                    ? 
                      PHONE_NUMBER_META_DATA[cc][0].region
                    :
                      PHONE_NUMBER_META_DATA[cc][0].slice(2, 4)
                    )
                  : (
                    PHONE_NUMBER_META_DATA[cc] instanceof Object
                    ?
                      PHONE_NUMBER_META_DATA[cc].region
                    :
                      PHONE_NUMBER_META_DATA[cc].slice(2, 4)
                    );
    var parsed = PhoneNumber.Parse(num.replace(/[\s\-\+]/g, ''), region);
    return parsed ? parsed.internationalFormat.replace(/[\s\-\+]/g, '') : null;
  },
  
  countries: function () {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'scripts/goles/countries.json', false);
    xhr.send();
    var countries = JSON.parse(xhr.responseText) || {};
    return countries;
  },
  
  textBlob: function (text) {
    return new Blob([text], {type: 'text/plain'});
  },
  
  textUnblob: function (blob, cb) {
    var fr = new FileReader;
    fr.addEventListener('loadend', function () {
      var text = fr.result;
      cb(text);
    });
    fr.readAsText(blob);
  },
  
  picUnblob: function (blob, width, height, callback) {
    var reader = new FileReader();
    reader.onload = function (event) {
      var img = new Image();
      img.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        var url = canvas.toDataURL();
        callback(url);
      }
      img.src = event.target.result;
    }
    reader.onerror = function ( event ) {
      Tools.log(event);
    }
    reader.readAsDataURL(blob);
  },

  vidUnblob: function (blob, width, height, callback) {
    var reader = new FileReader();
    reader.onload = function (event) {
      var vid = new Video();
      vid.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawVideo(vid, 0, 0, width, height);
        var url = canvas.toDataURL();
        callback(url);
      }
      vid.src = event.target.result;
    }
    reader.onerror = function ( event ) {
      Tools.log(event);
    }
    reader.readAsDataURL(blob);
  },

  audUnblob: function (blob, width, height, callback) {
    var reader = new FileReader();
    reader.onload = function (event) {
      var aud = new Audio();
      vid.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawAudio(aud, 0, 0, width, height);
        var url = canvas.toDataURL();
        callback(url);
      }
      aud.src = event.target.result;
    }
    reader.onerror = function ( event ) {
      Tools.log(event);
    }
    reader.readAsDataURL(blob);
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
/*      How to specify when is video and when is audio?
		case 'mp4':
      	fileType = 'audio/mp4';
      	break;*/
      default:
        fileType = 'text/plain';
        break;
    }
    return fileType;
  },

  imageSave: function (image, type, name, onSuccess, onError) {
    var sdCard = navigator.getDeviceStorage('pictures');
    onSuccess = function () {
      Tools.log('El archivo "' + this.result + '" se escribio correctamente');
    };
    onError = function () {
      Tools.log(this.error);
    };
    var fileType = this.getFileType(type);
    var imageBlob = CoSeMe.utils.latin1ToBlob(image, fileType);
    name = 'loqui/' + name + '.' + type;
    var request = sdCard.addNamed(imageBlob, name);
    request.onsuccess = onSuccess;
    request.onerror = onError;
  },

  audioSave: function (audio, type, name, onSuccess, onError) {
    var sdCard = navigator.getDeviceStorage('music');
    onSuccess = function () {
      Tools.log('El archivo "' + this.result + '" se escribio correctamente');
    };
    onError = function () {
      Tools.log(this.error);
    };
    var fileType = this.getFileType(type);
    var audioBlob = CoSeMe.utils.latin1ToBlob(audio, fileType);
    name = 'loqui/' + name + '.' + type;
    var request = sdCard.addNamed(audioBlob, name);
    request.onsuccess = onSuccess;
    request.onerror = onError;
  },

  b64ToBlob: function(b64Data, contentType, sliceSize) {
    var contentType = contentType | '';
    var sliceSize = sliceSize || 512;
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
    var reader = new FileReader;
    reader.onload = function (e) {
        var res = e.target.result;
        cb(res);
    }
    reader.readAsDataURL(blob);
  }

}
