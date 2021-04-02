const Command = require("@/client/command.js");
const tenorGif = require("@/scripts/tenorGif.js");
const mentionReact = require("@/scripts/mentionReact.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "cuddle",
			group: "reaction",
			description: "Have a wholesome cuddle with someone",
			format: "[@user] [message]",
			examples: [
				{
					input: "@user"
				},
				{
					input: "@user i love u"
				}
			],
			throttling: {
				usages: 3,
				duration: 10
			}
		});
	}

	async run(message) {
		const imageEmbed = await tenorGif("anime cuddle");
		const fullEmbed = mentionReact(message, "cuddles", imageEmbed);
		message.embed(fullEmbed);
	}
};