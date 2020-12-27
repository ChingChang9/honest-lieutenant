const { Command } = require("discord.js-commando");
const { MessageAttachment } = require("discord.js");
const Canvas = require("canvas");

module.exports = class MockCommand extends Command {
  constructor(client) {
		super(client, {
			name: "mock",
			group: "meme",
			memberName: "mock",
			description: "Makes a spongebob mocking meme",
      format: "<text-to-mock>",
      args: [
        {
          key: "text",
          prompt: "What text do you want to mock?",
          type: "string",
          parse: (text) => {
            let text1 = "";
            let text2 = "";
            let counter = 0;
            for (let index = 0; index < text.length; index++) {
              if (/[A-Za-z]/.test(text[index])) counter++;
              if (counter % 2) {
                if (index < 30) {
                  text1 += text[index].toLowerCase();
                } else {
                  text2 += text[index].toLowerCase();
                }
              } else {
                if (index < 30) {
                  text1 += text[index].toUpperCase();
                } else {
                  text2 += text[index].toUpperCase();
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

            return [text1, text2];
          }
        }
      ]
		});
	}

  async run(message, { text: [text1, text2] }) {
    const [context, canvas] = await createImage();

    context.font = "bold 48px Impact";
    context.shadowColor = "#000000";
    context.fillStyle = "#ffffff";
    context.shadowBlur = 6;
    context.lineWidth = 3;

    context.strokeText(text1, (canvas.width - context.measureText(text1).width) / 2, 53);
    context.strokeText(text2, (canvas.width - context.measureText(text2).width) / 2, 380);
  	context.fillText(text1, (canvas.width - context.measureText(text1).width) / 2, 53);
    context.fillText(text2, (canvas.width - context.measureText(text2).width) / 2, 380);

    const attachment = new MessageAttachment(canvas.toBuffer(), "spongebob-mocking-meme.jpg");
    message.channel.send(attachment);
  }
};

async function createImage() {
  const canvas = Canvas.createCanvas(800, 400);
  const context = canvas.getContext("2d");
  const background = await Canvas.loadImage("./assets/meme/spongebob-mocking.jpg");
  context.drawImage(background, 0, 0, canvas.width, canvas.height);

  return [context, canvas];
}