const Command = require("@/client/command.js");
const randomImage = require("@/scripts/randomImage.js");
const mentionReact = require("@/scripts/mentionReact.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "tickle",
			group: "reaction",
			description: "Tickles someone",
			format: "[user/message]",
			examples: [
				{
					explanation: "You tickle someone"
				},
				{
					input: "@user",
					explanation: "You tickle @user"
				},
				{
					input: "come here @user",
					explanation: "You tickle @user and say \"come here\""
				}
			],
			throttling: {
				usages: 3,
				duration: 10
			}
		});
	}

	async run(message) {
		const imageEmbed = await randomImage("tickle");
		const fullEmbed = mentionReact(message, "tickles", imageEmbed);
		message.embed(fullEmbed);
	}
};