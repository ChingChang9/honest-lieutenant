const fs = require("fs");
const { emptyQueue: emptyQueue } = require("../../config.json");

module.exports = {
  name: "queue",
  description: "Display the music queue",
  aliases: ["que", "q", "cue"],
  arguments: false,
  usage: "[page]",
  default: "auto",
  execute(message, arguments) {
    fs.readFile("./assets/queue.json", async (error, data) => {
      if (error) return console.log(error);

      const { guilds } = await JSON.parse(data);
      if (!guilds[message.guild.id]) guilds[message.guild.id] = emptyQueue;
      const { queue, settings } = guilds[message.guild.id];
      if (parseInt(arguments[0]) > Math.ceil(queue.length / 10) || parseInt(arguments[0]) < 1) {
        return message.reply("the page doesn't exist");
      }
      const page = parseInt(arguments[0]) || Math.ceil(settings.played / 10);
      this.postQueue(message, page);
    });
  },
  postQueue(message, page) {
    fs.readFile("./assets/queue.json", async (error, data) => {
      if (error) return console.log(error);

      const { guilds } = await JSON.parse(data);
      const { queue, settings } = guilds[message.guild.id];
      if (!queue[0]) return message.reply("the queue is empty!");
      let queueString = `\nQueue Page ${ page }/${ Math.ceil(queue.length / 10) }\n`;
      for (let index = (page - 1) * 10; index < Math.min(queue.length, page * 10); index++) {
        queueString += `\n${ index + 1 === settings.played ? "*" : " " }${ index + 1 }) ${ queue[index].title }`;
      }
      message.channel.send(`\`\`\`${ queueString }\`\`\``).then(async (message) => {
        if (page !== 1) await message.react("⬅️");
        if (page !== Math.ceil(queue.length / 10)) await message.react("➡️");
        if (Math.ceil(queue.length / 10) === 1) return;
        const collected = await message.awaitReactions((reaction, user) => ["⬅️", "➡️"].includes(reaction.emoji.name) && !user.bot, {
          max: 1, time: 12000
        });
        if (!collected.first()) return;
        if (collected.first()._emoji.name === "⬅️") return this.postQueue(message, page - 1);
        if (collected.first()._emoji.name === "➡️") return this.postQueue(message, page + 1);
      });
    });
  }
};