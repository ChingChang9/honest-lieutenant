const Discord = require("discord.js");
const Canvas = require("canvas");

module.exports = {
  name: "drake",
  description: "Makes a drake meme",
  arguments: true,
  usage: "<bad> <good>",
  async execute(message, arguments) {
    const canvas = Canvas.createCanvas(640, 550);
    const context = canvas.getContext("2d");
    const background = await Canvas.loadImage("./assets/drake.jpg");
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    context.font = "bold 42px Arial";
    context.fillStyle = "#000000";
  	context.fillText(arguments[0], (canvas.width * 3 / 4 - context.measureText(arguments[0]).width / 2), canvas.height / 4 + 21);
    context.fillText(arguments[1], (canvas.width * 3 / 4 - context.measureText(arguments[1]).width / 2), canvas.height * 3 / 4 + 21);
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "you're-fake.jpg");
    message.channel.send(attachment);
  }
};