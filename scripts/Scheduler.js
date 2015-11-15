function Scheduler(s) {
  this.schedule = s;
  this.schedule.forEach(function onProcess(current, index, array) {
    this.track = new Audio('?file=' + current.name);
    this.track.currentTime = current.seekTo;
    this.track.loop = current.loop;
    this.startAfter = current.startAfter;
  });
}

Scheduler.prototype = {
  play() {
    setTimeout(function () {
      this.track.play();
    }, this.startAfter ? this.startAfter : 0);
  }
}