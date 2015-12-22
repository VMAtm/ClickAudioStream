function TrackWrapper(audio) {
  this._playbackStopTimerDestroyer = null;
  this._clock = null;
  this._isPlaying = false;
  this._html5Audio = new Audio('/res/audio/' + audio.name);
  this._html5Audio.preload = 'auto';
  // All the timings are in MS
  this._playbackStartTime = audio.startAfter;
  this._playbackDuration = audio.duration;
  this._html5AudioCutStart = audio.start;
  this._html5AudioCutEnd = audio.end;
}

TrackWrapper.prototype.destroy = function() {
  this.stop();
  delete this._isPlaying;
  delete this._playbackStopTimerDestroyer;
  delete this._html5Audio;
  delete this._playbackStartTime;
  delete this._playbackDuration;
  delete this._html5AudioCutStart;
  delete this._html5AudioCutEnd;
};

/*
 * @offsetMS: offset on the global playback timline.
 *            not offset inside audio track.
 */
TrackWrapper.prototype.play = function (offsetMS) {
  this._clock.addOneShotTimer(offsetMS - this._clock.getTimeMS(),
  function () {
    this._isPlaying = true;
    this._playAt(offsetMS - this._playbackStartTime);
  }, this);
};

TrackWrapper.prototype.pause = function () {
  if (!this._beforeStop()) return;
  this._html5Audio.pause();
};

TrackWrapper.prototype.stop = function() {
  if (!this._beforeStop()) return;
  this._html5Audio.src = '';
  this._html5Audio.load();
}

TrackWrapper.prototype.setClock = function (clock) {
  this._clock = clock;
};

TrackWrapper.prototype._playAt = function(trackPlaybackStartOffset) {
  var html5AudioTrackPlaybackStartOffset =
      (trackPlaybackStartOffset % this._playbackDuration) + this._html5AudioCutStart;
  this._html5Audio.currentTime = html5AudioTrackPlaybackStartOffset / 1000;
  this._html5Audio.autoplay = true;
  this._html5Audio.play();

  var playbackDurationFromStartOffset =
      this._playbackDuration - trackPlaybackStartOffset;
  this._playbackStopTimerDestroyer = this._clock.addOneShotTimer(
    playbackDurationFromStartOffset, this.stop, this
  );

  var ONE_LOOP_PLAYBACK_DURATION = this._html5AudioCutEnd - this._html5AudioCutStart;
  if ((trackPlaybackStartOffset + playbackDurationFromStartOffset) < ONE_LOOP_PLAYBACK_DURATION)
      return;

  var html5AudioTimeToNextLoop =
      this._html5AudioCutEnd - html5AudioTrackPlaybackStartOffset;
  this._clock.addOneShotTimer(html5AudioTimeToNextLoop, restartLoop, this);

  function restartLoop() {
    if (!this._isPlaying)
      return; // Also protects from destroy() call
    this._html5Audio.currentTime = this._html5AudioCutStart / 1000;
    this._clock.addOneShotTimer(
      ONE_LOOP_PLAYBACK_DURATION, restartLoop, this
    );
  }
};

TrackWrapper.prototype.isPlayedAt = function(offsetMS) {
  return (this._playbackStartTime <= offsetMS)
      && ((this._playbackStartTime + this._playbackDuration) >= offsetMS);
};

TrackWrapper.prototype._beforeStop = function() {
  if (!this._isPlaying)
      return false;

  this._playbackStopTimerDestroyer &&
    this._playbackStopTimerDestroyer();
  this._isPlaying = false;
  return true;
};
