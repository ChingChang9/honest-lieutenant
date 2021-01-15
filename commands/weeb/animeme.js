const Command = require("@/client/command.js");
const getRedditPost = require("@/scripts/getRedditPost.js");

const subreddits = [
	"goodanimemes",
	"animemes",
	"animememes"
];

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "animeme",
			group: "weeb",
			aliases: ["animemes", "animememe", "animememes"],
			description: "Sends an anime meme (Might contain spoilers)",
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