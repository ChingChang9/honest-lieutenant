const Command = require("@/client/command.js");
const getRedditPost = require("@/scripts/getRedditPost.js");

const subreddits = [
	"kitsunemimi"
];

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "kitsune",
			group: "weeb",
			aliases: ["foxgirl", "kitsunemimi"],
			description: "Sends a kitsunemimi (fox girl)",
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