const fs = require("fs");

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
    let loop = !(arguments[0] === "off");
    fs.readFile("./assets/queue.json", async (error, data) => {
      if (error) return console.log(error);

      let { guilds } = await JSON.parse(data);
      guilds[message.guild.id].settings.loop = loop;
      fs.writeFile("./assets/queue.json", `{"guilds":${ JSON.stringify(guilds) }}`, (error) => {
        if (error) return console.log(error);
        message.react("👍🏽");
      });
    });
  }
};