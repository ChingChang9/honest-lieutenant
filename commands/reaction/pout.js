const Command = require("@/client/command.js");
const tenorGif = require("@/scripts/tenorGif.js");
const mentionReact = require("@/scripts/mentionReact.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "pout",
			group: "reaction",
			description: "Start pouting hehe",
			format: "[@user] [message]",
			examples: [
				{},
				{
					input: "b-b-baka!"
				},
				{
					input: "@user"
				},
				{
					input: "@user you are a baka!"
				}
			],
			throttling: {
				usages: 3,
				duration: 10
			}
		});
	}

	async run(message) {
		const imageEmbed = await tenorGif("anime pout");
		const fullEmbed = mentionReact(message, "pouts at", imageEmbed);
		message.embed(fullEmbed);
	}
};