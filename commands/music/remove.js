const { Command } = require("discord.js-commando");
const firebase = require("@/scripts/firebase.js");
const servers = require("@/scripts/servers.js");

module.exports = class RemoveCommand extends Command {
  constructor(client) {
		super(client, {
			name: "remove",
			group: "music",
			memberName: "remove",
			aliases: ["rm", "delete"],
			description: "Removes a song from the queue",
      format: "<song-index> [song-index]",
      examples: [
        " 2` (Removes the second song in the queue)",
        " 2 6` (Removes song 2 to 6)",
        " 6 2` (Also removes song 2 to 6 :D)"
      ],
      guildOnly: true,
			args: [
				{
					key: "index1",
					prompt: "What's the index of the song you want to delete you want to play?",
					type: "integer",
          min: 1
				},
        {
					key: "index2",
					prompt: "What's the other index of the upper/lower bound? (inclusive)",
					type: "integer",
          min: 1,
          default: 0
				}
			]
		});
	}

  run(message, { index1, index2 }) {
    index2 = index2 || index1;
    Promise.all([
      firebase.database.ref(`${ message.guild.id }/queue`).once("value"),
      getCurrentIndex(message.guild.id)
    ]).then((result) => {
      const [queueRef, played] = result;
      const queue = queueRef.val();
      const timestamps = Object.keys(queue || {});

      if (index1 > timestamps.length) {
        return message.reply("the first index doesn't exist!");
      } else if (index2 > timestamps.length) {
        return message.reply("the second index doesn't exist!");
      }

      if (index1 === index2 && index1 === played) {
        return message.reply("bruh I'm playing that right now. I can't delete the current song 🙄🙄");
      }

      removeRange(message.guild.id, queue, timestamps, played, Math.min(index1, index2), Math.max(index1, index2));
    });
    message.react("👍🏽");
  }
};

function getCurrentIndex(guildId) {
  if (servers.getDispatcher(guildId)) {
    return firebase.getItem(guildId, "played");
  }

  return 0;
}

function removeRange(guildId, queue, timestamps, played, index1, index2) {
  let count = 0;
  for (let index = index1; index <= index2; index++) {
    if (index !== played) queue[timestamps[index - 1]] = null;
    if (index < played) count++
  }
  firebase.updateValue(`${ guildId }/settings`, {
    played: played - count
  });
  firebase.database.ref(`${ guildId }/queue`).set(queue);
}