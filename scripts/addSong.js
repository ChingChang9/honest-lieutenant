const ytdl = require("ytdl-core");
const play = require("@/scripts/play.js");
const firebase = require("@/scripts/firebase.js");
const Message = require("@/client/message.js");

const trashes = [
	"100 gecs",
	"ppcocaine"
];

module.exports = {
	async exec(message, songUrl) {
		if (!message.member.voice.channel) {
			return message.reply("please only use this when you're in a voice channel");
		}

		const songInfo = await ytdl.getBasicInfo(songUrl).catch(error => {
			switch (error.message) {
				case "Not a youtube domain": return message.reply("I can only play songs from Youtube");
				case "Video unavailable": return message.reply("the video is unavailable");
				case "This is a private video. Please sign in to verify that you may see it.": return message.reply("this video is private");
			}

			if (error.name === "TypeError") return message.reply("this link is invalid");
			return message.error(error);
		});
		if (songInfo instanceof Message) return;

		const trashMessage = checkTrash(songInfo.videoDetails.title.toLowerCase());
		if (trashMessage) return message.reply(trashMessage);

		Promise.all([
			addSong(message, songInfo),
			message.member.voice.channel.join().then(connection => {
				connection.voice.setSelfDeaf(true);
				return connection;
			})
		]).then(result => {
			const [queue, connection] = result;

			if (!connection.player.dispatcher) {
				play.exec(message, connection, queue, queue.length - 1);
			}
		});
	}
};

async function addSong(message, songInfo) {
	await firebase.database.ref(`${ message.guild.id }/queue`).push({
		title: songInfo.videoDetails.title,
		videoUrl: songInfo.videoDetails.video_url,
		thumbnail: songInfo.videoDetails.thumbnails[songInfo.videoDetails.thumbnails.length - 1].url,
		channel: songInfo.videoDetails.ownerChannelName,
		channelUrl: `https://www.youtube.com/channel/${ songInfo.videoDetails.channelId }`,
		duration: songInfo.videoDetails.lengthSeconds,
		requester: message.member.displayName,
		requesterId: message.member.id
	});

	const queue = message.guild.queue;
	message.say(`Enqueued \`${ songInfo.videoDetails.title }\` at index \`${ queue.length }\``);

	return queue;
}

function checkTrash(title) {
	const trash = trashes.some(trash => {
		if (title.includes(trash)) return trash;
	});

	if (trash) {
		const refusal = [
			`no ${ trash } please!`,
			`I refuse to queue ${ trash }`,
			`nah bro, not ${ trash }`,
			`${ trash }... this ain't it chief`
		];
		return refusal[Math.floor(Math.random() * refusal.length)];
	}
}