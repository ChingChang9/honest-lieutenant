const fs = require("fs");

module.exports = {
  name: "queue",
  description: "Display the music queue",
  aliases: ["que", "q", "cue"],
  arguments: false,
  async execute(message, arguments) {
    fs.readFile("./assets/queue.json", (error, data) => {
      if (error) return console.log(error);

      const { queue, settings } = JSON.parse(data);
      if (!queue[0]) return message.reply("the queue is empty!");
      let queueString = "";
      for (let index = 0; index < queue.length; index++) {
        queueString += `\n${ index + 1 === settings.played ? "*" : " " }${ index + 1 }) ${ queue[index].title }`;
      }
      message.channel.send(`\`\`\`${ queueString }\`\`\``);
    });
  }
};