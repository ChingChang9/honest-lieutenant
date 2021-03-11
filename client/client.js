const { Client } = require("discord.js");
const Registry = require("@/client/registry.js");
const Dispatcher = require("@/client/dispatcher.js");
const RPCClient = require("@/client/rpc.js");
const firebase = require("@/workers/firebase.js");
const { emptyQueue, clientId } = require("@/config.json");
require("@/client/guild.js");
require("@/client/message.js");
require("@/client/voice.js");

module.exports = class extends Client {
	constructor(options) {
		super(options);
		this.commandPrefix = ".";
		this.owner = "371129637725798400";
		this.rpc = new RPCClient({ transport: "ipc" });
		this.registry = new Registry(this);
		this.dispatcher = new Dispatcher(this, this.registry);

		this.rpc.login({ clientId }).catch(console.error);

		this.once("ready", () => {
			this.user.setActivity("with myself | .help");
			console.log(`Logged in as ${ this.user.tag }!`);
		});

		this.on("message", message => this.dispatcher.handleMessage(message));
		this.on("messageUpdate", (oldMessage, newMessage) => this.dispatcher.handleMessage(newMessage, oldMessage));

		this.on("guildCreate", guild => firebase.updateGuildValue(guild.id, emptyQueue));
		this.on("guildDelete", guild => firebase.database.ref(`guilds/${ guild.id }`).remove());

		this.on("error", error => console.error("Websocket connection error: ", error));
	}

	isOwner(user) {
		return user.id === this.owner;
	}
};