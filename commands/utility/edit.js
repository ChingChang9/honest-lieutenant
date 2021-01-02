const Command = require("@/client/command.js");

module.exports = class EditCommand extends Command {
  constructor(client) {
    super(client, {
      name: "edit",
			group: "utility",
			description: "Edits a message sent by the bot",
      format: "<message-link> <new-text>",
      guildOnly: true,
      ownerOnly: true,
      hidden: true,
      arguments: [
        {
          key: "argString",
          parse: argString => {
            const args = argString.split(" ");
            const messageLink = args.shift();
            const split = messageLink.split("/");
            return [split[split.length - 2], split[split.length - 1], args.join(" ")];
          }
        }
      ]
    });
  }

  run(message, { argString: [channelId, messageId, newText] }) {
    message.guild.channels.cache.get(channelId).messages.fetch(messageId).then(fetchedMessage => {
      fetchedMessage.edit(newText);
    });
  }
};