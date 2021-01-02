const Command = require("@/client/command.js");
const { splitMessage } = require("discord.js");
const util = require("util");
const { discordToken } = require("@/config.json");

module.exports = class EvalCommand extends Command {
	constructor(client) {
		super(client, {
			name: "eval",
			group: "utility",
			description: "Executes JavaScript code",
			format: "<script>",
			ownerOnly: true,
			hidden: true,
			arguments: [
				{
					key: "script"
				}
			]
		});

		this.lastResult = null;
	}

	run(message, { script }) {
		/* eslint-disable no-unused-vars */
		const client = this.client;
		const guild = message.guild;
		const registry = this.client.registry;
		const lastResult = this.lastResult;
		/* eslint-enable no-unused-vars */

		try {
			this.start = process.hrtime();
			this.lastResult = eval(script);
			const result = getResult(this.lastResult, process.hrtime(this.start));
			message.say(result);
		} catch(error) {
			message.say(`\`${ error }\``);
		}
	}
};

function getResult(result, time) {
	const inspected = util.inspect(result, { depth: 0 }).replace(new RegExp(discordToken, "gi"), "--snip--");
	let messageString = `\`\`\`js\n${ inspected }\n\`\`\`⏱ ${
		time[0] ? `${ time[0] }.${ Math.floor(time[1] / 1000 / 1000) }s` : `${ time[1] / 1000 }µs`
	}`;
	return splitMessage(messageString, {
		maxLength: 1900,
		prepend: "```js\n",
		append: "\n```"
	});
}