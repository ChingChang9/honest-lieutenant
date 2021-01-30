require("module-alias/register");
const { Intents } = require("discord.js");
const DiscordClient = require("@/client/client.js");
// const Database = require("better-sqlite3");
const { discordToken } = require("@/config.json");
require("@/workers/rpc.js");

// const db = new Database("./assets/prefix.db", { verbose: console.log });
const intents = new Intents(["GUILDS", "GUILD_VOICE_STATES", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES"]);

const client = new DiscordClient({
	messageCacheMaxSize: 50,
	messageCacheLifetime: 60,
	messageSweepInterval: 5 * 60,
	ws: { intents }
}).registry.registerCommandsIn(`${ __dirname }/commands`);

client.login(discordToken);

process.on("unhandledRejection", error => console.error("Uncaught Promise Rejection", error));