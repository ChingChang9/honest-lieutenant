const ytdl = require("discord-ytdl-core");
const formatTime = require("@/scripts/formatTime.js");
const firebase = require("@/scripts/firebase.js");
const { clientId, embedColours } = require("@/config.json");

module.exports = {
	async exec(message, connection, queue, index, seekTimestamp = 0) {
		const dispatcher = await playSong(connection, queue, index, seekTimestamp);
		const voiceState = message.guild.voice;

		dispatcher.on("start", () => {
			if (voiceState.repeat !== "one" && !seekTimestamp) message.channel.send({
				embed: {
					color: embedColours.default,
					author: {
						name: queue[index].channel,
						url: queue[index].channelUrl
					},
					title: queue[index].title,
					url: queue[index].videoUrl,
					thumbnail: {
						url: queue[index].thumbnail
					},
					fields: [
						{
							name: "Duration",
							value: queue[index].duration === "0" ? "Live" : formatTime.exec(queue[index].duration),
							inline: true
						},
						{
							name: "Requested by",
							value: queue[index].requester,
							inline: true
						},
						{
							name: "Index",
							value: index + 1,
							inline: true
						}
					],
					footer: {
						text: "Ching Chang © 2021 Some Rights Reserved",
						icon_url: "attachment://icon.jpg"
					}
				}
			});

			firebase.updateValue(message.guild.id, {
				played: index + 1
			});

			voiceState.seekTimestamp = seekTimestamp;
			voiceState.dispatcher = dispatcher;
			voiceState.timeout?.close();
			voiceState.timeout = null;
		});

		dispatcher.on("finish", () => {
			const queue = message.guild.queue;
			const played = message.guild.played;
			const repeat = voiceState.repeat;
			voiceState.dispatcher = null;

			if (repeat === "one") {
				this.exec(message, connection, queue, played - 1);
			} else if (played === queue.length && repeat === "queue") {
				this.exec(message, connection, queue, 0);
			} else if (played === queue.length) {
				this.disconnect(message);
			} else {
				this.exec(message, connection, queue, played);
			}
		});

		dispatcher.on("error", error => {
			if (error.message === "opus stream: Video unavailable") {
				message.reply("this video is not available in my country :(");
			} else {
				message.error(error);
			}
			voiceState.dispatcher = null;
		});
	},
	disconnect(message) {
		message.guild.voice.timeout = setTimeout(() => {
			message.guild.voice.timeout = null;
			if (!message.guild.voice?.channel) return;

			const farewells = [
				"Ight imma head out",
				"Time to banana split out of this awkwardness",
				"Let me strawberry jam outta here",
				"Anyway~ I gotta wake up early tomorrow, so... yeah",
				"Alright, cya",
				"Goto. Farewell",
				"I'll go sell all my land",
				`For LOHS TV, I am ${ message.guild.members.cache.get(clientId).displayName }, and just remember: BE LEGENDARY!`
			];

			message.channel.send(farewells[Math.floor(Math.random() * farewells.length)]);

			setTimeout(() => {
				message.guild.voice.channel.leave();
			}, 3 * 1000);
		}, 4 * 60 * 1000);
	}
};

async function playSong(connection, queue, index, seekTimestamp) {
	return connection.play(
		await ytdl(queue[index].videoUrl, {
			filter: "audioonly", // TODO: CHANGE THIS TO "audio" IF STREAM ENDS UNEXPECTEDLY
			highWaterMark: 256 * 1024,
			opusEncoded: true,
			seek: seekTimestamp
		}), {
			type: "opus",
			volume: false,
			bitrate: 64,
			highWaterMark: 1
		}
	);
}