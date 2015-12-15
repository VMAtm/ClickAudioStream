function TrackWrapper(audio) {
  this.track = new Audio('/res/audio/' + audio.name);
  this.track.preload = 'auto';
  this.startAfter = audio.startAfter;
  this.start = audio.start;
  this.end = audio.end;
  this.duration = audio.duration;
  this.loop = this.end - this.start < this.duration;
}

TrackWrapper.prototype.play = function() {
  setTimeout(function () {
    this.startAt(0);
  }, this.startAfter);
};

TrackWrapper.prototype.pause = function () {
  if (this.track.paused) {
    this.track.play();
  } else {
    this.track.pause();
  }
}

TrackWrapper.prototype.startAt = function(msOffset) {
  if (this.start + msOffset >= this.duration) {
    return;
  }

  setTimeout(function() {
    this.track.currentTime = msOffset + this.start;
    this.track.autoplay = true;
    this.track.play();
  }, 0);
  setTimeout(function() {
    this.track.stop();
    // infinite loop check
    if (this.loop) {
      this.startAt(0);
    }
  }, this.end - this.start - msOffset % (this.end - this.start));
}