function Scheduler(s) {
  this.schedule = s;
  this.initialize();
  return this;
}

Scheduler.prototype = {
  currentlyPlaying: [],
  paused: false,
  playlist: [],
  schedule: [],
  initialize: function () {
    this.schedule.forEach(function (current, index, array) {
      var track = new Audio('/res/audio/' + current.name);
      track.loop = current.loop;
      track.preload = 'auto';
      track.currentTime = current.seekTo;
      this.playlist.push(track);
    });
  },
  play: function() {
    this.playlist.forEach(function (current, index, array) {
      setTimeout(function () {
        this.currentlyPlaying.push(current);
        current.autoplay = true;
        current.play();
      }, this.schedule[index].startAfter ? this.schedule[index].startAfter : 0);
    });
  },
  togglePause: function () {
    this.paused = !this.paused;
    this.currentlyPlaying.forEach(function (current, index, array) {
      if (current.paused) {
        current.play();
      } else {
        current.pause();
      }
    });
  }
}
