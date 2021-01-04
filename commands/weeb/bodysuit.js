const Command = require("@/client/command.js");
const getRedditPost = require("@/scripts/getRedditPost.js");

const subreddits = [
	"animebodysuits"
];

module.exports = class BodysuitCommand extends Command {
	constructor(client) {
		super(client, {
			name: "bodysuit",
			group: "weeb",
			aliases: ["bodysuits"],
			description: "Sends an anime girl in bodysuit",
			nsfw: true,
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