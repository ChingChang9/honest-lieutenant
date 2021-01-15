const Command = require("@/client/command.js");
const axios = require("axios");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "dog",
			group: "picture",
			aliases: ["puppy"],
			description: "Sends a cute dog"
		});
	}

	async run(message) {
		const url = await axios("https://dog.ceo/api/breeds/image/random").then(response => response.data.message);
		message.embed({
			image: { url },
			footer: {
				text: "Provided by Dog CEO"
			}
		});
	}
};