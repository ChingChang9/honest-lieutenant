const Discord = require("discord.js");
const Canvas = require("canvas");
const library = require("../../library.js");

module.exports = {
  name: "disloyal",
  description: "Make a disloyal guy meme",
  arguments: true,
  usage: "<guy> : <ex> : <girl>",
  async execute(message, arguments) {
    const textArray = arguments.join(" ").split(" : ");
    if (textArray.length < 3) return message.reply("that's not enough arguments, the proper usage would be: `.disloyal-guy <guy> : <ex> : <girl>`");

    const canvas = Canvas.createCanvas(1200, 800);
    const context = canvas.getContext("2d");
    const background = await Canvas.loadImage("./assets/meme/man-looking-back.jpg");
    context.drawImage(background, 0, 0, 1200, 800);
    context.font = "bold 40px Arial";
    context.shadowColor = "#000000";
    context.fillStyle = "#ffffff";
    context.shadowBlur = 6;
    context.lineWidth = 3;

    library.wordWrap(context, textArray[0], 490, 100, 350, 200, true);
    library.wordWrap(context, textArray[1], 800, 200, 350, 200, true);
    library.wordWrap(context, textArray[2], 170, 200, 350, 200, true);

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "man-looking-back-meme.jpg");
    message.channel.send(attachment);
  }
};