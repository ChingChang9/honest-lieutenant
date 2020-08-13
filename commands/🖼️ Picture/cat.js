const axios = require("axios");

module.exports = {
  name: "cat",
  description: "Send a random picture of cat",
  aliases: ["mao", "kitty"],
  arguments: false,
  usage: "<breed>",
  async execute(message, arguments) {
    let breedId = "";
    if (arguments.length) {
      if (arguments[0] === "breeds") {
        let embedString = "";
        const breedsArray = await axios("https://api.thecatapi.com/v1/breeds").then((response) => response.data);
        embedString = breedsArray.map((breed) => `${ breed.name }: \`${ breed.id }\``).join("\n");
        return message.channel.send({
          embed: {
          	color: "#fefefe",
          	author: {
          		name: "List of Cat Breed IDs"
          	},
          	description: embedString
          }
        });
      }
      breedId = `?breed_id=${ arguments[0] }`;
    }
    const url = await axios(`https://api.thecatapi.com/v1/images/search${ breedId }`).then((response) => response.data[0].url);
    return message.channel.send(url);
  }
};