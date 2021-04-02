const Command = require("@/client/command.js");
const tenorGif = require("@/scripts/tenorGif.js");
const mentionReact = require("@/scripts/mentionReact.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "blush",
			group: "reaction",
			description: "Start blushing owo",
			format: "[message]",
			throttling: {
				usages: 3,
				duration: 10
			}
		});
	}

	async run(message) {
		const imageEmbed = await tenorGif("anime blush");
		const fullEmbed = mentionReact(message, "", imageEmbed);
		message.embed(fullEmbed);
	}
};