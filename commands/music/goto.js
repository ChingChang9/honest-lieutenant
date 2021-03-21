const Command = require("@/client/command.js");
const addSong = require("@/scripts/addSong.js");
const votePlay = require("@/scripts/votePlay.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "goto",
			group: "music",
			aliases: ["gt"],
			description: "Play a specific track in the queue",
			format: "<song-index>",
			guildOnly: true,
			arguments: [
				{
					key: "index",
					parse: index => index === "farewell" ? index : parseInt(index),
					validate: index => !isNaN(index) || index === "farewell" || "please enter a number!"
				}
			]
		});
	}

	run(message, { index })  {
		if (index === "farewell") {
			return addSong(message, "https://www.youtube.com/watch?v=3zbGMcsCtjg");
		}

		const queue = message.guild.queue;
		index = parseInt(index) - 1;

		if (!queue[index]) return message.reply("The track doesn't exist");

		votePlay(message, queue, message.guild.played - 1, index, `Vote on jumping to \`${ queue[index].title }\``, "☑️");
	}
};