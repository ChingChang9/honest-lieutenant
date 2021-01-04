const Command = require("@/client/command.js");
const randomImage = require("@/scripts/randomImage.js");
const mentionReact = require("@/scripts/mentionReact.js");

module.exports = class ClapCommand extends Command {
	constructor(client) {
		super(client, {
			name: "clap",
			group: "reaction",
			aliases: ["applaud"],
			description: "Claps",
			format: "[message/user]",
			examples: [
				{
					input: "",
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
		const imageEmbed = await randomImage.exec("clap");
		const fullEmbed = mentionReact.exec(message, "applauds", imageEmbed);
		message.embed(fullEmbed);
	}
};