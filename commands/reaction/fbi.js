const Command = require("@/client/command.js");
const tenorGif = require("@/scripts/tenorGif.js");
const mentionReact = require("@/scripts/mentionReact.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "fbi",
			group: "reaction",
			aliases: ["police"],
			description: "Call the FBI",
			format: "[@user] [message]",
			examples: [
				{},
				{
					input: "don't move"
				},
				{
					input: "@user"
				},
				{
					input: "@user don't move"
				}
			],
			throttling: {
				usages: 3,
				duration: 10
			}
		});
	}

	async run(message) {
		const imageEmbed = await tenorGif("fbi open up");
		const fullEmbed = mentionReact(message, "calls the FBI on", imageEmbed);
		message.embed(fullEmbed);
	}
};