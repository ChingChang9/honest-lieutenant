const Command = require("@/client/command.js");
const randomImage = require("@/scripts/randomImage.js");
const mentionReact = require("@/scripts/mentionReact.js");

module.exports = class KappaCommand extends Command {
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
		const imageEmbed = await randomImage.exec("kappa");
		const fullEmbed = mentionReact.exec(message, "", imageEmbed);
		message.embed(fullEmbed);
	}
};