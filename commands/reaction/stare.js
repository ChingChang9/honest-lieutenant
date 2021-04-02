const Command = require("@/client/command.js");
const tenorGif = require("@/scripts/tenorGif.js");
const mentionReact = require("@/scripts/mentionReact.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "stare",
			group: "reaction",
			description: "Stare at something/someone uwu",
			format: "[@user] [message]",
			examples: [
				{},
				{
					input: "what is this"
				},
				{
					input: "@user"
				},
				{
					input: "@user im watching you"
				}
			],
			throttling: {
				usages: 3,
				duration: 10
			}
		});
	}

	async run(message) {
		const imageEmbed = await tenorGif("anime stare");
		const fullEmbed = mentionReact(message, "stares at", imageEmbed);
		message.embed(fullEmbed);
	}
};