const Command = require("@/client/command.js");
const tenorGif = require("@/scripts/tenorGif.js");
const mentionReact = require("@/scripts/mentionReact.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "pepe",
			group: "reaction",
			description: "Send a pepe gif",
			format: "[message]",
			throttling: {
				usages: 5,
				duration: 10
			}
		});
	}

	async run(message) {
		const imageEmbed = await tenorGif("pepe");
		const fullEmbed = mentionReact(message, "", imageEmbed);
		message.embed(fullEmbed);
	}
};