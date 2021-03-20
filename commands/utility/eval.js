const Command = require("@/client/command.js");
const util = require("util");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "eval",
			group: "utility",
			description: "Execute JavaScript code",
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

	async run(message, { script }) {
		/* eslint-disable no-unused-vars */
		const client = this.client;
		const guild = message.guild;
		const registry = this.client.registry;
		const lastResult = this.lastResult;
		/* eslint-enable no-unused-vars */

		try {
			this.start = process.hrtime();
			this.lastResult = await eval(script);
			const result = getResult(this.lastResult, process.hrtime(this.start));
			message.code(result, "js", "");
		} catch (error) {
			message.say(`\`${ error }\``);
		}
	}
};

function getResult(result, time) {
	return `${ util.inspect(result, { depth: 0 }) }\n\`\`\`⏱ ${
		time[0] ? `${ time[0] }.${ Math.floor(time[1] / 1000 / 1000) }s` : `${ time[1] / 1000 }µs`
	}`;
}