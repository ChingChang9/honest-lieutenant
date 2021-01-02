const ytdl = require("ytdl-core");
const formatTime = require("@/scripts/formatTime.js");
const firebase = require("@/scripts/firebase.js");
const servers = require("@/scripts/servers.js");
const { clientId } = require("@/config.json");

module.exports = {
	async exec(message, connection, queue, index, seekTimestamp = 0) {
		const dispatcher = await playSong(connection, queue, index, seekTimestamp);

		dispatcher.on("start", async () => {
			const repeat = await firebase.getItem(message.guild.id, "repeat");
			if (repeat !== "one" && !seekTimestamp) message.embed({
				color: "#fefefe",
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
					text: "Ching Chang © 2020 All Rights Reserved",
					icon_url: "attachment://icon.jpg"
				}
			});

			firebase.updateValue(`${ message.guild.id }/settings`, {
				played: index + 1,
				seek: seekTimestamp
			});

			servers.setDispatcher(message.guild.id, dispatcher);

			servers.getTimeout(message.guild.id)?.close();
			servers.setTimeout(message.guild.id, null);
		});

		dispatcher.on("finish", () => {
			Promise.all([
				firebase.getQueue(message.guild.id),
				firebase.getItem(message.guild.id, "repeat"),
				firebase.getItem(message.guild.id, "played")
			]).then(result => {
				const [queue, repeat, played] = result;
				servers.setDispatcher(message.guild.id, null);

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
		});

		dispatcher.on("error", error => {
			if (error.message === "input stream: Video unavailable") {
				message.reply("this video is not available in my country :(");
			} else {
				message.error(error);
			}
		});
	},
	disconnect(message) {
		servers.setTimeout(message.guild.id,
			setTimeout(() => {
				servers.setTimeout(message.guild.id, null);
				if (!message.guild.voice?.channel) return;

				const farewells = [
					"Ight imma head out",
					"Time to banana split out of this awkwardness",
					"Let me strawberry jam outta here",
					"Anyway~ I gotta wake up early tomorrow, so... yeah",
					"Alright, cya",
					`For LOHS TV, I am ${ message.guild.members.cache.get(clientId).displayName }, and just remember: BE LEGENDARY!`
				];

				message.channel.send(farewells[Math.floor(Math.random() * farewells.length)]);

				setTimeout(() => {
					message.guild.voice.channel.leave();
				}, 3 * 1000);

			}, 4 * 60 * 1000)
		);
	}
};

async function playSong(connection, queue, index, seekTimestamp) {
	return connection.play(
		await ytdl(queue[index].videoUrl, {
			filter: "audio",
			highWaterMark: 256 * 1024
		}), {
			seek: seekTimestamp,
			volume: false,
			bitrate: 64,
			highWaterMark: 1
		}
	);
}