const Command = require("@/client/command.js");
const tenorGif = require("@/scripts/tenorGif.js");
const mentionReact = require("@/scripts/mentionReact.js");

const attacks = ["slap", "attack", "kick", "punch", "hit"];

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "attack",
			group: "reaction",
			aliases: ["punch", "hit", "attacc"],
			description: "Attack someone",
			format: "[@user] [message]",
			examples: [
				{
					input: "@user"
				},
				{
					input: "@user get rekt"
				}
			],
			throttling: {
				usages: 3,
				duration: 10
			}
		});
	}

	async run(message) {
		const attack = attacks[Math.floor(Math.random() *  attacks.length)];
		const imageEmbed = await tenorGif(`anime ${ attack }`);
		const fullEmbed = mentionReact(message, `${ attack }${ attack === "punch" ? "e" : "" }s`, imageEmbed);
		message.embed(fullEmbed);
	}
};