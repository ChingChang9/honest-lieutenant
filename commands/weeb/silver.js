const Command = require("@/client/command.js");
const getRedditPost = require("@/scripts/getRedditPost.js");

const subreddits = [
	"silverhair"
];

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "silver",
			group: "weeb",
			aliases: ["silver-hair", "silverhair"],
			description: "Send a silver hair waifu",
			throttling: {
				usages: 5,
				duration: 10
			}
		});
	}

	async run(message) {
		const embed = await getRedditPost(subreddits, {
			nsfw: message.channel.nsfw,
			message
		});
		message.embed(embed);
	}
};