const Command = require("@/client/command.js");
const getRedditPost = require("@/scripts/getRedditPost.js");

const subreddits = [
	"KanojoOkarishimasu"
];

module.exports = class KanojoCommand extends Command {
	constructor(client) {
		super(client, {
			name: "kanojo",
			group: "weeb",
			aliases: ["rent-a-gf"],
			description: "Sends a Reddit thread related to \"Kanojo, Okarishimasu (Rent a Girlfriend)\"",
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