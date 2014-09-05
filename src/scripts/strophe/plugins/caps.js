/*
# This plugin is distributed under the terms of the MIT licence.
# Please see the LICENCE file for details.
#
# Copyright (c)
# Markus Kohlhase, 2011
# Adán Sánchez de Pedro Crespo, 2014

# File: strophe.caps.js
# A Strophe plugin for ( http://xmpp.org/extensions/xep-0115.html )

# NOTE: This plugin has following dependencies:
#
# - strophe.disco.js (by François de Metz)
# - sha1.js
*/


Strophe.addConnectionPlugin('caps',
{
  _connection: null,
  
  init: function (conn) {
    this._conn = conn;
    Strophe.addNamespace('CAPS', 'http://jabber.org/protocol/caps');
    if (this._conn.disco === void 0) throw new Error('disco plugin required!');
    if (b64_sha1 === void 0) throw new Error('SHA-1 library required!');
    this._conn.disco.addFeature(Strophe.NS.CAPS);
    this._conn.disco.addFeature(Strophe.NS.DISCO_INFO);
    this._conn.disco.addFeature(Strophe.NS.DISCO_ITEMS);
    if (this._conn.disco._identities.length === 0) {
      return this._conn.disco.addIdentity('client', Lungo.Core.environment().isMobile ? 'phone' : 'pc', 'http://loqui.im', '');
    }
  },
  
  addFeature: function(feature) {
    return this._conn.disco.addFeature(feature);
  },
  
  removeFeature: function(feature) {
    return this._conn.disco.removeFeature(feature);
  },
  
  sendPres: function() {
    return this._conn.send($pres().cnode(this.createCapsNode().tree()));
  },
  
  createCapsNode: function() {
    var node;
    if (this._conn.disco._identities.length > 0) {
      node = this._conn.disco._identities[0].name || "";
    } else {
      node = dummyId.name;
    }
    return $build("c", {
      xmlns: Strophe.NS.CAPS,
      hash: "sha-1",
      node: node,
      ver: this.generateVerificationString()
    });
  },
  
  propertySort: function(array, property) {
    return array.sort(function(a, b) {
      if (a[property] > b[property]) {
        return -1;
      } else {
        return 1;
      }
    });
  },
  
  generateVerificationString: function() {
    var S, features, i, id, ids, k, key, ns, _i, _j, _k, _len, _len2, _len3, _ref, _ref2;
    ids = [];
    _ref = this._conn.disco._identities;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      ids.push(i);
    }
    features = [];
    _ref2 = this._conn.disco._features;
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      k = _ref2[_j];
      features.push(k);
    }
    S = "";
    this.propertySort(ids, "category");
    this.propertySort(ids, "type");
    this.propertySort(ids, "lang");
    for (key in ids) {
      id = ids[key];
      S += "" + id.category + "/" + id.type + "/" + id.lang + "/" + id.name + "<";
    }
    features.sort();
    for (_k = 0, _len3 = features.length; _k < _len3; _k++) {
      ns = features[_k];
      S += "" + ns + "<";
    }
    return "" + (b64_sha1(S)) + "=";
  }

});
