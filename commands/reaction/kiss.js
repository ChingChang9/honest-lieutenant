const Command = require("@/client/command.js");
const kSoftImage = require("@/scripts/kSoftImage.js");
const mentionReact = require("@/scripts/mentionReact.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "kiss",
			group: "reaction",
			description: "Kiss someone",
			format: "[user/message]",
			examples: [
				{
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
		const imageEmbed = await kSoftImage("kiss");
		const fullEmbed = mentionReact(message, "kisses", imageEmbed);
		message.embed(fullEmbed);
	}
};