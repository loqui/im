define(["./xmpp", "./messenger"], function(xmpp, messenger){
	app.xmpp = xmpp;
	app.messenger = messenger;
	$(document).ready(function(){
		app.run();
	});
});

var app = new App();

function App(){
	
	
	this.run = function(){
		this.load();
		this.start();
	}
	
	this.popup = function(id){
		$(".popup#"+id).fadeIn(200);
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
		this.xmpp.settings = localStorage.xsettings ? JSON.parse(localStorage.getItem("xsettings")) : new Object();
		this.xmpp.presence = localStorage.xpresence ? JSON.parse(localStorage.getItem("xpresence")) : {show: "a", status: "Started using LOQUI"};
		this.xmpp.roster = localStorage.xroster ? JSON.parse(localStorage.getItem("xroster")) : new Object();
		this.xmpp.rosterdict = localStorage.xrd ? JSON.parse(localStorage.getItem("xrd")) : new Array();
		this.xmpp.me = localStorage.xme ? JSON.parse(localStorage.getItem("xme")) : new Object();
		this.messenger.list = localStorage.clist ? JSON.parse(localStorage.getItem("clist")) : new Array();
		this.messenger.avatars = localStorage.avatars ? JSON.parse(localStorage.getItem("avatars")) : new Object();
		this.messenger.sendQ = localStorage.sendQ ? JSON.parse(localStorage.getItem("sendQ")) : new Array();
	}
	
	this.save = function(){
		localStorage.setItem("xsettings", JSON.stringify(this.xmpp.settings));
		localStorage.setItem("xpresence", JSON.stringify(this.xmpp.presence));
		localStorage.setItem("xroster", JSON.stringify(this.xmpp.roster));
		localStorage.setItem("xme", JSON.stringify(this.xmpp.me));
		localStorage.setItem("xrd", JSON.stringify(this.xmpp.rosterdict));
		localStorage.setItem("clist", JSON.stringify(this.messenger.list));
		localStorage.setItem("avatars", JSON.stringify(this.messenger.avatars));
		localStorage.setItem("sendQ", JSON.stringify(this.messenger.sendQ));
	}
	
	document.body.addEventListener("online", function(){
		app.xmpp.connect();
	}, false);
	
}
