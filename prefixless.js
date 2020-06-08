const triggerWords = ["i'm", "im", "am", "i’m"];

module.exports = {
  execute(message) {
    const content = message.content.toLowerCase().split(/ +/);
    for (let index = 0; index < triggerWords.length; index++) {
      if (content.includes(triggerWords[index])) {
        if (message.author.id === "180472559148597249") {
          return message.channel.send(`No, you're not ${ content.slice(content.indexOf(triggerWords[index]) + 1).join(" ") }\nYou're a snake! :snake:\nhttps://tenor.com/view/squidward-dab-100-lit-gif-15118193`);
        }
        return message.channel.send(`Hi ${ content.slice(content.indexOf(triggerWords[index]) + 1).join(" ") }, I'm dad! 😂`);
      }
    }
    if (content.includes("die")) {
      return message.channel.send("https://tenor.com/view/dancing-coffin-coffin-dance-funeral-funny-farewell-gif-16737844");
    }
    if (content[0] === "+play") {
      return message.channel.send("heyy im online too and im better than vexera 😉");
    }
  }
};