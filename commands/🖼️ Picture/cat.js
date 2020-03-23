const fetch = require("node-fetch");

module.exports = {
  name: "cat",
  description: "Send a random picture of cat",
  aliases: ["mao"],
  arguments: false,
  async execute(message, arguments) {
    const { file } = await fetch("https://aws.random.cat/meow").then(async (response) => await response.json());
    message.channel.send(file);
  }
};