const Command = require("@/client/command.js");
const getRedditPost = require("@/scripts/getRedditPost.js");

const subreddits = [
	"bishounen"
];

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "husbando",
			group: "weeb",
			description: "Sends a husbando",
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