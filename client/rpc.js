const { Client } = require("discord-rpc");

module.exports = class extends Client {
	constructor(options) {
		super(options);
		this.startMusicStatus = (song, seekTimestamp) => {
			this.request("SET_ACTIVITY", {
				pid: process.pid,
				activity: {
					details: song.title,
					timestamps: {
						start: new Date().getTime() - seekTimestamp * 1000
					},
					assets: {
						large_image: "anime",
						large_text: "Honest Lieutenant#0383",
						small_image: "playing",
						small_text: "Playing"
					},
					instance: false,
					buttons: [
						{
							label: "Listen",
							url: song.videoUrl
						}
					]
				}
			});
		};
		this.pauseMusicStatus = song => {
			this.request("SET_ACTIVITY", {
				pid: process.pid,
				activity: {
					details: song.title,
					assets: {
						large_image: "anime",
						large_text: "Honest Lieutenant#0383",
						small_image: "paused",
						small_text: "Paused"
					},
					instance: false,
					buttons: [
						{
							label: "Listen",
							url: song.videoUrl
						}
					]
				}
			});
		};
		this.verbose = true;
	}
};