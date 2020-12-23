const { Command } = require("discord.js-commando");
const { MessageAttachment } = require("discord.js");
const icon = new MessageAttachment("./assets/icon.jpg");

module.exports = class HelpCommand extends Command {
	constructor(client) {
		super(client, {
			name: "help",
			group: "utility",
			memberName: "help",
			aliases: ["alias", "aliases", "command", "commands", "h"],
			description: "List all of my commands or details about a specific command",
			examples: ["help", "help prefix"],
      guarded: true,
			args: [
				{
					key: "command",
					prompt: "Which command would you like to view the help for?",
					type: "string",
					default: ""
				}
			]
		});
	}

  run(message, { command }) {
		if (!command) {
      let fields = [];
      this.client.registry.groups.forEach((group) => {
        fields.push({
          name: group.name,
          value: `\`${ this.client.commandPrefix }${ group.commands.map((command) => command.name).join(`\`, \`${ this.client.commandPrefix }`) }\``
        });
      });
      for (let group in this.client.registry.groups) {
        fields.push({
          name: group,
          value: `\`${ this.client.commandPrefix }${ this.client.registry.groups[key].map((command) => command.join(`\`, \`${ this.client.commandPrefix }`)) }\``
        });
      }
      return message.channel.send({
        files: [icon],
        embed: {
        	color: "#fefefe",
        	author: {
        		name: "Honest Lieutenant's Commands",
        		icon_url: "attachment://icon.jpg",
        		url: "https://www.chingchang.dev"
        	},
        	description: `Use \`${ this.client.commandPrefix }help [command]\` for more information on a specific command\n\`<>\`: Required \`[]\`: Optional`,
        	fields: fields,
        	footer: {
        		text: "Ching Chang © 2020 All Rights Reserved",
        		icon_url: "attachment://icon.jpg"
        	}
        }
      });
		}

    const commands = this.client.registry.findCommands(command, false, message);
    if (commands.length === 1) {
      command = commands[0];
      return message.channel.send({
        files: [icon],
        embed: {
          color: "#fefefe",
          author: {
            name: "Honest Lieutenant's Help Menu",
            icon_url: "attachment://icon.jpg",
            url: "https://www.chingchang.dev"
          },
          title: `${ this.client.commandPrefix }${ command.name }`,
          description: command.description,
          fields: [
            {
              name: "Usage",
              value: `\`${ this.client.commandPrefix }${ command.name } ${ command.format }\``,
              inline: true
            },
            {
              name: "Default Value",
              value: command.default || "No default value",
              inline: true
            },
            {
              name: "Aliases",
              value: command.aliases ? `\`${ this.client.commandPrefix }${ command.aliases.join(`\`, \`${ this.client.commandPrefix }`) }\`` : "No aliases"
            }
          ]
        }
      });
    } else if (commands.length > 1) {
      return message.reply("Found multiple commands, please be more specific");
    } else {
      return message.reply("I can't find the command. Use `.help` to see all my commands.");
    }
  }
};