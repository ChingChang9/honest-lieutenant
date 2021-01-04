const Command = require("@/client/command.js");
const getRedditPost = require("@/scripts/getRedditPost.js");

const subreddits = [
	"raimimemes",
	"marvelmemes",
	"animemes",
	"ShakespeareMemes",
	"Discordmemes"
];

module.exports = class MemeCommand extends Command {
	constructor(client) {
		super(client, {
			name: "meme",
			group: "reddit",
			description: "Sends a meme from Reddit",
			throttling: {
				usages: 5,
				duration: 10
			}
		});
	}

	async run(message) {
		const embed = await getRedditPost.exec(subreddits);

		message.embed(embed);
	}
};