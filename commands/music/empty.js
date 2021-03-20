const Command = require("@/client/command.js");
const { emptyQueue } = require("@/config.json");
const firebase = require("@/workers/firebase.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "empty",
			group: "music",
			aliases: ["clear"],
			description: "Clear all entries in the queue",
			guildOnly: true
		});
	}

	run(message) {
		if (!message.guild.voice?.dispatcher) {
			firebase.updateGuildValue(message.guild.id, emptyQueue);
		} else {
			const played = message.guild.played;

			let newQueue = {};
			newQueue[message.guild.queueKeys[played - 1]] = message.guild.queue[played - 1];
			firebase.updateGuildValue(message.guild.id, {
				queue: newQueue,
				played: 1
			});
		}
		message.react("👍🏽");
	}
};