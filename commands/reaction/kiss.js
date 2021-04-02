const Command = require("@/client/command.js");
const kSoftImage = require("@/scripts/kSoftImage.js");
const tenorGif = require("@/scripts/tenorGif.js");
const mentionReact = require("@/scripts/mentionReact.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "kiss",
			group: "reaction",
			description: "Kiss someone",
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
		const imageEmbed = Math.random() < 0.5 ? await kSoftImage("kiss") : await tenorGif("anime kiss");
		const fullEmbed = mentionReact(message, "kisses", imageEmbed);
		message.embed(fullEmbed);
	}
};