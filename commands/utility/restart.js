const Command = require("@/client/command.js");

module.exports = class RestartCommand extends Command {
  constructor(client) {
		super(client, {
			name: "restart",
			group: "utility",
			aliases: ["reboot", "ff"],
			description: "Restarts the bot",
      ownerOnly: true,
      hidden: true
		});
	}

  run() {
    process.exit();
  }
};