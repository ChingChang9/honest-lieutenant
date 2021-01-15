const Command = require("@/client/command.js");
const randomImage = require("@/scripts/randomImage.js");
const mentionReact = require("@/scripts/mentionReact.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "dab",
			group: "reaction",
			description: "Dabs on someone",
			format: "[message/user]",
			examples: [
				{
					input: "",
					explanation: "You dab"
				},
				{
					input: "they ain't us",
					explanation: "You dab and say \"they ain't us\""
				},
				{
					input: "@user",
					explanation: "You dab on @user"
				}
			],
			throttling: {
				usages: 3,
				duration: 10
			}
		});
	}

	async run(message) {
		const imageEmbed = await randomImage.exec("dab");
		const fullEmbed = mentionReact.exec(message, "dabs on", imageEmbed);
		message.embed(fullEmbed);
	}
};