const { Command } = require("discord.js-commando");

module.exports = class EditCommand extends Command {
  constructor(client) {
    super(client, {
      name: "edit",
			group: "utility",
			memberName: "edit",
			description: "Edits a message sent by the bot",
      format: "<message-link> <new-text>",
      guildOnly: true,
      ownerOnly: true,
      hidden: true,
			args: [
				{
					key: "messageLink",
					prompt: "Which message do you want to edit?",
					type: "string",
          parse: (messageLink) => {
            const split = messageLink.split("/");
            return [split[split.length - 2], split[split.length - 1]];
          }
				},
        {
          key: "newText",
          prompt: "What would you like to edit it to?",
          type: "string"
        }
			]
    });
  }

  run(message, { messageLink: [channelId, messageId], newText }) {
    message.guild.channels.cache.get(channelId).messages.fetch(messageId).then((fetchedMessage) => {
      fetchedMessage.edit(newText);
    });
  }
};