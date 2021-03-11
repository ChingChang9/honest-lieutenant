const Command = require("@/client/command.js");
const kSoftImage = require("@/scripts/kSoftImage.js");
const mentionReact = require("@/scripts/mentionReact.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "kappa",
			group: "reaction",
			description: "Sends kappa",
			format: "[message]",
			throttling: {
				usages: 5,
				duration: 10
			}
		});
	}

	async run(message) {
		const imageEmbed = await kSoftImage("kappa");
		const fullEmbed = mentionReact(message, "", imageEmbed);
		message.embed(fullEmbed);
	}
};