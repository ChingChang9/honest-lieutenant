const Discord = require("discord.js");
const Canvas = require("canvas");
const wordWrap = require("@/scripts/wordWrap.js");

module.exports = {
  name: "brain",
  description: "Make an expanding brain meme",
  arguments: true,
  usage: "<text1> : <text2> : [text3] : [...]",
  async execute(message, arguments) {
    const textArray = arguments.join(" ").split(" : ");
    if (textArray.length < 2) return message.reply("please have at least two arguments");
    if (textArray.length > 17) return message.reply("that's too many arguments. The max I can do is 17");

    const [context, canvas] = await createImage(textArray.length);
    context.font = "bold 40px Arial";
    context.fillStyle = "#000000";

    for (let index = 0; index < textArray.length; index++) {
      wordWrap.exec(context, textArray[index], 10, 16 + 249 * index, 380, 249);
    }

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "big-brain-meme.jpg");
    message.channel.send(attachment);
  }
};

async function createImage(size) {
  const canvas = Canvas.createCanvas(804, 6 + 249 * size);
  const context = canvas.getContext("2d");
  const background = await Canvas.loadImage("./assets/meme/expanding-brain.jpg");
  context.drawImage(background, 0, 248 * Math.max(size - 11 , 0) - 1500, 804, 4239);

  return [context, canvas];
}