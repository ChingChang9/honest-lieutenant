const Command = require("@/client/command.js");
const tenorGif = require("@/scripts/tenorGif.js");
const mentionReact = require("@/scripts/mentionReact.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "poke",
			group: "reaction",
			aliases: ["boop"],
			description: "Poke someone. B O O P",
			format: "[@user] [message]",
			examples: [
				{
					input: "@user"
				},
				{
					input: "@user sup"
				}
			],
			throttling: {
				usages: 3,
				duration: 10
			}
		});
	}

	async run(message) {
		const imageEmbed = await tenorGif("anime poke");
		const fullEmbed = mentionReact(message, "pokes", imageEmbed);
		message.embed(fullEmbed);
	}
};