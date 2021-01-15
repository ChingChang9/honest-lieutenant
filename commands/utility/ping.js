const Command = require("@/client/command.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "ping",
			group: "utility",
			description: "Check my ping",
			throttling: {
				usages: 5,
				duration: 10
			}
		});
	}

	async run(message) {
		const newMessage = await message.say("Pinging...");
		newMessage.edit(`Pong! The message round-trip took ${
			(newMessage.editedTimestamp || newMessage.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)
		}ms. The heartbeat ping is ${ Math.round(this.client.ws.ping) }ms`);
	}
};
