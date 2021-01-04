const Command = require("@/client/command.js");
const getRedditPost = require("@/scripts/getRedditPost.js");

const subreddits = [
	"todayilearned"
];

module.exports = class TodayILearnedCommand extends Command {
	constructor(client) {
		super(client, {
			name: "todayilearned",
			group: "reddit",
			description: "Sends a post from r/TodayILearned",
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