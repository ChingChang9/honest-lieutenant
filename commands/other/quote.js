const Command = require("@/client/command.js");
const axios = require("axios");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "quote",
			group: "other",
			aliases: ["qod"],
			description: "Sends a random quote"
		});
	}

	async run(message) {
		const quotes = await axios("https://type.fit/api/quotes").then(response => response.data);
		const index = Math.floor(Math.random() * quotes.length);
		message.say(`${ quotes[index].text }${ quotes[index].author ? ` —${ quotes[index].author }` : "" }`);
	}
};