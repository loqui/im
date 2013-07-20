'use strict';

var Messenger = {

  lastChat: null,
  
  onChatMessage: function (msg) {
    Messenger.msgProcess(msg);
    return true;
  },
  
  onSubRequest: function (msg) {
    XMPP.connection.roster.authorize(Strophe.getBareJidFromJid(msg.getAttribute('from')));
    return true;
  },
  
  presenceStart: function () {
    var show = XMPP.presence.show;
    var status = XMPP.presence.status;
    var msg = $pres();
    if (show!='a') {
      msg.c('show', {}, show);
    }
    if (status) {
      msg.c('status', {}, status);
    }
    msg.c('priority', {}, '127');
    XMPP.connection.send(msg.tree());
    App.light(show);
  },
  
  presenceUpdate: function(){
    var show = $$('section#main > article#me div#status select#show').val();
    //var status = $$('section#main > article#me div#status input#status').val();
    var status = $$('section#main > article#me div#status div#status[data-pretend=input-text]').text();
    if (App.connected) {
      var msg = $pres();
      if (show!='a') {
        msg.c('show', {}, show);
      }
      if (status) {
        msg.c('status', {}, status);
      }
      msg.c('priority', {}, '127');
      XMPP.connection.send(msg.tree());
      App.light(show);
    }
    XMPP.presence.show = show;
    XMPP.presence.status = status;
    Store.simple('xpresence', XMPP.presence);
  },
  
  render: function (what) {
    switch(what) {
      case 'chats':
        Messenger.chatsRender();
        break;
      case 'contacts':
        Messenger.contactsRender();
        break;
      case 'me':
        Messenger.meRender();
        break;
      case 'avatars':
        Messenger.avatarsRender();
        break;
      case 'presence':
        Messenger.presenceRender();
        break;
      case 'last':
        Messenger.lastRender();
        break;
    }
  },
  
  chatsRender: function () {
    var ul = $$('section#main>article#chats ul');
    if (Messenger.chats.length) {
      ul.empty();
      for (var i in Messenger.chats) {
        var chat = Messenger.chats[i];
        ul.prepend('<li data-jid= \'' + chat.jid + '\' data-unread=\'' + (chat.unread ? 1 : 0) + '\' class=\'person\'>'
        + '<span class=\'avatar\'><img id=\'' + chat.jid + '\' /></span>'
        + '<span class=\'name\'>' + chat.title + '</span>'
        + '<span class=\'show\'></span>'
        + '<span class=\'last\'>' + chat.last + '</span>'
        + '<span class=\'unread\'>+' + (chat.unread || 0) + '</span>'
        + '</li>');
      }
    } else {
      $$('section#main article#chats ul').html('<a href=\'#contacts\' data-router=\'article\' class=\'notyet\'>You have no chats yet. <br /><small>Why don\'t you ask your contacts if they can read you?</small></a>');
    }
  },
  
  contactsRender: function () {
    var ul = $$('section#main>article#contacts ul');
    if(XMPP.miniRoster.length) {
      ul.empty();
      for (var i in XMPP.miniRoster) {
        var person = XMPP.miniRoster[i];
        var name = person.name != null ? person.name : person.jid;
        ul.append('<li data-jid= \'' + person.jid + '\' class=\'person\'>'
          + '<span class=\'avatar\'><img id=\'' + person.jid + '\' /></span>'
          + '<span class=\'name\'>' + name + '</span>'
          + '<span class=\'show\'></span>'
          + '<span class=\'status\'></span>'
        +'</li>');
      }
    }
  },
  
  meRender: function () {
    var me = $$('section#main article#me');
    me.find('div#vcard span.avatar img').attr('id', XMPP.me.jid);
    me.find('div#vcard h1#fn').text(XMPP.me.fn);
    me.find('div#vcard h2#jid').text(Strophe.getBareJidFromJid(XMPP.me.jid));
    //me.find('div#status input#status').val(XMPP.presence.status);
    me.find('div#status div#status[data-pretend=input-text]').text(XMPP.presence.status);
    me.find('div#status select#show').val(XMPP.presence.show);
  },
  
  avatarsRender: function () {
    $$('span.avatar img:not([src])').each(function (i, el){
      var jid = Strophe.getBareJidFromJid(el.id);
      if (Messenger.avatars[jid]) {
        Store.recover(Messenger.avatars[jid], function (val) {
          if (val) {
            $$(el).attr('src', val);
          }
        });
      } else if (App.connected && navigator.onLine) {
        console.log('GETTING AVATAR FOR '+jid);
        XMPP.connection.vcard.get(function (data) {
          var vCard = $$(data).find('vCard');
          if (vCard.find('BINVAL').length) {
            var img = vCard.find('BINVAL').text();
            var type = vCard.find('TYPE').text();
            var avatar = 'data:'+type+';base64,'+img;
            $$(el).attr('src', avatar);
            Messenger.avatars[jid] = Store.save(avatar, function (index) {
              Store.simple('mavatars', Messenger.avatars);
            });
          }
        }, jid);
      }
    });
  },
  
  avatarSet: function (blob) {
    var reader = new FileReader();
    var jid = Strophe.getBareJidFromJid(XMPP.me.jid);
    reader.onload = function (event) {
      var img = new Image();
      img.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = 96;
        canvas.height = 96;
        canvas.getContext('2d').drawImage(img, 0, 0, 96, 96);
        var url = canvas.toDataURL();
        if ($$(XMPP.vcard).find('TYPE').length) {
          $$(XMPP.vcard).find('TYPE').text('image/png');
        $$(XMPP.vcard).find('BINVAL').text(url.split(',')[1]);
          $$('section#main article#me div#vcard img').attr('src', url);          
          XMPP.connection.vcard.set(function () {
            if (jid in Messenger.avatars) {
              Store.update(Messenger.avatars[jid], url);
            } else {
              Messenger.avatars[jid] = Store.save(url);
              Store.simple('mavatars', Messenger.avatars);
            }
          }, XMPP.vcard, jid);
        } else {
          alert('This account does not support avatar change yet.');
        }
      }
      img.src = event.target.result;
    }
    reader.readAsDataURL(blob);
  },
  
  presenceRender: function () {
    if (App.connected) {
      for (var i in XMPP.miniRoster) {
        var contact = XMPP.fullRoster[i];
        var show = 'na';
        var status = App.default.shows[show];
        for (var j in contact.resources) {
          show = contact.resources[Object.keys(contact.resources)[0]].show || 'a';
          status = contact.resources[Object.keys(contact.resources)[0]].status || App.default.shows[show];
          break;
        }
        XMPP.miniRoster[i].show = show;
        XMPP.miniRoster[i].status = status;
        var li = $$('section#main article.list [data-jid=\''+contact.jid+'\']');
        li.attr('data-show', show);
        li.find('.show').show().attr('data-show', show);
        li.find('.status').show().text(status);
        if (Messenger.lastChat == contact.jid) {
          var section = $$('section#chat');
          section.find('header .show').attr('data-show', show).show();
          section.find('header .status').text(status).show();
        }
      }
      if (Messenger.settings.disHide) {
        $$('section#main article#contacts').addClass('disHide');
      }
    } else {
      var section = $$('section');
      section.find('span.show').hide();
      section.find('span.status').hide();
      section.removeClass('disHide');
    }
  },
  
  lastRender: function () {
    var totalUnread = 0;
    for (var i in Messenger.chats) {
      var chat = Messenger.chats[i];
      var li = $$('section#main article#chats li[data-jid=\''+chat.jid+'\']');
      li.find('span.last').text(chat.last);
      li.attr('data-unread', chat.unread ? 1 : 0);
      li.find('span.unread').text('+' + chat.unread);
      if (chat.unread) {
        totalUnread += chat.unread;
      }
    }
    $$('body').attr('data-unread', totalUnread ? 1 : 0);
    $$('span.totalUnread').text('+' + totalUnread);
  },
  
  contactAdd: function () {
    if (App.connected) {
      var dialog = $$('section#dialog article#contactAdd');
      //var jid = dialog.find('input#jid').val();
      var jid = dialog.find('div#jid[data-pretend=input-text]').text();
      //var nickname = dialog.find('input#nickname').val();
      var nickname = dialog.find('div#nickname[data-pretend=input-text]').text();
      if (jid) {
        XMPP.connection.roster.add(jid, nickname, false, false);
        XMPP.connection.roster.subscribe(jid);
        //dialog.find('input').val('');
        dialog.find('[data-pretend=input-text]').empty();
        Lungo.Router.back();
        Lungo.Notification.show((nickname||jid)+' was added succesfully', 'check', 2);
      } else {
        alert('No user specified!');
      }
    } else {
      App.notNow('add contacts');
    }
  },
  
  contactEdit: function (jid) {
    var contact = Lungo.Core.findByProperty(XMPP.miniRoster, 'jid', jid);
    var dialog = $$('section#dialog article#contactEdit');
    var avatar = dialog.find('img.avatar');
    dialog.attr('data-jid', contact.jid);
    dialog.find('strong#jid').text(contact.jid);
    //dialog.find('input#nickname').val(contact.name || '');
	  if (contact.name) {
	    dialog.find('div#nickname[data-pretend=input-text]').text(contact.name);
	  }	else {
	    dialog.find('div#nickname[data-pretend=input-text]').empty();
	  }
    if (Messenger.avatars[contact.jid]) {
      Store.recover(Messenger.avatars[contact.jid], function (src) {
        avatar.attr('src', src);
      });
    } else {
      avatar.attr('src', 'img/foovatar.png');
    }
    App.dialog('contactEdit');
  },
  
  contactSave: function () {
    if (App.connected) {
	    var dialog = $$('section#dialog article#contactEdit');
	    var jid = dialog.attr('data-jid');
	    //var name = dialog.find('input#nickname').val();
	    var name = dialog.find('div#nickname[data-pretend=input-text]').text();
	    var contact = Lungo.Core.findByProperty(XMPP.miniRoster, 'jid', jid);
	    contact.name = name;
      Store.simple('xroster', XMPP.miniRoster, function () {
        XMPP.connection.roster.add(jid, name.length ? name : jid, false, false);
        $$('section#main article.list ul li[data-jid=\'' + jid + '\']').children('span.name').text(name);
        if (jid == Messenger.lastChat) {
          $$('section#chat > header span.name').text(name);
        }
        Lungo.Router.back();
        Lungo.Notification.show('Updated succesfully!', 'check', 2);
      });
    } else {
      App.notNow('edit contacts');
    }
  },
  
  contactDelete: function () {
    if (App.connected) {
    	var dialog = $$('section#dialog article#contactEdit');
      var jid = dialog.attr('data-jid');
      var name = dialog.find('div#nickname[data-pretend=input-text]').text() || jid;
      var will = confirm('Are sure you want to remove ' + name + ' from your contact list?');
      if (will) {
      	XMPP.connection.roster.remove(jid);
      	Lungo.Router.back();
        Lungo.Notification.show('Deleted succesfully!', 'remove', 2);
      }
    } else {
      App.notNow('delete contacts');
    }
  },
  
  chatShow: function (jid) {
    var section = $$('section#chat');
    var article = section.find('article#chat');
    var contact = Lungo.Core.findByProperty(XMPP.miniRoster, 'jid', jid);
    section.find('header .name').text(contact.name ? contact.name : jid);
    section.find('header .status').text(contact.status);
    section.find('header .show').attr('data-show', contact.show);
    if (Messenger.avatars[jid]) {
      Store.recover(Messenger.avatars[jid], function (src) {
        section.find('header .avatar').html('<img src=\'' + src + '\' />');
      });
    } else {
      section.find('header .avatar').empty();
    }
    Messenger.lastChat = jid;
  	Lungo.Router.section('chat');
  	$$('section#chat > article#chat > ul#messages').empty();
  	var data = Messenger.chatFind(jid);
  	data.unread = 0;
  	Messenger.lastRender();
  	var chat = new Chat(data.jid, data.title, data.multiuser, data.msgChunks);
  	chat.lastChunkRender();
  	Store.simple('mchats', Messenger.chats);
  },
  
  chatFind: function (jid) {
    return Lungo.Core.findByProperty(Messenger.chats, 'jid', jid);
  },
  
  chatIndex: function (jid) {
    var index;
    for (var i in Messenger.chats) {
      if (Messenger.chats[i].jid == jid) {
        index = i;
        break;
      }
    }
    return index;
  },
  
  chatPull: function (index) {
		var ul = $$('section#main > article#chats > ul');
		var li = ul.children('li[data-jid=\'' + Messenger.chats[index].jid + '\']')[0];
	  var temp = Messenger.chats[index];
	  Messenger.chats.splice(index, 1);
	  Messenger.chats.push(temp);
	  Store.simple('mchats', Messenger.chats);
		if (li) {
		  console.log("Moviendo...");
		  ul.prepend(li.outerHTML);
		  li.remove();
		} else console.log("No hay ná que mover...");
	},
  
  chatDelete: function (jid) {
    var index = Messenger.chatIndex(jid);
    var chat = Messenger.chats[index];
    for (var i in chat.msgChunks) {
      Store.drop(i);
    }
    Messenger.chats.splice(index, 1);
    $$('section#main > article#chats > ul li[data-jid=\'' + jid + '\']').remove();
    Store.simple('mchats', Messenger.chats);
    Lungo.Notification.show('Deleted succesfully!', 'remove', 2);
  },
  
  say: function () {
    var jid = Messenger.lastChat;
    var text = $$("section#chat>article#chat div#text").text().replace(/^\s+/g,'').replace(/\s+$/g,'');
    var date = new Date();
		var stamp = date.getUTCFullYear()+"-"+("0"+(date.getUTCMonth()+1)).slice(-2)+"-"+("0"+(date.getUTCDate())).slice(-2)+"T"+("0"+(date.getUTCHours())).slice(-2)+":"+("0"+(date.getUTCMinutes())).slice(-2)+":"+("0"+(date.getUTCSeconds())).slice(-2)+"Z";
		var localstamp = date.getFullYear()+"-"+("0"+(date.getMonth()+1)).slice(-2)+"-"+("0"+(date.getDate())).slice(-2)+"T"+("0"+(date.getHours())).slice(-2)+":"+("0"+(date.getMinutes())).slice(-2)+":"+("0"+(date.getSeconds())).slice(-2)+"Z";
		if (text.length) {
		  var msg = new Message(Strophe.getBareJidFromJid(XMPP.me.jid), jid, text, localstamp);
		  msg.send();
		  $$("section#chat>article#chat div#text").empty();
		  var index = Messenger.chatIndex(jid);
		  if (index) {
		    Messenger.chatPull(index);
		  }
		}
  },
  
  msgProcess: function (data) {
    var tree = $$(data);
    var from = Strophe.getBareJidFromJid(tree.attr('from'));
    var to = Strophe.getBareJidFromJid(tree.attr('to'));
    var body = tree.children("body").length ? tree.children("body").text() : null;
    var composing = tree.children("composing").length;
		var paused = tree.children("paused").length || tree.children("active").length;
		if (body) {
		  var date = new Date();
			var stamp = tree.children("delay").length ? Tool.localize(tree.children("delay").attr("stamp")) : date.getFullYear()+"-"+("0"+(date.getMonth()+1)).slice(-2)+"-"+("0"+(date.getDate())).slice(-2)+"T"+("0"+(date.getHours())).slice(-2)+":"+("0"+(date.getMinutes())).slice(-2)+":"+("0"+(date.getSeconds())).slice(-2)+"Z";
			var msg = new Message(from, to, body, stamp);
      msg.process();
      var index = Messenger.chatIndex(from);
		  if (index) {
		    Messenger.chatPull(index);
		  }
		}
  },
  
  toSendQ: function (stIndex) {
    Messenger.sendQ.push(stIndex);
    Store.simple('msendQ', Messenger.sendQ);
  }

}
