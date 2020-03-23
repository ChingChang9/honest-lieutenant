const fetch = require("node-fetch");

module.exports = {
  name: "dog",
  description: "Send a random picture of dog",
  arguments: false,
  async execute(message, arguments) {
    const responseString = await fetch("https://dog.ceo/api/breeds/image/random").then(async (response) => await response.text());
    message.channel.send(JSON.parse(responseString).message);
  }
};