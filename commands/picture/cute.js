const Command = require("@/client/command.js");
const request = require("@/workers/request.js");
const { ksoftAuth } = require("@/config.json");

module.exports = class extends Command {
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
		const url = await request("https://api.ksoft.si/images/random-aww", {
			headers: {
				Authorization: `Bearer ${ ksoftAuth }`
			}
		}).then(response => response.data.image_url);

		message.embed({
			image: { url },
			footer: {
				text: "Provided by KSoft.Si"
			}
		});
	}
};