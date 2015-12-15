function Timer(expireTSMS, callback, context) {
  this._expireTSMS = expireTSMS;
  this._callback = callback;
  this._context = context;
}

Timer.prototype.destroy = function () {
  this.clearCallback();
  delete this._expireTSMS;
};

Timer.prototype.getExpireTSMS = function () {
  return this._expireTSMS;
};

Timer.prototype.clearCallback = function () {
  delete this._callback;
  delete this._context;
};

Timer.prototype.fire = function () {
  this._callback && this._callback.call(this._context);
};