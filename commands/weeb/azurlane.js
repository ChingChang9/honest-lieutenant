const Command = require("@/client/command.js");
const getRedditPost = require("@/scripts/getRedditPost.js");

const subredditsNSFW = [
	"AzurLewd",
	"AzureLane",
	"AzurLaneXXX"
];
const subredditsSFW = [
	"AzureLane"
];

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "azurlane",
			group: "weeb",
			aliases: ["azur"],
			description: "Sends an Azur Lane waifu",
			throttling: {
				usages: 5,
				duration: 10
			}
		});
	}

	async run(message) {
		if (message.channel.nsfw) {
			message.embed(await getRedditPost(subredditsNSFW));
		} else {
			const embed = await getRedditPost(subredditsSFW, {
				nsfw: message.channel.nsfw,
				message
			});
			message.embed(embed);
		}
	}
};