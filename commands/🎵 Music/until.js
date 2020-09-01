const fs = require("fs");
const library = require("../../library.js");

module.exports = {
  name: "until",
  description: "Estimate the time until a certain can be played",
  aliases: ["time"],
  arguments: true,
  usage: "<index-of-song>",
  async execute(message, arguments) {
    if (!message.guild.voice) {
      return message.reply("I'm not playing anything!");
    }

    const connection = await message.guild.voice.channel.join();
    if (!connection.player.dispatcher) {
      return message.reply("I'm not playing anything!");
    }

    fs.readFile("./assets/queue.json", async (error, data) => {
      if (error) return console.log(error);

      const { guilds } = await JSON.parse(data);
      const { queue, settings } = guilds[message.guild.id];
      const index = settings.played - 1;

      if (parseInt(arguments[0]) < index + 1) {
        return message.reply("that song has already been played");
      }
      if (parseInt(arguments[0]) === index + 1) {
        return message.reply("I'm currently playing that song right now, duh 🙄");
      }

      let timeLeft = queue[index].duration - Math.floor(connection.player.dispatcher.streamTime / 1000);
      for (let counter = index + 1; counter < parseInt(arguments[0]) - 1; counter++) {
        timeLeft += parseInt(queue[counter].duration);
      }
      return message.channel.send(`\`${ library.formatTime(timeLeft) }\` until \`${ queue[parseInt(arguments[0]) - 1].title }\` plays`);
    });
  }
};