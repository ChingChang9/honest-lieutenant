const { Client } = require("discord-rpc");
const rpc = new Client({ transport: "ipc" });
const { clientId, clientSecret } = require("@/config.json");

rpc.once("ready", () => {
	rpc.setActivity({
		startTimestamp: new Date().getTime(),
		largeImageKey: "christmas",
		largeImageText: "Honest Lieutenant#0383",
		smallImageKey: "atom",
		smallImageText: "Atom",
		instance: false
	}).then(() => console.log("RPC has been set!"));
});

rpc.login({clientId, clientSecret});