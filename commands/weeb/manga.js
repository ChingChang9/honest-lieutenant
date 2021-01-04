const Command = require("@/client/command.js");
const getRedditPost = require("@/scripts/getRedditPost.js");

const subreddits = [
	"manga"
];

module.exports = class MangaCommand extends Command {
	constructor(client) {
		super(client, {
			name: "manga",
			group: "weeb",
			description: "Sends an manga-related post from Reddit",
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