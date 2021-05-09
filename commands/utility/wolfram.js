const Command = require("@/client/command.js");
let WolframAlphaAPI = require("wolfram-alpha-api");
let { wolframAlphaAppId } = require("@/config.json");
const waApi = WolframAlphaAPI(wolframAlphaAppId);
WolframAlphaAPI = null;
wolframAlphaAppId = null;
delete require.cache[require.resolve("wolfram-alpha-api")];

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "wolfram",
			group: "utility",
			aliases: ["wolfram-alpha", "wa"],
			description: "Send a WolframAlpha query.\nTo learn more about the query format, refer to [WolframAlpha's website](https://www.wolframalpha.com)",
			format: "<query>",
			arguments: [
				{
					key: "query"
				}
			],
			throttling: {
				usage: 2,
				duration: 6
			}
		});
	}

	async run(message, { query }) {
		const output = await waApi.getShort(query).catch(error => {
			switch (error.message) {
				case "Wolfram|Alpha did not understand your input": return message.reply(error.message);
				default: return message.error(error);
			}
		});

		message.embed({
			fields: [
				{
					name: "Query",
					value: query
				},
				{
					name: "Output",
					value: output
				}
			]
		});
	}
};