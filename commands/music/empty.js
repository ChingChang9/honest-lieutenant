const { Command } = require("discord.js-commando");
const { emptyQueue } = require("@/config.json");
const firebase = require("@/scripts/firebase.js");
const servers = require("@/scripts/servers.js");

module.exports = class EmptyCommand extends Command {
  constructor(client) {
    super(client, {
			name: "empty",
			group: "music",
			memberName: "empty",
			description: "Clear al entries in the queue",
      guildOnly: true
		});
  }

  async run(message) {
    if (!servers.getDispatcher(message.guild.id)) {
      await firebase.updateValue(message.guild.id, emptyQueue);
    } else {
      const played = await firebase.getItem(message.guild.id, "played");
      const queue = await firebase.database.ref(`${ message.guild.id }/queue`).once("value");
      let newQueue = {};
      newQueue[Object.keys(queue.val())[played - 1]] = Object.values(queue.val())[played - 1];
      firebase.database.ref(`${ message.guild.id }/queue`).set(newQueue);
      firebase.updateValue(`${ message.guild.id }/settings`, {
        played: 1
      });
    }
    message.react("👍🏽");
  }
};