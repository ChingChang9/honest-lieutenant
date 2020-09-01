const fs = require("fs");
const { emptyQueue: emptyQueue } = require("../../config.json");

module.exports = {
  name: "empty",
  description: "Clear all entries in the queue",
  arguments: false,
  execute(message, arguments) {
    fs.readFile("./assets/queue.json", async (error, data) => {
      if (error) return console.log(error);

      let { guilds } = await JSON.parse(data);
      guilds[message.guild.id] = emptyQueue;
      fs.writeFile("./assets/queue.json", `{"guilds":${ JSON.stringify(guilds) }}`, (error) => {
        if (error) return console.log(error);
        message.react("👍🏽");
      });
    });
  }
};