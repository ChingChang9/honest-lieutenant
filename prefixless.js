const fs = require("fs");

const coffinTriggerWords = ["die", "dies", "dying"];
const dadTriggerWords = ["i'm", "im", "am", "i’m"];

module.exports = {
  execute(message) {
    const content = message.content.toLowerCase().split(/ +/);
    if (content[0] === "+play") {
      return message.channel.send("heyy im online too and im better than <@228537642583588864> 😉");
    }

    if (content.join(" ").match(/you know what i(.)?m talking about/)) {
      const randomNumber = Math.random();
      if (message.author.id === "371129637725798400" || randomNumber < 0.5) {
        return message.channel.send({
          files: [`./assets/i-know-what-youre-talking-about/${
            Math.floor(Math.random() * fs.readdirSync("./assets/i-know-what-youre-talking-about").length)
          }.jpg`]
        });
      }
      return message.channel.send({
        files: [`./assets/i-really-dont.jpg`]
      });
    }

    for (let index = 0; index < coffinTriggerWords.length; index++) {
      if (content.includes(coffinTriggerWords[index])) return message.channel.send("https://tenor.com/view/dancing-coffin-coffin-dance-funeral-funny-farewell-gif-16737844");
    }

    for (let index = 0; index < dadTriggerWords.length; index++) {
      if (content.includes(dadTriggerWords[index])) {
        if (dadTriggerWords[index] === "am" && (!content[content.indexOf(dadTriggerWords[index]) - 1] || content[content.indexOf(dadTriggerWords[index]) - 1] !== "i")) return;

        const sonName = content.slice(content.indexOf(dadTriggerWords[index]) + 1).join(" ");
        if (!sonName) return message.reply("stop doing that 🙄");

        let randomNumber = Math.random();
        if (randomNumber < 0.76) return;

        if (sonName.slice(0, 3) === "not") {
          return message.channel.send(`We know you're ${ sonName }, you're ${ message.member.displayName }! ${ emojis[Math.floor(Math.random() * (emojis.length))] }`);
        }

        if (message.author.id === "180472559148597249") {
          return message.channel.send({
            files: [`./assets/snake/${ Math.floor(Math.random() * fs.readdirSync("./assets/snake").length) }.jpg`]
          }, `No, you're not ${ sonName }\nYou're a`);
        }
        if (message.author.id === "633488684116606976") {
          return message.channel.send(`Hi ${ sonName }, I'm also ${ sonName }! ❤️`);
        }

        const dadNames = [
          "a comedian",
          "so funny",
          "dad",
          message.guild.members.cache.get("668301556185300993").displayName
        ];
        const harshResponses = [
          "gonna delete your existence",
          "gonna put some dirt in your eye",
          "gonna eat you"
        ];

        randomNumber = Math.random();
        if (randomNumber < 1 / (dadNames.length + 1)) {
          return message.channel.send(`You are ${ sonName }?? I thought you were ${ message.member.displayName } 🤔🤔`);
        }

        const emojis = ["😂", "😇", "🙃", "😉", "😏", "😘", "😝", "😎", "🤗", "🤣"];
        return message.channel.send(`Hi ${ sonName }, I'm ${ message.author.id === "628441856765591573" ? harshResponses[Math.floor(Math.random() * (harshResponses.length))] :
        dadNames[Math.floor(Math.random() * (dadNames.length))] }! ${ emojis[Math.floor(Math.random() * (emojis.length))] }`);
      }
    }
  }
};