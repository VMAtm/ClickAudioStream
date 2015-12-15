function Scheduler(s) {
  this.schedule = s;
  this.currentlyPlaying = [];
  this.playlist = [];
  this.schedule = [];
  this.paused = false;
  this.initialize();
  return this;
}

Scheduler.prototype.initialize = function () {
  this.schedule.forEach(function (current) {
    this.playlist.push(new TrackWrapper(current));
  });
};

Scheduler.prototype.play = function() {
  this.playlist.forEach(function (current, index, array) {
    this.currentlyPlaying.push(current);
    current.play();
  });
};

Scheduler.prototype.togglePause = function () {
  this.paused = !this.paused;
  this.currentlyPlaying.forEach(function (current, index, array) {
    if (current.paused) {
      current.play();
    } else {
      current.pause();
    }
  });
};