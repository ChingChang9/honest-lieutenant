const fs = require("fs");

module.exports = {
  name: "clear",
  description: "Clear all entries in the queue",
  arguments: false,
  async execute(message, arguments) {
    fs.writeFile("./assets/queue.json", `{"queue":[],"played":0}`, (error) => {
      if (!error) return message.react("👍🏽");
      console.log(error);
    });
  }
};