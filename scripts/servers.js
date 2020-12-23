module.exports = {
  setTimeout(guildId, timeout) {
    this.timeouts[guildId] = timeout;
  },
  getTimeout(guildId) {
    return this.timeouts[guildId];
  },
  setDispatcher(guildId, dispatcher) {
    this.dispatchers[guildId] = dispatcher;
  },
  getDispatcher(guildId) {
    return this.dispatchers[guildId];
  },
  timeouts: {},
  dispatchers: {}
};