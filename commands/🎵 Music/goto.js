const p = require("@music/play.js");
const firebase = require("@/scripts/firebase.js");
const votePlay = require("@/scripts/votePlay.js");

module.exports = {
  name: "goto",
  description: "Play a specific song in the queue",
  arguments: true,
  usage: "<index-of-song>",
  async execute(message, arguments)  {
    if (arguments[0] === "farewell") {
      return p.execute(message, ["https://www.youtube.com/watch?v=3zbGMcsCtjg"]);
    }
    const index = parseInt(arguments[0]);

    const queue = await firebase.getQueue(message.guild.id);
    const played = await firebase.getPlayed(message.guild.id);

    if (!queue[index - 1]) return message.reply("I can't find the track, maybe the queue has been cleared?");

    votePlay.exec(message, queue, played - 1, index - 1, `Vote on jumping to \`${ queue[index - 1].title }\``, "☑️");
  }
};