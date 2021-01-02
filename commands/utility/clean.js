const Command = require("@/client/command.js");

module.exports = class CleanCommand extends Command {
  constructor(client) {
		super(client, {
			name: "clean",
			group: "utility",
			aliases: ["sweep"],
			description: "Delete a number of the most recent messages",
      format: "[#-of-messages]",
      guildOnly: true,
      clientPermissions: ["MANAGE_MESSAGES"],
      userPermissions: ["MANAGE_MESSAGES"],
			arguments: [
				{
					key: "number",
					default: 10,
          parse: number => parseInt(number),
          validate: number => {
            return number > 0 && number < 100 || "please enter a number between 1 and 99 (inclusive)"
          }
				}
			]
		});
	}

  run(message, { number }) {
    message.channel.bulkDelete(number + 1, true).catch(error => {
      message.reply("there was an error trying to delete messages in this channel");
    });
  }
};