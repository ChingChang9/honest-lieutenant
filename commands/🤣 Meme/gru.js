const Discord = require("discord.js");
const Canvas = require("canvas");
const library = require("../../library.js");

module.exports = {
  name: "gru",
  description: "Make a gru presentation meme",
  arguments: true,
  usage: "<step-1> : <step-2> : ...",
  async execute(message, arguments) {
    const textArray = arguments.join(" ").split(" : ");
    if (textArray.length < 3) return message.reply("please enter at least 3 arguments");
    if (textArray.length === 4 && textArray[2] !== textArray[3]) textArray.splice(3, 0, textArray[2]);
    if (textArray.length === 3) textArray.push(textArray[2]);
    const canvas = textArray.length > 4 ? Canvas.createCanvas(500, 500) : Canvas.createCanvas(500, 320);
    const context = canvas.getContext("2d");
    const background = await Canvas.loadImage("./assets/meme/gru-presentation.jpg");
    context.drawImage(background, 0, 0, 500, 500);
    context.font = "bold 40px Arial";
    context.fillStyle = "#000000";

    library.wordWrap(context, textArray[0], 130, 25, 100, 135);
    library.wordWrap(context, textArray[1], 395, 30, 90, 130);
    library.wordWrap(context, textArray[2], 135, 195, 95, 125);
    library.wordWrap(context, textArray[3], 395, 195, 95, 120);
    if (textArray[4]) library.wordWrap(context, textArray[4], 280, 350, 115, 145);

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "gru-presentation-meme.jpg");
    message.channel.send(attachment);
  }
};