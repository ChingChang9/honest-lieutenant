const fs = require("fs");

module.exports = {
  name: "remove",
  description: "Remove a song from the queue",
  aliases: ["delete"],
  arguments: true,
  usage: "<song-index>",
  execute(message, arguments) {
    fs.readFile("./assets/queue.json", async (error, data) => {
      if (error) return console.log(error);

      let { guilds } = await JSON.parse(data);
      if (!guilds[message.guild.id]) {
        guilds[message.guild.id] = {"queue":[],"settings":{"played":0,"loop":false}};
      }
      if (arguments[0] > guilds[message.guild.id].queue.length) {
        return message.reply("that was an invalid index");
      }
      if (arguments[0] == guilds[message.guild.id].settings.played) {
        return message.reply("bruh I'm playing that right now. I can't delete the currently playing song 🙄🙄")
      }
      if (arguments[0] < guilds[message.guild.id].settings.played) {
        guilds[message.guild.id].settings.played--;
      }
      guilds[message.guild.id].queue.splice(arguments[0] - 1, 1);

      fs.writeFile("./assets/queue.json", `{"guilds":${ JSON.stringify(guilds) }}`, (error) => {
        if (error) return console.log(error);
        message.react("👍🏽");
      });
    });
  }
};