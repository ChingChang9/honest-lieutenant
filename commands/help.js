const Discord = require("discord.js");
const { prefix } = require("../config.json");
const icon = new Discord.MessageAttachment("./assets/icon.jpg");

module.exports = {
  name: "help",
  description: "List all of my commands or info about a specific command",
  aliases: ["commands"],
  usage: "<command-name>",
  execute(message, arguments) {
    const data = [];
    const { commands } = message.client;

    if (!arguments.length) {
      const helpEmbed = {
      	color: "#fefefe",
      	author: {
      		name: "Honest Lieutenant",
      		icon_url: "attachment://icon.jpg",
      		url: "https://www.chingchang.dev"
      	},
      	description: "Here's a list of all my commands\nType `.help <command>` for information on a specific command.",
      	fields: [
      		{
      			name: "🎵 Music",
      			value: `\`${ prefix }${ commands.map((command) => command.name).join(`\`, \`${ prefix }`) }\``
      		}
      	],
      	footer: {
      		text: "Ching Chang © 2020 All Rights Reserved",
      		icon_url: "attachment://icon.jpg"
      	}
      };
      return message.author.send({ files: [icon], embed: helpEmbed })
      	.then(() => {
      		if (message.channel.type === "dm") return;
      		message.reply("I've sent you a DM with all my commands!");
      	})
      	.catch((error) => {
      		console.error(`Could not send help DM to ${ message.author.tag }.\n`, error);
      		message.reply("It seems like I can't DM you! Do you have DM's disabled?");
      	});
    } else {
      const name = arguments[0].toLowerCase();
      const command = commands.get(name) || commands.find((command) => command.aliases && command.aliases.includes(name));
      if (!command) return message.reply("That's not a valid command!");

      const helpEmbed = {
      	color: "#fefefe",
      	author: {
      		name: "Honest Lieutenant",
      		icon_url: "attachment://icon.jpg",
      		url: "https://www.chingchang.dev"
      	},
        title: `${ prefix }${ command.name }`,
      	description: `Function:\n${ command.description }`,
      	fields: [
          {
            name: "Usage",
            value: `\`${ prefix }${ command.name } ${ command.usage }\``,
            inline: true
          },
          {
            name: "Default Value",
            value: command.default || "No default value",
            inline: true
          }
      	],
      	footer: {
      		text: "Ching Chang © 2020 All Rights Reserved",
      		icon_url: "attachment://icon.jpg"
      	}
      };
      return message.channel.send({ files: [icon], embed: helpEmbed })
      	.catch((error) => {
      		console.error(`Could not send help DM to ${ message.author.tag }.\n`, error);
      		message.reply("It seems like I can't DM you! Do you have DM's disabled?");
      	});
    }
  }
};