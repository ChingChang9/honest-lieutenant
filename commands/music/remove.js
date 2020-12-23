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

  async execute(message, { index1, index2 }) {
    const queue = await firebase.getQueue(message.guild.id);

    index2 = index2 || index1;

    if (index1 > queue.length) {
      return message.reply("the first index is invalid");
    } else if (index2 > queue.length) {
      return message.reply("the second index is invalid");
    }

    const played = await getCurrentIndex(message);

    if (index1 === index2 && index1 === played) {
      return message.reply("bruh I'm playing that right now. I can't delete the current song 🙄🙄");
    }

    for (let index = index1; index <= index2; index++) {
      queue
    }

    // REMOVE IT FROM QUEUE
    message.react("👍🏽");
  }
};

async function getCurrentIndex(message) {
  if (message.guild.voice.channel) {
    if (!servers.getDispatcher(message.guild.id)) {
      return await firebase.getItem(message.guild.id, "played");
    }
  }

  return 0;
}