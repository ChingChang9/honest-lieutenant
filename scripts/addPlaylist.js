const ytdl = require("ytdl-core");
const play = require("@/scripts/play.js");

module.exports = {
	async exec(message, urls, number) {
		if (!message.member.voice.channel) {
			return message.reply("please only use this when you're in a voice channel");
		}

		if (!urls) return message.reply("this list empty! YEET!");

		if (!number && urls.length > 10) {
			message.say("Queuing the first 10 by default...");
			number = 10;
		} else {
			number = parseInt(number) || urls.length;
		}

		Promise.all([
			addPlaylist(message, message.guild.queueRef, urls, number - 1),
			message.member.voice.channel.join().then(connection => {
				connection.voice.setSelfDeaf(true);
				return connection;
			})
		]).then(result => {
			const [songs, connection] = result;
			message.guild.queueRef.update(songs);
			const songLength = Object.keys(songs).length;
			message.say(`Enqueued ${ songLength } songs`);

			if (!connection.player.dispatcher) {
				const queue = message.guild.queue;
				play.exec(message, connection, queue, queue.length - songLength);
			}
		});
	}
};

function addPlaylist(message, queueRef, urls, number) {
	let songs = {};
	let promises = [];

	for (const url of urls) {
		if (Object.keys(songs).length > number) return;

		promises.push(new Promise(resolve => {
			ytdl.getInfo(url).then(songInfo => resolve(songInfo)).catch(error => message.error(error));
		}));
	}

	return Promise.all(promises).then(async (songInfos) => {
		await songInfos.forEach(songInfo => {
			songs[queueRef.push().key] = {
				title: songInfo.videoDetails.title,
				videoUrl: songInfo.videoDetails.video_url,
				thumbnail: songInfo.videoDetails.thumbnails[songInfo.videoDetails.thumbnails.length - 1].url,
				channel: songInfo.videoDetails.author.name,
				channelUrl: songInfo.videoDetails.author.channel_url,
				duration: songInfo.videoDetails.lengthSeconds,
				requester: message.member.displayName,
				requesterId: message.member.id
			};
		});

		return songs;
	});
}