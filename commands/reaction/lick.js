const Command = require("@/client/command.js");
const kSoftImage = require("@/scripts/kSoftImage.js");
const mentionReact = require("@/scripts/mentionReact.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "lick",
			group: "reaction",
			description: "Lick someone",
			format: "[user/message]",
			examples: [
				{
					explanation: "You lick someone"
				},
				{
					input: "@user",
					explanation: "You lick @user"
				},
				{
					input: "delicious",
					explanation: "You lick someone and say \"delicious\""
				}
			],
			throttling: {
				usages: 3,
				duration: 10
			}
		});
	}

	async run(message) {
		const imageEmbed = await kSoftImage("lick");
		const fullEmbed = mentionReact(message, "licks", imageEmbed);
		message.embed(fullEmbed);
	}
};