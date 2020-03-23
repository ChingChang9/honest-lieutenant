const fs = require("fs");
const play = require("./play.js");

module.exports = {
  name: "loop",
  description: "Toggle loop",
  aliases: ["repeat"],
  arguments: false,
  usage: "<on/off>",
  default: "on",
  async execute(message, arguments)  {
    if (!message.guild.voice) {
      return message.reply("I'm not in the voice channel!");
    }
    const connection = await message.guild.voice.channel.join();
    if (!connection.player.dispatcher) {
      return message.reply("I'm not playing anything!");
    }
    fs.readFile("./assets/queue.json", (error, data) => {
      if (error) return console.log(error);

      let loop = !(arguments[0] === "off");
      const { queue, settings } = JSON.parse(data);
      fs.writeFile("./assets/queue.json", `{"queue":${ JSON.stringify(queue) },"settings":{"played":${ settings.played },"loop":${ loop }}}`, (error) => {
        if (error) return console.log(error);
        message.react("👍🏽");
      });
    });
  }
};