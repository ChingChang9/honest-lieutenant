const fs = require("fs");

module.exports = {
  name: "repeat",
  description: "Toggle repeat",
  aliases: ["loop"],
  arguments: false,
  usage: "<on/off>",
  default: "toggle",
  async execute(message, arguments)  {
    if (!message.guild.voice) {
      return message.reply("I'm not in the voice channel!");
    }
    const connection = await message.guild.voice.channel.join();
    if (!connection.player.dispatcher) {
      return message.reply("I'm not playing anything!");
    }
    fs.readFile("./assets/queue.json", async (error, data) => {
      if (error) return console.log(error);

      let { guilds } = await JSON.parse(data);
      if (!arguments[0]) {
        guilds[message.guild.id].settings.repeat = !guilds[message.guild.id].settings.repeat;
      } else if (arguments[0] === "on") {
        guilds[message.guild.id].settings.repeat = true;
      } else if (arguments[0] === "off") {
        guilds[message.guild.id].settings.repeat = false;
      }
      fs.writeFile("./assets/queue.json", `{"guilds":${ JSON.stringify(guilds) }}`, (error) => {
        if (error) return console.log(error);
        guilds[message.guild.id].settings.repeat ? message.react("🔂") : message.react("🇽");
      });
    });
  }
};