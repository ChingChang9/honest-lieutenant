const { Command } = require("discord.js-commando");
const firebase = require("@/scripts/firebase.js");
const servers = require("@/scripts/servers.js");

module.exports = class RemoveCommand extends Command {
  constructor(client) {
		super(client, {
			name: "remove",
			group: "music",
			memberName: "remove",
			aliases: ["delete"],
			description: "Remove a song from the queue",
      format: "<song-index>",
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

  async run(message, { index1, index2 }) {
    const queueRef = await firebase.database.ref(`${ message.guild.id }/queue`).once("value");
    const queue = queueRef.val();
    const timestamps = Object.keys(queue || {});

    index2 = index2 || index1;

    if (index1 > timestamps.length) {
      return message.reply("the first index doesn't exist!");
    } else if (index2 > timestamps.length) {
      return message.reply("the second index doesn't exist!");
    }

    const played = await getCurrentIndex(message.guild.id);

    if (index1 === index2 && index1 === played) {
      return message.reply("bruh I'm playing that right now. I can't delete the current song 🙄🙄");
    }

    removeRange(message.guild.id, queue, timestamps, played, Math.min(index1, index2), Math.max(index1, index2));

    message.react("👍🏽");
  }
};

async function getCurrentIndex(guildId) {
  if (servers.getDispatcher(guildId)) {
    return await firebase.getItem(guildId, "played");
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