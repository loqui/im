/*
  Copyright 2013, Adán Sánchez de Pedro Crespo <adansdpc@waalt.com>
*/

/**
 * Attention Strophe Plugin
 * Implements http://xmpp.org/extensions/xep-0224.html
 */
 
Strophe.addConnectionPlugin('attention', {

  _connection: null,
  
  init: function(conn) {
    this._connection = conn;
    Strophe.addNamespace('XEP0224', 'urn:xmpp:attention:0');
  },
  
  handlify: function (callback) {
    return this._connection.addHandler(callback, Strophe.NS.XEP0224, 'message', 'headline', null, null);
  },
  
  request: function (to, body) {
    var msg = $msg({to: to, type: 'headline'});
	  if (body) {
		  msg.c('body', {}, body);
	  }
	  msg.c('attention', {xmlns: Strophe.NS.XEP0224});
	  this._connection.send(msg.tree());
  }
  
});
