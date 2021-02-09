const Command = require("@/client/command.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "rpc",
			group: "utility",
			description: "Restarts RPC",
			ownerOnly: true,
			hidden: true
		});
	}

	run() {
		const path = `${ this.client.registry.root }/workers/rpc.js`;
		delete require.cache[path];
		require(path);
	}
};