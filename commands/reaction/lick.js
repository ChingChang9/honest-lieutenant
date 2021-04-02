const Command = require("@/client/command.js");
const kSoftImage = require("@/scripts/kSoftImage.js");
const tenorGif = require("@/scripts/tenorGif.js");
const mentionReact = require("@/scripts/mentionReact.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "lick",
			group: "reaction",
			description: "Lick someone",
			format: "[@user] [message]",
			examples: [
				{
					input: "@user"
				},
				{
					input: "@user delicious"
				}
			],
			throttling: {
				usages: 3,
				duration: 10
			}
		});
	}

	async run(message) {
		const imageEmbed = Math.random() < 0.5 ? await kSoftImage("lick") : await tenorGif("anime lick");
		const fullEmbed = mentionReact(message, "licks", imageEmbed);
		message.embed(fullEmbed);
	}
};