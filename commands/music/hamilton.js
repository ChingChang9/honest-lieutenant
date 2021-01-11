const Command = require("@/client/command.js");
const addPlaylist = require("@/scripts/addPlaylist.js");

module.exports = class HamiltonCommand extends Command {
	constructor(client) {
		super(client, {
			name: "hamilton",
			group: "music",
			aliases: ["ham"],
			description: "Queues the entire Hamilton soundtrack!! 😃😃",
			format: "[original/cut]",
			guildOnly: true,
			arguments: [
				{
					key: "version",
					prompt: "What version do you want?",
					type: "string",
					oneOf: ["original", "cut"],
					default: "original"
				}
			]
		});
	}

	run(message, { version }) {
		const playList = version === "original" ? "https://www.youtube.com/playlist?list=PLeLze2eDTIzM0wJ4Oe-FRgZCpkmn9Y8o3" :
			"https://www.youtube.com/playlist?list=PL3e0JLen9XhaNicHQRYvSGNwehFRllN8T";
		addPlaylist.exec(message, playList);
	}
};