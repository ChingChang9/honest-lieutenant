const Command = require("@/client/command.js");
const getRedditPost = require("@/scripts/getRedditPost.js");

const subreddits = [
	"hololive",
	"hololivememes"
];

module.exports = class HoloLiveCommand extends Command {
	constructor(client) {
		super(client, {
			name: "hololive",
			group: "weeb",
			description: "Sends a Hololive-related post from Reddit",
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