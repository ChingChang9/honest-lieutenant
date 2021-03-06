const Command = require("@/client/command.js");
const getRedditPost = require("@/scripts/getRedditPost.js");

const subreddits = [
	"AraAra"
];

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "ara",
			group: "weeb",
			aliases: ["araara", "ara-ara"],
			description: "Ara ara",
			nsfw: true,
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