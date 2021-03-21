const Command = require("@/client/command.js");
const { secondsToString } = require("@/scripts/formatTime.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "info",
			group: "music",
			aliases: ["np", "current"],
			description: "Display information of the current track",
			guildOnly: true
		});
	}

	run(message) {
		const dispatcher = message.guild.voice?.dispatcher;
		if (!dispatcher) return message.reply("I'm not playing anything!");

		const queue = message.guild.queue;
		const index = message.guild.played - 1;

		const [elapsed, duration, ratio] = getInfo(message.guild.voice.songElapsed, queue[index].duration);

		message.embed({
			title: queue[index].title,
			url: queue[index].videoUrl,
			thumbnail: {
				url: queue[index].thumbnail
			},
			description: `${ elapsed } ${ "▬".repeat(ratio) }🔘${ "▬".repeat((9 - ratio)) } ${ duration }`,
			fields: [
				{
					name: "Requested by",
					value: queue[index].requester,
					inline: true
				},
				{
					name: "Index",
					value: index + 1,
					inline: true
				}
			],
			footer: {
				text: "Ching Chang © 2021 Some Rights Reserved",
				icon_url: "attachment://icon.jpg"
			}
		});
	}
};

function getInfo(elapsedTimestamp, duration) {
	const ratio = duration === "0" ? 9 : Math.floor(elapsedTimestamp / duration * 10);

	return [secondsToString(elapsedTimestamp), secondsToString(duration), ratio];
}