const Command = require("@/client/command.js");
const kSoftImage = require("@/scripts/kSoftImage.js");
const mentionReact = require("@/scripts/mentionReact.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "hug",
			group: "reaction",
			aliases: ["cuddle"],
			description: "Hugs someone",
			format: "[user/message]",
			examples: [
				{
					explanation: "You hug someone"
				},
				{
					input: "@user",
					explanation: "You hug @user"
				},
				{
					input: "it's okay @user",
					explanation: "You hug @user and say \"it's okay\""
				}
			],
			throttling: {
				usages: 3,
				duration: 10
			}
		});
	}

	async run(message) {
		const imageEmbed = await kSoftImage("hug");
		const fullEmbed = mentionReact(message, "hugs", imageEmbed);
		message.embed(fullEmbed);
	}
};