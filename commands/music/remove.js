const Command = require("@/client/command.js");
const firebase = require("@/workers/firebase.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "remove",
			group: "music",
			aliases: ["rm", "delete"],
			description: "Removes a song from the queue",
			format: "<song-index> [song-index]",
			examples: [
				{
					input: "2",
					explanation: "Removes the second song in the queue"
				},
				{
					input: "2 6",
					explanation: "Removes song 2 to 6"
				},
				{
					input: "6, 2",
					explanation: "Also removes song 2 to 6 :D"
				}
			],
			guildOnly: true,
			arguments: [
				{
					key: "index1",
					parse: index1 => parseInt(index1),
					validate: index1 => !isNaN(index1) || "please enter a number"
				},
				{
					key: "index2",
					default: 0,
					parse: index2 => parseInt(index2),
					validate: index2 => !isNaN(index2) || "the second index is not a number!"
				}
			]
		});
	}

	async run(message, { index1, index2 }) {
		const played = message.guild.played;
		const queueKeys = message.guild.queueKeys;
		const queueRef = await message.guild.queueRef.once("value");
		const queue = queueRef.val();

		if (index1 > queueKeys.length) {
			return message.reply(`the ${ index2 ? "" : "first " }index doesn't exist!`);
		}
		index2 = Math.min(index2 || index1, queueKeys.length);

		if (index1 === index2 && index1 === played && message.guild.voice?.dispatcher) {
			return message.reply("bruh I'm playing that right now. I can't delete the current track 🙄🙄");
		}

		removeRange(message.guild, queue, queueKeys, played, Math.min(index1, index2), Math.max(index1, index2));
		message.react("👍🏽");
	}
};

function removeRange(guild, queue, queueKeys, played, index1, index2) {
	let count = 0;
	for (let index = index1; index <= index2; index++) {
		if (index !== played || !guild.voice?.dispatcher) queue[queueKeys[index - 1]] = null;
		if (index <= played) count++;
	}
	firebase.updateGuildValue(guild.id, {
		played: played - count
	});
	guild.queueRef.set(queue);
}