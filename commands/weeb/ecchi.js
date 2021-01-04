const Command = require("@/client/command.js");
const randomImage = require("@/scripts/randomImage.js");
const getRedditPost = require("@/scripts/getRedditPost.js");

const subreddits = [
	"ecchi",
	"AzurLewd",
	"pantsu",
	"Nekomimi",
	"Sukebei"
];

module.exports = class EcchiCommand extends Command {
	constructor(client) {
		super(client, {
			name: "ecchi",
			group: "weeb",
			aliases: ["lewd"],
			description: "Sends an ecchi anime picture",
			nsfw: true,
			throttling: {
				usages: 5,
				duration: 10
			}
		});
	}

	async run(message) {
		if (Math.random() < 0.1) {
			message.embed(await randomImage.exec("hentai", true));
		} else {
			message.embed(await getRedditPost.exec(subreddits));
		}
	}
};