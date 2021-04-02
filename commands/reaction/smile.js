const Command = require("@/client/command.js");
const tenorGif = require("@/scripts/tenorGif.js");
const mentionReact = require("@/scripts/mentionReact.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "smile",
			group: "reaction",
			description: "Talk less. Smile more 😊😊",
			format: "[@user] [message]",
			examples: [
				{},
				{
					input: "nice to see you"
				},
				{
					input: "@user"
				},
				{
					input: "@user nice to see you"
				}
			],
			throttling: {
				usages: 3,
				duration: 10
			}
		});
	}

	async run(message) {
		const imageEmbed = await tenorGif("anime smile");
		const fullEmbed = mentionReact(message, "smiles at", imageEmbed);
		message.embed(fullEmbed);
	}
};