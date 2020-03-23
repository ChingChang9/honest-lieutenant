const fs = require("fs");

module.exports = {
  name: "clear",
  description: "Clear all entries in the queue",
  arguments: false,
  async execute(message, arguments) {
    fs.writeFile("./assets/queue.json", `{"queue":[],"settings":{"played":0,"loop":false}}`, (error) => {
      if (error) return console.log(error);
      message.react("👍🏽");
    });
  }
};