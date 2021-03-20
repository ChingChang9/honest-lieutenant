const { Client } = require("discord-rpc");

module.exports = class extends Client {
	constructor(options) {
		super(options);
		this.startMusicStatus = (song, seekTimestamp) => {
			this.setActivity({
				details: song.title,
				startTimestamp: new Date().getTime() - seekTimestamp * 1000,
				largeImageKey: "anime",
				largeImageText: "Honest Lieutenant#0383",
				smallImageKey: "playing",
				smallImageText: "Playing",
				instance: false,
				buttons: [
					{
						label: "Listen",
						url: song.videoUrl
					}
				]
			});
		};
		this.pauseMusicStatus = song => {
			this.setActivity({
				details: song.title,
				largeImageKey: "anime",
				largeImageText: "Honest Lieutenant#0383",
				smallImageKey: "paused",
				smallImageText: "Paused",
				instance: false,
				buttons: [
					{
						label: "Listen",
						url: song.videoUrl
					}
				]
			});
		};
		this.verbose = true;
	}
};