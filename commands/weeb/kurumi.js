const Command = require("@/client/command.js");
const getRedditPost = require("@/scripts/getRedditPost.js");

const subreddits = [
	"Kurumi"
];

module.exports = class KurumiCommand extends Command {
	constructor(client) {
		super(client, {
			name: "kurumi",
			group: "weeb",
			aliases: ["tokisaki"],
			description: "Sends a Reddit thread related to Kurumi Tokisaki from \"Date a Live\"",
			throttling: {
				usages: 5,
				duration: 10
			}
		});
	}

	async run(message) {
		const embed = await getRedditPost.exec(subreddits, {
			nsfw: message.channel.nsfw,
			message
		});
		message.embed(embed);
	}
};