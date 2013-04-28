/*
This library is free software; you can redistribute it and/or modify it
 under the terms of the GNU Lesser General Public License as published
 by the Free Software Foundation; either version 2.1 of the License, or
 (at your option) any later version.
 .
 This library is distributed in the hope that it will be useful, but
 WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser
 General Public License for more details.

  Copyright (c) dodo <dodo@blacksec.org>, 2011

*/

/**
* File: strophe.register.js
* A Strophe plugin for XMPP In-Band Registration.
*/
Strophe.addConnectionPlugin('register', {
    _connection: null,

    //The plugin must have the init function.
    init: function(conn) {
        this._connection = conn;

        // compute free emun index number
        var i = 0;
        Object.keys(Strophe.Status).forEach(function (key) {
            i = Math.max(i, Strophe.Status[key]);
        });

        /* extend name space
         *  NS.REGISTER - In-Band Registration
         *              from XEP 77.
         */
        Strophe.addNamespace('REGISTER', 'jabber:iq:register');
        Strophe.Status.REGISTERING = i + 1;
        Strophe.Status.REGIFAIL    = i + 2;
        Strophe.Status.REGISTER    = i + 3;
        Strophe.Status.SUBMITTING  = i + 4;
        Strophe.Status.SBMTFAIL    = i + 5;
        Strophe.Status.REGISTERED  = i + 6;

        if (conn.disco)
            conn.disco.addFeature(Strophe.NS.REGISTER);

        // hooking strophe's connection.reset
        var self = this, reset = conn.reset;
        conn.reset = function () {
            reset();
            self.instructions = "";
            self.fields = {};
            self.authentication = {};
            self.registered = false;
            self.enabled = null;
        };
    },

    /** Function: connect
     *  Starts the registration process.
     *
     *  As the registration process proceeds, the user supplied callback will
     *  be triggered multiple times with status updates.  The callback
     *  should take two arguments - the status code and the error condition.
     *
     *  The status code will be one of the values in the Strophe.Status
     *  constants.  The error condition will be one of the conditions
     *  defined in RFC 3920 or the condition 'strophe-parsererror'.
     *
     *  Please see XEP 77 for a more detailed explanation of the optional
     *  parameters below.
     *
     *  Parameters:
     *    (String) domain - The xmpp server's Domain.  This will be the server,
     *      which will be contacted to register a new JID.
     *      The server has to provide and allow In-Band Registration (XEP-0077).
     *    (Function) callback The connect callback function.
     *    (Integer) wait - The optional HTTPBIND wait value.  This is the
     *      time the server will wait before returning an empty result for
     *      a request.  The default setting of 60 seconds is recommended.
     *      Other settings will require tweaks to the Strophe.TIMEOUT value.
     *    (Integer) hold - The optional HTTPBIND hold value.  This is the
     *      number of connections the server will hold at one time.  This
     *      should almost always be set to 1 (the default).
     */
    connect: function (domain, callback, wait, hold) {
        var that = this._connection;
        this.instructions = "";
        this.fields = {};
        this.authentication = {};
        this.registered = false;
        this.enabled = false;

        that.connect_callback = callback;
        that.connected = false;
        that.authenticated = false;
        that.disconnecting = false;
        that.errors = 0;

        that.domain = domain || that.domain;
        that.wait = wait || that.wait;
        that.hold = hold || that.hold;

        // build the body tag
        var body = that._buildBody().attrs({
            to: that.domain,
            "xml:lang": "en",
            wait: that.wait,
            hold: that.hold,
            content: "text/xml; charset=utf-8",
            ver: "1.6",
            "xmpp:version": "1.0",
            "xmlns:xmpp": Strophe.NS.BOSH
        });

        that._changeConnectStatus(Strophe.Status.CONNECTING, null);

        that._requests.push(
            new Strophe.Request(body.tree(),
                                that._onRequestStateChange.bind(
                                    that, this._register_cb.bind(this)),
                                body.tree().getAttribute("rid")));
        that._throttledRequestHandler();
    },

    /** PrivateFunction: _register_cb
     *  _Private_ handler for initial registration request.
     *
     *  This handler is used to process the initial registration request
     *  response from the BOSH server. It is used to set up a bosh session
     *  and requesting registration fields from host.
     *
     *  Parameters:
     *    (Strophe.Request) req - The current request.
     */
    _register_cb: function (req) {
        var that = this._connection;

        Strophe.info("_register_cb was called");
        that.connected = true;

        var bodyWrap = req.getResponse();
        if (!bodyWrap) { return; }

        if (that.xmlInput !== Strophe.Connection.prototype.xmlInput) {
            that.xmlInput(bodyWrap);
        }
        if (that.rawInput !== Strophe.Connection.prototype.rawInput) {
            that.rawInput(Strophe.serialize(bodyWrap));
        }

        var typ = bodyWrap.getAttribute("type");
        var cond, conflict;
        if (typ !== null && typ == "terminate") {
            // an error occurred
            cond = bodyWrap.getAttribute("condition");
            conflict = bodyWrap.getElementsByTagName("conflict");
            if (cond !== null) {
                if (cond == "remote-stream-error" && conflict.length > 0) {
                    cond = "conflict";
                }
                that._changeConnectStatus(Strophe.Status.CONNFAIL, cond);
            } else {
                that._changeConnectStatus(Strophe.Status.CONNFAIL, "unknown");
            }
            return;
        }

        // check to make sure we don't overwrite these if _connect_cb is
        // called multiple times in the case of missing stream:features
        if (!that.sid) {
            that.sid = bodyWrap.getAttribute("sid");
        }
        if (!that.stream_id) {
            that.stream_id = bodyWrap.getAttribute("authid");
        }

        var wind = bodyWrap.getAttribute('requests');
        if (wind) { that.window = parseInt(wind, 10); }
        var hold = bodyWrap.getAttribute('hold');
        if (hold) { that.hold = parseInt(hold, 10); }
        var wait = bodyWrap.getAttribute('wait');
        if (wait) { that.wait = parseInt(wait, 10); }


        var register, mechanisms;
        register = bodyWrap.getElementsByTagName("register");
        mechanisms = bodyWrap.getElementsByTagName("mechanism");
        if (register.length === 0 && mechanisms.length === 0) {
            // we didn't get stream:features yet, so we need wait for it
            // by sending a blank poll request
            var body = that._buildBody();
            that._requests.push(
                new Strophe.Request(body.tree(),
                                    that._onRequestStateChange.bind(
                                        that, this._register_cb.bind(this)),
                                    body.tree().getAttribute("rid")));
            that._throttledRequestHandler();
            return;
        }

        var i, mech;
        for (i = 0; i < mechanisms.length; i++) {
            mech = Strophe.getText(mechanisms[i]);
            if (mech == 'DIGEST-MD5') {
                this.authentication.sasl_digest_md5 = true;
            } else if (mech == 'PLAIN') {
                this.authentication.sasl_plain = true;
            } else if (mech == 'ANONYMOUS') {
                this.authentication.sasl_anonymous = true;
            }
        }

        /*if (register.length === 0) {
            that._changeConnectStatus(Strophe.Status.REGIFAIL, null);
            return;
        } else*/ this.enabled = true;

        // send a get request for registration, to get all required data fields
        that._changeConnectStatus(Strophe.Status.REGISTERING, null);
        that._addSysHandler(this._get_register_cb.bind(this),
                            null, "iq", null, null);
        that.send($iq({type: "get"}).c("query",
            {xmlns: Strophe.NS.REGISTER}).tree());
    },

    /** PrivateFunction: _get_register_cb
     *  _Private_ handler for Registration Fields Request.
     *
     *  Parameters:
     *    (XMLElement) elem - The query stanza.
     *
     *  Returns:
     *    false to remove the handler.
     */
    _get_register_cb: function (stanza) {
        var i, query, field, that = this._connection;
        query = stanza.getElementsByTagName("query");

        if (query.length !== 1) {
            that._changeConnectStatus(Strophe.Status.REGIFAIL, "unknown");
            return false;
        }
        query = query[0];
        // get required fields
        for (i = 0; i < query.childNodes.length; i++) {
            field = query.childNodes[i];
            if (field.tagName.toLowerCase() === 'instructions') {
                // this is a special element
                // it provides info about given data fields in a textual way.
                this.instructions = Strophe.getText(field);
                continue;
            } else if (field.tagName.toLowerCase() === 'x') {
                // ignore x for now
                continue;
            }
            this.fields[field.tagName.toLowerCase()] = Strophe.getText(field);
        }
        that._changeConnectStatus(Strophe.Status.REGISTER, null);
        return false;
    },

    /** Function: submit
     *  Submits Registration data.
     *
     *  As the registration process proceeds, the user supplied callback will
     *  be triggered with status code Strophe.Status.REGISTER. At this point
     *  the user should fill all required fields in connection.register.fields
     *  and invoke this function to procceed in the registration process.
     */
    submit: function () {
        var i, name, query, fields, that = this._connection;
        query = $iq({type: "set"}).c("query", {xmlns:Strophe.NS.REGISTER});

        // set required fields
        fields = Object.keys(this.fields);
        for (i = 0; i < fields.length; i++) {
            name = fields[i];
            query.c(name).t(this.fields[name]).up();
        }

        // providing required information
        that._changeConnectStatus(Strophe.Status.SUBMITTING, null);
        that._addSysHandler(this._submit_cb.bind(this),
                            null, "iq", null, null);
        that.send(query);
    },

    /** PrivateFunction: _submit_cb
     *  _Private_ handler for submitted registration information.
     *
     *  Parameters:
     *    (XMLElement) elem - The query stanza.
     *
     *  Returns:
     *    false to remove the handler.
     */
    _submit_cb: function (stanza) {
        var i, query, field, error = null, that = this._connection;

        query = stanza.getElementsByTagName("query");
        if (query.length > 0) {
            query = query[0];
            // update fields
            for (i = 0; i < query.childNodes.length; i++) {
                field = query.childNodes[i];
                if (field.tagName.toLowerCase() === 'instructions') {
                    // this is a special element
                    // it provides info about given data fields in a textual way
                    this.instructions = Strophe.getText(field);
                    continue;
                }
                this.fields[field.tagName.toLowerCase()]=Strophe.getText(field);
            }
        }

        if (stanza.getAttribute("type") === "error") {
            error = stanza.getElementsByTagName("error");
            if (error.length !== 1) {
                that._changeConnectStatus(Strophe.Status.SBMTFAIL, "unknown");
                return false;
            }
            // this is either 'conflict' or 'not-acceptable'
            error = error[0].firstChild.tagName.toLowerCase();
            if (error === 'conflict')
                // already registered
                this.registered = true;
        } else
            this.registered = true;

        if (this.registered) {
            that.jid  = this.fields.username + "@" + that.domain;
            that.pass = this.fields.password;
        }

        if (error === null) {
            Strophe.info("Registered successful.");
            that._changeConnectStatus(Strophe.Status.REGISTERED, null);
        } else {
            Strophe.info("Registration failed.");
            that._changeConnectStatus(Strophe.Status.SBMTFAIL, error);
        }
        return false;
    },

    /** Function: authenticate
     *  Login with newly registered account.
     *
     *  This is just a helper function to authenticate with the new account of
     *  the successful registration. This is recommended to do in the
     *  user supplied callback when receiving Strophe.Status.REGISTERED.
     *  It is also possible to do it on Strophe.Status.SBMTFAIL when
     *  connection.register.registered is true under the circumstances that an
     *  already existing account with the appendant password was supplied.
     */
    authenticate: function () {
        var auth_str, hashed_auth_str, that = this._connection;

        if (Strophe.getNodeFromJid(that.jid) === null &&
            this.authentication.sasl_anonymous) {
            that._changeConnectStatus(Strophe.Status.AUTHENTICATING, null);
            that._sasl_success_handler = that._addSysHandler(
                that._sasl_success_cb.bind(that), null,
                "success", null, null);
            that._sasl_failure_handler = that._addSysHandler(
                that._sasl_failure_cb.bind(that), null,
                "failure", null, null);

            that.send($build("auth", {
                xmlns: Strophe.NS.SASL,
                mechanism: "ANONYMOUS"
            }).tree());
        } else if (Strophe.getNodeFromJid(that.jid) === null) {
            // we don't have a node, which is required for non-anonymous
            // client connections
            that._changeConnectStatus(Strophe.Status.CONNFAIL,
                                      'x-strophe-bad-non-anon-jid');
            that.disconnect();
        } else if (this.authentication.sasl_digest_md5) {
            that._changeConnectStatus(Strophe.Status.AUTHENTICATING, null);
            that._sasl_challenge_handler = that._addSysHandler(
                that._sasl_challenge1_cb.bind(that), null,
                "challenge", null, null);
            that._sasl_failure_handler = that._addSysHandler(
                that._sasl_failure_cb.bind(that), null,
                "failure", null, null);

            that.send($build("auth", {
                xmlns: Strophe.NS.SASL,
                mechanism: "DIGEST-MD5"
            }).tree());
        } else if (this.authentication.sasl_plain) {
            // Build the plain auth string (barejid null
            // username null password) and base 64 encoded.
            auth_str = Strophe.getBareJidFromJid(that.jid);
            auth_str = auth_str + "\u0000";
            auth_str = auth_str + Strophe.getNodeFromJid(that.jid);
            auth_str = auth_str + "\u0000";
            auth_str = auth_str + that.pass;

            that._changeConnectStatus(Strophe.Status.AUTHENTICATING, null);
            that._sasl_success_handler = that._addSysHandler(
                that._sasl_success_cb.bind(that), null,
                "success", null, null);
            that._sasl_failure_handler = that._addSysHandler(
                that._sasl_failure_cb.bind(that), null,
                "failure", null, null);

            hashed_auth_str = Base64.encode(auth_str);
            that.send($build("auth", {
                xmlns: Strophe.NS.SASL,
                mechanism: "PLAIN"
            }).t(hashed_auth_str).tree());
        } else {
            that._changeConnectStatus(Strophe.Status.AUTHENTICATING, null);
            that._addSysHandler(that._auth1_cb.bind(that), null, null,
                                null, "_auth_1");

            that.send($iq({
                type: "get",
                to: that.domain,
                id: "_auth_1"
            }).c("query", {
                xmlns: Strophe.NS.AUTH
            }).c("username", {}).t(Strophe.getNodeFromJid(that.jid)).tree());
        }
    },
});

