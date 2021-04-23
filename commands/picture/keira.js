const Command = require("@/client/command.js");

let { readdirSync } = require("fs");
const folderSize = readdirSync("./assets/keira").length;
readdirSync = null;
delete require.cache[require.resolve("fs")];

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "keira",
			group: "picture",
			description: "Send a photo of Keira Knightley"
		});
	}

	run(message) {
		const index = Math.floor(Math.random() * folderSize);

		message.embed({
			files: [`./assets/keira/${ index }.jpg`],
			image: {
				url: `attachment://${ index }.jpg`
			},
			footer: index === folderSize.length - 1 ? { text: "Ha! you thought!" } : null
		});
	}
};