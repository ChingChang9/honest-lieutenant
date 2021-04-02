const Command = require("@/client/command.js");
const tenorGif = require("@/scripts/tenorGif.js");
const mentionReact = require("@/scripts/mentionReact.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "dab",
			group: "reaction",
			description: "Dab on 'em haters",
			format: "[@user] [message]",
			examples: [
				{},
				{
					input: "ah ha gottem!"
				},
				{
					input: "@user"
				},
				{
					input: "@user ah ha gottem!"
				}
			],
			throttling: {
				usages: 3,
				duration: 10
			}
		});
	}

	async run(message) {
		const imageEmbed = await tenorGif("anime dab");
		const fullEmbed = mentionReact(message, "dabs on", imageEmbed);
		message.embed(fullEmbed);
	}
};