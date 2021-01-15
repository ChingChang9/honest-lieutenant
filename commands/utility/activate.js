const Command = require("@/client/command.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "activate",
			group: "utility",
			description: "Sets the bot activity",
			ownerOnly: true,
			hidden: true
		});
	}

	run() {
		this.client.user.setActivity("with myself | .help");
	}
};