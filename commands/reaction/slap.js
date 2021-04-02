const Command = require("@/client/command.js");
const tenorGif = require("@/scripts/tenorGif.js");
const mentionReact = require("@/scripts/mentionReact.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "slap",
			group: "reaction",
			description: "Slap someone",
			format: "[@user] [message]",
			examples: [
				{
					input: "@user"
				},
				{
					input: "@user go away"
				}
			],
			throttling: {
				usages: 3,
				duration: 10
			}
		});
	}

	async run(message) {
		const imageEmbed = await tenorGif("anime slap");
		const fullEmbed = mentionReact(message, "slaps", imageEmbed);
		message.embed(fullEmbed);
	}
};