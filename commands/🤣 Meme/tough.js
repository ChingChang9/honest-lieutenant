const Discord = require("discord.js");
const Canvas = require("canvas");
const library = require("../../library.js");

module.exports = {
  name: "tough",
  description: "Make a spongebob getting tough meme",
  arguments: true,
  usage: "<text1> : <text2> : [text3] : ...",
  async execute(message, arguments) {
    const textArray = arguments.join(" ").split(" : ");
    if (textArray.length < 2) return message.reply("please have at least 2 arguments");
    if (textArray.length > 6) return message.reply("that's too many arguments. The max I can do is 6");

    const canvas = Canvas.createCanvas(500, 145 * textArray.length - 29);
    const context = canvas.getContext("2d");
    const background = await Canvas.loadImage("./assets/meme/spongebob-getting-tough.jpg");
    textArray.length === 6 ? context.drawImage(background, 0, 0, 500, 841) : context.drawImage(background, 0, -155, 500, 841);
    context.font = "bold 40px Arial";
    context.fillStyle = "#000000";

    for (let index = 0; index < textArray.length; index++) {
      library.wordWrap(context, textArray[index], 224, 140 * index, 266, 135);
    }
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "spongebob-getting-tough-meme.jpg");
    message.channel.send(attachment);
  }
};