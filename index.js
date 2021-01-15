require("module-alias/register");
const DiscordClient = require("@/client/client.js");
const Database = require("better-sqlite3");
const { discordToken } = require("@/config.json");
require("@/workers/rpc.js");
require("@/workers/reddit.js");

const db = new Database("./assets/prefix.db", { verbose: console.log });

const client = new DiscordClient({
	messageCacheMaxSize: 50,
	messageCacheLifetime: 60,
	messageSweepInterval: 5 * 60
}).registry.registerCommandsIn(`${ __dirname }/commands`);

client.login(discordToken);

process.on("unhandledRejection", error => console.error("Uncaught Promise Rejection", error));