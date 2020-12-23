const { Command } = require("discord.js-commando");
const axios = require("axios");

module.exports = class DogCommand extends Command {
  constructor(client) {
    super(client, {
      name: "dog",
      aliases: ["puppy", "doge"],
      group: "picture",
      memberName: "dog",
      description: "Send a random picture of some dog"
    });
  }

  async run(message) {
    const url = await axios("https://dog.ceo/api/breeds/image/random").then((response) => response.data.message);
    message.say(url);
  }
};