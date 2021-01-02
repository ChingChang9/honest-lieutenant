const Command = require("@/client/command.js");
const fs = require("fs");

module.exports = class KeiraCommand extends Command {
	constructor(client) {
		super(client, {
			name: "keira",
			group: "picture",
			description: "Sends a random picture of Keira Knightley"
		});
	}

	run(message) {
		const folderSize = fs.readdirSync("./assets/keira").length;
		const index = Math.floor(Math.random() * folderSize);
		if (index === folderSize.length - 1) {
			message.say("Ha! you thought!");
		}
		message.channel.send({
			files: [`./assets/keira/${ index }.jpg`]
		});
	}
};