const Command = require("@/client/command.js");
const { secondsToString } = require("@/scripts/formatTime.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "queue",
			group: "music",
			aliases: ["que", "q", "cue"],
			description: "Display the music queue",
			format: "[page]",
			clientPermissions: ["MANAGE_MESSAGES"],
			guildOnly: true,
			arguments: [
				{
					key: "page",
					parse: page => parseInt(page),
					validate: page => !isNaN(page) || page === "auto" || "Please enter a number",
					default: "auto",
				}
			]
		});
	}

	async run(message, { page }) {
		const maxPage = Math.ceil(message.guild.queue.length / 10);
		if (page === "auto") {
			page = Math.ceil(message.guild.played / 10);
		} else if (page > maxPage) {
			return message.reply("The page doesn't exist");
		}

		const newMessage = await sendQueue(message, page);

		if (maxPage > 5) {
			newMessage.react("⏪");
			newMessage.react("⬅️");
			newMessage.react("➡️");
			newMessage.react("⏩");
		} else if (maxPage > 1) {
			newMessage.react("⬅️");
			newMessage.react("➡️");
		}
	}
};

async function sendQueue(message, page) {
	const queue = message.guild.queue;

	if (!queue[0]) {
		message.reactions.removeAll();
		return message.reply("This queue empty! YEET!");
	}

	const queueString = getQueueString(message.guild, page);
	const newMessage = await message.code(queueString, "ml");

	startCollector(message, newMessage, queue, page);

	return newMessage;
}

async function startCollector(oldMessage, newMessage, queue, page) {
	const collector = await newMessage.createReactionCollector((reaction, user) => ["⏪", "⬅️", "➡️", "⏩"].includes(reaction.emoji.name) && !user.bot, {
		max: 1,
		idle: 30 * 1000
	});

	const lastPage = Math.ceil(queue.length / 10);
	collector.on("collect", (reaction, user) => {
		reaction.users.remove(user.id);
		if (reaction.emoji.name === "⏪") return sendQueue(oldMessage, 1 || lastPage);
		if (reaction.emoji.name === "⬅️") return sendQueue(oldMessage, (lastPage + page - 1) % lastPage || lastPage);
		if (reaction.emoji.name === "➡️") return sendQueue(oldMessage, (lastPage + page + 1) % lastPage || lastPage);
		if (reaction.emoji.name === "⏩") return sendQueue(oldMessage, lastPage || lastPage);
	});
	collector.once("end", () => {
		if (!collector.endReason() && !newMessage.deleted) newMessage.reactions.removeAll();
	});
}

function getQueueString(guild, page) {
	const queue = guild.queue;
	let queueString = `Queue Page ${ page }/${ Math.ceil(queue.length / 10) }\n`;
	for (let index = (page - 1) * 10; index < Math.min(queue.length, page * 10); index++) {
		const isCurr = index + 1 === guild.played;
		const duration = getDuration(guild.voice, queue[index].duration, isCurr);

		let newLine = `${ isCurr ? "*" : " " }${ index + 1 }) ${ queue[index].title }`;
		if (lengthInUtf8Bytes(newLine) > 54) {
			while (lengthInUtf8Bytes(newLine) > 53) {
				newLine = newLine.slice(0, -1);
			}
			newLine += "…";
		} else {
			newLine += " ".repeat(54 - lengthInUtf8Bytes(newLine));
		}
		newLine += `| ${ duration }`;
		queueString += `\n${ newLine }`;
	}
	return queueString;
}

function getDuration(voice, durationString, isCurr) {
	const isPlaying = isCurr && voice?.dispatcher;
	if (durationString === "0") {
		return `∞ ${ isPlaying ? "left" : "    " }`;
	} else if (isPlaying) {
		return `${ secondsToString(durationString - voice.songElapsed) } left`;
	} else {
		return `${ secondsToString(durationString) }     `;
	}
}

function lengthInUtf8Bytes(string) {
	string = string.replace(/[’❤♡│♫–À-ÿ]/g, " ");
	const matched = encodeURIComponent(string).match(/%[89ABab]/g);
	return string.length + (matched ? matched.length / 3 : 0);
}