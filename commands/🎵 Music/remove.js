const firebase = require("@/scripts/firebase.js");

module.exports = {
  name: "remove",
  description: "Remove a song from the queue",
  aliases: ["delete"],
  arguments: true,
  usage: "<song-index>",
  async execute(message, arguments) {
    const queue = await firebase.getQueue(message.guild.id);
    const played = await firebase.getPlayed(message.guild.id);

    if (arguments[0] > queue.length || arguments[0] < 1) {
      return message.reply("that was an invalid index");
    }
    if (arguments[0] == played && message.guild.voice) {
      const connection = await message.guild.voice.channel.join();
      if (connection.player.dispatcher) {
        return message.reply("bruh I'm playing that right now. I can't delete the current song 🙄🙄");
      }
    }
    if (arguments[0] <= played) {
      await firebase.updateValue(`${ message.guild.id }/settings/played`, played - 1);
    }
    queue.splice(arguments[0] - 1, 1);

    message.react("👍🏽");
  }
};