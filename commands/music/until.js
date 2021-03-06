const Command = require("@/client/command.js");
const { secondsToString } = require("@/scripts/formatTime.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "until",
			group: "music",
			aliases: ["time", "til", "ut"],
			description: "Estimate the time until a track plays",
			format: "<song-index>",
			guildOnly: true,
			arguments: [
				{
					key: "untilIndex",
					parse: untilIndex => parseInt(untilIndex),
					validate: untilIndex => !isNaN(untilIndex) || "Please enter a number!"
				}
			]
		});
	}

	run(message, { untilIndex }) {
		const dispatcher = message.guild.voice?.dispatcher;
		if (!dispatcher) return message.reply("I'm not playing anything!");

		const queue = message.guild.queue;
		const played = message.guild.played;

		if (untilIndex < played) {
			return message.reply("That song is already played");
		} else if (untilIndex === played) {
			return message.reply("I'm currently playing that song right now, duh 🙄");
		} else if (!queue[untilIndex - 1]) {
			return message.reply("The track doesn't exist");
		}

		let timeLeft = queue[played - 1].duration - message.guild.voice.songElapsed;
		for (let counter = played; counter < untilIndex - 1; counter++) {
			timeLeft += parseInt(queue[counter].duration);
		}

		message.say(`\`${ secondsToString(timeLeft) }\` until \`${ queue[untilIndex - 1].title }\` plays`);
	}
};