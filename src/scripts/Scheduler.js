function Scheduler(schedule) {
  this._playingTracks = [];
  this._allTracks = [];
  this._paused = false;
  this._clock = null;

  schedule.forEach(function (trackPlaybackDescription) {
    var track = new TrackWrapper(trackPlaybackDescription);
    this._allTracks.push(track);
  }, this);

  this._clockUpdateTimer = setInterval(
    this._updatePlaybackPosition.bind(this), 30
  );
}

Scheduler.prototype.destroy = function() {
  clearInterval(this._clockUpdateTimer);
  this._allTracks.forEach(function(track) {
    track.destroy();
  }, this);
  delete this._playingTracks;
  delete this._allTracks;
  delete this._paused;
  delete this._clock;
  delete this._clockUpdateTimer;
};

Scheduler.prototype.play = function() {
  if (this._paused) {
    this._clock.paused = false;
    // XXX should continue not restart if we were paused
    throw new Error('Not implemented');
  } else {
    this.seek(0);
  }
};

Scheduler.prototype.pause = function () {
  this._paused = true;
  this._playingTracks.forEach(function (track) {
    track.pause();
  });
  this._clock.paused = true;
};

Scheduler.prototype.seek = function (offsetMS) {
  this._paused = false;

  this._playingTracks.forEach(function(track) {
    track.pause();
  }, this);
  this._playingTracks = [];

  this._clock && this._clock.destroy();
  this._clock = new Clock();

  this._allTracks.forEach(function (track) {
    if (!track.isPlayedAt(offsetMS)) return;

    this._playingTracks.push(track);
    track.setClock(this._clock);
    track.play(offsetMS);
  }, this);
};

Scheduler.prototype._updatePlaybackPosition = function() {
  if (this._paused) return;
  if (!this._clock) return;
  this._clock.update();

  this._allTracks.forEach(function (track) {
    if (!track.isPlayedAt(this._clock.getTimeMS())) return;
    if (this._playingTracks.indexOf(track) !== -1) return;

    this._playingTracks.push(track);
    track.setClock(this._clock);
    track.play(this._clock.getTimeMS());
  }, this);
}
