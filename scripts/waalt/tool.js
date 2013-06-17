'use strict';

var Tool = {

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
  
  localize: function (utc) {
	  var offset = new Date().getTimezoneOffset();
	  var ymdhms = utc.split('T');
	  var ymd = ymdhms[0].split('-');
	  var hms = ymdhms[1].substr(0, ymdhms[1].length-1).split(':');
	  var date = new Date(ymd[0], ymd[1]-1, ymd[2], hms[0], hms[1], hms[2]);
	  date.setTime(date.getTime()-60000*offset);
	  return date.getFullYear()+'-'+('0'+(date.getMonth()+1)).slice(-2)+'-'+('0'+(date.getDate())).slice(-2)+'T'+('0'+(date.getHours())).slice(-2)+':'+('0'+(date.getMinutes())).slice(-2)+':'+('0'+(date.getSeconds())).slice(-2)+'Z';
  },
  
  urlHL: function (text) {
	  var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	  return text.replace(exp,'<a href=\'$1\' target=\'_blank\'>$1</a>'); 
  }

}
