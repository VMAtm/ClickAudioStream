function Clock() {
  this._timeMS = 0;
  this._lastUpdateWallclockTimeMS = undefined;
  this._lastDeltaMS = undefined;
  this._paused = false;
  this._timerManager = new TimerManager(this);
}

Clock.prototype.destroy = function () {
  this._timerManager.destroy();
  delete this._timerManager;
  delete this._timeMS;
  delete this._lastUpdateWallclockTimeMS;
  delete this._lastDeltaMS;
  delete this._paused;
};

// current time in MS
Clock.prototype.getTimeMS = function () {
  return this._timeMS;
};

Clock.prototype.getLastDeltaMS = function () {
  return this._lastDeltaMS;
};

// returns timer destroyer function
Clock.prototype.addOneShotTimer = function (timeoutMS, callback, context) {
  return this._timerManager.addOneShot(timeoutMS, callback, context);
};

Object.defineProperty(Clock.prototype, 'paused', {
  get: function () {
    return this._paused;
  },
  set: function (value) {
    if (this._paused && !value) {
      // unpause
      // Skip paused time
      this._lastUpdateWallclockTimeMS = Date.now();
    } else if (!this._paused && value) {

    }
    this._paused = value;
  }
});

/*
 * Called to synchronize with Date.now()
 * returns time delta ms
 */
Clock.prototype.update = function () {
  if (this._paused) return;

  //if (libutil.isUndef(this._lastUpdateWallclockTimeMS)) {
  if (this._lastUpdateWallclockTimeMS === undefined) {
    // Initialize just on the first update - perfect accuracy
    this._lastUpdateWallclockTimeMS = Date.now();
  }
  var deltaMS = Date.now() - this._lastUpdateWallclockTimeMS;
  this._timeMS += deltaMS;
  this._timerManager.update();
  this._lastUpdateWallclockTimeMS = Date.now();
  this._lastDeltaMS = deltaMS;
  return deltaMS;
};

Clock.prototype.reset = function () {
  this.destroy();
  Clock.call(this);
};