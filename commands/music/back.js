const Command = require("@/client/command.js");
const votePlay = require("@/scripts/votePlay.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "back",
			group: "music",
			aliases: ["b", "previous", "prev"],
			description: "Play the previous track",
			format: "[#-of-songs-to-back]",
			voiceOnly: true,
			arguments: [
				{
					key: "back",
					default: 1,
					parse: back => parseInt(back),
					validate: back => !isNaN(back) || "Please enter a number!"
				}
			]
		});
	}

	run(message, { back }) {
		const queue = message.guild.queue;
		const index = message.guild.played - 1;

		if (!queue) message.reply("The queue is empty!");

		const toIndex = Math.max(index - back, 0);
		votePlay(message, queue, index, toIndex, `Vote on rewinding to \`${ queue[toIndex].title }\``, "⏪");
	}
};