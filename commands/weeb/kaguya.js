const Command = require("@/client/command.js");
const getRedditPost = require("@/scripts/getRedditPost.js");

const subreddits = [
	"Kaguya_sama"
];

module.exports = class KaguyaCommand extends Command {
	constructor(client) {
		super(client, {
			name: "kaguya",
			group: "weeb",
			aliases: ["liw", "kaguya-sama", "love-is-war"],
			description: "Sends a Reddit thread related to \"Kaguya-Sama: Love is War\"",
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