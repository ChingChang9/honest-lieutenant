const { Client } = require("discord-rpc");
const rpc = new Client({ transport: "ipc" });
const { clientId } = require("@/config.json");

rpc.login({clientId});

process.on("MUSICSTART", (song, seekTimestamp) => {
	rpc.setActivity({
		details: song,
		startTimestamp: new Date().getTime() - seekTimestamp * 1000,
		largeImageKey: "christmas",
		largeImageText: "Honest Lieutenant#0383",
		smallImageKey: "playing",
		smallImageText: "Playing",
		instance: false
	});
});

process.on("MUSICRESUME", guild => {
	rpc.setActivity({
		details: guild.queue[guild.played - 1].title,
		startTimestamp: new Date().getTime() - guild.voice.songElapsed * 1000,
		largeImageKey: "christmas",
		largeImageText: "Honest Lieutenant#0383",
		smallImageKey: "playing",
		smallImageText: "Playing",
		instance: false
	});
});

process.on("MUSICPAUSE", guild => {
	rpc.setActivity({
		details: guild.queue[guild.played - 1].title,
		largeImageKey: "christmas",
		largeImageText: "Honest Lieutenant#0383",
		smallImageKey: "paused",
		smallImageText: "Paused",
		instance: false
	});
});

process.on("MUSICSTOP", () => {
	rpc.clearActivity();
});