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

  run(message, { back }) {
    Promise.all([
      firebase.getQueue(message.guild.id),
      firebase.getItem(message.guild.id, "played")
    ]).then((result) => {
      const [queue, played] = result;
      const index = played - 1;

      if (!queue) message.reply("the queue is empty!");

      const toIndex = Math.max(index - back, 0);
      votePlay.exec(message, queue, index, toIndex, `Vote on rewinding to \`${ queue[toIndex].title }\``, "⏪");
    });
  }
};