const Command = require("@/client/command.js");
const kSoftImage = require("@/scripts/kSoftImage.js");
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
		const imageEmbed = await kSoftImage("fbi");
		const fullEmbed = mentionReact(message, "calls the FBI on", imageEmbed);
		message.embed(fullEmbed);
	}
};