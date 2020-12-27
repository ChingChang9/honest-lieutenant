const { Command } = require("discord.js-commando");
const firebase = require("@/scripts/firebase.js");
const votePlay = require("@/scripts/votePlay.js");

module.exports = class BackCommand extends Command {
  constructor(client) {
    super(client, {
			name: "back",
			group: "music",
			memberName: "back",
			aliases: ["b", "previous", "prev"],
			description: "Plays the previous song",
      format: "[#-of-songs-to-back]",
      guildOnly: true,
      args: [
        {
          key: "back",
					prompt: "How many songs do you want to skip back?",
					type: "integer",
          min: 1,
          default: 1
        }
      ]
		});
  }

  async run(message, { back })  {
    const queue = await firebase.getQueue(message.guild.id);
    const played = await firebase.getItem(message.guild.id, "played");

    if (!queue) message.reply("the queue is empty!");

    const toIndex = Math.max(played - back - 1, 0);
    votePlay.exec(message, queue, played - 1, toIndex, `Vote on rewinding to \`${ queue[toIndex].title }\``, "⏪");
  }
};