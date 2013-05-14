define(["./xmpp", "./messenger"], function(xmpp, messenger){
	app.xmpp = xmpp;
	app.messenger = messenger;
	app.run();
});

var app = new App();

function App(){

	this.version = "007";	
	
	this.run = function(){
		if(localStorage.version < this.version)this.asyncify();
		else this.load();
	}
	
	this.dialog = function(id){
		Lungo.Router.aside("main", "options");
		Lungo.Router.section("dialog");
		Lungo.Router.article(id, id);
	}
	
	this.popdown = function(obj){
		$(obj).closest(".popup").fadeOut(200);
	}
	
	this.numify = function(num){
		var base = "LOQUI by Waaltcom";
		window.document.title = num ? base + " (" + num + ")" : base;
	}
	
	this.start = function(){
		// Check wether app has beeen runned previously or not
		if($.isEmptyObject(this.xmpp.settings))Lungo.Router.section("welcome");		
		else{
			Lungo.Router.section("main")
			this.xmpp.connect();
		}
	}
	
	this.load = function(){
		async.parallel([
			function(callback){
				asyncStorage.getItem("xpresence", function(val){
					app.xmpp.presence = val?JSON.parse(val) : {show: "a", status: "Started using LOQUI"};
					callback(null);
				});
			},
			function(callback){
				asyncStorage.getItem("xroster", function(val){
					app.xmpp.roster = val?JSON.parse(val) : new Object();
					callback(null);
				});
			},
			function(callback){
				asyncStorage.getItem("xrd", function(val){
					app.xmpp.rosterdict = val?JSON.parse(val) : new Array();
					callback(null);
				});
			},
			function(callback){
				asyncStorage.getItem("xme", function(val){
					app.xmpp.me = val?JSON.parse(val) : new Object();
					callback(null);
				});
			},
			function(callback){
				asyncStorage.getItem("mchats", function(val){
					app.messenger.list = val?JSON.parse(val) : new Array();
					callback(null);
				});
			},
			function(callback){
				asyncStorage.getItem("mavatars", function(val){
					app.messenger.avatars = val?JSON.parse(val) : new Object();
					callback(null);
				});
			},
			function(callback){
				asyncStorage.getItem("msendQ", function(val){
					app.messenger.sendQ = val?JSON.parse(val) : new Array();
					callback(null);
				});
			},
			function(callback){
				asyncStorage.getItem("xsettings", function(val){
					app.xmpp.settings = val?JSON.parse(val) : new Object();
					callback(null);
				});
			}
		], function(err, results){
			app.start();
		});
	}
	
	this.save = function(){
		asyncStorage.setItem("xpresence", JSON.stringify(this.xmpp.presence));
		asyncStorage.setItem("xroster", JSON.stringify(this.xmpp.roster));
		asyncStorage.setItem("xme", JSON.stringify(this.xmpp.me));
		asyncStorage.setItem("xrd", JSON.stringify(this.xmpp.rosterdict));
		asyncStorage.setItem("mchats", JSON.stringify(this.messenger.list));
		asyncStorage.setItem("mavatars", JSON.stringify(this.messenger.avatars));
		asyncStorage.setItem("msendQ", JSON.stringify(this.messenger.sendQ));
		asyncStorage.setItem("aversion", this.version);
		asyncStorage.setItem("xsettings", JSON.stringify(this.xmpp.settings));
	}
	
	this.asyncify = function(){
		localStorage.version = this.version;
		async.parallel([
			function(callback){
				asyncStorage.setItem("xpresence", localStorage.xpresence, function(){
					callback(null);				
				});
			},
			function(callback){
				asyncStorage.setItem("xroster", localStorage.xroster, function(){
					callback(null);			
				});
			},
			function(callback){
				asyncStorage.setItem("xme", localStorage.xme, function(){				
					callback(null);
				});
			},
			function(callback){
				asyncStorage.setItem("xrd", localStorage.xrd, function(){
					callback(null);
				});
			},
			function(callback){
				asyncStorage.setItem("mchats", localStorage.clist, function(){
					callback(null);
				});
			},
			function(callback){
				asyncStorage.setItem("mavatars", localStorage.avatars, function(){
					callback(null);
				});
			},
			function(callback){
				asyncStorage.setItem("msendQ", localStorage.sendQ, function(){
					callback(null);
				});
			},
			function(callback){
				asyncStorage.setItem("xsettings", localStorage.xsettings, function(){
					callback(null);
				});
			}
		], function(err, results){
			app.load();
		});
	}
	
	this.clear = function(){
		localStorage.clear();
		asyncStorage.clear();
		this.xmpp.connection.disconnect();
		this.run();
	}
	
	document.body.addEventListener("online", function(){
		app.xmpp.connect();
	}, false);
	
}
