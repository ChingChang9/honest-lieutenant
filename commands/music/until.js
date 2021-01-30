const Command = require("@/client/command.js");
const formatTime = require("@/scripts/formatTime.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "until",
			group: "music",
			aliases: ["time", "til", "ut"],
			description: "Estimates the time until a song plays",
			format: "<song-index>",
			guildOnly: true,
			arguments: [
				{
					key: "untilIndex",
					parse: untilIndex => parseInt(untilIndex),
					validate: untilIndex => {
						if (isNaN(untilIndex)) return "please enter a number!";
						return true;
					}
				}
			]
		});
	}

	run(message, { untilIndex }) {
		const dispatcher = message.guild.voice?.dispatcher;
		if (!dispatcher) {
			return message.reply("I'm not playing anything!");
		}

		const queue = message.guild.queue;
		const played = message.guild.played;

		if (untilIndex < played) {
			return message.reply("that song is already played");
		} else if (untilIndex === played) {
			return message.reply("I'm currently playing that song right now, duh 🙄");
		} else if (!queue[untilIndex - 1]) {
			return message.reply("the track doesn't exist");
		}

		let timeLeft = queue[played - 1].duration - message.guild.voice.songElapsed;
		for (let counter = played; counter < untilIndex - 1; counter++) {
			timeLeft += parseInt(queue[counter].duration);
		}

		message.say(`\`${ formatTime(timeLeft) }\` until \`${ queue[untilIndex - 1].title }\` plays`);
	}
};