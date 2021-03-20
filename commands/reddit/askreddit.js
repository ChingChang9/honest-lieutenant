const Command = require("@/client/command.js");
const getRedditPost = require("@/scripts/getRedditPost.js");

const subreddits = [
	"askreddit"
];

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "askreddit",
			group: "reddit",
			aliases: ["ar"],
			description: "Send a post from r/AskReddit",
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