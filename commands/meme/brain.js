const { Command } = require("discord.js-commando");
const { MessageAttachment } = require("discord.js");
const Canvas = require("canvas");
const wordWrap = require("@/scripts/wordWrap.js");

module.exports = class BrainCommand extends Command {
  constructor(client) {
		super(client, {
			name: "brain",
			group: "meme",
			memberName: "brain",
			description: "Makes an expanding brain meme",
      format: "<text1> : <text2> : [...]*",
      examples: [
        " chika : kaguya`",
        " chika : kaguya : hayasaka : ishigami`"
      ],
      args: [
        {
          key: "text",
          prompt: "",
          type: "string",
          parse: (text) => text.split(" : "),
          validate: (text) => {
            const textArray = text.split(" : ");
            if (textArray.length < 2) return "please have at least two arguments";
            if (textArray.length > 17) return "that's too many arguments. The max I can do is 17";
            return true;
          }
        }
      ]
		});
	}

  async run(message, { text }) {
    const [context, canvas] = await createImage(text.length);
    context.font = "bold 40px Arial";
    context.fillStyle = "#000000";

    for (let index = 0; index < text.length; index++) {
      wordWrap.exec(context, text[index], 10, 16 + 249 * index, 380, 249);
    }

    const attachment = new MessageAttachment(canvas.toBuffer(), "big-brain-meme.jpg");
    message.channel.send(attachment);
  }
};

async function createImage(size) {
  const canvas = Canvas.createCanvas(804, 6 + 249 * size);
  const context = canvas.getContext("2d");
  const background = await Canvas.loadImage("./assets/meme/expanding-brain.jpg");
  context.drawImage(background, 0, 248 * Math.max(size - 11 , 0) - 1500, 804, 4239);

  return [context, canvas];
}