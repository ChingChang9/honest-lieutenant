const fs = require("fs");
const play = require("./play.js");

module.exports = {
  name: "goto",
  description: "Play a specific song in the queue",
  aliases: ["jump"],
  arguments: true,
  usage: "<index-of-song>",
  async execute(message, arguments)  {
    if (!message.member.voice.channel) {
      return message.reply("you need to be in a voice channel to use this command!");
    }
    const connection = await message.member.voice.channel.join();
    fs.readFile("./assets/queue.json", (error, data) => {
      if (error) return console.log(error);

      const { queue, settings } = JSON.parse(data);
      let index = parseInt(arguments[0]);
      if (!queue[index - 1]) return message.reply("I can't find the track, maybe the queue has been cleared?");
      play.play(message, connection, queue, index - 1);
    });
  }
};