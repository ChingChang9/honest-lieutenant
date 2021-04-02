const Command = require("@/client/command.js");
const kSoftImage = require("@/scripts/kSoftImage.js");
const tenorGif = require("@/scripts/tenorGif.js");
const mentionReact = require("@/scripts/mentionReact.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "tickle",
			group: "reaction",
			description: "Tickle someone hehe",
			format: "[@user] [message]",
			examples: [
				{
					input: "@user"
				},
				{
					input: "@user mwahaha"
				}
			],
			throttling: {
				usages: 3,
				duration: 10
			}
		});
	}

	async run(message) {
		const imageEmbed = Math.random() < 0.5 ? await kSoftImage("tickle") : await tenorGif("anime tickle");
		const fullEmbed = mentionReact(message, "tickles", imageEmbed);
		message.embed(fullEmbed);
	}
};