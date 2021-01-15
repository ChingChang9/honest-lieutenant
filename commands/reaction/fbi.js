const Command = require("@/client/command.js");
const randomImage = require("@/scripts/randomImage.js");
const mentionReact = require("@/scripts/mentionReact.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "fbi",
			group: "reaction",
			aliases: ["police"],
			description: "Calls the FBI",
			format: "[message/user]",
			examples: [
				{
					input: "",
					explanation: "You call the FBI"
				},
				{
					input: "don't move",
					explanation: "You call the FBI and say \"don't move\""
				},
				{
					input: "@user",
					explanation: "You call the FBI on @user"
				}
			],
			throttling: {
				usages: 3,
				duration: 10
			}
		});
	}

	async run(message) {
		const imageEmbed = await randomImage.exec("fbi");
		const fullEmbed = mentionReact.exec(message, "calls the FBI on", imageEmbed);
		message.embed(fullEmbed);
	}
};