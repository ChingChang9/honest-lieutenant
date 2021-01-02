const Command = require("@/client/command.js");
const firebase = require("@/scripts/firebase.js");
const formatTime = require("@/scripts/formatTime.js");
const servers = require("@/scripts/servers.js");

module.exports = class QueueCommand extends Command {
  constructor(client) {
    super(client, {
			name: "queue",
			group: "music",
			aliases: ["que", "q", "cue"],
			description: "Displays the music queue",
      format: "[page]",
      clientPermissions: ["MANAGE_MESSAGES"],
      guildOnly: true,
      arguments: [
        {
          key: "page",
          parse: page => parseInt(page),
          default: "auto",
        }
      ]
		});
  }

  run(message, { page }) {
    Promise.all([
      firebase.getQueue(message.guild.id),
      firebase.getItem(message.guild.id, "played")
    ]).then(result => {
      const [queue, played] = result;

      if (!queue[0]) return message.reply("the queue is empty!");
      if (page === "auto") {
        page = Math.ceil(played / 10);
      } else if (page > Math.ceil(queue.length / 10)) {
        return message.reply("the page doesn't exist");
      }

      sendQueue(message, queue, page, played);
    });
  }
};

async function sendQueue(message, queue, page, played) {
  const queueString = await getQueueString(message.guild.id, queue, page, played);
  const newMessage = await message.code(queueString, "ml");

  if (Math.ceil(queue.length / 10) > 1) {
    newMessage.react("⬅️");
    newMessage.react("➡️");
  }
  startCollector(newMessage, queue, page);
}

function editQueue(message, page) {
  Promise.all([
    firebase.getQueue(message.guild.id),
    firebase.getItem(message.guild.id, "played")
  ]).then(async (result) => {
    const [queue, played] = result;

    if (!queue[0]) {
      message.reactions.removeAll();
      return message.edit("```The queue has been cleared!```");
    }

    const queueString = await getQueueString(message.guild.id, queue, page, played);

    message.edit(`\`\`\`ml\n${ queueString }\`\`\``);

    startCollector(message, queue, page);
  });
}

async function startCollector(message, queue, page) {
  const collector = await message.createReactionCollector((reaction, user) => ["⬅️", "➡️"].includes(reaction.emoji.name) && !user.bot, {
    max: 1,
    idle: 30 * 1000
  });

  const lastPage = Math.ceil(queue.length / 10);
  collector.on("collect", (reaction, user) => {
    reaction.users.remove(user.id);
    if (reaction.emoji.name === "⬅️") return editQueue(message, (lastPage + page - 1) % lastPage || lastPage);
    if (reaction.emoji.name === "➡️") return editQueue(message, (lastPage + page + 1) % lastPage || lastPage);
  });
  collector.on("end", (reaction, user) => {
    if (!collector.endReason()) message.reactions.removeAll();
  });
}

async function getQueueString(guildId, queue, page, played) {
  let queueString = `Queue Page ${ page }/${ Math.ceil(queue.length / 10) }\n`;
  for (let index = (page - 1) * 10; index < Math.min(queue.length, page * 10); index++) {
    const isCurr = index + 1 === played;
    const duration = await getDuration(guildId, queue[index].duration, isCurr);

    let newLine = `${ isCurr ? "*" : " " }${ index + 1 }) ${ queue[index].title }`;
    if (lengthInUtf8Bytes(newLine) > 54) {
      newLine = newLine.slice(0, 53) + "…";
    } else {
      newLine += " ".repeat(54 - lengthInUtf8Bytes(newLine));
    }
    newLine += `| ${ duration }`;
    queueString += `\n${ newLine }`;
  }
  return queueString;
}

async function getDuration(guildId, durationString, isCurr) {
  const dispatcher = servers.getDispatcher(guildId);
  if (durationString === "0") return `∞ ${ isCurr && dispatcher ? "left" : "    " }`;

  if (isCurr && dispatcher) {
    const seekTimestamp = await firebase.getItem(guildId, "seek");
    const elapsed = Math.floor(dispatcher.streamTime / 1000) + seekTimestamp;
    return `${ formatTime.exec(durationString - elapsed) } left`;
  } else {
    return `${ formatTime.exec(durationString) }     `;
  }
}

function lengthInUtf8Bytes(string) {
  const matched = encodeURIComponent(string).match(/%[89ABab]/g);
  return string.length + (matched ? matched.length / 3 : 0);
}