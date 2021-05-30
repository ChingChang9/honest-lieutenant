const { Structures, MessageAttachment, splitMessage } = require("discord.js");
const { embedColours } = require("@/config.json");

module.exports = Structures.extend("Message", Message => class extends Message {
	constructor(...args) {
		super(...args);
		this.command = null;
		this.argString = null;
		this._response = null;
	}

	initCommand(command, argString) {
		this.command = command;
		this.argString = argString;
		this.run();
	}

	run() {
		if (this._block() instanceof Promise) return;

		const throttle = this.command.throttle(this.author.id);
		if (throttle) throttle.usages++;

		const args = this._parseArgs(this.argString);
		if (args instanceof Promise) return;
		this.command.run(this, args);
	}

	_parseArgs(argString) {
		const argsArray = this.command.arguments.length > 1 ? argString.split(" ") : [argString];
		let args = {};

		for (let index = 0; index < this.command.arguments.length; index++) {
			const arg = this.command.arguments[index];

			if (!argsArray[index] && arg.default === null && (!arg.allowAttachment || arg.allowAttachment && !this.attachments.size)) {
				return this.reply(`The correct usage is \`${
					this.guild.commandPrefix }${ this.command.name } ${ this.command.format
				}\`\nType \`${ this.guild.commandPrefix }help ${ this.command.name
				}\` for more information`);
			}

			const argValue = argsArray[index] ? arg.parse(argsArray[index]) : arg.default;

			if (arg.oneOf && !arg.oneOf.includes(argValue)) {
				return this.reply(`The input has to be one of \`${ arg.oneOf.join("`, `") }\``);
			}

			const validity = arg.validate(argValue, this);
			if (typeof validity === "string") return this.reply(validity);

			args[arg.key] = argValue;
		}

		return args;
	}

	_block() {
		if (this.command.isDisabledIn(this.guild)) return this.reply(`The ${ this.command.name } command is disabled in this server`);
		if ((this.command.guildOnly || this.command.voiceOnly) && !this.guild) return this.reply(`The \`${ this.command.name }\` command can only be used in servers`);
		if (this.command.voiceOnly && !this.member.voice.channel) return this.reply(`Please only use the ${ this.command.name } command when you're in a voice channel`);
		if (this.command.nsfw && !this.channel.nsfw) return this.reply(`The \`${ this.command.name }\` command can only be used in NSFW channels`);
		if (this.command.ownerOnly && !this.client.isOwner(this.author)) return this.reply(`The \`${ this.command.name }\` command can only be used by the bot owner`);

		if (this.command.userPermissions) {
			const missing = this.channel.permissionsFor(this.author).missing(this.command.userPermissions);
			if (missing.length === 1) {
				return this.reply(`You need the \`${ missing[0].replace(/_/g, " ").toLowerCase() }\` permission to run this command`);
			} else if (missing.length > 1) {
				return this.reply(`You need the following permissions to run this command: \`${ missing.map(perm => perm.toLowerCase().replace(/_/g, " ")).join("`, `") }\``);
			}
		}

		if (this.command.clientPermissions) {
			const missing = this.channel.permissionsFor(this.client.user).missing(this.command.clientPermissions);
			if (missing.length === 1) {
				return this.reply(`I need the "${ missing[0].toLowerCase().replace(/_/g, " ") }" permission for the \`${ this.command.name }\` command to work`);
			} else if (missing.length > 1) {
				return this.reply(`I need the following permissions to run the \`${ this.command.name }\` command: ${
					missing.map(perm => perm.toLowerCase().replace(/_/g, " ")).join(", ") }`);
			}
		}

		const throttle = this.command.throttle(this.author.id);
		if (throttle && throttle.usages >= this.command.throttling.usages) {
			const remaining = (throttle.start + this.command.throttling.duration * 1000 - Date.now()) / 1000;
			return this.reply(`You may not use the \`${ this.command.name }\` command again for another ${ remaining.toFixed(1) } seconds`);
		}
	}

	async getDisplayName(userId) {
		return await this.guild.members.fetch(userId).then(member => member.displayName)
			.catch(() => this.client.users.fetch(userId).then(user => user.username).catch(() => "Deleted User"));
	}

	say(content, cache = true) {
		let message;
		if (content instanceof MessageAttachment || content.files || this._response?.embeds[0]?.image ||
			this._response?.embeds[0]?.thumbnail || this._response?.embeds[0]?.footer?.iconURL) {
			message = this.channel.send(content);
			this._response?.delete();
		} else {
			if (typeof content === "string") content = { content, embed: null };
			message = this._response ? this._response.edit(content) : this.channel.send(content);
		}
		return message.then(response => {
			this._response = cache ? response : null;
			return response;
		});
	}

	code(content, lang = "", lastAppend = "\n```") {
		const contents = splitMessage(`\`\`\`${ lang }\n${ content }${ lastAppend }`, {
			maxLength: 1800,
			prepend: `\`\`\`${ lang }\n`,
			append: "\n```"
		});
		for (let i = 0; i < contents.length - 1; i++) {
			this.say(contents[i], false);
		}

		return this.say(contents[contents.length - 1]);
	}

	embed(embed, type = "default") {
		if (typeof embed === "string") {
			return this.say({
				embed: {
					color: embedColours[type],
					author: { name: embed }
				}
			});
		} else {
			embed.color = embedColours[type];
			const files = embed.files;
			delete embed.files;
			return this.say({ files, embed });
		}
	}

	reply(content) {
		return this.embed({
			description: `[<@${ this.author.id }>] ${ content }`
		}, "error");
	}

	error(error) {
		return this.embed({
			author: {
				name: "We don't know what happened 😬😬"
			},
			title: `${ error.name }: ${ error.message }`,
			description: "Please contact `Ching Chang#9870` in [the support server](https://discordapp.com/invite/Bu8rPza)"
		}, "error");
	}
});
