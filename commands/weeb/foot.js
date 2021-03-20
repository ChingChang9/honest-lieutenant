const Command = require("@/client/command.js");
const getRedditPost = require("@/scripts/getRedditPost.js");

const subreddits = [
	"animefoot",
	"KonosubaFeet"
];

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "foot",
			group: "weeb",
			aliases: ["feet"],
			description: "Send anime feet",
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