function Scheduler(s) {
  this.schedule = s;
  this.schedule.forEach(function onProcess(current, index, array) {
    this.track = new Audio('/res/audio/' + current.name);
    this.track.currentTime = current.seekTo;
    this.track.loop = current.loop;
    this.track.preload = 'auto';
    this.startAfter = current.startAfter;
  });
}

Scheduler.prototype = {
  play() {
    setTimeout(function () {
      this.track.autoplay = true;
      this.track.play();
    }, this.startAfter ? this.startAfter : 0);
  }
}
