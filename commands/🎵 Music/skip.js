const fs = require("fs");
const play = require("./play.js");

module.exports = {
  name: "skip",
  description: "Skip to the next song",
  aliases: ["next", "forward"],
  arguments: false,
  usage: "<#-of-songs-to-skip>",
  default: "1",
  async execute(message, arguments)  {
    if (!message.guild.voice) {
      return message.reply("I'm not in the voice channel!");
    }
    const connection = await message.guild.voice.channel.join();
    fs.readFile("./assets/queue.json", (error, data) => {
      if (error) return console.log(error);

      const { queue, played } = JSON.parse(data);
      if (played === queue.length) {
        return connection.player.dispatcher.destroy();
      }
      let skip = parseInt(arguments[0]) || 1;
      play.play(message, connection, queue, played + skip - 1);
    });
  }
}