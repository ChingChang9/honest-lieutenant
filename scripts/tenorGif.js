const request = require("@/workers/request.js");
const { tenorKey } = require("@/config.json");

module.exports = async q => {
	const url = await request("https://g.tenor.com/v1/search", {
		params: {
			key: tenorKey,
			q,
			contentfilter: "medium",
			media_filter: "minimal",
			ar_range: "wide",
			limit: 1,
			pos: Math.floor(Math.random() * 36)
		}
	}).then(response => response.data.results[0].media[0].gif.url);

	return {
		image: { url },
		footer: {
			text: "Via Tenor"
		}
	};
};