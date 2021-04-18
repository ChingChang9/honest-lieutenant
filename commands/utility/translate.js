const Command = require("@/client/command.js");
const translate = require("@/scripts/translate.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "translate",
			group: "utility",
			aliases: ["tr"],
			description: "Translate a text into English",
			format: "<text-to-translate>",
			arguments: [
				{
					key: "text"
				}
			]
		});
	}

	async run(message, { text }) {
		message.say(await translate(text));
	}
};