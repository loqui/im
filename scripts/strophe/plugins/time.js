/*
  Copyright 2013, Adán Sánchez de Pedro Crespo <adansdpc@waalt.com>
*/

/**
 * Entity Time Strophe Plugin
 * Implements http://xmpp.org/extensions/xep-0202.html
 */
 
var TimePlugin = function (conn) {

  this._connection = conn;
  this._callback = null;
  
  this.setCallback = function (callback) {
    this._callback = callback;
    return true;
  }
  
  this.unsetCallback = function () {
    this._callback = null;
  }
  
  this.request = function (to) {
    var iq = $iq({to: to, type: 'get'});
	  msg.c('time', {xmlns: Strophe.NS.XEP0202});
	  this._connection.send(iq.tree());
  }
  
  this._onResult = function (stanza) {
    if ($(stanza).children('time').length) {
      if (this._callback) {
        this._callback(stanza);
      }
    }
    return true;
  }
  
  this._onGet = function (stanza) {
    console.log(stanza);
    var date = new Date();
    var offset = date.getTimezoneOffset();
    var tzo = offset ? (offset.toString().slice(0, 1) == '-' ? '-' : '+') + (new Date(Math.abs(offset)*60000).toString().split(' ')[4].slice(0, -3)) : 'Z';
    var utc = date.getFullYear()+'-'
      +('0'+(date.getMonth()+1)).slice(-2)+'-'
      +('0'+(date.getDate())).slice(-2)+'T'
      +('0'+(date.getHours())).slice(-2)+':'
      +('0'+(date.getMinutes())).slice(-2)+':'
      +('0'+(date.getSeconds())).slice(-2)+'Z';
    var iq = $iq({to: $(stanza).attr('from'), type: 'result', id: $(stanza).attr('id')});
    var time = $build('time', {xmlns: Strophe.NS.XEP0202});
	  time.c('tzo', {}, tzo);
	  time.c('utc', {}, utc);
	  iq.cnode(time.tree());
	  console.log(iq.tree());
	  this._connection.send(iq.tree());
    return true;
  }

  Strophe.addNamespace('XEP0202', 'urn:xmpp:time');
  this._connection.addHandler(this._onResult.bind(this), Strophe.NS.XEP0202, 'iq', 'result', null, null);
  this._connection.addHandler(this._onGet.bind(this), Strophe.NS.XEP0202, 'iq', 'get', null, null);
  
}
