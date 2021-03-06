const Command = require("@/client/command.js");
const addPlaylist = require("@/scripts/addPlaylist.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "hamilton",
			group: "music",
			aliases: ["ham"],
			description: "Queue the entire Hamilton soundtrack!! 😃😃",
			format: "[original/outtakes/instrumental]",
			voiceOnly: true,
			arguments: [
				{
					key: "version",
					oneOf: ["original", "outtakes", "instrumental"],
					default: "outtakes"
				}
			]
		});
	}

	run(message, { version }) {
		const playList = version === "outtakes" ? "https://www.youtube.com/playlist?list=PLeLze2eDTIzM0wJ4Oe-FRgZCpkmn9Y8o3" :
			version === "instrumental" ? "https://www.youtube.com/playlist?list=PL4QruBuFRA69zo9ycMNxZ_PtqgJHAqZuS" :
			"https://www.youtube.com/playlist?list=PL3e0JLen9XhaNicHQRYvSGNwehFRllN8T";
		addPlaylist(message, playList);
	}
};