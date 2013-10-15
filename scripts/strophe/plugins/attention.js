/*
  Copyright 2013, Adán Sánchez de Pedro Crespo <adansdpc@waalt.com>
*/

/**
 * Attention Strophe Plugin
 * Implements http://xmpp.org/extensions/xep-0224.html
 */
 
Strophe.addConnectionPlugin('attention', {

  _connector: null,
  _connection: null,
  _callback: null,
  
  init: function (conn) {
    this._connection = conn;
    Strophe.addNamespace('XEP0224', 'urn:xmpp:attention:0');
    conn.addHandler(this._handler.bind(this), null, 'message', 'headline', null, null);
  },
  
  setCallback: function (callback, connector) {
    this._callback = callback;
    this._connector = connector;
    return true;
  },
  
  unsetCallback: function () {
    this._callback = null;
  },
  
  request: function (to, body) {
    var msg = $msg({to: to, type: 'headline'});
		if (body) {
			msg.c('body', {}, body);
		}
		msg.c('attention', {xmlns: Strophe.NS.XEP0224});
		this._connection.send(msg.tree());
  },
  
  _handler: function (stanza) {
    if ($(stanza).children('attention').length) {
      if (this._callback) {
        this._callback(stanza, this._connector);
      }
    }
    return true;
  }
  
});
