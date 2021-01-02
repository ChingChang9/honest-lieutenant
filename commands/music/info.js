const Command = require("@/client/command.js");
const firebase = require("@/scripts/firebase.js");
const formatTime = require("@/scripts/formatTime.js");

module.exports = class InfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: "info",
			group: "music",
			aliases: ["np", "current"],
			description: "Displays information of the current song",
			guildOnly: true
		});
	}

	run(message) {
		const dispatcher = message.guild.dispatcher;
		if (!dispatcher) {
			return message.reply("I am not playing anything!");
		}

		Promise.all([
			firebase.getQueue(message.guild.id),
			firebase.getItem(message.guild.id, "played")
		]).then(async (result) => {
			const [queue, played] = result;
			const index = played - 1;

			const [elapsed, duration, ratio] = await getInfo(message.guild.id, dispatcher, queue[index].duration);

			message.embed({
				color: "#fefefe",
				author: {
					name: queue[index].channel,
					url: queue[index].channelUrl
				},
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
						value: played + 1,
						inline: true
					}
				],
				footer: {
					text: "Ching Chang © 2021 All Rights Reserved",
					icon_url: "attachment://icon.jpg"
				}
			});
		});
	}
};

async function getInfo(guildId, dispatcher, duration) {
	const seekTimestamp = await firebase.getItem(guildId, "seek");
	const elapsedTimestamp = Math.floor(dispatcher.streamTime / 1000) + seekTimestamp;
	const elapsed = formatTime.exec(elapsedTimestamp);
	const ratio = duration === "0" ? 9 : Math.floor(elapsedTimestamp / duration * 10);

	return [elapsed, formatTime.exec(duration), ratio];
}