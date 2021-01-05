const Command = require("@/client/command.js");
const axios = require("axios");
const { ksoftAuth } = require("@/config.json");
const translate = require("@/scripts/translate.js");

module.exports = class LyricsCommand extends Command {
	constructor(client) {
		super(client, {
			name: "lyrics",
			group: "music",
			aliases: ["ly"],
			description: "Displays the lyrics of the current song",
			format: "[original/translate]",
			examples: [
				{
					input: "",
					explanation: "Displays the lyrics in its language"
				},
				{
					input: "translate",
					explanation: "Displays the English translation of the lyrics"
				}
			],
			guildOnly: true,
			arguments: [
				{
					key: "language",
					oneOf: ["original", "translate"],
					validate: (_, message) => {
						if (!message.guild.voice?.dispatcher) {
							return "I'm not playing anything!";
						}
						return true;
					},
					default: "original"
				}
			]
		});
	}

	async run(message, { language }) {
		const [videoTitle, videoUrl] = getVideoInfo(message);

		const data = await axios("https://api.ksoft.si/lyrics/search", {
			headers: {
				Authorization: `Bearer ${ ksoftAuth }`
			},
			params: {
				q: videoTitle,
				limit: 1
			}
		}).then(response => response.data.data[0]);

		let lyrics = data.lyrics;
		const songTitle = data.name;
		const thumbnailUrl = data.album_art;

		if (language === "translate") {
			lyrics = await translate.exec(lyrics);
		}

		let start = 0;
		let end = 0;
		while (end < lyrics.length) {
			end = start + 2048;
			if (lyrics.length > end) {
				while (lyrics[--end] !== "\n");
			}
			message.embed({
				title: start === 0 ? songTitle : null,
				url: start === 0 ? videoUrl : null,
				thumbnail: start === 0 ? { url: thumbnailUrl } : null,
				description: lyrics.slice(start, end),
				footer: end >= lyrics.length ? { text: "Lyrics provided by KSoft.Si" } : null
			});
			start = end + 1;
		}
	}
};

function getVideoInfo(message) {
	const queue = message.guild.queue;
	const index = message.guild.played - 1;
	return [queue[index].title, queue[index].videoUrl];
}