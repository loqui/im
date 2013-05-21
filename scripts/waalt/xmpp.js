define(["strophe/strophe"], function(strophe, roster, messaging, vcard){
	return new XMPP();
});

function XMPP(){

	this.hosts = [
		{"name": "LOQUI", "domain": "loqui.im", "country": "ES", "bosh": "https://app.loqui.im/http-bind"},
		{"name": "Comm.unicate.me", "domain": "comm.unicate.me", "country": "UK", "bosh": "http://comm.unicate.me:5280/http-bind"},
		{"name": "CodingTeam", "domain": "codingteam.net", "country": "FR", "bosh": "http://codingteam.net:5280/http-bind"},
		{"name": "InternetException", "domain": "internet-exception.de", "country": "DE", "bosh": "http://internet-exception.de:5280/http-bind"},
		{"name": "Jabber.co.nz", "domain": "jabber.co.nz", "country": "NZ", "bosh": "http://jabber.co.nz:5280/http-bind"},
		{"name": "JabbIM", "domain": "jabbim.cz", "country": "CZ", "bosh": "http://www.jabbim.cz:5280/http-bind"},
		{"name": "Jaim.at", "domain": "jaim.at", "country": "AT", "bosh": "http://jaim.at:5280/http-bind"},
		{"name": "MayPlaces", "domain": "mayplaces.com", "country": "USA", "bosh": "http://mayplaces.com:5280/http-bind"},
	];
	
	this.ping = function(i){
		var st = new Date().getTime();
		img = new Image();
		img.src = this.hosts[i].bosh + "?" + Math.random();
		var that = this;
		img.onerror = function(){
			that.hosts[i].ping = new Date().getTime() - st;
			$("section#wizard>article#hosts ul li#"+i+" span.ping").html(that.hosts[i].ping+"ms");
			if(i<that.hosts.length-1)that.ping(i+1);
		}
	}
	
	this.hostsList = function(){
		var ul = $("section#wizard>article#hosts ul");
		ul.empty();
		for(i in this.hosts){
			ul.append("<li id=\""+i+"\" onclick=\"app.xmpp.hostChoose("+i+")\">"+this.hosts[i].name+"<img src=\"img/flags/"+this.hosts[i].country+".svg\" alt=\""+this.hosts[i].country+"\" class=\"flag\" /><span class=\"ping\"></span></li>");
		}
		this.ping(0);
		this.pingTimer = setInterval("app.xmpp.ping(0)", 5000);
	}
	
	this.hostChoose = function(i){
		clearInterval(this.pingTimer);
		this.settings.host = this.hosts[i].domain;
		this.settings.bosh = this.hosts[i].bosh;
		$("section#wizard>article#signup span#server").html(this.hosts[i].name);
	}
	
	this.login = function(){
		var jid = $("section#login>article#login input[name=\"user\"]").val();
		var pass = $("section#login>article#login input[name=\"pass\"]").val();
		if(jid && pass){
			this.settings.username = jid.split("@")[0];
			this.settings.password = pass;
			this.settings.host = jid.split("@")[1];
			this.settings.bosh = this.hosts[0].bosh;
			this.connect();
			app.save();
		}else alert("You didn't fill in the form properly");
	}
	
	this.register = function(){
		var user = $("section#wizard>article#signup input[name=\"user\"]").val();
		var pass = $("section#wizard>article#signup input[name=\"pass\"]").val();
		var pass2 = $("section#wizard>article#signup input[name=\"pass2\"]").val();
		if(user && pass && pass == pass2)$.post("https://app.loqui.im/register.php", { username: user, password: pass}, function(data){
			var json = JSON.parse(data);
			if(json.length>1){
				switch(json[1]){
					case "wrong":
						alert("Sorry...\nFailed to register in \""+this.settings.host+"\"");
						break;
					case "held":
						alert("Sorry...\nUsername \""+user+"\" is already held.");
						break;
				}
			}else{
				app.xmpp.settings.username = user;
				app.xmpp.settings.password = pass;
				app.save();
				alert("GREAT!\nYou have signed up succesfully.");
			}
		});
		else alert("You didn't fill in the form properly or password fields missmatch");
	}
	
	this.connect = function(){
		this.connection = new Strophe.Connection(this.settings.bosh);
		if(navigator.onLine){
			console.log("Trying to connect to "+this.settings.bosh);
			var lc = this.connection;
			this.connection.connect(this.settings.username+"@"+this.settings.host, this.settings.password, function(status){
				switch(status){
					case Strophe.Status.CONNECTING:
						console.log("CONNECTING");
						Lungo.Notification.show("Connecting", "clock");
						break;
					case Strophe.Status.CONNFAIL:
						console.log("CONNFAIL");
						Lungo.Notification.hide();
						Lungo.Router.section("login");
						Lungo.Notification.error("Could not reach server!", "Please check your username.", "warning", 3);
						break;
					case Strophe.Status.AUTHENTICATING:
						console.log("AUTHENTICATING");
						Lungo.Notification.show("Authenticating", "clock");
						break;
					case Strophe.Status.AUTHFAIL:
						console.log("AUTHFAIL");
						Lungo.Router.section("login");
						Lungo.Notification.error("Authentication failed!", "Please check your username and password.", "warning", 3);
						break;
					case Strophe.Status.CONNECTED:
						console.log("CONNECTED");
						app.messenger.chatList();
						app.messenger.peopleList();
						app.messenger.me();
						lc.addHandler(onChatMessage, null, 'message', 'chat', null, null);
						lc.addHandler(onSubRequest, null, 'presence', 'subscribe', null, null);
						$("section#main > article#me div#status input#status").val(app.xmpp.presence.status);
						app.xmpp.connection.vcard.get(function(data){
							var vCard =  $(data).find("vCard").get(0);
							app.xmpp.me = {
								jid: app.xmpp.settings.username+"@"+app.xmpp.settings.host,
								fn: $(vCard).find("FN").text(),
								avatar: "data:"+ $(vCard).find("TYPE").text() + ";base64," + $(vCard).find("BINVAL").text()
							}
							app.xmpp.rosterGet();
							app.xmpp.bulkSend(app.messenger.sendQ);
						});
						Lungo.Notification.hide();
						$("audio#login").get(0).play();
						break;
					case Strophe.Status.DISCONNECTED:
						console.log("DISCONNECTED");
						Lungo.Notification.hide();
						$("audio#logout").get(0).play();
						break;
					case Strophe.Status.DISCONNECTING:
						console.log("DISCONNECTING");
						Lungo.Notification.show("Disconnecting", "clock");
						break;
					case Strophe.Status.ATTACHED:
						console.log("ATTACHED");
						break;
				}
			});
		}else{
			console.log("OFFLINE: Loading from cache");
			app.messenger.chatList();
			app.messenger.peopleList();
			app.messenger.me();
		}
		Lungo.Router.section("main");
	}
	
	function onChatMessage(msg){
		console.log(Strophe.serialize(msg));
		app.messenger.process(msg);
		return true;
	}
	
	function onSubRequest(msg){
		console.log(Strophe.serialize(msg));
		app.xmpp.connection.roster.authorize(Strophe.getBareJidFromJid(msg.getAttribute('from')));
		return true;
	}
	
	this.rosterGet = function(){
		app.xmpp.connection.roster.registerCallback(function(data){
			app.xmpp.roster = data;
			console.log("ROSTER UPDATE");
			app.messenger.chatList();
			app.messenger.peopleList();
			app.messenger.me();
			app.messenger.render("presence");
			app.save();
		});
		this.connection.roster.get(function(){
			app.messenger.presenceStart();
		});
	}
	
	this.send = function(msg, delayed){
		app.xmpp.connection.Messaging.send(msg.to, msg.text, delayed ? msg.stamp : delayed);
		if(app.messenger.capabilities.CSN != 0){
			app.xmpp.connection.Messaging.csnSend(msg.to, "active");
		}
	}
	
	this.bulkSend = function(q){
		for(i in q){
			this.send(q[i], true);
		}
		q.length = 0;
		app.save();
	}
	
	this.csnSend = function(jid, state){
		app.xmpp.connection.Messaging.csnSend(jid, state);
	}
	
	$(window).bind('beforeunload', function(){
		app.xmpp.connection.disconnect();
	});

}
