const fs = require("fs");

const coffinTriggerWords = ["die", "dies", "dying"];
const dadTriggerWords = ["am", "i'm", "im", "i’m"];
const emojis = ["😂", "😇", "🙃", "😉", "😏", "😘", "😝", "😎", "🤗", "🤣"];

module.exports = {
  execute(message) {
    const content = message.content.toLowerCase().split(/s|\n/);
    const displayName = message.guild.members.cache.get("668301556185300993").displayName;

    if (content[0].match(/^ay+/) && content.length === 1) return message.channel.send("lmao");

    if (content[0] === "owo" && content.length === 1) return message.channel.send("What's this?");

    if (content[0].match(/^no+/) && message.author.id === "195217084974759936") return message.channel.send("https://media.discordapp.net/attachments/458510721664417853/723527184635002890/unknown.png");

    if (content[0] === "+play") return message.reply("heyy im online too and im better than <@228537642583588864> 😉");

    if (coffinTriggerWords.some((word) => content.includes(word))) return message.channel.send("https://tenor.com/view/dancing-coffin-coffin-dance-funeral-funny-farewell-gif-16737844");

    if (content.join(" ").match(/you know what i(.)?m talking about/)) {
      if (message.author.id === "371129637725798400" || Math.random() < 0.5) {
        return message.channel.send({
          files: [`./assets/i-know-what-youre-talking-about/${
            Math.floor(Math.random() * fs.readdirSync("./assets/i-know-what-youre-talking-about").length - 1)
          }.jpg`]
        });
      }
      return message.channel.send({
        files: [`./assets/i-really-dont.jpg`]
      });
    }

    for (const triggerWord of dadTriggerWords) {
      if (content.includes(triggerWord)) {
        if (triggerWord === "am" && (!content[content.indexOf(triggerWord) - 1] ||
          content[content.indexOf(triggerWord) - 1] !== "i") ||
          Math.random() < 0.76) return;

        const sonName = content.slice(content.indexOf(triggerWord) + 1).join(" ");
        if (!sonName && message.author.id == "195217084974759936") return message.reply("stop doing that 🙄");

        if (sonName.match(/^not /) && sonName.length > 4) return message.channel.send(`We know you're ${ sonName }, you're ${
          message.member.displayName }! ${ emojis[Math.floor(Math.random() * (emojis.length))] }`);

        if (message.author.id === "633488684116606976") return message.channel.send(`Hi ${ sonName }, I'm also ${ sonName }! ❤️`);

        if (message.author.id === "180472559148597249") {
          return message.channel.send({
            files: [`./assets/snake/${ Math.floor(Math.random() * fs.readdirSync("./assets/snake").length) }.jpg`]
          }, `No, you're not ${ sonName }\nYou're a`);
        }

        const dadNames = [
          "a comedian",
          "so funny",
          "dad",
          displayName,
          `something of a ${ displayName } myself`,
          `your friendly neighbourhood ${ displayName }`,
          "a dead bot",
          "gonna put some dirt in your eye"
        ];

        if (Math.random() < 1 / (dadNames.length + 1)) {
          return message.channel.send(`You are ${ sonName }?? I thought you were ${ message.member.displayName } 🤔🤔`);
        }

        return message.channel.send(`Hi ${ sonName }, I'm ${
          dadNames[Math.floor(Math.random() * (dadNames.length - 1))] }! ${
          emojis[Math.floor(Math.random() * (emojis.length - 1))] }`);
      }
    }
  }
};