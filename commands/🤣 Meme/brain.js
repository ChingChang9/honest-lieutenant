const Discord = require("discord.js");
const Canvas = require("canvas");
const library = require("../../library.js");

module.exports = {
  name: "brain",
  description: "Make an expanding brain meme",
  arguments: true,
  usage: "<text1> : <text2> : <text3> : ...",
  async execute(message, arguments) {
    const textArray = arguments.join(" ").split(" : ");
    if (textArray.length < 2) return message.reply("please have at least two arguments");
    if (textArray.length > 17) return message.reply("that's too many arguments. The max I can do is 17");

    const canvas = Canvas.createCanvas(804, 6 + 249 * textArray.length);
    const context = canvas.getContext("2d");
    const background = await Canvas.loadImage("./assets/meme/expanding-brain.jpg");
    context.drawImage(background, 0, 0, 804, 4239);
    context.font = "bold 40px Arial";
    context.fillStyle = "#000000";

    for (let index = 0; index < textArray.length; index++) {
      library.wordWrap(context, textArray[index], 10, 16 + 249 * index, 380, 249);
    }
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "big-brain-meme.jpg");
    message.channel.send(attachment);
  }
};