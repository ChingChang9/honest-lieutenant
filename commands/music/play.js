const Command = require("@/client/command.js");
let { google } = require("googleapis");
let { youtubeAuth } = require("@/config.json");
const addSong = require("@/scripts/addSong.js");
const addPlaylist = require("@/scripts/addPlaylist.js");

const youtube = google.youtube({
	version: "v3",
	auth: youtubeAuth
});
google = null;
youtubeAuth = null;
delete require.cache[require.resolve("googleapis")];

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "play",
			group: "music",
			aliases: ["p", "add", "a"],
			description: "Adds music to the music queue",
			format: "<song/playlist> [playlist-length]",
			examples: [
				{
					input: "let it go",
				},
				{
					input: "<song-link>"
				},
				{
					input: "<playlist-link>", // TODO: Default now 100. Also update addPlaylist to work with "all"
					explanation: "Queues the first 100 songs in the playlist"
				},
				{
					input: " <playlist-link> 4",
					explanation: "Queues the first 4 songs in the playlist"
				},
				{
					input: "<playlist-link> all",
					explanation: "Queues the entire playlist"
				}
			],
			default: "playlist-length: `10`",
			guildOnly: true,
			arguments: [
				{
					key: "song",
					validate: (_, message) => {
						if (!message.member.voice.channel) return "please only use this when you're in a voice channel";
						return true;
					}
				}
			]
		});
	}

	async run(message, { song }) {
		const songUrl = await getSongUrl(song);
		if (!songUrl) return message.reply("sorry I couldn't find this song 😬😬\nMaybhaps give me the link?");

		const playlistId = song.match(/^http.+playlist\?list=(.+)&?/)?.[1];
		if (playlistId) return addPlaylist(message, playlistId, song.split(" ")[1]);

		addSong(message, songUrl);
	}
};

async function getSongUrl(song) {
	if (song.match(/^http/)) return song;
	if (song.match(/^<http/) && song.match(/>/)) return song.slice(1).replace(">", "");

	const result = await youtube.search.list({
		part: "snippet",
		q: song,
		type: "video",
		maxResults: 1
	});

	if (result.data.items[0]) {
		return `https://www.youtube.com/watch?v=${ result.data.items[0].id.videoId }`;
	}
}