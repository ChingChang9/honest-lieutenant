module.exports = {
  setTimeout(guildId, timeout) {
    this._timeouts[guildId] = timeout;
  },
  getTimeout(guildId) {
    return this._timeouts[guildId];
  },
  setDispatcher(guildId, dispatcher) {
    this._dispatchers[guildId] = dispatcher;
  },
  getDispatcher(guildId) {
    return this._dispatchers[guildId];
  },
  _timeouts: {},
  _dispatchers: {}
};