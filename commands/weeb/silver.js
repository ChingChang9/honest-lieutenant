const Command = require("@/client/command.js");
const getRedditPost = require("@/scripts/getRedditPost.js");

const subreddits = [
	"silverhair"
];

module.exports = class SilverCommand extends Command {
	constructor(client) {
		super(client, {
			name: "silver",
			group: "weeb",
			aliases: ["silver-hair", "silverhair"],
			description: "Sends a silver hair waifu",
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