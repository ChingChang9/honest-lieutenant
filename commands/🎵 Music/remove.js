const fs = require("fs");

module.exports = {
  name: "remove",
  description: "Remove a song from the queue",
  aliases: ["delete"],
  arguments: true,
  usage: "<song-index>",
  execute(message, arguments) {
    fs.readFile("./assets/queue.json", (error, data) => {
      if (error) return console.log(error);

      const queue = JSON.parse(data);
      if (arguments[0] > queue.queue.length) {
        return message.reply("that was an invalid index");
      }
      if (arguments[0] == queue.settings.played) {
        return message.reply("bruh I'm playing that right now. I can't delete the currently playing song 🙄🙄")
      }
      if (arguments[0] < queue.settings.played) {
        queue.settings.played--;
      }
      queue.queue.splice(arguments[0] - 1, 1);

      fs.writeFile("./assets/queue.json", JSON.stringify(queue), (error) => {
        if (error) return console.log(error);
        message.react("👍🏽");
      });
    });
  }
};