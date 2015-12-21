function TrackWrapper(audio) {
  this.track = new Audio('/res/audio/' + audio.name);
  this.track.preload = 'auto';
  this.startAfter = audio.startAfter;
  this.duration = audio.duration;
  this.start = audio.start;
  this.end = audio.end;
  this.loop = (this.end - this.start) < this.duration;
}

TrackWrapper.prototype.play = function (offsetMS) {
  this.clock.addOneShotTimer(function () {
    this.startAt(offsetMS);
  }, math.max(this.startAfter - offsetMS, 0));
};

TrackWrapper.prototype.pause = function () {
  if (this.track.paused) {
    this.track.play();
  } else {
    this.track.pause();
  }
};

TrackWrapper.prototype.setClock = function (timeClock) {
  this.clock = timeClock;
};

TrackWrapper.prototype.startAt = function (msOffset) {
  if (this.start + msOffset >= this.duration) {
    return;
  }

  this.clock.addOneShotTimer(function () {
    this.track.currentTime = msOffset + this.start;
    this.track.autoplay = true;
    this.track.play();
  }, 0);
  var playWindow = this.end - this.start;
  this.clock.addOneShotTimer(function () {
    this.track.stop();
    // infinite loop check
    if (this.loop) {
      this.startAt(0);
    }
  }, playWindow - msOffset % playWindow);
};