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
		this.sectionShow("splash");
		app.start();
	}
	
	this.sectionShow = function(section, article, data){
		this.curSection = section;
		if(article){
			$("section#"+section+">article#"+article).show().siblings("article").hide();
			this.curArticle = article;
		}
		$("section#"+section).show().siblings().hide();
		switch(section){
			case "wizard":
				switch(article){
					case "hosts":
						this.xmpp.hostsList();
						break;
					case "login":
						$("section#wizard article#login div").html(data==true?"<input name=\"host\" type=\"text\" placeholder=\"XMPP host\" required /><input name=\"bosh\" type=\"text\" placeholder=\"BOSH URL\" required />":"");
						break;
				}
				break;
			case "login":
				switch(article){
					case "connecting":
						this.xmpp.connect();
				}
				break;
			case "main":
				switch(article){
					case "list":
						if(this.xmpp.roster)this.messenger.chatList();
						$("section#main header h1").html("Chats");
						break;
					case "people":
						//this.messenger.peopleList();
						$("section#main header h1").html("People");
						break;
					case "me":
						//this.messenger.me();
						$("section#main header h1").html("Me");
						break;
				}
				break;
			case "chat":
				switch(article){
					case "one":
						this.messenger.chatWith(data);
						break;					
				}
				break;
		}
	}
	
	this.popup = function(id){
		$(".popup#"+id).fadeIn(200);
	}
	
	this.popdown = function(obj){
		$(obj).closest(".popup").fadeOut(200);
	}
	
	this.start = function(){
		var section = $.isEmptyObject(this.xmpp.settings) ? "wizard" : "login";
		var article = $.isEmptyObject(this.xmpp.settings) ? "welcome" : "connecting";
		this.sectionShow(section, article);
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
