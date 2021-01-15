const Command = require("@/client/command.js");
const randomImage = require("@/scripts/randomImage.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "birb",
			group: "picture",
			aliases: ["bird", "berb"],
			description: "Sends a birb",
			throttling: {
				usages: 5,
				duration: 10
			}
		});
	}

	async run(message) {
		message.embed(await randomImage.exec("birb"));
	}
};