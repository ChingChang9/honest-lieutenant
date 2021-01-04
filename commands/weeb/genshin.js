const Command = require("@/client/command.js");
const getRedditPost = require("@/scripts/getRedditPost.js");

const subreddits = [
	"Genshin_Impact"
];

module.exports = class GenshinCommand extends Command {
	constructor(client) {
		super(client, {
			name: "genshin",
			group: "weeb",
			aliases: ["genshin-impact", "genshinimpact"],
			description: "Sends a Genshin Impact-related post from Reddit",
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