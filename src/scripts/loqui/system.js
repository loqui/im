/* global Tools, Make */

/**
* @file Holds {@link System}
* @author [Jovan Gerodetti]{@link https://github.com/TitanNano}
* @license AGPLv3
*/

'use strict';

/**
 * Please place future feature detection in this namespace!
 *
 * @namespace System
 */
var System = Make({

  isFxOS : navigator.userAgent.search(/\((mobi|tablet).+Gecko/i) > -1,

  isGecko34 :  false,

  _make : function(){

    this.isGecko34 = this.getGeckoVersion() >= 34;

    // this alows us to enable CSS features only if the platform supports it.
    var configClasses = {
        'gecko-34' : this.isGecko34,
        'fxos' : this.isFxOS
    };

    document.body.className += ' ' + Object.keys(configClasses).filter(key => {
      return configClasses[key];
    }).join(' ');

    navigator.getUserMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
  },

  /**
   * Returns the current gecko version.
   *
   * @return {number}
   */
  getGeckoVersion : function(){
    var mo = navigator.userAgent.match(/firefox\/([0-9\.]+)$/i);
    return mo ? parseFloat(mo[1]) : 0;
  }

})();
