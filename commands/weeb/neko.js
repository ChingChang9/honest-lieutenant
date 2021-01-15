const Command = require("@/client/command.js");
const randomImage = require("@/scripts/randomImage.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "neko",
			group: "weeb",
			aliases: ["catgirl"],
			description: "Sends a neko (catgirl)",
			throttling: {
				usages: 5,
				duration: 10
			}
		});
	}

	// TODO: r/Nekomimi
	async run(message) {
		message.embed(await randomImage.exec("neko", message.channel.nsfw));
	}
};