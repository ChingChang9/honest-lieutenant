const Command = require("@/client/command.js");
const { MessageAttachment } = require("discord.js");
const fs = require("fs");
const { embedColours } = require("@/config.json");

const folderSize = fs.readdirSync("./assets/keira").length;

module.exports = class KeiraCommand extends Command {
	constructor(client) {
		super(client, {
			name: "keira",
			group: "picture",
			description: "Sends a photo of Keira Knightley"
		});
	}

	run(message) {
		const index = Math.floor(Math.random() * folderSize);
		const file = new MessageAttachment(`./assets/keira/${ index }.jpg`);

		message.channel.send({
			files: [file],
			embed: {
				color: embedColours.default,
				image: {
					url: `attachment://${ index }.jpg`
				},
				footer: index === folderSize.length - 1 ? { text: "Ha! you thought!" } : null
			}
		});
	}
};