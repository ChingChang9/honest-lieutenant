const Command = require("@/client/command.js");
const getRedditPost = require("@/scripts/getRedditPost.js");

const subreddits = [
	"Showerthoughts"
];

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "showerthoughts",
			group: "reddit",
			aliases: ["showerthought"],
			description: "Send a post from r/ShowerThoughts",
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