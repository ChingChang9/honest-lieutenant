const Command = require("@/client/command.js");
const RPCClient = require("@/client/rpc.js");
const { clientId } = require("@/config.json");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "rpc",
			group: "utility",
			description: "Reload RPC",
			format: "[on/off]",
			ownerOnly: true,
			hidden: true,
			arguments: [
				{
					key: "verbose",
					oneOf: ["on", "off"],
					default: "on"
				}
			]
		});
	}

	async run(message, { verbose }) {
		if (verbose === "off" && this.client.rpc.verbose) {
			this.client.rpc.clearActivity();
			this.client.rpc.verbose = false;
		} else {
			this.client.rpc.destroy();
			this.client.rpc = new RPCClient({ transport: "ipc" });
			this.client.rpc.login({ clientId }).catch(console.error);
			this.client.rpc.once("ready", () => {
				if (message.guild.voice?.dispatcher) {
					this.client.rpc.startMusicStatus(message.guild.queue[message.guild.played - 1], message.guild.voice.songElapsed);
				}
			});
		}
	}
};