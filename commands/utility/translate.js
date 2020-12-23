const { Command } = require("discord.js-commando");
const translate = require("@/scripts/translate.js");

module.exports = class TranslateCommand extends Command {
  constructor(client) {
		super(client, {
			name: "translate",
			group: "utility",
			memberName: "translate",
			description: "Translate a text to English",
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
    return message.reply("this command is deprecated :(");
    message.say(await translate.exec(text));
  }
};