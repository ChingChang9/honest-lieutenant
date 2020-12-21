const firebase = require("@/scripts/firebase.js");

module.exports = {
  name: "queue",
  description: "Display the music queue",
  aliases: ["que", "q", "cue"],
  arguments: false,
  usage: "[page]",
  default: "auto",
  async execute(message, arguments) {
    const queue = await firebase.getQueue(message.guild.id);
    const played = await firebase.getPlayed(message.guild.id);
    const page = parseInt(arguments[0]) || Math.ceil(played / 10);

    if (page > Math.ceil(queue.length / 10) || page < 1) {
      return message.reply("the page doesn't exist");
    }
    sendQueue(message, queue, page, played);
  }
};

async function sendQueue(message, queue, page, played) {
  if (!queue[0]) return message.reply("the queue is empty!");

  const queueString = getQueueString(queue, page, played);

  const newMessage = await message.channel.send(`\`\`\`${ queueString }\`\`\``);

  if (page !== 1) await newMessage.react("⬅️");
  if (page !== Math.ceil(queue.length / 10)) await newMessage.react("➡️");
  const collected = await newMessage.awaitReactions((reaction, user) => ["⬅️", "➡️"].includes(reaction.emoji.name) && !user.bot, {
    max: 1, time: 30 * 1000
  });
  if (!collected.first()) return;
  if (collected.first()._emoji.name === "⬅️") return editQueue(newMessage, page - 1);
  if (collected.first()._emoji.name === "➡️") return editQueue(newMessage, page + 1);
}

async function editQueue(message, page) {
  const queue = await firebase.getQueue(message.guild.id);
  const played = await firebase.getPlayed(message.guild.id);

  if (!queue[0]) return message.edit("The queue has been cleared!");

  const queueString = getQueueString(queue, page, played);

  await message.edit(`\`\`\`${ queueString }\`\`\``);
}

function getQueueString(queue, page, played) {
  let queueString = `\nQueue Page ${ page }/${ Math.ceil(queue.length / 10) }\n`;
  for (let index = (page - 1) * 10; index < Math.min(queue.length, page * 10); index++) {
    queueString += `\n${ index + 1 === played ? "*" : " " }${ index + 1 }) ${ queue[index].title }`;
  }
  return queueString;
}