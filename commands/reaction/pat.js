const Command = require("@/client/command.js");
const randomImage = require("@/scripts/randomImage.js");
const mentionReact = require("@/scripts/mentionReact.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "pat",
			group: "reaction",
			aliases: ["headrub"],
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
		let fullEmbed;
		if (message.content.includes("headrub") || Math.random() < 0.5) {
			const imageEmbed = await randomImage.exec("headrub");
			fullEmbed = mentionReact.exec(message, "rubs @'s head", imageEmbed);
		} else {
			const imageEmbed = await randomImage.exec("pat");
			fullEmbed = mentionReact.exec(message, "pats @ on the head", imageEmbed);
		}

		message.embed(fullEmbed);
	}
};