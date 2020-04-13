const fs = require("fs");
const play = require("./play.js");

module.exports = {
  name: "skip",
  description: "Skip to the next song",
  aliases: ["next", "forward"],
  arguments: false,
  usage: "<#-of-songs-to-skip>",
  default: "1",
  async execute(message, arguments) {
    if (!message.member.voice.channel) {
      return message.reply("you need to be in a voice channel to use this command!");
    }
    const connection = await message.member.voice.channel.join();
    fs.readFile("./assets/queue.json", (error, data) => {
      if (error) return console.log(error);

      const { queue, settings } = JSON.parse(data);
      if (connection.player.dispatcher && settings.played === queue.length) {
        return connection.player.dispatcher.destroy();
      }
      let skip = parseInt(arguments[0]) || 1;
      play.play(message, connection, queue, settings.played + skip - 1);
    });
  }
};