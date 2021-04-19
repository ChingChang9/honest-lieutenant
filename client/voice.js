const { Structures } = require("discord.js");
const playSong = require("@/scripts/playSong.js");

module.exports = Structures.extend("VoiceState", VoiceState => class extends VoiceState {
	constructor(...args) {
		super(...args);
		this.dispatcher = null;
		this.timeout = null;
		this.seekTimestamp = 0;
		this.repeat = "off";
		this.filter = "";
		this.appliedFilterNames = new Set();
		this.appliedFilters = {};
		this.speed = 1;
		this.bass = 0;
		this.filters = {
			"8D": "apulsator=hz=0.09",
			Bassboost: "bass=g=9",
			Karaoke: "stereotools=mlev=0.024,bass=g=3,asubboost,loudnorm,volume=2.3",
			Nightcore: "aresample=48000,asetrate=48000*1.2",
			Normalizer: "loudnorm,volume=3",
			Vaporwave: "aresample=48000,asetrate=48000*0.84",
			Vibrate: "vibrato=f=6.5",
			WTF: "apulsator=hz=1,vibrato=f=3.5,tremolo,bass=g=7"
		};
	}

	get songElapsed() {
		return Math.floor(this.dispatcher.streamTime * this.speed / 1000) + this.seekTimestamp;
	}

	applyFilter(message, filterName, { newSpeed = this.speed, newBass = this.bass } = {}) {
		if (filterName !== "WTF") this.removeFilter("WTF", false);

		let action;
		if (this.appliedFilterNames.has(filterName) &&
		(newSpeed !== this.speed && newSpeed !== 1 || newBass !== this.bass && newBass !== 0)) {
			this.addFilter(filterName);
			action = "Updating";
		} else if (this.appliedFilterNames.has(filterName)) {
			this.removeFilter(filterName);
			action = "Removing";
		} else {
			if (filterName === "WTF") this.clearAllFilters(message, false);
			this.addFilter(filterName);
			action = "Applying";
		}

		this.filter = Object.values(this.appliedFilters).join(",");
		this.bass = newBass;

		if (this.dispatcher) {
			const seekTimestamp = Math.max(0, this.songElapsed - 1.5 * newSpeed);
			this.speed = newSpeed;
			playSong(message, this.dispatcher.player.voiceConnection, message.guild.queue, message.guild.played - 1, seekTimestamp, true);
			message.embed(`${ action } ${ filterName } Filter...`, "loading");
		} else {
			this.speed = newSpeed;
			this.displayFilters(message);
		}
	}

	addFilter(filterName) {
		this.appliedFilterNames.add(filterName);
		this.appliedFilters[filterName] = this.filters[filterName];
	}

	removeFilter(filterName) {
		this.appliedFilterNames.delete(filterName);
		delete this.appliedFilters[filterName];
	}

	clearAllFilters(message, showMessge = true) {
		this.appliedFilterNames.clear();
		this.appliedFilters = {};
		this.filter = "";
		this.bass = 0;

		if (this.dispatcher) {
			const seekTimestamp = Math.max(0, this.songElapsed - 1.5);
			this.speed = 1;
			playSong(message, this.dispatcher.player.voiceConnection, message.guild.queue, message.guild.played - 1, seekTimestamp, true);
			if (showMessge) return message.embed("Removing all filters...", "loading");
		} else {
			this.speed = 1;
		}
	}

	displayFilters(message) {
		if (this.appliedFilterNames.size) {
			message.embed({
				title: "Applied Filters",
				description: Array.from(this.appliedFilterNames).map(filterName => {
					if (filterName === "Nightcore") return `Nightcore (${ Math.round((this.speed - 1) / 0.28 * 100) / 100 })`;
					if (filterName === "Vaporwave") return `Vaporwave (${ Math.round((1 - this.speed) / 0.32 * 100) / 100 })`;
					if (filterName === "Bassboost") return `Bassboost (${ this.bass })`;
					return filterName;
				}).join("\n")
			});
		} else {
			message.embed("No Filters Applied");
		}
	}
});