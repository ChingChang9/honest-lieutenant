const { Command } = require("discord.js-commando");
const addPlaylist = require("@/scripts/addPlaylist.js");
const firebase = require("@/scripts/firebase.js");
const votePlay = require("@/scripts/votePlay.js");

module.exports = class GotoCommand extends Command {
  constructor(client) {
    super(client, {
			name: "goto",
			group: "music",
			memberName: "goto",
      aliases: ["gt"],
			description: "Plays a specific song in the queue",
      format: "<song-index>",
      guildOnly: true,
      args: [
        {
          key: "index",
					prompt: "What's the index of the song you want to play?",
					type: "integer|string",
          min: 1
        }
      ]
		});
  }

  run(message, { index })  {
    if (index === "farewell") {
      return addPlaylist.exec(message, ["https://www.youtube.com/watch?v=3zbGMcsCtjg"], 1);
    }
    if (typeof(index) === "string" || index < 1) {
      return message.reply("the index is invalid!");
    }

    index--;
    Promise.all([
      firebase.getQueue(message.guild.id),
      firebase.getItem(message.guild.id, "played")
    ]).then((result) => {
      const [queue, played] = result;

      if (!queue[index]) return message.reply("I can't find the track, maybe the queue has been cleared?");

      votePlay.exec(message, queue, played - 1, index, `Vote on jumping to \`${ queue[index].title }\``, "☑️");
    });
  }
};