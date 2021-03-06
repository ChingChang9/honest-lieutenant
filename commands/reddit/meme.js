const Command = require("@/client/command.js");
const getRedditPost = require("@/scripts/getRedditPost.js");

const subreddits = [
	"raimimemes",
	"marvelmemes",
	"animemes",
	"ShakespeareMemes",
	"Discordmemes"
];

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "meme",
			group: "reddit",
			description: "Send a meme from Reddit",
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