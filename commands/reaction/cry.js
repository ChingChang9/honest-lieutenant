const Command = require("@/client/command.js");
const tenorGif = require("@/scripts/tenorGif.js");
const mentionReact = require("@/scripts/mentionReact.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "cry",
			group: "reaction",
			aliases: ["sob"],
			description: "Aweee what happened? You start crying 🥺🥺",
			format: "[message]",
			throttling: {
				usages: 3,
				duration: 10
			}
		});
	}

	async run(message) {
		const imageEmbed = await tenorGif("anime cry");
		const fullEmbed = mentionReact(message, "", imageEmbed);
		message.embed(fullEmbed);
	}
};