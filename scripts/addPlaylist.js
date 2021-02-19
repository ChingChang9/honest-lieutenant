const ytpl = require("ytpl");
const playSong = require("@/scripts/playSong.js");

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
		if (!songs) return;
		message.guild.queueRef.update(songs);
		const songLength = Object.keys(songs).length;

		if (number === 101 && songLength > 100) {
			message.embed("Enqueued the first 100 songs by default");
		}	else {
			message.embed(`Enqueued ${ songLength } songs`);
		}

		if (!connection.player.dispatcher) {
			const queue = message.guild.queue;
			playSong(message, connection, queue, queue.length - songLength);
		}
	});
};

async function getPlaylist(message, playlistId, number) {
	const playlist = await ytpl(playlistId, { limit: number }).catch(error => {
		switch (error.message) {
			case "Cannot read property 'contents' of undefined": return message.reply("the playlist is empty 🙄🙄");
			case "API-Error: The playlist does not exist.": return message.reply("I can't find the playlist. Is it private?");
			case "not a known youtube link": return message.reply("this is not a valid playlist. Are you trying to queue `My Mix`?\n`My Mix` is a **dyanamic** playlist generated by Youtube based on your watch history. I can't queue that lol");
			default: message.error(error);
		}
	});
	let songs = {};
	if (!playlist.items) return false;

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