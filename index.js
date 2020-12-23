require("module-alias/register");
const fs = require("fs");
const { CommandoClient, SQLiteProvider } = require("discord.js-commando");
const path = require("path");
const sqlite = require("sqlite");
const { prefix, emptyQueue, discordToken } = require("@/config.json");
const prefixless = require("@/prefixless.js");
const firebase = require("@/scripts/firebase.js");

const client = new CommandoClient({
  commandPrefix: prefix,
  owner: "371129637725798400",
  invite: "https://discordapp.com/invite/Bu8rPza",
  disableEveryone: true
});

sqlite.open({
  filename: path.join(__dirname, "settings.sqlite3"),
  driver: sqlite.Database
}).then((db) => client.setProvider(new SQLiteProvider(db)));

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ["utility", "⚙️ Utility"],
    ["music", "🎵 Music"],
    // ["meme", "🙃 Meme"],
    ["picture", "🖼️ Picture"],
    ["other", "❓ Other"]
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({
    help: false,
    ping: false,
    prefix: false,
    unknownCommand: false
  })
  .registerCommandsIn(path.join(__dirname, "commands"));

client.once("ready", () => {
  console.log(`Logged in as ${ client.user.tag }!`);
  client.user.setActivity("with myself | .help");
});

client.on("guildCreate", (guild) => {
	firebase.updateValue(guild.id, emptyQueue);
});

client.on("guildDelete", (guild) => {
	firebase.database.ref(guild.id).remove();
});

client.on("message", (message) => {
  if (!message.author.bot && !message.content.startsWith(prefix)) prefixless.run(message);
});

client.on("error", (error) => console.error("The websocket connection encountered an error: ", error));
process.on("unhandledRejection", (error) => console.error("Uncaught Promise Rejection", error));

client.login(discordToken);