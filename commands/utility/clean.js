const { Command } = require("discord.js-commando");

module.exports = class CleanCommand extends Command {
  constructor(client) {
		super(client, {
			name: "clean",
			group: "utility",
			memberName: "clean",
			aliases: ["sweep"],
			description: "Delete a number of the most recent messages",
      format: "[#-of-messages]",
      guildOnly: true,
      clientPermissions: ["MANAGE_MESSAGES"],
      userPermissions: ["MANAGE_MESSAGES"],
			args: [
				{
					key: "number",
					prompt: "How many messages do you want to delete?",
					type: "integer",
          max: 99,
          min: 1,
					default: 10
				}
			]
		});
	}

  run(message, { number }) {
    message.channel.bulkDelete(number + 1, true).catch((error) => {
      message.reply("there was an error trying to delete messages in this channel");
    });
  }
};