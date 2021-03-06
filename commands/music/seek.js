const Command = require("@/client/command.js");
const playSong = require("@/scripts/playSong.js");
const { stringToSeconds } = require("@/scripts/formatTime.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "seek",
			group: "music",
			aliases: ["jump"],
			description: "Jump to a timestamp of the current track",
			format: "<timestamp>",
			examples: [
				{
					input: "1:20",
					explanation: "Jump to 1:20 of the song"
				},
				{
					input: "80",
					explanation: "Also jump to 1:20 of the song"
				},
				{
					input: "0:80",
					explanation: "Once again jump to 1:20 of the song"
				}
			],
			voiceOnly: true,
			arguments: [
				{
					key: "timestamp",
					parse: stringToSeconds,
					validate: timestamp => !isNaN(timestamp) ||  "That's an invalid timestamp!"
				}
			]
		});
	}

	async run(message, { timestamp }) {
		const queue = message.guild.queue;
		const index = message.guild.played - 1;

		const connection = await message.member.voice.channel.join();
		connection.voice.setSelfDeaf(true);

		if (timestamp >= queue[index].duration) {
			return message.reply("The timestamp is past the duration of the song!");
		}

		playSong(message, connection, queue, index, timestamp);
	}
};