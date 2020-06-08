const fs = require("fs");

module.exports = {
  name: "clear",
  description: "Clear all entries in the queue",
  arguments: false,
  execute(message, arguments) {
    fs.readFile("./assets/queue.json", async (error, data) => {
      if (error) return console.log(error);

      let { guilds } = await JSON.parse(data);
      guilds[message.guild.id] = {"queue":[],"settings":{"played":0,"loop":false}};
      fs.writeFile("./assets/queue.json", `{"guilds":${ JSON.stringify(guilds) }}`, (error) => {
        if (error) return console.log(error);
        message.react("👍🏽");
      });
    });
  }
};