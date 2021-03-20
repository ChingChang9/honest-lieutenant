const Command = require("@/client/command.js");
const kSoftImage = require("@/scripts/kSoftImage.js");
const mentionReact = require("@/scripts/mentionReact.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "clap",
			group: "reaction",
			aliases: ["applaud"],
			description: "Clap!",
			format: "[message/user]",
			examples: [
				{
					explanation: "You clap"
				},
				{
					input: "wow that's awesome",
					explanation: "You clap and say \"wow that's awesome\""
				},
				{
					input: "@user",
					explanation: "You clap for @user"
				}
			],
			throttling: {
				usages: 3,
				duration: 10
			}
		});
	}

	async run(message) {
		const imageEmbed = await kSoftImage("clap");
		const fullEmbed = mentionReact(message, "applauds", imageEmbed);
		message.embed(fullEmbed);
	}
};