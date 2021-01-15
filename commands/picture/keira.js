const Command = require("@/client/command.js");
const { MessageAttachment } = require("discord.js");
const { embedColours } = require("@/config.json");

let { readdirSync } = require("fs");
const folderSize = readdirSync("./assets/keira").length;
readdirSync = null;
delete require.cache[require.resolve("fs")];

module.exports = class extends Command {
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

		message.say({
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