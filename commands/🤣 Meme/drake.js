const Discord = require("discord.js");
const Canvas = require("canvas");

module.exports = {
  name: "drake",
  description: "Make a drake meme",
  arguments: true,
  usage: "<bad> : <good>",
  async execute(message, arguments) {
    const canvas = Canvas.createCanvas(640, 550);
    const context = canvas.getContext("2d");
    const background = await Canvas.loadImage("./assets/drake.jpg");
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    context.font = "bold 42px Arial";
    context.fillStyle = "#000000";
    let [text1, text2] = arguments.join(" ").split(":");
    if (!text2) {
      return message.reply("you didn't provide the second argument!");
    }
  	context.fillText(text1, (canvas.width * 3 / 4 - context.measureText(text1).width / 2), canvas.height / 4 + 21);
    context.fillText(text2, (canvas.width * 3 / 4 - context.measureText(text2).width / 2), canvas.height * 3 / 4 + 21);
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "drake-meme.jpg");
    message.channel.send(attachment);
  }
};