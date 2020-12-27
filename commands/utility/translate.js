const { Command } = require("discord.js-commando");
const translate = require("@/scripts/translate.js");

module.exports = class TranslateCommand extends Command {
  constructor(client) {
		super(client, {
			name: "translate",
			group: "utility",
			memberName: "translate",
      aliases: ["tr"],
			description: "Translates a text to English",
      format: "<text-to-translate>",
			args: [
				{
					key: "text",
					prompt: "What do you want to translate?",
					type: "string"
				}
			]
		});
	}

  async run(message, { text }) {
    message.say(await translate.exec(text));
  }
};