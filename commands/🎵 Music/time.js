const fs = require("fs");

module.exports = {
  name: "time",
  description: "Estimate the time until a certain can be played",
  aliases: ["until"],
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
      return message.channel.send(`\`${ this.formatTime(timeLeft) }\` until \`${ queue[parseInt(arguments[0]) - 1].title }\` plays`);
    });
  },
  formatTime(seconds) {
    return `${ seconds < 36000 ? "0" : "" }${ Math.floor(seconds / 3600) }:${
    seconds % 3600 < 600 ? "0" : "" }${ Math.floor(seconds % 3600 / 60) }:${
    seconds % 60 < 10 ? "0" : "" }${ seconds % 60 }`;
  }
};