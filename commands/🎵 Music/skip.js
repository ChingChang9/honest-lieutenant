const firebase = require("@/scripts/firebase.js");
const votePlay = require("@/scripts/votePlay.js");

module.exports = {
  name: "skip",
  description: "Skip to the next song",
  aliases: ["next", "forward", "s"],
  arguments: false,
  usage: "[#-of-songs-to-skip]",
  default: "1",
  async execute(message, arguments) {
    const queue = await firebase.getQueue(message.guild.id);
    const played = await firebase.getPlayed(message.guild.id);

    if (played === queue.length) {
      const connection = await message.member.voice.channel.join();
      connection.voice.setSelfDeaf(true);

      if (!connection.player.dispatcher) return;
      return connection.player.dispatcher.destroy();
    }
    const skip = parseInt(arguments[0]) || 1;

    votePlay.exec(message, queue, played - 1, played + skip - 1, `Vote on skipping \`${ queue[played - 1].title }\``, "⏩");
  }
};