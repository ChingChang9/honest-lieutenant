const ytpl = require("ytpl");
const play = require("@/scripts/play.js");

module.exports = (message, playlistId, number = 101) => {
	if (!message.member.voice.channel) {
		return message.reply("please only use this when you're in a voice channel");
	}

	Promise.all([
		getPlaylist(message, playlistId, number - 1),
		message.member.voice.channel.join().then(connection => {
			connection.voice.setSelfDeaf(true);
			return connection;
		})
	]).then(result => {
		const [songs, connection] = result;
		message.guild.queueRef.update(songs);
		const songLength = Object.keys(songs).length;

		if (number === 101 && songLength > 100) {
			message.embed("Enqueued the first 100 songs by default");
		}	else {
			message.embed(`Enqueued ${ songLength } songs`);
		}

		if (!connection.player.dispatcher) {
			const queue = message.guild.queue;
			play.exec(message, connection, queue, queue.length - songLength);
		}
	});
};

async function getPlaylist(message, playlistId, number) {
	const playlist = await ytpl(playlistId, { limit: number });
	let songs = {};

	await playlist.items.forEach(songInfo => {
		songs[message.guild.queueRef.push().key] = {
			title: songInfo.title,
			videoUrl: songInfo.shortUrl,
			thumbnail: songInfo.thumbnails[0].url,
			channel: songInfo.author.name,
			channelUrl: songInfo.author.url,
			duration: songInfo.durationSec,
			requester: message.member.displayName,
			requesterId: message.member.id
		};
	});

	return songs;
}