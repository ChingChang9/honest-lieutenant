const Command = require("@/client/command.js");
const randomImage = require("@/scripts/randomImage.js");
const getRedditPost = require("@/scripts/getRedditPost.js");

const subreddits = [
	"Nekomimi"
];

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "neko",
			group: "weeb",
			aliases: ["catgirl", "nekomimi"],
			description: "Sends a nekomimi (catgirl)",
			throttling: {
				usages: 5,
				duration: 10
			}
		});
	}

	async run(message) {
		if (Math.random() < 1 / (subreddits.length + 1)) {
			return message.embed(await randomImage("neko", message.channel.nsfw));
		}

		const embed = await getRedditPost(subreddits, {
			nsfw: message.channel.nsfw,
			message
		});
		message.embed(embed);
	}
};