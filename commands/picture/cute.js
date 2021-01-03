const Command = require("@/client/command.js");
const axios = require("axios");
const { ksoftAuth } = require("@/config.json");

module.exports = class CuteCommand extends Command {
	constructor(client) {
		super(client, {
			name: "cute",
			group: "picture",
			aliases: ["aww"],
			description: "Sends a cute photo (likely an animal)",
			throttling: {
				usages: 5,
				duration: 10
			}
		});
	}

	async run(message) {
		const url = await axios("https://api.ksoft.si/images/random-aww", {
			headers: {
				Authorization: `Bearer ${ ksoftAuth }`
			}
		}).then(response => response.data.image_url);

		message.embed({
			color: "#fefefe",
			image: { url },
			footer: {
				text: "Provided by KSoft.Si"
			}
		});
	}
};