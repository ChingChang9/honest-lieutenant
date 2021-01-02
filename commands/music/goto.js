const Command = require("@/client/command.js");
const addPlaylist = require("@/scripts/addPlaylist.js");
const firebase = require("@/scripts/firebase.js");
const votePlay = require("@/scripts/votePlay.js");

module.exports = class GotoCommand extends Command {
  constructor(client) {
    super(client, {
			name: "goto",
			group: "music",
      aliases: ["gt"],
			description: "Plays a specific song in the queue",
      format: "<song-index>",
      guildOnly: true,
      arguments: [
        {
          key: "index",
          parse: index => index === "farewell" ? index : parseInt(index),
          validate: index => {
            if (isNaN(index) && index !== "farewell") return "please enter a number!";
            return true
          }
        }
      ]
		});
  }

  run(message, { index })  {
    if (index === "farewell") {
      return addPlaylist.exec(message, ["https://www.youtube.com/watch?v=3zbGMcsCtjg"], 1);
    }

    index = parseInt(index) - 1;
    Promise.all([
      firebase.getQueue(message.guild.id),
      firebase.getItem(message.guild.id, "played")
    ]).then(result => {
      const [queue, played] = result;

      if (!queue[index]) return message.reply("the track doesn't exist");

      votePlay.exec(message, queue, played - 1, index, `Vote on jumping to \`${ queue[index].title }\``, "☑️");
    });
  }
};