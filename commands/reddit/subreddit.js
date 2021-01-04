const Command = require("@/client/command.js");
const getRedditPost = require("@/scripts/getRedditPost.js");
const axios = require("axios");

module.exports = class SubRedditCommand extends Command {
	constructor(client) {
		super(client, {
			name: "subreddit",
			group: "reddit",
			aliases: ["sub"],
			description: "Sends a post from a subreddit",
			format: "<subreddit>",
			examples: [
				{
					input: "discordapp",
					explanation: "Sends a post from r/discordapp"
				}
			],
			throttling: {
				usages: 5,
				duration: 10
			},
			arguments: [
				{
					key: "subreddit",
					parse: subreddit => subreddit.replace(/^r\//, "")
				}
			]
		});
	}

	async run(message, { subreddit }) {
		const nsfw = await axios(`https://www.reddit.com/r/${ subreddit }/about.json`).then(response => response.data.data.over18);

		if (nsfw && !message.channel.nsfw) {
			return message.reply("this subreddit is age restricted and this is a SFW channel");
		}

		message.embed(await getRedditPost.exec([subreddit]));
	}
};