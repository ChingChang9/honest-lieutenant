module.exports = {
	_timeouts: new Map(),
	_dispatchers: new Map(),

	setTimeout(guildId, timeout) {
		this._timeouts.set(guildId, timeout);
	},
	getTimeout(guildId) {
		return this._timeouts.get(guildId);
	},
	setDispatcher(guildId, dispatcher) {
		this._dispatchers.set(guildId, dispatcher);
	},
	getDispatcher(guildId) {
		return this._dispatchers.get(guildId);
	}
};