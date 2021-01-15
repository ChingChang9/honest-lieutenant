const Command = require("@/client/command.js");
const getRedditPost = require("@/scripts/getRedditPost.js");

const subreddits = [
	"Gesugao"
];

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "gesugao",
			group: "weeb",
			description: "Sends a gesugao (the bot creator's favourite!)",
			nsfw: true,
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