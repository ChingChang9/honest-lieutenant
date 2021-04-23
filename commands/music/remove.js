const Command = require("@/client/command.js");
const firebase = require("@/workers/firebase.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "remove",
			group: "music",
			aliases: ["rm", "delete"],
			description: "Remove some track(s) from the queue",
			format: "<song-index> [song-index]",
			examples: [
				{
					input: "2",
					explanation: "Remove the second song in the queue"
				},
				{
					input: "2 6",
					explanation: "Remove song 2 to 6"
				},
				{
					input: "6, 2",
					explanation: "Also remove song 2 to 6 :D"
				}
			],
			guildOnly: true,
			arguments: [
				{
					key: "index1",
					parse: index1 => parseInt(index1),
					validate: index1 => !isNaN(index1) || "Please enter a number"
				},
				{
					key: "index2",
					default: 0,
					parse: index2 => parseInt(index2),
					validate: index2 => !isNaN(index2) || "The second index is not a number!"
				}
			]
		});
	}

	run(message, { index1, index2 }) {
		if (index1 > message.guild.queueKeys.length && index2 === 0) {
			return message.reply("The index doesn't exist!");
		}
		index2 = Math.min(index2 || index1, message.guild.queueKeys.length);

		if (index1 === index2 && index1 === message.guild.played && message.guild.voice?.dispatcher) {
			return message.reply("Bruh I'm playing that right now. I can't delete the current track 🙄🙄");
		}

		removeRange(message.guild, Math.min(index1, index2) - 1, Math.max(index1, index2) - 1);
		message.react("👍🏽");
	}
};

function removeRange(guild, index1, index2) {
	let removedCount = 0;
	let newQueue = {};
	for (let index = 0; index < guild.queueKeys.length; index++) {
		if (index >= index1 && index <= index2 && (index !== guild.played || !guild.voice?.dispatcher)) {
			newQueue[guild.queueKeys[index]] = null;
			if (index <= guild.played) removedCount++;
		} else {
			newQueue[guild.queueKeys[index]] = guild.queue[index];
		}
	}
	firebase.updateGuildValue(guild.id, {
		queue: newQueue,
		played: guild.played - removedCount
	});
}