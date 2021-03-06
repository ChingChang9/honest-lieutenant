const Command = require("@/client/command.js");
const kSoftImage = require("@/scripts/kSoftImage.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "fox",
			group: "picture",
			description: "Send a fox",
			throttling: {
				usages: 5,
				duration: 10
			}
		});
	}

	async run(message) {
		message.embed(await kSoftImage("fox"));
	}
};