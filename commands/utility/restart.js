const Command = require("@/client/command.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "restart",
			group: "utility",
			aliases: ["reboot", "ff"],
			description: "Restart the bot",
			ownerOnly: true,
			hidden: true
		});
	}

	run() {
		process.exit();
	}
};