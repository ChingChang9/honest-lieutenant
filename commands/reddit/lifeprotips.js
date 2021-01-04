const Command = require("@/client/command.js");
const getRedditPost = require("@/scripts/getRedditPost.js");

const subreddits = [
	"lifeprotips"
];

module.exports = class LifeProTipsCommand extends Command {
	constructor(client) {
		super(client, {
			name: "lifeprotips",
			group: "reddit",
			aliases: ["lifeprotip", "lpt"],
			description: "Sends a post from r/LifeProTips",
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