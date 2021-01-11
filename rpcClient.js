const { Client } = require("discord-rpc");
const rpc = new Client({ transport: "ipc" });
const { clientId } = require("@/config.json");

rpc.login({clientId});

process.on("MUSICSTART", song => {
	rpc.setActivity({
		details: song,
		startTimestamp: new Date().getTime(),
		largeImageKey: "christmas",
		largeImageText: "Honest Lieutenant#0383",
		smallImageKey: "playing",
		smallImageText: "Playing",
		instance: false
	});
});

process.on("MUSICSTOP", () => {
	rpc.clearActivity();
});