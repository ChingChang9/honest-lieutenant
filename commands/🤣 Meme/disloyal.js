const Discord = require("discord.js");
const Canvas = require("canvas");
const wordWrap = require("@/scripts/wordWrap.js");
const prefix = "."; // FIXME: Make this dynamic

module.exports = {
  name: "disloyal",
  description: "Make a disloyal guy meme",
  arguments: true,
  usage: "<guy> : <ex> : <girl> : [\"weeb\"]",
  async execute(message, arguments) {
    const textArray = arguments.join(" ").split(" : ");
    if (textArray.length < 3) return message.reply(`that's not enough arguments, the proper usage would be: \`${ prefix }disloyal-guy ${ this.usage }\``);

    const guy = !textArray[3] ? "man" : "subaru";
    const [context, canvas] = await createImage(guy);

    context.font = "bold 72px Arial";
    context.shadowColor = "#000000";
    context.fillStyle = "#ffffff";
    context.shadowBlur = 6;
    context.lineWidth = 3;

    wordWrap.exec(context, textArray[0], 490, 100, 350, 200, true);
    wordWrap.exec(context, textArray[1], 820, 200, 350, 200, true);
    wordWrap.exec(context, textArray[2], 150, 200, 350, 200, true);

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "man-looking-back-meme.jpg");
    message.channel.send(attachment);
  }
};

async function createImage(guy) {
  const canvas = Canvas.createCanvas(1200, 800);
  const context = canvas.getContext("2d");
  const background = await Canvas.loadImage(`./assets/meme/${ guy }-looking-back.jpg`);
  context.drawImage(background, 0, 0, 1200, 800);

  return [context, canvas];
}