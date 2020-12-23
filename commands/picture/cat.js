const { Command } = require("discord.js-commando");
const axios = require("axios");

module.exports = class CatCommand extends Command {
  constructor(client) {
    super(client, {
      name: "cat",
      aliases: ["mao", "kitty", "neko"],
      group: "picture",
      memberName: "cat",
      description: "Send a random picture some cat",
      args: [
        {
          key: "breedId",
          prompt: "What breed do you want?",
          type: "string",
          default: ""
        }
      ]
    });
  }

  async run(message, { breedId }) {
    if (breedId === "breeds") {
      const breedsArray = await axios("https://api.thecatapi.com/v1/breeds").then((response) => response.data);
      return message.embed({
      	color: "#fefefe",
      	author: {
      		name: "List of Cat Breed IDs"
      	},
      	description: breedsArray.map((breed) => `${ breed.name }: \`${ breed.id }\``).join("\n")
      });
    } else if (breedId) {
      breedId = `?breed_id=${ breedId }`;
    }
    const url = await axios(`https://api.thecatapi.com/v1/images/search${ breedId }`).then((response) => response.data[0].url);
    message.say(url);
  }
};