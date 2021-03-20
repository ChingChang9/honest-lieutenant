const Command = require("@/client/command.js");
const getRedditPost = require("@/scripts/getRedditPost.js");

const subreddits = [
	"anime"
];

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "anime",
			group: "weeb",
			description: "Send an anime-related post from Reddit",
			throttling: {
				usages: 5,
				duration: 10
			}
		});
	}

	async run(message) {
		message.embed(await getRedditPost(subreddits));
	}
};