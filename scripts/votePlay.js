const play = require("@/scripts/play.js");
const firebase = require("@/workers/firebase.js");

module.exports = (message, queue, currentIndex, toIndex, text, emoji) => {
	if (!message.member.voice.channel) {
		return message.reply("please only use this when you're in a voice channel");
	}

	if (toIndex >= queue.length) {
		firebase.updateValue(message.guild.id, {
			played: queue.length,
		});
		if (message.guild.voice?.dispatcher) {
			message.guild.voice?.dispatcher.end();
			message.guild.voice.dispatcher = null;
		}
		return;
	}

	const connection = await message.member.voice.channel.join();
	connection.voice.setSelfDeaf(true);

	if (message.member.id === queue[currentIndex].requesterId || connection.channel.members.size < 3 || !connection.player.dispatcher) {
		play.exec(message, connection, queue, toIndex);
	} else {
		const newMessage = await message.say(text);
		addReactions(newMessage, emoji, connection, queue, currentIndex, toIndex);
	}
};

async function addReactions(message, emoji, connection, queue, currentIndex, toIndex) {
	message.react(emoji);
	const collector = await message.createReactionCollector((reaction, user) => reaction.emoji.name === emoji && !user.bot, {
		max: Math.ceil((connection.channel.members.size - 1) * 2 / 3) + 1,
		time: 30 * 1000
	});
	collector.on("collect", (reaction, user) => {
		if (user.id === queue[currentIndex].requesterId || collector.size >= Math.ceil((connection.channel.members.size - 1) * 2 / 3)) {
			play.exec(message, connection, queue, toIndex);
			collector.stop();
		}
	});
	collector.on("end", () => message.delete());
}