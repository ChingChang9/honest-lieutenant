const { Structures } = require("discord.js");

module.exports = Structures.extend("VoiceState", VoiceState => {
	return class extends VoiceState {
		constructor(...args) {
			super(...args);
			this.dispatcher = null;
			this.timeout = null;
			this.seekTimestamp = 0;
			this.repeat = "off";
		}

		get songElapsed() {
			return Math.floor(this.dispatcher.streamTime / 1000) + this.seekTimestamp;
		}

	};
});