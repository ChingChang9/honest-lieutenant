require("module-alias/register");
const { CommandoClient, SQLiteProvider } = require("discord.js-commando");
const path = require("path");
const sqlite = require("sqlite");
const { emptyQueue, discordToken } = require("@/config.json");
const prefixless = require("@/prefixless.js");
const firebase = require("@/scripts/firebase.js");

const client = new CommandoClient({
  commandPrefix: ".",
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
    ["meme", "🙃 Meme"],
    ["picture", "🖼️ Picture"],
    ["other", "❓ Other"]
  ])
  .registerCommandsIn(path.join(__dirname, "commands"));

client.once("ready", () => {
  client.user.setActivity("with myself | .help");
  console.log(`Logged in as ${ client.user.tag }!`);
});

client.on("guildCreate", (guild) => {
	firebase.updateValue(guild.id, emptyQueue);
});

client.on("guildDelete", (guild) => {
	firebase.database.ref(guild.id).remove();
});

client.on("message", async (message) => {
  if (!message.author.bot && !message.content.startsWith(message.guild.commandPrefix)) {
    prefixless.run(message);
  }
});

client.on("error", (error) => console.error("Websocket connection error: ", error));
process.on("unhandledRejection", (error) => console.error("Uncaught Promise Rejection", error));

client.login(discordToken);