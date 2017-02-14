/*
  Copyright 2014, Adán Sánchez de Pedro Crespo <adansdpc@waalt.com>
*/

/**
 * Software Version Strophe Plugin
 * Implements http://xmpp.org/extensions/xep-0092.html
 */
 
Strophe.addConnectionPlugin('version', {

  _connection: null,
  
  init: function (conn) {
    this._connection = conn;
    Strophe.addNamespace('XEP0092', 'jabber:iq:version');
  },

  handlify: function (callback) {
    return [
      this._connection.addHandler(callback, Strophe.NS.XEP0092, 'iq', 'result', null, null),
      this._connection.addHandler(this._onGet.bind(this), Strophe.NS.XEP0092, 'iq', 'get', null, null)
    ];
  },
  
  request: function (to) {
    var iq = $iq({to: to, type: 'get'});
	  msg.c('query', {xmlns: Strophe.NS.XEP0092});
	  this._connection.send(iq.tree());
    console.log(iq);
  },
  
  _onGet: function (stanza) {
    console.log(stanza);
    var iq = $iq({to: $(stanza).attr('from'), type: 'result', id: $(stanza).attr('id')});
    var query = $build('query', {xmlns: Strophe.NS.XEP0092});
	  query.c('name', {}, App.name);
	  query.c('version', {}, App.version + App.minorVersion);
	  query.c('os', {}, Lungo.Core.environment().os ? Lungo.Core.environment().os.name : 'PC');
	  iq.cnode(query.tree());
	  console.log(iq.tree());
	  this._connection.send(iq.tree());
    return true;
  }
  
});
