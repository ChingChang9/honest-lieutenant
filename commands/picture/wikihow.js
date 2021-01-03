const Command = require("@/client/command.js");
const axios = require("axios");
const { ksoftAuth } = require("@/config.json");

module.exports = class WikihowCommand extends Command {
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
		const data = await axios("https://api.ksoft.si/images/random-wikihow", {
			headers: {
				Authorization: `Bearer ${ ksoftAuth }`
			}
		}).then(response => response.data);

		message.embed({
			color: "#fefefe",
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