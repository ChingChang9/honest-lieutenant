const Command = require("@/client/command.js");
const tenorGif = require("@/scripts/tenorGif.js");
const mentionReact = require("@/scripts/mentionReact.js");

const searchStrings = ["bite", "nom"];

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "bite",
			group: "reaction",
			aliases: ["nom"],
			description: "Bite someone. Nom nom nom 😋😋",
			format: "[@user] [message]",
			examples: [
				{
					input: "@user"
				},
				{
					input: "@user imma eat you"
				}
			],
			throttling: {
				usages: 3,
				duration: 10
			}
		});
	}

	async run(message) {
		const searchString = searchStrings[Math.floor(Math.random() *  searchStrings.length)];
		const imageEmbed = await tenorGif(`anime ${ searchString }`);
		const fullEmbed = mentionReact(message, "bites", imageEmbed);
		message.embed(fullEmbed);
	}
};