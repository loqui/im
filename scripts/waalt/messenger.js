define(function(){
	return new Messenger();
});

function Messenger(){

	this.capabilities = new Object();
	this.state = "active";
	this.lastNot = null;
	this.lastChat = 0;

	this.Chat = function(jid, title){
		this.title = title;
		this.jid = jid;
		this.messages = new Array();
	}
	
	this.Message = function(from, to, text, html, stamp){
		this.from = from;
		this.to = to;
		this.text = text;
		this.html = html;
		this.read = false;
		this.stamp = stamp;
	}
	
	this.peopleList = function(){
		var ul = $("section#main>article#people ul");
		ul.empty();
		for(i in app.xmpp.roster){
			var person = app.xmpp.roster[i];
			var name = person.name != null ? person.name : person.jid;
			status = "Disconnected";
			show = "na";
			for(i in person.resources){
				var status = person.resources[i].status;
				var show = person.resources[i].show || "a";
				break;
			}
			ul.append("<li onclick=\"app.messenger.chatWith('"+person.jid+"')\" id=\""+person.jid+"\" class=\"person\">"
				+"<span class=\"avatar\"><img id=\""+person.jid+"\" src=\"img/foovatar.png\" /></span>"
				+"<span class=\"name\">"+name+"</span>"
				+"<span class=\"show "+show+"\"></span>"
				+"<span class=\"status\">"+status+"</span>"
			+"</li>");
			app.xmpp.rosterdict[person.jid] = name;
		}
		this.avatarize();
	}
	
	this.chatList = function(){
		var ul = $("section#main>article#chats ul");
		var totalUnread = 0;
		if(this.list.length > 0){
			ul.empty();
			for(i=this.list.length-1;i>=0;i--){
				if(this.list[i].messages.length){
					var chat = this.list[i];
					var status = "Disconnected";
					var show = "na";
					if(navigator.onLine){
						var person = app.xmpp.connection.roster.findItem(this.list[i].jid);
						for(j in person.resources){
							status = person.resources[j].status;
							show = person.resources[j].show || "a";
							break;
						}
					}
					var last = this.list[i].messages[this.list[i].messages.length-1].text.replace(/&(?!\w+([;\s]|$))/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
					last = last.length > 42 ? last.substring(0, 42) + "..." : last;
					var unread = this.unread(i);
					totalUnread += unread;
					ul.append("<li onclick=\"app.messenger.chatWith('"+chat.jid+"')\" id=\""+chat.jid+"\" class=\"person\">"
						+"<span class=\"avatar\"><img id=\""+chat.jid+"\" src=\"img/foovatar.png\" /></span>"
						+"<span class=\"name\">"+chat.title+"</span>"
						+"<span class=\"unread\">"+(unread > 0 ? "+" + unread : "")+"</span>"
						+"<span class=\"show "+show+"\"></span>"
						+"<span class=\"status\">"+last+"</span>"
					+"</li>");
				}
			}
			if(totalUnread){
				$("section#main > header #totalUnread").text("+"+totalUnread).fadeIn("fast");
				app.numify(totalUnread);
			}else{
				$("section#main > header #totalUnread").hide();
				app.numify();
			}
			this.avatarize();
		}
	}
	
	this.chatWith = function(jid){
		var ci = this.find(jid);
		if(ci<0){
			var title = app.xmpp.rosterdict[jid];
			var newChat = new this.Chat(jid, title);
			this.list.push(newChat);
		}else{
			this.pull(ci);	
		}
		this.capabilities.CSN = -1;
		Lungo.Router.section("chat");
		this.lastChat = jid;
		this.render();
		$("section#chat>article#one #typing").hide();
		app.save();
	}
	
	this.render = function(what){
		switch(what){
			case "presence":
				if(this.list.length){
					var ci = this.find(this.lastChat);
					if(ci > -1){
						var name = app.messenger.list[ci].title;
						var jid = app.messenger.list[ci].jid;
						var j = -1;
						status = "Disconnected";
						show = "na";
						if(navigator.onLine){
							var person = app.xmpp.connection.roster.findItem(jid);
							for(i in person.resources){
								var status = person.resources[i].status;
								var show = person.resources[i].show || "a";
								break;
							}
						}
						$("section#chat>header span.name").text(name);
						$("section#chat>header span.status").text(status);
						$("section#chat>header span.show").removeClass("chat a away xa dnd na").addClass(show);
						$("section#chat>header span.avatar").html("<img id=\""+jid+"\" src=\"img/foovatar.png\" />");
						this.avatarize();
					}
				}
				break;
			case "messages":
				var chat = this.list[this.find(this.lastChat)];
				var ul = $("section#chat>article#one>ul#messages");
				var pType;
				if(chat.messages.length){
					var html;
					for(i in chat.messages){
						var msg = chat.messages[i];
						var text = this.urlHL(chat.messages[i].text.replace(/&(?!\w+([;\s]|$))/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
						var type = msg.from == chat.jid ? "in" : "out";
						var day = this.day(msg.stamp);
						var stamp = "<span class=\"stamp\">"+this.hour(msg.stamp)+"</span>";
						if(pType == undefined)html = ("<li class=\""+type+"\"><div class=\"msg\">"+stamp+text+"</div>");
						else if(pType == type){
							if(day > this.day(chat.messages[i-1].stamp))html+="</li><span class=\"daychange\">"+day[1]+"/"+day[2]+"</span><li class=\""+type+"\">";
							html += ("<div class=\"msg\">"+stamp+text+"</div>");
						}
						else{
							if(day > this.day(chat.messages[i-1].stamp))html+="</li><span class=\"daychange\">"+day[1]+"/"+day[2]+"</span>";
							else html+="</li>";
							html += ("<li class=\""+type+"\"><div class=\"msg\">"+stamp+text+"</div>");
						}
						pType = type;
						chat.messages[i].read = true;
					}
					ul.html(html+"</li><hr class=\"end\" />");
					$(ul).animate({scrollTop:ul[0].scrollHeight}, 'fast');
					this.chatList();
					app.save();
				}else ul.empty();
				break;
			default:
				this.render("presence");
				this.render("messages");
				break;
		}
	}
	
	this.find = function(jid){
		for(i=0;i<this.list.length;i++)if(this.list[i].jid == jid)return i;
		return -1;
	}
	
	
	this.pull = function(ci){
		var temp = this.list[ci];
		this.list.splice(ci, 1);
		this.list.push(temp);
	}
	
	this.unread = function(ci){
		var chat = this.list[ci];
		var unread = 0;
		if(chat.messages.length){
			for(var i in chat.messages){
				var msg = chat.messages[i];
				if(msg.read == false)unread++;
			}
		}
		return unread;
	}
	
	this.say = function(e){
		var jid = this.lastChat;
		var text = $("section#chat>article#one div#text").text().replace(/^\s+/g,'').replace(/\s+$/g,'');
		var html = $("section#chat>article#one div#text").html();
		var dom = $("section#chat>article#one div#text").get(0).childNodes[0];
		var date = new Date();
		var stamp = date.getUTCFullYear()+"-"+("0"+(date.getUTCMonth()+1)).slice(-2)+"-"+("0"+(date.getUTCDate())).slice(-2)+"T"+("0"+(date.getUTCHours())).slice(-2)+":"+("0"+(date.getUTCMinutes())).slice(-2)+":"+("0"+(date.getUTCSeconds())).slice(-2)+"Z";
		var localstamp = date.getFullYear()+"-"+("0"+(date.getMonth()+1)).slice(-2)+"-"+("0"+(date.getDate())).slice(-2)+"T"+("0"+(date.getHours())).slice(-2)+":"+("0"+(date.getMinutes())).slice(-2)+":"+("0"+(date.getSeconds())).slice(-2)+"Z";
		if(text.length){
			var newMessage = new this.Message(Strophe.getBareJidFromJid(app.xmpp.me.jid), jid, text, html, localstamp);
			this.list[this.find(jid)].messages.push(newMessage);
			$("section#chat>article#one div#text").empty();
			this.state = "active";
			this.render("messages");
			this.chatList();
			if(navigator.onLine){
				app.xmpp.send(newMessage);
				$("audio#sent").get(0).play();
			}else{
				Lungo.Notification.show("You are currently Offline, message will be sent when connected again.", "warning", 3);
				newMessage.stamp = stamp;
				this.sendQ.push(newMessage);
			}
			app.save();
		}
	}
	
	this.process = function(msg){
		var from = Strophe.getBareJidFromJid(msg.getAttribute('from'));
		var to = Strophe.getBareJidFromJid(msg.getAttribute('to'));
		var tree = $(msg);
		var text = tree.children("body").text();
		var html = tree.children("html").find("p").html() || null;
		var composing = tree.children("composing").length;
		var paused = tree.children("paused").length || tree.children("active").length;
		this.capabilities.CSN = (composing || paused);
		if(text || html){
			var date = new Date();
			var stamp = tree.children("delay").attr("stamp") ? this.localize(tree.children("delay").attr("stamp")) : date.getFullYear()+"-"+("0"+(date.getMonth()+1)).slice(-2)+"-"+("0"+(date.getDate())).slice(-2)+"T"+("0"+(date.getHours())).slice(-2)+":"+("0"+(date.getMinutes())).slice(-2)+":"+("0"+(date.getSeconds())).slice(-2)+"Z";
			var newMessage = new this.Message(from, to, text, html, stamp);
			var ci = this.find(from);
			if(ci<0){
				var newChat = new this.Chat(from, app.xmpp.rosterdict[from]);
				newChat.messages.push(newMessage);
				this.list.push(newChat);
				$("audio#newchat").get(0).play();
			}else{
				this.list[ci].messages.push(newMessage);
				this.pull(ci);
				$("audio#received").get(0).play();
			}
			if(document.hidden && navigator.mozNotification){
				this.lastNot = navigator.mozNotification.createNotification(from, newMessage.text, app.messenger.avatars[from] || "img/foovatar.png");
				this.lastNot.onclick = function(){
					app.messenger.chatWith(from);
				}
				this.lastNot.show();
			}
			app.save();
			if($("section#chat").hasClass("show") && from == this.lastChat)this.render("messages");
			else this.chatList();
		}
		if(composing && from == this.lastChat){
			$("section#chat>article#one #typing").show();
		}else if(paused && from == this.lastChat){
			$("section#chat>article#one #typing").hide();
		}
	}
	
	this.avatarize = function(){
		$("span.avatar img").each(function(i, el){
			var jid = el.id;
			if(app.messenger.avatars[jid]){
				$(el).attr("src", app.messenger.avatars[jid]);
			}else if(navigator.onLine) app.xmpp.connection.vcard.get(function(data){
				var vCard = $(data).find("vCard");
				var img = vCard.find('BINVAL').text();
				var type = vCard.find('TYPE').text();
				var avatar = "data:"+type+";base64,"+img;
				if(img && type){
					$(el).attr("src", avatar);
					app.messenger.avatars[jid] = avatar;
					app.save();
				}else $(el).attr("src", "img/foovatar.png");
			}, jid);
		});
	}
	
	this.me = function(){
		var art = $("section#main > article#me");
		art.find("div#vcard h1").text(app.xmpp.me.fn);
		art.find("div#vcard h2").text(app.xmpp.me.jid);
		art.find("div#status input#status").val(app.xmpp.presence.status);
		this.avatarize();
	}
	
	this.presenceSet = function(show){
		var show = show || app.xmpp.presence.show;
		var status = $("section#main > article#me div#status input#status").val();
		$("section#main > article#me div#status ul#show li."+show).addClass("selected").siblings().removeClass("selected");
		var msg = $pres();
		if(show!="a")msg.c("show", {}, show);
		if(status)msg.c("status", {}, status);
		app.xmpp.connection.send(msg.tree());
		app.xmpp.presence.show = show;
		app.xmpp.presence.status = status;
		app.save();
		this.me();
	}
	
	this.search = function(){
		alert("Not implemented yet");
	}
	
	this.hour = function(stamp){
		var hour = stamp.split("T");
		hour = hour[1].split(":");
		return hour[0]+":"+hour[1];
	}
	
	this.day = function(stamp){
		var day = stamp.split("T");
		day = day[0].split("-");
		return day;
	}
	
	this.localize = function(utc){
		var offset = new Date().getTimezoneOffset();
		var ymdhms = utc.split("T");
		var ymd = ymdhms[0].split("-");
		var hms = ymdhms[1].substr(0, ymdhms[1].length-1).split(":");
		var date = new Date(ymd[0], ymd[1]-1, ymd[2], hms[0], hms[1], hms[2]);
		date.setTime(date.getTime()-60000*offset);
		return date.getFullYear()+"-"+("0"+(date.getMonth()+1)).slice(-2)+"-"+("0"+(date.getDate())).slice(-2)+"T"+("0"+(date.getHours())).slice(-2)+":"+("0"+(date.getMinutes())).slice(-2)+":"+("0"+(date.getSeconds())).slice(-2)+"Z";
	}
	
	this.urlHL = function(text){
		var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
		return text.replace(exp,"<a href='$1' target='_blank'>$1</a>"); 
	}
	
	this.personAdd = function(){
		var jid = $("#personAdd input#jid").val();
		var nickname = $("#personAdd input#nickname").val();
		if(jid){
			app.xmpp.connection.roster.add(jid, nickname, false, false);
			app.xmpp.connection.roster.subscribe(jid);
			$("#personAdd input").val("");
			Lungo.Router.back();
			Lungo.Notification.show((nickname||jid)+" was added succesfully", "check", 2);
		}else alert("No LOQUI user or JabberID specified!");
	}
	
	$("section#chat>article#one div#text").keydown(function(e){
		switch(e.which){
			case 13:
				e.preventDefault();
				app.messenger.say();
				break;
		}
	});
	$("section#chat>article#one div#text").keyup(function(e){
		if(app.messenger.state != "composing" && e.which != 13){
			app.xmpp.csnSend(app.messenger.lastChat, "composing");
			app.messenger.state = "composing";
		}
		if(app.messenger.state != "paused" && (e.which == 8 || e.which == 46) && $(e.target).text().length<1){
			app.xmpp.csnSend(app.messenger.lastChat, "paused");
			app.messenger.state = "paused";
		}
	});
	
	$("section#main > article#me div#status input#status").keydown(function(e){
		switch(e.which){case 13:app.messenger.presenceSet();break;}
	});
	
	
}
