const Command = require("@/client/command.js");
const randomImage = require("@/scripts/randomImage.js");

module.exports = class EcchiCommand extends Command {
	constructor(client) {
		super(client, {
			name: "ecchi",
			group: "picture",
			aliases: ["lewd"],
			description: "Sends an ecchi picture",
			nsfw: true,
			throttling: {
				usages: 5,
				duration: 10
			}
		});
	}

	async run(message) {
		message.embed(await randomImage.exec("hentai", true));
	}
};