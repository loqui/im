//	XMPP plugins for Strophe v0.2

//	(c) 2012 Yiorgis Gozadinos.
//	strophe.plugins is distributed under the MIT license.
//	http://github.com/ggozad/strophe.plugins


// Plugin to deal with basic instant messaging

Strophe.addConnectionPlugin('Messaging', {

	_connection: null,

	init: function(conn){
		this._connection = conn;
		Strophe.addNamespace('XHTML_IM', 'http://jabber.org/protocol/xhtml-im');
		Strophe.addNamespace('XHTML', 'http://www.w3.org/1999/xhtml');
		Strophe.addNamespace('XEP0085', 'http://jabber.org/protocol/chatstates');
		Strophe.addNamespace('XEP0203', 'urn:xmpp:delay');
	},

	// Register message notifications when connected
	statusChanged: function (status, condition) {
		if (status === Strophe.Status.CONNECTED || status === Strophe.Status.ATTACHED) {
			//this._connection.addHandler(this._onReceiveChatMessage.bind(this), null, 'message', 'chat');
		}
	},

	// **send** sends a message. `body` is the plaintext contents whereas `html_body` is the html version.
	/*send: function(to, body, html_body){
		var msg = $msg({to: to, type: 'chat'});
		if(body && html_body){
			msg.c('body', {}, body);
			msg.c('html', {xmlns: Strophe.NS.XHTML_IM}).c('body', {xmlns: Strophe.NS.XHTML}).c('p', {}).cnode(html_body);
		}
		this._connection.send(msg.tree());
	},*/
	
	send: function(to, body, stamp){
		var msg = $msg({to: to, type: 'chat'});
		if(body){
			msg.c('body', {}, body);
			if(stamp)msg.c('delay', {xmlns: Strophe.NS.XEP0203, stamp: stamp});
		}
		console.log(Strophe.serialize(msg));
		this._connection.send(msg.tree());
	},
	
	csnSend: function(to, state) {
		var msg = $msg({to: to, type: 'chat'});
		switch(state){
			case 'composing':
				msg.c('composing', {xmlns: Strophe.NS.XEP0085});
				break;
			case 'paused':
				msg.c('paused', {xmlns: Strophe.NS.XEP0085});
				break;
			case 'inactive':
				msg.c('inactive', {xmlns: Strophe.NS.XEP0085});
				break;
			case 'gone':
				msg.c('gone', {xmlns: Strophe.NS.XEP0085});
				break;
			default:
				msg.c('active', {xmlns: Strophe.NS.XEP0085});
				break;
		}
		console.log(Strophe.serialize(msg));
		this._connection.send(msg.tree());
	}
	
});

