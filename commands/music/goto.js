const { Command } = require("discord.js-commando");
const play = require("@music/play.js");
const firebase = require("@/scripts/firebase.js");
const votePlay = require("@/scripts/votePlay.js");

module.exports = class GotoCommand extends Command {
  constructor(client) {
    super(client, {
			name: "goto",
			group: "music",
			memberName: "goto",
			description: "Play a specific song in the queue",
      format: "<index-of-song>",
      guildOnly: true,
      args: [
        {
          key: "index",
					prompt: "What's the index of the song you want to play?",
					type: "integer",
          min: 1
        }
      ]
		});
  }

  async run(message, { index })  {
    if (index === "farewell") { // TODO: type string?
      return play.run(message, { song: "https://www.youtube.com/watch?v=3zbGMcsCtjg" });
    }

    const queue = await firebase.getQueue(message.guild.id);
    const played = await firebase.getItem(message.guild.id, "played");
    index -= 1;

    if (!queue[index]) return message.reply("I can't find the track, maybe the queue has been cleared?");

    votePlay.exec(message, queue, played - 1, index, `Vote on jumping to \`${ queue[index].title }\``, "☑️");
  }
};