/**
 * function for the online help
 */

'use strict';

 var Help = {
   main: function() {
     if (App.platform === "FirefoxOS") {
       if (_('MainHelpFFOS') != '{{MainHelpFFOS}}') {
         Lungo.Notification.show('info-sign', _('MainHelpFFOS'));
       }
       else {
         Lungo.Notification.show('info-sign', 'No help available yet!');
       }
     }
     else if (App.platform === "UbuntuTouch") {
       if(_('MainHelpUT') != '{{MainHelpUT}}') {
         Lungo.Notification.show('info-sign', _('MainHelpUT'));
       }
       else {
         Lungo.Notification.show('info-sign', "Tap pencil, then 'Phone sync' and select contacts from addressbook to import them.");
       }
     }
   },

   contact: function() {
     if (App.platform === "FirefoxOS") {
       if (_('ContactHelpFFOS') != '{{ContactHelpFFOS}}') {
         Lungo.Notification.show('info-sign', _('ContactHelpFFOS'));
       }
       else {
         Lungo.Notification.show('info-sign', 'No help available yet!');
       }
     }
     else if (App.platform === "UbuntuTouch") {
       if(_('ContactHelpUT') != '{{ContactHelpUT}}') {
         Lungo.Notification.show('info-sign', _('ContactHelpUT'));
       }
       else {
         Lungo.Notification.show('info-sign', 'Tap avatar to have a big preview (repeat to close).');
       }
     }
   },

   muc: function() {
     if (App.platform === "FirefoxOS") {
       if (_('MucHelpFFOS') != '{{MucHelpFFOS}}') {
         Lungo.Notification.show('info-sign', _('MucHelpFFOS'));
       }
       else {
         Lungo.Notification.show('info-sign', 'No help available yet!');
       }
     }
     else if (App.platform === "UbuntuTouch") {
       if (_('MucHelpUT') != '{{MucHelpUT}}') {
         Lungo.Notification.show('info-sign', _('MucHelpUT'));
       }
       else {
         Lungo.Notification.show('info-sign', 'Tap avatar to have a big preview (repeat to close).');
       }
     }
   },

   chat: function() {
     if (App.platform === "FirefoxOS") {
       if (_('ChatHelpFFOS') != '{{ChatHelpFFOS}}') {
         Lungo.Notification.show('info-sign', _('ChatHelpFFOS'));
       }
       else {
         Lungo.Notification.show('info-sign', 'No help available yet!');
       }
     }
     else if (App.platform === "UbuntuTouch") {
       if (_('ChatHelpUT') != '{{ChatHelpUT}}') {
         Lungo.Notification.show('info-sign', _('ChatHelpUT'));
       }
       else {
         Lungo.Notification.show('info-sign', 'Tap pics to view (repeat to close), tap videos to view (then 1x to play / 2x to pause, x to close), tap audio to listen (then 1x to play / pause, x to close).');
       }
     }
   }

 };
