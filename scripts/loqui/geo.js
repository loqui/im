'use strict';

var Geo = {

  curPos: null,
  cb: null,

  Pos: function (lat, long, accuracy) {
    this.lat = lat;
    this.long = long;
    this.accuracy = accuracy;
  },
  
  posGet: function (cb) {
    if (navigator && navigator.geolocation) {
      Lungo.Notification.show('map-marker', _('Geolocating'));
      navigator.geolocation.getCurrentPosition(Geo.success, Geo.error, {
        enableHighAccuracy : true,
        timeout : 30000
      });
    } else {
      Tools.log('Geolocation is not supported.');
    }
    Geo.cb = cb;
  },
  
  success: function (pos) {
    Geo.curPos = new Geo.Pos(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy);
    Lungo.Notification.hide();
    Tools.log("You are in " + Geo.curPos.lat + "N " + Geo.curPos.long + "E.\n Accuracy is " + Geo.curPos.accuracy + "m");
    Geo.cb(Geo.curPos);
  },
  
  error: function (err) {
    if (err.code == 1) {
      Lungo.Notification.error(_('Error'), _('LocationDenied'), 'exclamation-sign');
    } else if (err.code == 2) {
      Lungo.Notification.error(_('Error'), _('LocationUnavailable'), 'exclamation-sign');
    } else if (err.code == 3) {
      Lungo.Notification.error(_('Error'), _('LocationTimedout'), 'exclamation-sign');
    } else {
      Lungo.Notification.error(_('Error'), null, 'exclamation-sign');
    }
  },
  
  distance: function (a, b) {
    var R = 6371; // km
    var dLat = (b[0]-a[0]).toRad();
    var dLon = (b[1]-a[1]).toRad();
    var lat1 = a[0].toRad();
    var lat2 = b[0].toRad();
    var ta = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var tc = 2 * Math.atan2(Math.sqrt(ta), Math.sqrt(1-ta)); 
    var d = R * tc;
    return d;
  }
  
}

/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}
