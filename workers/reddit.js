const Snoowrap = require("snoowrap");
const request = require("@/workers/request.js");
const { redditAuth, discordWebhook } = require("@/config.json");

const user = new Snoowrap(redditAuth).getMe();
let lastUrl;

setInterval(async () => {
	const newSaved = await user.getSavedContent({limit: 1})[0];
	if (lastUrl && lastUrl !== newSaved.url) {
		request(`https://discord.com/api/webhooks/${ discordWebhook.id }/${ discordWebhook.token }`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: {
				embeds: [{
					color: 16711422,
					author: {
						name: newSaved.title.slice(0, 256),
						url: `https://www.reddit.com${ newSaved.permalink }`
					},
					image: {
						url: newSaved.url
					}
				}]
			}
		});
	}
	lastUrl = newSaved.url;
}, 30 * 1000);