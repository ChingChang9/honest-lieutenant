const Command = require("@/client/command.js");
const axios = require("axios");

module.exports = class DogCommand extends Command {
  constructor(client) {
    super(client, {
      name: "dog",
      group: "picture",
      aliases: ["puppy", "doge"],
      description: "Sends a random dog photo"
    });
  }

  async run(message) {
    const url = await axios("https://dog.ceo/api/breeds/image/random").then(response => response.data.message);
    message.say(url);
  }
};