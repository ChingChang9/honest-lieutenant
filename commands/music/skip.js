const Command = require("@/client/command.js");
const votePlay = require("@/scripts/votePlay.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "skip",
			group: "music",
			aliases: ["s", "sk", "next", "forward"],
			description: "Skips to the next song",
			format: "[#-of-songs-to-skip]",
			guildOnly: true,
			arguments: [
				{
					key: "skip",
					default: 1,
					parse: skip => parseInt(skip),
					validate: skip => {
						if (isNaN(skip)) return "please enter a number!";
						return true;
					}
				}
			]
		});
	}

	run(message, { skip }) {
		const queue = message.guild.queue;
		const index = message.guild.played - 1;

		votePlay(message, queue, index, index + skip, `Vote on skipping \`${ queue[index].title }\``, "⏩");
	}
};