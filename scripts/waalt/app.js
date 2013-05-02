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
		app.start();
	}
	
	this.popup = function(id){
		$(".popup#"+id).fadeIn(200);
	}
	
	this.popdown = function(obj){
		$(obj).closest(".popup").fadeOut(200);
	}
	
	this.start = function(){
		if($.isEmptyObject(this.xmpp.settings)) Lungo.Router.section("welcome");		
		else this.xmpp.connect();
	}
	
	this.load = function(){
		this.xmpp.settings = localStorage.xsettings ? JSON.parse(localStorage.getItem("xsettings")) : new Object();
		this.xmpp.presence = localStorage.xpresence ? JSON.parse(localStorage.getItem("xpresence")) : {show: "a", status: "Started using LOQUI"};
		this.messenger.list = localStorage.clist ? JSON.parse(localStorage.getItem("clist")) : new Array();
		this.messenger.avatars = sessionStorage.avatars ? JSON.parse(sessionStorage.getItem("avatars")) : new Object();
	}
	
	this.save = function(){
		localStorage.setItem("xsettings", JSON.stringify(this.xmpp.settings));
		localStorage.setItem("xpresence", JSON.stringify(this.xmpp.presence));
		localStorage.setItem("clist", JSON.stringify(this.messenger.list));
		sessionStorage.setItem("avatars", JSON.stringify(this.messenger.avatars));
	}
	
}
