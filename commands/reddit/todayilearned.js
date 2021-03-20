const Command = require("@/client/command.js");
const getRedditPost = require("@/scripts/getRedditPost.js");

const subreddits = [
	"todayilearned"
];

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "todayilearned",
			group: "reddit",
			description: "Send a post from r/TodayILearned",
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