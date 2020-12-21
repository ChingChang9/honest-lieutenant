const firebase = require("@/scripts/firebase.js");
const votePlay = require("@/scripts/votePlay.js");

module.exports = {
  name: "back",
  description: "Play the previous song",
  aliases: ["previous", "prev"],
  arguments: false,
  usage: "[#-of-songs-to-back]",
  default: "1",
  async execute(message, arguments)  {
    const queue = await firebase.getQueue(message.guild.id);
    const played = await firebase.getPlayed(message.guild.id);

    if (!queue) message.reply("the queue is empty!");
    const back = await parseInt(arguments[0]) || 1;

    const toIndex = played <= 1 ? 0 : played - back - 1;
    votePlay.exec(message, queue, played - 1, toIndex, `Vote on rewinding to \`${ queue[toIndex].title }\``, "⏪")
  }
};