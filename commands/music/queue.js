const { Command } = require("discord.js-commando");
const firebase = require("@/scripts/firebase.js");
const formatTime = require("@/scripts/formatTime.js");

module.exports = class QueueCommand extends Command {
  constructor(client) {
    super(client, {
			name: "queue",
			group: "music",
			memberName: "queue",
			aliases: ["que", "q", "cue"],
			description: "Display the music queue",
      format: "[page]",
      guildOnly: true,
      args: [
        {
          key: "page",
					prompt: "What page of the queue do you want to see?",
					type: "integer",
          min: 1,
          default: 0
        }
      ]
		});
  }

  async run(message, { page }) {
    const queue = await firebase.getQueue(message.guild.id);
    if (!queue[0]) return message.reply("the queue is empty!");

    const played = await firebase.getItem(message.guild.id, "played");
    page = page || Math.ceil(played / 10);

    if (page > Math.ceil(queue.length / 10)) {
      return message.reply("the page doesn't exist");
    }
    sendQueue(message, queue, page, played);
  }
};

async function sendQueue(message, queue, page, played) {
  const queueString = getQueueString(queue, page, played);

  const newMessage = await message.code("ml", queueString);

  addReactions(newMessage, queue, page);
}

async function editQueue(message, page) {
  const queue = await firebase.getQueue(message.guild.id);
  const played = await firebase.getItem(message.guild.id, "played");

  if (!queue[0]) return message.edit("```The queue has been cleared!```");

  const queueString = getQueueString(queue, page, played);

  await message.edit(`\`\`\`ml\n${ queueString }\`\`\``);

  addReactions(message, queue, page);
}

async function addReactions(message, queue, page) {
  if (page !== 1) await message.react("⬅️");
  if (page !== Math.ceil(queue.length / 10)) await message.react("➡️");

  const collector = await message.createReactionCollector((reaction, user) => ["⬅️", "➡️"].includes(reaction.emoji.name) && !user.bot, {
    max: 1, time: 30 * 1000
  });
  collector.on("collect", (reaction, user) => {
    message.reactions.removeAll();
    if (reaction.emoji.name === "⬅️") return editQueue(message, page - 1);
    if (reaction.emoji.name === "➡️") return editQueue(message, page + 1);
  });
  collector.on("end", (reaction, user) => {
    message.reactions.removeAll();
  });
}

function getQueueString(queue, page, played) {
  let queueString = `Queue Page ${ page }/${ Math.ceil(queue.length / 10) }\n`;
  for (let index = (page - 1) * 10; index < Math.min(queue.length, page * 10); index++) {
    const isPlaying = index + 1 === played;
    const duration = getDuration(queue[index].duration, isPlaying);

    let newLine = `${ isPlaying ? "*" : " " }${ index + 1 }) ${ queue[index].title }`;
    if (lengthInUtf8Bytes(newLine) > 59 - duration.length) {
      newLine = newLine.slice(0, 58 - duration.length) + "…";
    } else {
      newLine += " ".repeat(59 - duration.length - lengthInUtf8Bytes(newLine));
    }
    newLine += `| ${ duration }`;
    if (isPlaying) newLine += " left";
    queueString += `\n${ newLine }`;
  }
  return queueString;
}

function getDuration(durationString, isPlaying) {
  // if (isPlaying && ) {
  //   const seekTimestamp = await firebase.getItem(guildId, "seek");
  //   const elapsed = Math.floor(dispatcher.streamTime / 1000) + seekTimestamp;
  //   return formatTime.exec(durationString - elapsed);
  // } else {
    return formatTime.exec(durationString);
  // }
}

function lengthInUtf8Bytes(string) {
  const matched = encodeURIComponent(string).match(/%[89ABab]/g);
  return string.length + (matched ? matched.length / 3 : 0);
}