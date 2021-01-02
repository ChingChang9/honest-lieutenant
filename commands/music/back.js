const Command = require("@/client/command.js");
const firebase = require("@/scripts/firebase.js");
const votePlay = require("@/scripts/votePlay.js");

module.exports = class BackCommand extends Command {
	constructor(client) {
		super(client, {
			name: "back",
			group: "music",
			aliases: ["b", "previous", "prev"],
			description: "Plays the previous song",
			format: "[#-of-songs-to-back]",
			guildOnly: true,
			arguments: [
				{
					key: "back",
					default: 1,
					parse: back => parseInt(back),
					validate: back => {
						if (isNaN(back)) return "please enter a number!";
						return true;
					}
				}
			]
		});
	}

	run(message, { back }) {
		Promise.all([
			firebase.getQueue(message.guild.id),
			firebase.getItem(message.guild.id, "played")
		]).then(result => {
			const [queue, played] = result;
			const index = played - 1;

			if (!queue) message.reply("the queue is empty!");

			const toIndex = Math.max(index - back, 0);
			votePlay.exec(message, queue, index, toIndex, `Vote on rewinding to \`${ queue[toIndex].title }\``, "⏪");
		});
	}
};