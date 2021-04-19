const Command = require("@/client/command.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "avatar",
			group: "utility",
			aliases: ["profile"],
			description: "Display a user's profile picture (avatar)",
			format: "[user]",
			examples: [
				{
					explanation: "Display your profile picture"
				},
				{
					input: "@Honest Lieutenant",
					explanation: "Display Honest Lieutenant's profile picture"
				},
				{
					input: "668301556185300993",
					explanation: "Display Honest Lieutenant's profile picture without pinging him"
				}
			],
			arguments: [
				{
					key: "mentioned",
					default: "You"
				}
			]
		});
	}

	async run(message, { mentioned }) {
		if (mentioned === "You") return message.say(message.author.displayAvatarURL());

		const userId = mentioned.match(/^(\\?<@!?)?([0-9]+)>?$/)?.[2];
		if (userId) {
			const user = await message.client.users.fetch(userId);
			if (user) return message.say(user.displayAvatarURL());
		}

		message.reply("I can't find this user!");
	}
};