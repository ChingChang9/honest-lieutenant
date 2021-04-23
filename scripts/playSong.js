const ytdl = require("discord-ytdl-core");
const { secondsToString } = require("@/scripts/formatTime.js");
const firebase = require("@/workers/firebase.js");
const { embedColours } = require("@/config.json");

module.exports = playSong;

async function playSong(message, connection, queue, index, seekTimestamp = 0, changeFilter = false) {
	const dispatcher = await startSong(connection, queue, index, seekTimestamp, message.guild.voice.filter);
	const voiceState = message.guild.voice;
	const requester = await message.getDisplayName(queue[index].requesterId);

	dispatcher.once("start", () => {
		if (message.client.rpc.verbose) message.client.rpc.startMusicStatus(queue[index], seekTimestamp);
		if (voiceState.repeat !== "one" && !seekTimestamp) message.channel.send({
			embed: {
				color: embedColours.default,
				title: queue[index].title,
				url: queue[index].videoUrl,
				thumbnail: {
					url: queue[index].thumbnail
				},
				fields: [
					{
						name: "Duration",
						value: queue[index].duration === "0" ? "Live" : secondsToString(queue[index].duration),
						inline: true
					},
					{
						name: "Requested by",
						value: requester,
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
		if (changeFilter) {
			voiceState.displayFilters(message);
		}

		firebase.updateGuildValue(message.guild.id, {
			played: index + 1
		});

		voiceState.seekTimestamp = seekTimestamp;
		voiceState.dispatcher = dispatcher;
		voiceState.timeout?.close();
		voiceState.timeout = null;
	});

	dispatcher.once("finish", () => {
		message.client.rpc.clearActivity();
		const queue = message.guild.queue;
		const played = message.guild.played;
		const repeat = voiceState.repeat;
		voiceState.dispatcher = null;

		if (repeat === "one") {
			playSong(message, connection, queue, played - 1);
		} else if (played === queue.length && repeat === "queue") {
			playSong(message, connection, queue, 0);
		} else if (played === queue.length) {
			disconnect(message);
		} else {
			playSong(message, connection, queue, played);
		}
	});

	dispatcher.once("error", error => {
		message.error(error);

		message.client.rpc.clearActivity();
		const queue = message.guild.queue;
		const played = message.guild.played;
		voiceState.dispatcher = null;

		if (played === queue.length && voiceState.repeat === "queue") {
			playSong(message, connection, queue, 0);
		} else if (played === queue.length) {
			disconnect(message);
		} else {
			playSong(message, connection, queue, played);
		}
	});
}

async function startSong(connection, queue, index, seekTimestamp, filter) {
	const stream = await ytdl(queue[index].videoUrl, {
		filter: "audio",
		highWaterMark: 256 * 1024,
		opusEncoded: true,
		seek: seekTimestamp,
		encoderArgs: filter ? ["-af", filter] : null
	});

	return connection.play(stream, {
		type: "opus",
		volume: false,
		bitrate: 64,
		highWaterMark: 1
	});
}

function disconnect(message) {
	message.guild.voice.timeout = setTimeout(() => {
		message.guild.voice.timeout = null;
		if (!message.guild.voice?.channel) return;

		const farewells = [
			"ight imma head out",
			"Time to banana split out of this awkwardness",
			"Let me strawberry jam outta here",
			"Anyway~ I gotta wake up early tomorrow, so... yeah",
			"Alright, cya",
			"Goto. Farewell",
			"I'll go sell all my land",
			`For LOHS TV, I am ${ message.guild.clientName }, and just remember: BE LEGENDARY!`,
			"oyasuminasai"
		];

		message.channel.send(farewells[Math.floor(Math.random() * farewells.length)]);

		setTimeout(() => {
			message.guild.voice.channel.leave();
		}, 3 * 1000);
	}, 4 * 60 * 1000);
}