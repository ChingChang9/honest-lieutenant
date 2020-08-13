const axios = require("axios");

module.exports = {
  name: "dog",
  description: "Send a random picture of dog",
  aliases: ["puppy"],
  arguments: false,
  async execute(message, arguments) {
    const url = await axios("https://dog.ceo/api/breeds/image/random").then((response) => response.data.message);
    message.channel.send(url);
  }
};