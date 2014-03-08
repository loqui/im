/* 
Plugin to implement the vCard extension. 
http://xmpp.org/extensions/xep-0054.html

Authors:
Nathan Zorn (nathan.zorn@gmail.com)
Adán Sánchez de Pedro Crespo (adansdpc@waalt.com)

*/
/* jslint configuration: */
/* global document, window, setTimeout, clearTimeout, console,
    XMLHttpRequest, ActiveXObject,
    Base64, MD5,
    Strophe, $build, $msg, $iq, $pres 
*/
var buildIq = function(type, from, jid, vCardEl) {
    var iq;
    if (!jid)
    {
        //retrieve current jid's vCard
        iq = $iq({type:type, from:from});
    }
    else
    {
        iq = $iq({type:type, to:jid, from:from});
    }
    var ret = iq.c("vCard", {xmlns:Strophe.NS.VCARD});
    if (vCardEl)
    {
        ret = ret.cnode(vCardEl);
    }
    return ret;
};
Strophe.addConnectionPlugin('vcard', {
    _connection: null,
    // Called by Strophe.Connection constructor
    init: function(conn) {
        this._connection = conn;
        Strophe.addNamespace('VCARD', 'vcard-temp');
    },
    /****Function
      Retrieve a vCard for a JID/Entity
      Parameters:
      (Function) handler_cb - The callback function used to handle the request.
      (String) jid - optional - The name of the entity to request the vCard
         If no jid is given, this function retrieves the current user's vcard.
    */
    get: function(handler_cb, jid) {
        var iq = buildIq("get", this._connection.jid, jid);
        this._connection.sendIQ(iq.tree(), handler_cb, null);
    },
    /*** Function
        Set an entity's vCard.
    */
    set: function(handler_cb, vCardEl, jid) {
        var iq = buildIq("set", this._connection.jid, jid, vCardEl);
        console.log(Strophe.serialize(iq));
        this._connection.sendIQ(iq.tree(), handler_cb, null);
    },
    
    createUpdateNode: function(vCardEl) {
      var xNode = $build('x', {xmlns: 'vcard-temp:x:update'});
      xNode.cnode(vCardEl);
      return xNode;
    }
});
