/*
  Copyright 2011, Markus Kohlhase <mail@markus-kohlhase.de>
*/

/**
 * Message Delivery Receipts Strophe Plugin
 * Implement http://xmpp.org/extensions/xep-0184.html
 */

Strophe.addConnectionPlugin('receipts', {
    _conn: null,
    _msgQueue: {},
    _retries: {},
    _resendCount: 10,
    _resendTime: 9000,

    init: function(conn) {
        this._conn = conn;
        Strophe.addNamespace('RECEIPTS', 'urn:xmpp:receipts');
    },
	
	
    statusChanged: function (status) {
		if (status === Strophe.Status.CONNECTED || status === Strophe.Status.ATTACHED) {
			// set up handlers for receipts
			//this._conn.addHandler(this._onRequestReceived.bind(this), Strophe.NS.RECEIPTS, "message");
			var that = this;
			setTimeout(function(){that.resendQueue();},5000);
		}
	},
	
	/*
	_onRequestReceived: function(msg){
		this._processReceipt(msg);
		return true;
	},
	* */

    /* sendMessage
    ** sends a message with a receipt and stores the message in the queue
    ** in case a receipt is never received
    **
    ** msg should be a builder
    */
    sendMessage: function(msg) {
        var id = this._conn.getUniqueId();
        
        msg.tree().setAttribute('id', id);

        var request = Strophe.xmlElement('request', {'xmlns': Strophe.NS.RECEIPTS});
        msg.tree().appendChild(request);

        this._msgQueue[id] = msg;
        this._retries[id] = 0;

        this._conn.send(msg);
        
        this.resendMessage(id);
        
        return id;
        
    },
    
    /*
    ** resend queued message 
    */
    resendMessage: function(id){
		var that = this;
		setTimeout(function(){
			if (that._msgQueue[id]){
				// if we are disconnected, dont increment retries count and retry later
				if (!that._conn.connected) {
					that.resendMessage(id);
					return;
				}
				that._retries[id]++;
				if (that._retries[id] > that._resendCount) {
					//TODO: use mod_rest to force injection of the message
					//console.debug('message could not be delivered after ' + that._resendCount + ' attempts');
					return;
				}
				
				// FIX: use our actual jid in case we disconnected and changed jid								
				that._msgQueue[id].tree().setAttribute('from', that._conn.jid);
				
				that._conn.send(that._msgQueue[id]);
				that.resendMessage(id);
			}
		},this._resendTime);
	},
	
	/* addMessageHandler
    ** add a message handler that handles XEP-0184 message receipts
    */
    addReceiptHandler: function(handler, type, from, options) {
        var that = this;

        var proxyHandler = function(msg) {
            that._processReceipt(msg);
         
            // call original handler
            return handler(msg);
        };

        this._conn.addHandler(proxyHandler, Strophe.NS.RECEIPTS, 'message',
                              type, null, from, options);
    },
    
    /*
	 * process a XEP-0184 message receipts
	 * send recept on request
	 * remove msg from queue on received 
	*/
	_processReceipt: function(msg){
		var id = msg.getAttribute('id'),
			from = msg.getAttribute('from'),
			req = msg.getElementsByTagName('request'),
			rec = msg.getElementsByTagName('received');
			
			// check for request in message
            if (req.length > 0) {
				// send receipt
				var out = $msg({to: from, from: this._conn.jid, id: this._conn.getUniqueId()}),
					request = Strophe.xmlElement('received', {'xmlns': Strophe.NS.RECEIPTS, 'id': id});
				out.tree().appendChild(request);
				this._conn.send(out);
			}
			// check for received
            if (rec.length > 0) {
                var recv_id = rec[0].getAttribute('id');
				if (recv_id) { // delete msg from queue
					delete this._msgQueue[recv_id];
					delete this._retries[recv_id];
				}
            }			
	},
	
	resendQueue: function(){
		if (!this._conn.connected) {
			var that = this;
			setTimeout(function(){that.resendQueue();},5000);
			return;
		}
		for (var id in this._msgQueue) {
			if (this._msgQueue.hasOwnProperty(id)) {
			   this._conn.send(this._msgQueue[id]);
			}
		}	
	},

    getUnreceivedMsgs: function() {
        var msgs = [];
        for (var id in this._msgQueue) {
            if (this._msgQueue.hasOwnProperty(id)) {
                msgs.push(this._msgQueue[id]);
            }
        }
        return msgs;
    },

    clearMessages: function() {
        this._msgQueue = {};
    }
}); 
