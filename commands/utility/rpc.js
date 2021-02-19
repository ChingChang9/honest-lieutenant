const Command = require("@/client/command.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "rpc",
			group: "utility",
			description: "Reloads RPC",
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

	run(message, { verbose }) {
		if (verbose === "off") {
			this.client.rpc.clearActivity();
			this.client.rpc.verbose = false;
		} else {
			const path = `${ this.client.registry.root }/workers/rpc.js`;
			delete require.cache[path];
			this.client.rpc = require(path);
			if (message.guild.voice?.dispatcher) {
				this.client.rpc.on("ready", () => {
					this.client.rpc.startMusicStatus(message.guild.queue[message.guild.played - 1], message.guild.voice.songElapsed);
				});
			}
		}
	}
};