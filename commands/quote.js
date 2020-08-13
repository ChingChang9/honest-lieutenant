const axios = require("axios");

module.exports = {
  name: "quote",
  description: "Send a random quote",
  arguments: false,
  async execute(message, arguments) {
    const quotes = await axios("https://type.fit/api/quotes").then((response) => response.data);
    const index = Math.floor(Math.random() * quotes.length);
    message.channel.send(`${ quotes[index].text }${ quotes[index].author ? ` —${ quotes[index].author }` : "" }`);
  }
};