const Command = require("@/client/command.js");
const request = require("@/workers/request.js");
const { ksoftAuth } = require("@/config.json");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "wikihow",
			group: "picture",
			description: "Sends a weird WikiHow image",
			throttling: {
				usages: 5,
				duration: 10
			}
		});
	}

	async run(message) {
		const data = await request("https://api.ksoft.si/images/random-wikihow", {
			headers: {
				Authorization: `Bearer ${ ksoftAuth }`
			}
		}).then(response => response.data);

		message.embed({
			author: {
				name: data.title,
				url: data.article_url
			},
			image: {
				url: data.url
			},
			footer: {
				text: "Provided by KSoft.Si"
			}
		});
	}
};