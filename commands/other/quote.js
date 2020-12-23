const { Command } = require("discord.js-commando");
const axios = require("axios");

module.exports = class QuoteCommand extends Command {
  constructor(client) {
		super(client, {
			name: "quote",
			group: "other",
			memberName: "quote",
			description: "Send a random quote"
		});
	}

  async run(message) {
    const quotes = await axios("https://type.fit/api/quotes").then((response) => response.data);
    const index = Math.floor(Math.random() * quotes.length);
    message.say(`${ quotes[index].text }${ quotes[index].author ? ` —${ quotes[index].author }` : "" }`); // TODO: null-safe
  }
};