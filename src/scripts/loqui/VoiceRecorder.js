/**
* @file Holds {@link VoiceRecorder}
* @author [Jovan Gerodetti]{@link https://github.com/TitanNano}
* @license AGPLv3
*/

var VoiceRecorder = {

  /**
   * @type {Blaze.Var<string>}
   */
  duration : new Blaze.Var(''),

  /**
   * @type {Blaze.Var<boolean>}
   */
  processing : new Blaze.Var(false),

  /**
   * @type {Blaze.Var<number>}
   */
  recording : new Blaze.Var(null),

  /**
   * @type {Promise}
   * @private
   */
  _audioPromise : null,

  /**
   * @type {boolean}
   * @private
   */
  _active : false,

  /**
   * @type {AudioStream}
   * @private
   */
  _audioStream : null,

  /**
   * @type {MediaRecorder}
   * @private
   */
  _audioRecorder : null,

  /**
   * @private
   */
  getDurationSeconds : function(){
    let [minutes, seconds] = this.duration.get().split(':').map(item => parseInt(item));

    return minutes * 60 + seconds;
  },

  /**
   * Starts the audio recording.
   */
  start : function() {

    if (this.processing.get() || this.recording.get()) { return; }

    this._audioPromise = null;
    this._active = true;
    this.duration.set('00:00');

    navigator.getUserMedia({audio : true}, (stream) => {
      if (this._active) {
        var start = Date.now();
        var touch = null;

        this._audioStream = stream;
        this._audioRecorder = new MediaRecorder(stream);

        var interval = setInterval(() => {
          var time = (new Date());
          time.setTime(Date.now() - start);

          this.duration.set((time.getMinutes() < 10 ? '0' : '') + time.getMinutes() + ':' + (time.getSeconds() < 10 ? '0' : '') + time.getSeconds());
        }, 1000);

        this.recording.set(interval);
        this._audioRecorder.start();

        Tools.log('recording now!');
      } else {
        stream.stop();
      }
    }, function(e){
      console.error(e);
    });
  },

  /**
   * Returns a promise for the recorded audio blob.
   * May return null if there is no finsihed recording.
   */
  getBlob : function(){
    if (this._audioPromise) {
      this.processing.set(true);

      return this._audioPromise.then((blob) => {
        console.log(blob);

        this.processing.set(false);
        this._audioPromise = null;

        return { blob : blob, duration : this.getDurationSeconds() };
      });
    } else {
      return Promise.resolve(null);
    }
  },

  /**
   * Stops the current recording.
   */
  stop : function(cb){

    if (this._active) {
      this._active = false;
      cb(this.getDurationSeconds());
    }

    if (this._audioStream && this._audioRecorder) {
      this._audioPromise = new Promise((resolve) => {
        this._audioRecorder.ondataavailable = e => resolve(e.data);
      });

      this._audioRecorder.stop();
      this._audioStream.stop();

      this._audioRecorder = null;
      this._audioStream   = null;

      clearInterval(this.recording.get());

      this.recording.set(null);
    }
  }
};
