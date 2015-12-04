module.exports.TimerManager = TimerManager;

var _ = require('underscore');
var Timer = require('./Timer.js').Timer;

function TimerManager(clock) {
    this._clock = clock;
    this._orderedTimers = [];
    this._orderedTimers2 = [];
}

TimerManager.prototype.destroy = function() {
    // Protect from call during timer callback call
    setTimeout(function() {
        _.each(this._orderedTimers, function(timer) {
            timer.destroy();
        });
        delete this._clock;
        delete this._orderedTimers;
        delete this._orderedTimers2;
    }.bind(this), 0);
};

TimerManager.prototype.update = function() {
    var curTimeMS = this._clock.getTimeMS();
    // Protect from creation of timers during callbacks calls
    var tmp = this._orderedTimers;
    this._orderedTimers = this._orderedTimers2;
    this._orderedTimers2 = tmp;

    while(this._orderedTimers2.length) {
        var timer = this._orderedTimers2[0];
        if (timer.getExpireTSMS() <= curTimeMS) {
            timer.fire();
        } else {
            this._addTimerToSortedList(timer);
        }
        this._orderedTimers2.splice(0, 1);
    }
    // Invariant: this._orderedTimers2 is always empty on return
};

// returns timer destroyer function
TimerManager.prototype.addOneShot = function(timeoutMS, callback, context) {
    var expireTSMS = this._clock.getTimeMS() + timeoutMS;
    var newTimer = new Timer(expireTSMS, callback, context);
    this._addTimerToSortedList(newTimer);
    return this._timerDestroyer.bind(this, newTimer);
};

TimerManager.prototype._addTimerToSortedList = function(newTimer) {
    var newTimerIx = 0;
    for(var timerIx = 0; timerIx < this._orderedTimers.length; ++timerIx) {
        var timer = this._orderedTimers[timerIx];
        if (timer.getExpireTSMS() < newTimer.getExpireTSMS()) {
            newTimerIx = timerIx + 1;
        } else break;
    }
    this._orderedTimers.splice(newTimerIx, 0, newTimer);
};

TimerManager.prototype._timerDestroyer = function(timer) {
    timer.clearCallback();
};