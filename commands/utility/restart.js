const { Command } = require("discord.js-commando");

module.exports = class RestartCommand extends Command {
  constructor(client) {
		super(client, {
			name: "restart",
			group: "utility",
			memberName: "restart",
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