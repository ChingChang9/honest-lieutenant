const Command = require("@/client/command.js");

const commandMap = {
	"coffin-dance": "coffinDance",
	"dad-joke": "dadJoke",
	"talking-about": "talkingAbout",
	"vexera-play": "vexeraPlay"
};

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "rate",
			group: "utility",
			description: "Show or set the spam rate of a hidden cringe response",
			format: "<cringe-response> [rate]",
			examples: [
				{
					input: "dad-joke 20",
					explanation: "Set the spam rate of dad jokes to 20%"
				},
				{
					input: "owo default",
					explanation: "Set the spam rate of owo responses to default"
				}
			],
			userPermissions: ["ADMINISTRATOR"],
			guildOnly: true,
			guarded: true,
			arguments: [
				{
					key: "command"
				},
				{
					key: "rate",
					default: "",
					parse: rate => rate === "" || rate === "default" ? rate : parseInt(rate),
					validate: rate => rate >= 0 && rate <= 100 || rate === "" || rate === "default" ||
						"Please enter a number between 0 and 100 (inclusive)"
				}
			]
		});
	}

	run(message, { command, rate }) {
		if (command in commandMap) command = commandMap[command];

		if (!(command in message.client.spamRate)) return message.reply("Cannot find the cringe response");

		if (rate === "") return message.say(`The spam rate of \`${ command }\` is \`${ message.guild.getSpamRate(command) * 100 }%\``);

		const newRate = message.guild.setSpamRate(command, rate);
		message.say(`Set the spam rate of \`${ command }\` to \`${ newRate }%\``);
	}
};