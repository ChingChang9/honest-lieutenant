const Command = require("@/client/command.js");
const Message = require("@/client/message.js");
const ytdl = require("ytdl-core");
const { google } = require("googleapis");
const { scrapePlaylist } = require("youtube-playlist-scraper");
const { youtubeAuth } = require("@/config.json");
const addSong = require("@/scripts/addSong.js");
const addPlaylist = require("@/scripts/addPlaylist.js");

const youtube = google.youtube({
	version: "v3",
	auth: youtubeAuth
});
const trashes = [
	"100 gecs",
	"ppcocaine"
];

module.exports = class PlayCommand extends Command {
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
					input: "<playlist-link>",
					explanation: "Queues the first 10 songs in the playlist"
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
		if (!songUrl) return message.reply("sorry I couldn't find this song 😬😬. Maybhaps give me the link?");
		if (song.match(/^http.+playlist\?list=(.+)&?/)) return queuePlaylist(message, songUrl, song.split(" ")[1]);

		const songInfo = await ytdl.getInfo(songUrl).catch(error => {
			if (error.message === "Not a YouTube domain") return message.reply("I can only play songs from Youtube");
			if (error.message === "Video unavailable") return message.reply("the video is unavailable");
			if (error.name === "TypeError") return message.reply("this link is invalid");
			return message.error(error);
		});

		if (songInfo instanceof Message) return;

		const trashMessage = checkTrash(songInfo.videoDetails.title.toLowerCase());
		if (trashMessage) return message.reply(trashMessage);

		addSong.exec(message, songInfo);
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

	if (result.data.items) {
		return `https://www.youtube.com/watch?v=${ result.data.items[0].id.videoId }`;
	}
}

function checkTrash(title) {
	const trash = trashes.some(trash => {
		if (title.includes(trash)) return trash;
	});

	if (trash) {
		const refusal = [
			`no ${ trash } please!`,
			`I refuse to queue ${ trash }`,
			`nah bro, not ${ trash }`,
			`${ trash }... this ain't it chief`
		];
		return refusal[Math.floor(Math.random() * refusal.length)];
	}
}

function queuePlaylist(message, url, number) {
	const id = url.match(/^http.+playlist\?list=(.+)&?/)[1];
	scrapePlaylist(id).then(response => {
		const urls = response.playlist.map((video) => video.url);
		addPlaylist.exec(message, urls, number);
	});
}