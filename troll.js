const triggerWords = ["i'm ", "im ", "i am "];

module.exports = {
  execute(message) {
    const content = message.content.toLowerCase();
    for (let index = 0; index < triggerWords.length; index++) {
      if (content.includes(triggerWords[index])) {
        return message.channel.send(`Hi ${ content.slice(content.indexOf(triggerWords[index]) + triggerWords[index].length) }, I'm dad! 😂`);
      }
    }
    if (content.split(/ +/).includes("die")) {
      return message.channel.send("https://tenor.com/view/dancing-coffin-coffin-dance-funeral-funny-farewell-gif-16737844");
    }
  }
}