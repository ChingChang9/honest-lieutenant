const Command = require("@/client/command.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "activate",
			group: "utility",
			description: "Set the bot activity",
			ownerOnly: true,
			hidden: true
		});
	}

	run(message) {
		this.client.user.setActivity("with myself | .help");
		message.delete();
	}
};