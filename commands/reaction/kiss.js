const Command = require("@/client/command.js");
const randomImage = require("@/scripts/randomImage.js");
const mentionReact = require("@/scripts/mentionReact.js");

module.exports = class KissCommand extends Command {
	constructor(client) {
		super(client, {
			name: "kiss",
			group: "reaction",
			description: "Kisses someone",
			format: "[user/message]",
			examples: [
				{
					input: "",
					explanation: "You kiss someone"
				},
				{
					input: "@user",
					explanation: "You kiss @user"
				},
				{
					input: "I love you",
					explanation: "You kiss someone and say \"I love you\""
				}
			],
			throttling: {
				usages: 3,
				duration: 10
			}
		});
	}

	async run(message) {
		const imageEmbed = await randomImage.exec("kiss");
		const fullEmbed = mentionReact.exec(message, "kisses", imageEmbed);
		message.embed(fullEmbed);
	}
};