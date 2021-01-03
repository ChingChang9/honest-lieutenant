require("module-alias/register");
const DiscordClient = require("@/client/client.js");
const Database = require("better-sqlite3");
const { discordToken } = require("@/config.json");
require("@/rpcClient.js");

const db = new Database("./assets/prefix.db", { verbose: console.log });

const client = new DiscordClient({
	messageCacheMaxSize: 50,
	messageCacheLifetime: 60,
	messageSweepInterval: 5 * 60
});
client.registry.registerGroups([
	{ id: "utility", name: "⚙️ Utility", guarded: true },
	{ id: "music", name: "🎵 Music" },
	{ id: "picture", name: "🖼️ Picture" },
	{ id: "reaction", name: "<:tsundere:763493801301245975> Reaction" },
	{ id: "meme", name: "🙃 Meme Maker" },
	{ id: "other", name: "❓ Other" }
]).registerCommandsIn(`${ __dirname }/commands`);

client.login(discordToken);

process.on("unhandledRejection", error => console.error("Uncaught Promise Rejection", error));