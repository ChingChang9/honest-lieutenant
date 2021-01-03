const Command = require("@/client/command.js");
const randomImage = require("@/scripts/randomImage.js");
const mentionReact = require("@/scripts/mentionReact.js");

module.exports = class HeadrubCommand extends Command {
	constructor(client) {
		super(client, {
			name: "headrub",
			group: "reaction",
			description: "Rubs someone's head",
			format: "[user/message]",
			examples: [
				{
					input: "",
					explanation: "You rub someone's head"
				},
				{
					input: "@user",
					explanation: "You rub @user's head"
				},
				{
					input: "it's okay @user",
					explanation: "You rub @user's head and say \"it's okay\""
				}
			],
			throttling: {
				usages: 3,
				duration: 10
			}
		});
	}

	async run(message) {
		const imageEmbed = await randomImage.exec("headrub");
		const fullEmbed = mentionReact.exec(message, "rubs @'s head", imageEmbed);
		message.embed(fullEmbed);
	}
};