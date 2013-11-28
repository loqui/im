/*
  Copyright 2013, Adán Sánchez de Pedro Crespo <adansdpc@waalt.com>
*/

/**
 * Attention Strophe Plugin
 * Implements http://xmpp.org/extensions/xep-0224.html
 */
 
var AttentionPlugin = function (conn) {

  this._connection = conn;
  this._callback = null;
  
  this.setCallback = function (callback) {
    this._callback = callback;
    return true;
  }
  
  this.unsetCallback = function () {
    this._callback = null;
  }
  
  this.request = function (to, body) {
    var msg = $msg({to: to, type: 'headline'});
	  if (body) {
		  msg.c('body', {}, body);
	  }
	  msg.c('attention', {xmlns: Strophe.NS.XEP0224});
	  this._connection.send(msg.tree());
  }
  
  this._handler = function (stanza) {
    if ($(stanza).children('attention').length) {
      if (this._callback) {
        this._callback(stanza);
      }
    }
    return true;
  }

  Strophe.addNamespace('XEP0224', 'urn:xmpp:attention:0');
  this._connection.addHandler(this._handler.bind(this), null, 'message', 'headline', null, null);
  
}
