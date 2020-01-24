const Discord = require("discord.js");
const Canvas = require("canvas");

module.exports = {
  name: "mock",
  description: "Turns the message into a spongebob mocking meme",
  arguments: true,
  usage: "<text-to-mock>",
  async execute(message, arguments) {
    let text1 = "";
    let text2 = "";
    let counter = 0;
    for (let index = 0; index < arguments.join(" ").length; index++) {
      if (/[A-Za-z]/.test(arguments.join(" ")[index])) counter++;
      if (counter % 2) {
        if (index < 30) {
          text1 += arguments.join(" ")[index].toLowerCase();
        } else {
          text2 += arguments.join(" ")[index].toLowerCase();
        }
      } else {
        if (index < 30) {
          text1 += arguments.join(" ")[index].toUpperCase();
        } else {
          text2 += arguments.join(" ")[index].toUpperCase();
        }
      }
    }
    if (text1.length === 30) {
      while (text1.charAt(text1.length - 1) !== " ") {
        text2 = `${ text1.charAt(text1.length - 1) }${ text2 }`;
        text1 = text1.substring(0, text1.length - 1);
      }
      text1 = text1.substring(0, text1.length - 1);
    }
    text2 = text2.substring(0, 30);

    const canvas = Canvas.createCanvas(800, 400);
    const context = canvas.getContext("2d");
    const background = await Canvas.loadImage("./assets/spongebob-mocking.jpg");
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    context.font = "bold 48px Impact";
    context.shadowColor = "#000000";
    context.shadowBlur = 6;
    context.lineWidth = 3;
    context.strokeText(text1, (canvas.width - context.measureText(text1).width) / 2, 53);
    context.strokeText(text2, (canvas.width - context.measureText(text2).width) / 2, 380);
    context.shadowBlur = 5;
  	context.fillStyle = "#ffffff";
  	context.fillText(text1, (canvas.width - context.measureText(text1).width) / 2, 53);
    context.fillText(text2, (canvas.width - context.measureText(text2).width) / 2, 380);
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "you're-fake.jpg");
    message.channel.send(attachment);
  }
};