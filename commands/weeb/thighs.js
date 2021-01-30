const Command = require("@/client/command.js");
const getRedditPost = require("@/scripts/getRedditPost.js");

const subreddits = [
	"thighdeology",
	"ZettaiRyouiki",
	"animelegs",
	"AnimeBurumaandSpats"
];

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "thighs",
			group: "weeb",
			aliases: ["thigh", "leg", "legs"],
			description: "Sends anime thighs",
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