const fs = require("fs");

module.exports = {
  name: "queue",
  description: "Display the music queue",
  arguments: false,
  async execute(message, arguments) {
    fs.readFile("./assets/queue.json", (error, data) => {
      if (error) return console.log(error);

      const { queue, played } = JSON.parse(data);
      let queueString = "";
      for (let index = 0; index < queue.length; index++) {
        queueString += `\n${ index + 1 }. ${ queue[index].title }`;
      }
      if (!queueString) return message.reply("the queue is empty!");
      message.channel.send(`\`\`\`${ queueString }\`\`\``);
    });
  }
};