const fetch = require("node-fetch");

module.exports = {
  name: "quote",
  description: "Send a random quote",
  arguments: false,
  async execute(message, arguments) {
    const responseString = await fetch("https://type.fit/api/quotes").then(async (response) => await response.text());
    const quotes = JSON.parse(responseString);
    const index = Math.floor(Math.random() * quotes.length);
    message.channel.send(`${ quotes[index].text }${ quotes[index].author ? ` —${ quotes[index].author }` : "" }`);
  }
};