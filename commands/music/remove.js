const Command = require("@/client/command.js");
const firebase = require("@/scripts/firebase.js");

module.exports = class RemoveCommand extends Command {
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
					validate: index1 => {
						if (isNaN(index1)) return "please enter a number!";
						return true;
					}
				},
				{
					key: "index2",
					default: 0,
					parse: index2 => parseInt(index2),
					validate: index2 => {
						if (isNaN(index2)) return "the second index is not a number!";
						return true;
					}
				}
			]
		});
	}

	run(message, { index1, index2 }) {
		index2 = index2 || index1;
		Promise.all([
			firebase.database.ref(`${ message.guild.id }/queue`).once("value"),
			getCurrentIndex(message.guild)
		]).then(result => {
			const [queueRef, played] = result;
			const queue = queueRef.val();
			const timestamps = Object.keys(queue || {});

			if (index1 > timestamps.length) {
				return message.reply("the first index doesn't exist!");
			} else if (index2 > timestamps.length) {
				return message.reply("the second index doesn't exist!");
			}

			if (index1 === index2 && index1 === played) {
				return message.reply("bruh I'm playing that right now. I can't delete the current track 🙄🙄");
			}

			removeRange(message.guild.id, queue, timestamps, played, Math.min(index1, index2), Math.max(index1, index2));
		});
		message.react("👍🏽");
	}
};

function getCurrentIndex(guild) {
	if (guild.dispatcher) {
		return firebase.getItem(guild.id, "played");
	}

	return 0;
}

function removeRange(guildId, queue, timestamps, played, index1, index2) {
	let count = 0;
	for (let index = index1; index <= index2; index++) {
		if (index !== played) queue[timestamps[index - 1]] = null;
		if (index < played) count++;
	}
	firebase.updateValue(`${ guildId }/settings`, {
		played: played - count
	});
	firebase.database.ref(`${ guildId }/queue`).set(queue);
}