const Discord = require("discord.js");
const Canvas = require("canvas");
const wordWrap = require("@/scripts/wordWrap.js");

module.exports = {
  name: "tough",
  description: "Make a spongebob getting tough meme",
  arguments: true,
  usage: "<text1> : <text2> : [text3] : ...",
  async execute(message, arguments) {
    const textArray = arguments.join(" ").split(" : ");
    if (textArray.length < 2) return message.reply("please have at least 2 arguments");
    if (textArray.length > 6) return message.reply("that's too many arguments. The max I can do is 6");

    const [context, canvas] = await createImage(textArray.length)

    context.font = "bold 40px Arial";
    context.fillStyle = "#000000";

    for (let index = 0; index < textArray.length; index++) {
      wordWrap.exec(context, textArray[index], 224, 140 * index, 266, 135);
    }
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "spongebob-getting-tough-meme.jpg");
    message.channel.send(attachment);
  }
};

async function createImage(size) {
  const canvas = Canvas.createCanvas(500, 145 * size - 29);
  const context = canvas.getContext("2d");
  const background = await Canvas.loadImage("./assets/meme/spongebob-getting-tough.jpg");
  if (size === 6) {
    context.drawImage(background, 0, 0, 500, 841);
  } else {
    context.drawImage(background, 0, -155, 500, 841);
  }

  return [context, canvas];
}