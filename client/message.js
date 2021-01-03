const { Structures, MessageAttachment } = require("discord.js");

module.exports = Structures.extend("Message", Message => {
	return class extends Message {
		constructor(...args) {
			super(...args);
			this.command = null;
			this.argString = null;
			this.response = null;
		}

		initCommand(command, argString) {
			this.command = command;
			this.argString = argString;
			this.run();
		}

		async run() {
			if (this.canRun() !== true) return;

			const throttle = this.command.throttle(this.author.id);
			if (throttle) throttle.usages++;

			const args = await this.parseArgs(this.argString);
			if (args instanceof Message) return;
			this.command.run(this, args);
		}

		async parseArgs(argString) {
			const argsArray = this.command.arguments.length > 1 ? argString.split(" ") : [argString];
			let args = {};

			for (let index = 0; index < this.command.arguments.length; index++) {
				const arg = this.command.arguments[index];

				if (!argsArray[index] && arg.default === null) {
					return await this.reply(`the correct usage is \`${
						this.guild.commandPrefix }${ this.command.name } ${ this.command.format
					}\`. Use \`${ this.guild.commandPrefix }help ${ this.command.name
					}\` for more information`);
				}

				const argValue = argsArray[index] ? arg.parse(argsArray[index]) : arg.default;

				if (arg.oneOf && !arg.oneOf.includes(argValue)) {
					return await this.reply(`the input has to be one of \`${ arg.oneOf.join("`, `") }\``);
				}

				const validity = arg.validate(argValue, this);
				if (typeof validity === "string") return await this.reply(validity);

				args[arg.key] = argValue;
			}

			return args;
		}

		canRun() {
			if (this.command.guildOnly && !this.guild) return this.command.onBlock(this, "guildOnly");
			if (this.command.nsfw && !this.channel.nsfw) return this.command.onBlock(this, "nsfw");

			const hasPermission = this.command.hasPermission(this);
			if (typeof hasPermission === "string") {
				return this.command.onBlock(this, "permission", { response: typeof hasPermission === "string" ? hasPermission : undefined });
			}

			if (this.command.clientPermissions) {
				const missing = this.channel.permissionsFor(this.client.user).missing(this.command.clientPermissions);
				if (missing.length) {
					return this.command.onBlock(this, "clientPermissions", { missing });
				}
			}

			const throttle = this.command.throttle(this.author.id);
			if (throttle && throttle.usages + 1 > this.command.throttling.usages) {
				const remaining = (throttle.start + (this.command.throttling.duration * 1000) - Date.now()) / 1000;
				const data = { throttle, remaining };
				return this.command.onBlock(this, "throttling", data);
			}

			return true;
		}

		say(content) {
			if (content instanceof MessageAttachment || content.files) {
				this.response?.delete();
				return this.channel.send(content).then(response => {
					this.response = response;
					return response;
				});
			} else {
				const message = this.response ? this.response.edit(content) : this.channel.send(content);
				return message.then(response => {
					this.response = response;
					return response;
				});
			}
		}

		reply(content) {
			return this.say(`<@${ this.author.id }>, ${ content }`);
		}

		code(content, lang = "") {
			return this.say(`\`\`\`${ lang }\n${ content }\n\`\`\``); // TODO: USE splitMessage FROM DISCORD.JS
		}

		embed(embed) {
			return this.say({embed});
		}

		error(error) {
			this.reply(`\`${ error.name }: ${ error.message }\`\nPlease contact <@${ this.client.owner }> here: https://discordapp.com/invite/Bu8rPza`);
		}
	};
});