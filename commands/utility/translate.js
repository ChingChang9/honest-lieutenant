const Command = require("@/client/command.js");
// const translate = require("@/scripts/translate.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "translate",
			group: "utility",
			aliases: ["tr"],
			description: "Translates a text to English",
			format: "<text-to-translate>",
			arguments: [
				{
					key: "text"
				}
			]
		});
	}

	async run(message, { text }) {
		message.reply("This command is deprecated :(");
		// message.say(await translate(text));
	}
};