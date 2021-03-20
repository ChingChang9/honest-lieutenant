const Command = require("@/client/command.js");
const getRedditPost = require("@/scripts/getRedditPost.js");

const subreddits = [
	"SleepyMoe"
];

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "sleepy",
			group: "weeb",
			description: "Send a sleepy anime character",
			throttling: {
				usages: 5,
				duration: 10
			}
		});
	}

	async run(message) {
		const embed = await getRedditPost(subreddits, {
			nsfw: message.channel.nsfw,
			message
		});
		message.embed(embed);
	}
};