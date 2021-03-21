const Command = require("@/client/command.js");
const addSong = require("@/scripts/addSong.js");
const addPlaylist = require("@/scripts/addPlaylist.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "play",
			group: "music",
			aliases: ["p", "add", "a"],
			description: "Add some track(s) to the music queue",
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
			default: "playlist-length: `100`",
			voiceOnly: true,
			arguments: [
				{
					key: "searchString",
					parse: searchString => searchString.match(/^<http/) && searchString.match(/>/) ? searchString.slice(1).replace(">", "") : searchString
				}
			]
		});
	}

	async run(message, { searchString }) {
		const playlistId = searchString.match(/^http.+playlist\?list=(.+)&?/)?.[1];
		if (playlistId) return addPlaylist(message, playlistId, searchString.split(" ")[1]);

		addSong(message, searchString);
	}
};