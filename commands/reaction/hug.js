const Command = require("@/client/command.js");
const kSoftImage = require("@/scripts/kSoftImage.js");
const tenorGif = require("@/scripts/tenorGif.js");
const mentionReact = require("@/scripts/mentionReact.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "hug",
			group: "reaction",
			description: "Give someone a good hug",
			format: "[@user] [message]",
			examples: [
				{
					input: "@user"
				},
				{
					input: "@user it's okay"
				}
			],
			throttling: {
				usages: 3,
				duration: 10
			}
		});
	}

	async run(message) {
		const imageEmbed = Math.random() < 0.5 ? await kSoftImage("hug") : await tenorGif("anime hug");
		const fullEmbed = mentionReact(message, "hugs", imageEmbed);
		message.embed(fullEmbed);
	}
};