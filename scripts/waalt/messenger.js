define(function(){
	return new Messenger();
});

function Messenger(){

	this.capabilities = new Object();
	this.state = "active";
	this.lastnot = null;

	this.Chat = function(jid){
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
			ul.append("<li onclick=\"app.sectionShow('chat', 'one', '"+person.jid+"')\" id=\""+person.jid+"\" class=\"person\">"
				+"<span class=\"avatar\"><img id=\""+person.jid+"\" src=\"img/foovatar.png\" /></span>"
				+"<span class=\"name\">"+name+"</span>"
				+"<span class=\"show "+show+"\"></span>"
				+"<span class=\"status\">"+status+"</span>"
			+"</li>");
		}
		this.avatarize();
	}
	
	this.chatList = function(){
		var ul = $("section#main>article#list ul");
		var totalUnread = 0;
		ul.empty();
		for(i=this.list.length-1;i>=0;i--){
			if(this.list[i].messages.length){
				var person = app.xmpp.connection.roster.findItem(this.list[i].jid);
				var name = person.name != null ? person.name : person.jid;
				var status = "Disconnected";
				var show = "na";
				for(j in person.resources){
					status = person.resources[j].status;
					show = person.resources[j].show || "a";
					break;
				}
				var last = this.list[i].messages[this.list[i].messages.length-1].text;
				last = last.length > 42 ? last.substring(0, 42) + "..." : last;
				var unread = this.unread(i);
				totalUnread += unread;
				ul.append("<li onclick=\"app.messenger.chatWith('"+person.jid+"')\" id=\""+person.jid+"\" class=\"person\">"
					+"<span class=\"avatar\"><img id=\""+person.jid+"\" src=\"img/foovatar.png\" /></span>"
					+"<span class=\"name\">"+name+"</span>"
					+"<span class=\"unread\">"+(unread > 0 ? "+" + unread : "")+"</span>"
					+"<span class=\"show "+show+"\"></span>"
					+"<span class=\"status\">"+last+"</span>"
				+"</li>");
			}
		}
		if(totalUnread)$("section#main > header #totalUnread").html("+"+totalUnread).fadeIn("fast");
		else $("section#main > header #totalUnread").hide();
		this.avatarize();
	}
	
	this.chatWith = function(jid){
		var ci = this.find(jid);
		if(ci<0){
			var newChat = new this.Chat(jid);
			this.list.push(newChat);
		}else{
			this.pull(ci);	
		}
		this.capabilities.CSN = -1;
		this.render();
		Lungo.Router.section("chat");
		app.save();
	}
	
	this.render = function(what){
		switch(what){
			case "presence":
				if(this.list.length){
					var person = app.xmpp.connection.roster.findItem(this.list[this.list.length-1].jid);
					var name = person.name != null ? person.name : person.jid;
					var j = -1;
					status = "Disconnected";
					show = "na";
					for(i in person.resources){
						var status = person.resources[i].status;
						var show = person.resources[i].show || "a";
						break;
					}
					$("section#chat>header span.name").html(name);
					$("section#chat>header span.status").html(status);
					$("section#chat>header span.show").removeClass("chat a away xa dnd na").addClass(show);
					$("section#chat>header span.avatar").html("<img id=\""+person.jid+"\" src=\"img/foovatar.png\" />");
					this.avatarize();
				}
				break;
			case "messages":
				var chat = this.list[this.list.length-1];
				var ul = $("section#chat>article#one>ul#messages");
				var pType;
				if(chat.messages.length){
					var html;
					for(i in chat.messages){
						var msg = chat.messages[i];
						var text = /*chat.messages[i].html ||*/ chat.messages[i].text;
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
		console.log(e);
		var jid = this.list[this.list.length-1].jid;
		var text = $("section#chat>article#one div#text").text().replace(/^\s+/g,'').replace(/\s+$/g,'');
		var html = $("section#chat>article#one div#text").html();
		var dom = $("section#chat>article#one div#text").get(0).childNodes[0];
		var date = new Date();
		var stamp = date.getUTCFullYear()+"-"+("0"+(date.getUTCMonth()+1)).slice(-2)+"-"+("0"+(date.getUTCDate())).slice(-2)+"T"+("0"+(date.getUTCHours())).slice(-2)+":"+("0"+(date.getUTCMinutes())).slice(-2)+":"+("0"+(date.getUTCSeconds())).slice(-2)+"Z";
		var localstamp = date.getFullYear()+"-"+("0"+(date.getMonth()+1)).slice(-2)+"-"+("0"+(date.getDate())).slice(-2)+"T"+("0"+(date.getHours())).slice(-2)+":"+("0"+(date.getMinutes())).slice(-2)+":"+("0"+(date.getSeconds())).slice(-2)+"Z";
		if(text.length){
			app.xmpp.send(jid, text, dom);
			var newMessage = new this.Message(Strophe.getBareJidFromJid(app.xmpp.connection.jid), jid, text, html, localstamp);
			this.list[this.list.length-1].messages.push(newMessage);
			$("section#chat>article#one div#text").empty();
			this.state = "active";
			this.render("messages");
			$("audio#sent").get(0).play();
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
			console.log("TEXT OR HTML");
			var date = new Date();
			var stamp = tree.children("delay").attr("stamp") ? this.localize(tree.children("delay").attr("stamp")) : date.getFullYear()+"-"+("0"+(date.getMonth()+1)).slice(-2)+"-"+("0"+(date.getDate())).slice(-2)+"T"+("0"+(date.getHours())).slice(-2)+":"+("0"+(date.getMinutes())).slice(-2)+":"+("0"+(date.getSeconds())).slice(-2)+"Z";
			console.log(text);
			var newMessage = new this.Message(from, to, text, html, stamp);
			var ci = this.find(from);
			if(ci<0){
				var newChat = new this.Chat(from);
				newChat.messages.push(newMessage);
				this.list.push(newChat);
				$("audio#newchat").get(0).play();
			}else{
				this.list[ci].messages.push(newMessage);
				//this.pull(ci);
				$("audio#received").get(0).play();
			}
			if(app.curSection=="chat" && app.curArticle=="one")this.render("messages");
			else if(app.curSection=="main")this.chatList();
			if(document.hidden){
				this.lastnot = navigator.mozNotification.createNotification(from, newMessage.text, app.messenger.avatars[from] || "img/foovatar.png");
				this.lastnot.show();
			}
			app.save();
		}
		if(composing){
			$("section#chat>article#one #typing").show();
		}else if(paused){
			$("section#chat>article#one #typing").hide();
		}else console.log("UNKNOWN");
	}
	
	this.avatarize = function(){
		$("span.avatar img").each(function(i, el){
			var jid = el.id;
			if(app.messenger.avatars[jid]){
				$(el).attr("src", app.messenger.avatars[jid]);
			}else app.xmpp.connection.vcard.get(function(data){
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
		var jid = Strophe.getBareJidFromJid(app.xmpp.connection.jid);
		var vCard = $(app.xmpp.vCard);
		art.find("div#vcard h1").html(jid);
		art.find("div#vcard h2").html(vCard.find("FN").text());
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
	
	this.personAdd = function(){
		var jid = $("#personAdd input#jid").val();
		var nickname = $("#personAdd input#nickname").val();
		if(jid){
			app.xmpp.connection.roster.add(jid, nickname, false, false);
			$("#personAdd input").val("");
			$("#personAdd").hide();
		}else alert("No LOQUI user or JabberID specified!");
	}
	
	$("section#chat>article#one div#text").keydown(function(e){
		switch(e.which){
			case 13:
				e.preventDefault();
				app.messenger.say();
				break;
			case 107:
				e.preventDefault();
				app.xmpp.connection.disconnect();
				break;
		}
	});
	$("section#chat>article#one div#text").keyup(function(e){
		if(app.messenger.state != "composing" && e.which != 13){
			app.xmpp.csnSend(app.messenger.list[app.messenger.list.length-1].jid, "composing");
			app.messenger.state = "composing";
		}
		if(app.messenger.state != "paused" && (e.which == 8 || e.which == 46) && $(e.target).text().length<1){
			app.xmpp.csnSend(app.messenger.list[app.messenger.list.length-1].jid, "paused");
			app.messenger.state = "paused";
		}
	});
	
	$("section#main > article#me div#status input#status").keydown(function(e){
		switch(e.which){case 13:app.messenger.presenceSet();break;}
	});
	
	
}
