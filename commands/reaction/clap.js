const Command = require("@/client/command.js");
const tenorGif = require("@/scripts/tenorGif.js");
const mentionReact = require("@/scripts/mentionReact.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "clap",
			group: "reaction",
			aliases: ["applaud"],
			description: "Start clapping",
			format: "[@user] [message]",
			examples: [
				{},
				{
					input: "wow that's awesome"
				},
				{
					input: "@user"
				},
				{
					input: "@user wow that's awesome"
				}
			],
			throttling: {
				usages: 3,
				duration: 10
			}
		});
	}

	async run(message) {
		const imageEmbed = await tenorGif("anime clap");
		const fullEmbed = mentionReact(message, "applauds", imageEmbed);
		message.embed(fullEmbed);
	}
};