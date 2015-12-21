function Scheduler(s) {
  this.schedule = s;
  this.currentlyPlaying = [];
  this.playlist = [];
  this.paused = false;
  this.initialize();
  this.clock = null;
  return this;
}

Scheduler.prototype.initialize = function () {
  this.schedule.forEach(function (current) {
    this.playlist.push(new TrackWrapper(current));
  });
};

Scheduler.prototype.play = function() {
  this.seek(0);
};

Scheduler.prototype.seek = function (offsetMS) {
  if (this.currentlyPlaying) {
    delete this.currentlyPlaying;
    this.currentlyPlaying = [];
  }
  if (this.clock) {
    this.clock.destroy();
  }

  this.clock = Clock();
  setTimeout(function () {
    if (!this.paused) {
      this.clock.update();
    }
  }, 30);
  this.playlist.forEach(function (current, index, array) {
    if (current.startAfter <= offsetMS && (current.startAfter + duration) >= offsetMS) {
      this.currentlyPlaying.push(current);
      current.setClock(this.clock);
      current.play(offsetMS);
    }
  });
};

Scheduler.prototype.togglePause = function () {
  this.paused = !this.paused;
  this.currentlyPlaying.forEach(function (current, index, array) {
    current.pause();
  });
};