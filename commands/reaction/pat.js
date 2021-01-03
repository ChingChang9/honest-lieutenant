const Command = require("@/client/command.js");
const randomImage = require("@/scripts/randomImage.js");
const mentionReact = require("@/scripts/mentionReact.js");

module.exports = class PatCommand extends Command {
	constructor(client) {
		super(client, {
			name: "pat",
			group: "reaction",
			description: "Pats someone",
			format: "[user/message]",
			examples: [
				{
					input: "",
					explanation: "You pat someone's head"
				},
				{
					input: "@user",
					explanation: "You pat @user's head"
				},
				{
					input: "it's okay @user",
					explanation: "You pat @user's head and say \"it's okay\""
				}
			],
			throttling: {
				usages: 3,
				duration: 10
			}
		});
	}

	async run(message) {
		const imageEmbed = await randomImage.exec("pat");
		const fullEmbed = mentionReact.exec(message, "pats @ on the head", imageEmbed);
		message.embed(fullEmbed);
	}
};