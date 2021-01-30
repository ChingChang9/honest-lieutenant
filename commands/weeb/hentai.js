const Command = require("@/client/command.js");
const getRedditPost = require("@/scripts/getRedditPost.js");

const subreddits = [
	"hentai",
	"EmbarrassedHentai",
	"CumHentai",
	"PublicHentai",
	"MasturbationHentai",
	"Animemasturbation"
];

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "hentai",
			group: "weeb",
			description: "Sauces hentai",
			nsfw: true,
			throttling: {
				usages: 5,
				duration: 10
			}
		});
	}

	async run(message) {
		message.embed(await getRedditPost(subreddits));
	}
};