const Command = require("@/client/command.js");
const getRedditPost = require("@/scripts/getRedditPost.js");

const subreddits = [
	"Kurumi"
];

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "kurumi",
			group: "weeb",
			aliases: ["tokisaki"],
			description: "Send a Reddit thread related to Kurumi Tokisaki from \"Date a Live\"",
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