const Command = require("@/client/command.js");
const kSoftImage = require("@/scripts/kSoftImage.js");
const tenorGif = require("@/scripts/tenorGif.js");
const mentionReact = require("@/scripts/mentionReact.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "pat",
			group: "reaction",
			aliases: ["headpat", "headrub"],
			description: "Pat someone",
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
		let fullEmbed;
		if (message.content.includes("headrub") || Math.random() < 0.5) {
			const imageEmbed = Math.random() < 0.68 ? await tenorGif("anime head rub") : await kSoftImage("headrub");
			fullEmbed = mentionReact(message, "rubs @'s head", imageEmbed);
		} else {
			const imageEmbed = Math.random() < 0.68 ? await tenorGif("anime head pat") : await kSoftImage("pat");
			fullEmbed = mentionReact(message, "pats @ on the head", imageEmbed);
		}

		message.embed(fullEmbed);
	}
};