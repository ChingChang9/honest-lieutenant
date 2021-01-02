const Command = require("@/client/command.js");
const { emptyQueue } = require("@/config.json");
const firebase = require("@/scripts/firebase.js");
const servers = require("@/scripts/servers.js");

module.exports = class EmptyCommand extends Command {
  constructor(client) {
    super(client, {
			name: "empty",
			group: "music",
      aliases: ["clear"],
			description: "Clears all entries in the queue",
      guildOnly: true
		});
  }

  run(message) {
    if (!servers.getDispatcher(message.guild.id)) {
      firebase.updateValue(message.guild.id, emptyQueue);
    } else {
      Promise.all([
        firebase.database.ref(`${ message.guild.id }/queue`).once("value"),
        firebase.getItem(message.guild.id, "played")
      ]).then(result => {
        const [queue, played] = result
        let newQueue = {};
        newQueue[Object.keys(queue.val())[played - 1]] = Object.values(queue.val())[played - 1];
        firebase.database.ref(`${ message.guild.id }/queue`).set(newQueue);
        firebase.updateValue(`${ message.guild.id }/settings`, {
          played: 1
        });
      });
    }
    message.react("👍🏽");
  }
};