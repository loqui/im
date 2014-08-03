var FB = {

  appId: '528942200534414',
  
  start: function () {
    FB.login();
  },
  
  login: function () {
    var code = this.get('code');
    if (code) {
      var token = this.getToken(code);
      if (token) {
        var account = new Account({
          token: token,
          provider: 'facebook',
          resource: 'LoquiIM',
          enabled: true,
          chats: [],
          roster: []
        });
        account.test();
      } else {
        window.location.replace('https://www.facebook.com/dialog/oauth?client_appId=' + FB.appId + '&redirect_uri=https://app.loqui.com/facebookEP&scope=xmpp_login,read_mailbox&display=popup');
      }
    }
  },
  
  getToken: function (code) {
    var params = '?code=' + code;
    var req = new XMLHttpRequest({
      mozAnon: true,
      mozSystem: true
    });
    req.open('GET', 'https://app.loqui.im/fbToken' + params, false);
    req.send();
    var res = req.responseText.split('&');
    var vars = {};
    res.forEach(function (e, i, a) {
      var [key, value] = e.split('=');
      vars[key] = value;
    });
    return vars.access_token;
  },
  
  get: function (key) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0; i<vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == key){
        return pair[1];
      }
    }
    return(false);
  }
  
}

FB.start();

function explode(delimiter, string, limit) {
         var emptyArray = { 0: '' };
        
        // third argument is not required
        if ( arguments.length < 2 ||
            typeof arguments[0] == 'undefined' || typeof arguments[1] == 'undefined' ) {
            return null;
        }
     
        if ( delimiter === '' || delimiter === false ||
            delimiter === null ) {
            return false;
        }
        
        if ( typeof delimiter == 'function' || typeof delimiter == 'object' ||
            typeof string == 'function' || typeof string == 'object' ) {
            	return emptyArray;    
        }
     
        if ( delimiter === true ) {
            delimiter = '1';
        }  
        
        if (!limit) {
            return string.toString().split(delimiter.toString());
        } else {
            // support for limit argument        
        	var splitted = string.toString().split(delimiter.toString());
            var partA = splitted.splice(0, limit - 1);
            var partB = splitted.join(delimiter.toString());
            partA.push(partB);
            return partA;   
        }   
};

var UTF8 = {
  encode: function(s){
    for(var c, i = -1, l = (s = s.split("")).length, o = String.fromCharCode; ++i < l;
    s[i] = (c = s[i].charCodeAt(0)) >= 127 ? o(0xc0 | (c >>> 6)) + o(0x80 | (c & 0x3f)) : s[i]
    );
    return s.join("");
  },
  decode: function(s){
    for(var a, b, i = -1, l = (s = s.split("")).length, o = String.fromCharCode, c = "charCodeAt"; ++i < l;
    ((a = s[i][c](0)) & 0x80) &&
    (s[i] = (a & 0xfc) == 0xc0 && ((b = s[i + 1][c](0)) & 0xc0) == 0x80 ?
    o(((a & 0x03) << 6) + (b & 0x3f)) : o(128), s[++i] = "")
    );
    return s.join("");
  }
};
