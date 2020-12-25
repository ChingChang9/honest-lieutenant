const { Command } = require("discord.js-commando");
const { splitMessage } = require("discord.js");
const util = require("util");
const { discordToken } = require("@/config.json");

module.exports = class EvalCommand extends Command {
	constructor(client) {
		super(client, {
			name: "eval",
			group: "utility",
			memberName: "eval",
			description: "Execute JavaScript code",
			ownerOnly: true,
      hidden: true,
			args: [
				{
					key: "script",
					prompt: "What code would you like to evaluate?",
					type: "string"
				}
			]
		});

		this.lastResult = null;
	}

	run(message, { script }) {
		const client = message.client;
		const lastResult = this.lastResult;
		const doReply = (value) => {
			if (value instanceof Error) {
				message.reply(`Callback error: \`${ value }\``);
			} else {
				const result = getResult(value, process.hrtime(this.start));
				if (Array.isArray(result)) {
					for (const item of result) message.say(item);
				} else {
					message.say(result);
				}
			}
		};

		try {
      this.start = process.hrtime();
			this.lastResult = eval(script);
  		const result = getResult(this.lastResult, process.hrtime(this.start));
  		if (Array.isArray(result)) {
  			result.map(item => message.say(item));
  		} else {
  			message.say(result);
  		}
		} catch(error) {
			message.reply(`\`${ error }\``);
		}
	}
};

function getResult(result, time) {
  const inspected = util.inspect(result, { depth: 0 }).replace(new RegExp(discordToken, "gi"), "--snip--");
  let messageString = `\`\`\`js\n${ inspected }\n\`\`\`⏱ ${
    time[0] ? `${ time[0] }.${ Math.floor(time[1] / 1000000) }s` : `${ time[1] / 1000 }µs`
  }`;
  return splitMessage(messageString, {
    maxLength: 1900,
    prepend: "```js\n",
    append: "\n```"
  });
}