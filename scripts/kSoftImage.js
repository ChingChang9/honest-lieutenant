const request = require("@/workers/request.js");
const { ksoftAuth } = require("@/config.json");

module.exports = async (tag, nsfw = false) => {
	const url = await request("https://api.ksoft.si/images/random-image", {
		headers: {
			Authorization: `Bearer ${ ksoftAuth }`
		},
		params: { tag, nsfw }
	}).then(response => response.data.url);

	return {
		image: { url },
		footer: {
			text: "Provided by KSoft.Si"
		}
	};
};