const Command = require("@/client/command.js");
const kSoftImage = require("@/scripts/kSoftImage.js");
const getRedditPost = require("@/scripts/getRedditPost.js");

const subreddits = [
	"ecchi",
	"Lewd_Not_Hentai",
	"AzurLewd",
	"pantsu",
	"Nekomimi",
	"Sukebei",
	"BikiniMoe"
];

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "ecchi",
			group: "weeb",
			aliases: ["lewd"],
			description: "Send an ecchi anime picture",
			nsfw: true,
			throttling: {
				usages: 5,
				duration: 10
			}
		});
	}

	async run(message) {
		if (Math.random() < 0.1) {
			message.embed(await kSoftImage("hentai", true));
		} else {
			message.embed(await getRedditPost(subreddits));
		}
	}
};