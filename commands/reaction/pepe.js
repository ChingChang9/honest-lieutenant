const Command = require("@/client/command.js");
const kSoftImage = require("@/scripts/kSoftImage.js");
const mentionReact = require("@/scripts/mentionReact.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "pepe",
			group: "reaction",
			description: "Sends pepe",
			throttling: {
				usages: 5,
				duration: 10
			}
		});
	}

	async run(message) {
		const imageEmbed = await kSoftImage("pepe");
		const fullEmbed = mentionReact(message, "", imageEmbed);
		message.embed(fullEmbed);
	}
};