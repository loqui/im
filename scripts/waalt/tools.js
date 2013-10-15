'use strict';

var Tools = {

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
  
  stamp: function () {
    var date = new Date();
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
  
  emojify: function (text, map) {
    var mapped = text;
    if (map.length != undefined) {
      for (var i in map) {
        var original = map[i][0];
        for (var j in map[i]) {
          var token = map[i][j].replace(/([\(\)\[\]\\\$])/g, '\\$1');
          var rexp = new RegExp('('+token+')', 'g');
          mapped = mapped.replace(rexp, '<img src="img/emoji/'+original+'.png" alt="$1" />');
          if (mapped != text) {
            return mapped;
          }
        }
      }
    }
    return text;
  }

}
