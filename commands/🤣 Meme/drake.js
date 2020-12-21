const Discord = require("discord.js");
const Canvas = require("canvas");
const wordWrap = require("@/scripts/wordWrap.js");

const versions = [
  "chika"
];

module.exports = {
  name: "drake",
  description: "Make a drake meme",
  arguments: true,
  usage: "<bad> : <good> : [version]",
  async execute(message, arguments) {
    const [text1, text2, version] = arguments.join(" ").split(" : ");
    if (!text2) return message.reply("you didn't provide the second argument!");

    const [context, canvas] = await createImage(version);

    context.font = "bold 40px Arial";
    context.fillStyle = "#000000";

    wordWrap.exec(context, text1, 332, 0, 300, canvas.height / 2);
    wordWrap.exec(context, text2, 332, canvas.height / 2, 300, canvas.height / 2);

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "drake-meme.jpg");
    message.channel.send(attachment);
  }
};

async function createImage(version) {
  const prefix = versions.includes(version) ? version : "original"
  const canvas = Canvas.createCanvas(640, 518);
  const context = canvas.getContext("2d");
  const background = await Canvas.loadImage(`./assets/meme/${ prefix }-drake.jpg`);
  context.drawImage(background, 0, 0, canvas.width, canvas.height);

  return [context, canvas];
}