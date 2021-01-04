const Command = require("@/client/command.js");
const getRedditPost = require("@/scripts/getRedditPost.js");

const subreddits = [
	"anime"
];

module.exports = class AnimeCommand extends Command {
	constructor(client) {
		super(client, {
			name: "anime",
			group: "weeb",
			description: "Sends an anime-related post from Reddit",
			throttling: {
				usages: 5,
				duration: 10
			}
		});
	}

	async run(message) {
		message.embed(await getRedditPost.exec(subreddits));
	}
};