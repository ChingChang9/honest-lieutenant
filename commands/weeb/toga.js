const Command = require("@/client/command.js");
const getRedditPost = require("@/scripts/getRedditPost.js");

const subreddits = [
	"himikotoga"
];

module.exports = class TogaCommand extends Command {
	constructor(client) {
		super(client, {
			name: "toga",
			group: "weeb",
			aliases: ["himiko"],
			description: "Sends a Reddit thread related to Himiko Toga from \"Boku no Hero Academia\"",
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