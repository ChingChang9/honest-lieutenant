const Command = require("@/client/command.js");
const tenorGif = require("@/scripts/tenorGif.js");
const mentionReact = require("@/scripts/mentionReact.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "wow",
			group: "reaction",
			aliases: ["amazed", "sugoi"],
			description: "Sugoi yo sugoi!!!",
			format: "[@user] [message]",
			examples: [
				{},
				{
					input: "your art is amazing!!"
				},
				{
					input: "@user"
				},
				{
					input: "@user your art is amazing!!"
				}
			],
			throttling: {
				usages: 3,
				duration: 10
			}
		});
	}

	async run(message) {
		const imageEmbed = Math.random() < 0.73 ? await tenorGif("anime amazed") : await tenorGif("anime wow");
		const fullEmbed = mentionReact(message, "is amazed by", imageEmbed);
		message.embed(fullEmbed);
	}
};