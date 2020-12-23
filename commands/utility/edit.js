const { Command } = require("discord.js-commando");

module.exports = class EditCommand extends Command {
  constructor(client) {
    super(client, {
      name: "edit",
			group: "utility",
			memberName: "edit",
			description: "Edit a message in a channel",
      format: "<channel-id> <message-id> <new-text>",
      guildOnly: true,
      ownerOnly: true,
      hidden: true,
			args: [
				{
					key: "channelId",
					prompt: "Which channel do you want to say it in?",
					type: "string",
          parse: (channelId) => {
            return channelId.slice(2, -1);
          }
				},
        {
          key: "messageId",
          prompt: "Which message do you want to edit?",
          type: "string"
        },
        {
          key: "newText",
          prompt: "What do you want to edit it to?",
          type: "string"
        }
			]
    });
  }

  run(message, { channelId, messageId, newText }) {
    message.guild.channels.cache.get(channelId).messages.fetch(messageId).then((fetchedMessage) => {
      fetchedMessage.edit(newText);
    });
  }
};