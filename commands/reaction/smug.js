const Command = require("@/client/command.js");
const tenorGif = require("@/scripts/tenorGif.js");
const mentionReact = require("@/scripts/mentionReact.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "smug",
			group: "reaction",
			description: "Show a smug face. You go!",
			format: "[@user] [message]",
			examples: [
				{},
				{
					input: "haha you thought"
				},
				{
					input: "@user"
				},
				{
					input: "@user haha you thought"
				}
			],
			throttling: {
				usages: 3,
				duration: 10
			}
		});
	}

	async run(message) {
		const imageEmbed = await tenorGif("anime smug");
		const fullEmbed = mentionReact(message, "smugs at", imageEmbed);
		message.embed(fullEmbed);
	}
};