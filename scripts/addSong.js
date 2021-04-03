const ytsr = require("ytsr");
const playSong = require("@/scripts/playSong.js");
const { stringToSeconds } = require("@/scripts/formatTime.js");

const trashes = [
	"100 gecs",
	"ppcocaine"
];

module.exports = async (message, searchString) => {
	const songInfo = await getSongInfo(message, searchString);
	if (!songInfo) return message.reply("Sorry I couldn't find this song 😬😬\nMaybhaps give me the link?");

	const trashMessage = checkTrash(songInfo.title.toLowerCase());
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
			playSong(message, connection, queue, queue.length - 1);
		}
	});
};

async function getSongInfo(message, searchString) {
	const result = await ytsr(searchString, { limit: 1 });

	if (result.items.length) return {
		title: result.items[0].title,
		videoUrl: result.items[0].url,
		thumbnail: result.items[0].bestThumbnail.url,
		duration: stringToSeconds(result.items[0].duration),
		requesterId: message.member.id
	};
}

async function addSong(message, songInfo) {
	await message.guild.queueRef.push(songInfo);

	message.say(`Enqueued \`${ songInfo.title }\` at index \`${ message.guild.queue.length }\``);

	return message.guild.queue;
}

function checkTrash(title) {
	const trash = trashes.some(trash => {
		if (title.includes(trash)) return trash;
	});

	if (trash) {
		const refusal = [
			`No ${ trash } please!`,
			`I refuse to queue ${ trash }`,
			`nah bro, not ${ trash }`,
			`${ trash }... this ain't it chief`
		];
		return refusal[Math.floor(Math.random() * refusal.length)];
	}
}