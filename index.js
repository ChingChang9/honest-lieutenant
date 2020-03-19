const fs = require("fs");
const Discord = require("discord.js");
const { prefix, token } = require("./config.json");

const client = new Discord.Client();
client.commands = new Discord.Collection();

function readDirectory(path) {
	const commandFiles = fs.readdirSync(path);
	for (const file of commandFiles) {
		if (fs.statSync(`${ path }/${ file }`).isDirectory()) {
			readDirectory(`${ path }/${ file }`);
		} else {
			const command = require(`${ path }/${ file }`);
			client.commands.set(command.name, command);
		}
	}
}
readDirectory("./commands");

client.on("ready", () => {
  console.log(`Logged in as ${ client.user.tag }!`);
  client.user.setActivity("with myself | .help");
});

client.on("message", (message) => {
	if (message.content.toLowerCase().startsWith("im ") || message.content.toLowerCase().startsWith("i'm ")) {
		return message.channel.send(`Hi ${ message.content.split(/ +/).splice(1).join(" ") }, I'm dad! 😂`);
	}
	if (message.content.toLowerCase().startsWith("i am ")) {
		return message.channel.send(`Hi ${ message.content.split(/ +/).splice(2).join(" ") }, I'm dad! 😂`);
	}

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const arguments = message.content.slice(prefix.length).split(/ +/);
	const commandName = arguments.shift().toLowerCase();

  const command = client.commands.get(commandName) || client.commands.find((command) => command.aliases && command.aliases.includes(commandName));
  if (!command) return;

  if (command.arguments && !arguments.length) {
		return message.reply(`you didn't provide any arguments!\nThe proper usage would be: \`${ prefix }${ command.name } ${ command.usage }\``);
  }

  try {
  	command.execute(message, arguments);
  } catch (error) {
  	console.error(error);
  	message.reply("there was an error trying to execute that command!");
  }
});

client.on("guildMemberAdd", (guildMember) => {
	guildMember.roles.add(guildMember.guild.roles.find((role) => role.name === "Stressed IB student"));
});

client.on("error", (error) => {
	 console.error("The websocket connection encountered an error:", error);
});

process.on("unhandledRejection", (error) => console.error("Uncaught Promise Rejection", error));

client.login(token);