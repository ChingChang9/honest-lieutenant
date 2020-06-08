const Discord = require("discord.js");
const Canvas = require("canvas");
const library = require("../../library.js");

module.exports = {
  name: "drake",
  description: "Make a drake meme",
  arguments: true,
  usage: "<bad> : <good>",
  async execute(message, arguments) {
    const canvas = Canvas.createCanvas(640, 518);
    const context = canvas.getContext("2d");
    const background = await Canvas.loadImage("./assets/meme/drake.jpg");
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    context.font = "bold 40px Arial";
    context.fillStyle = "#000000";
    const [text1, text2] = arguments.join(" ").split(" : ");
    if (!text2) return message.reply("you didn't provide the second argument!");
    library.wordWrap(context, text1, 332, 0, 300, canvas.height / 2);
    library.wordWrap(context, text2, 332, canvas.height / 2, 300, canvas.height / 2);
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "drake-meme.jpg");
    message.channel.send(attachment);
  }
};