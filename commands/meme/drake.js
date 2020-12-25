const { Command } = require("discord.js-commando");
const { MessageAttachment } = require("discord.js");
const Canvas = require("canvas");
const wordWrap = require("@/scripts/wordWrap.js");

const versions = [
  "chika"
];

module.exports = class DrakeCommand extends Command {
  constructor(client) {
		super(client, {
			name: "drake",
			group: "meme",
			memberName: "drake",
			description: "Make a drake meme",
      format: "<bad> : <good> : [version]",
      args: [
        {
          key: "text",
          prompt: "",
          type: "string",
          parse: (text) => text.split(" : "),
          validate: (text) => {
            const [, text2] = text.split(" : ");
            if (!text2) return "you didn't provide the second argument!";
            return true;
          }
        }
      ]
		});
	}

  async run(message, { text: [text1, text2, version] }) {
    const [context, canvas] = await createImage(version);

    context.font = "bold 40px Arial";
    context.fillStyle = "#000000";

    wordWrap.exec(context, text1, 332, 0, 300, canvas.height / 2);
    wordWrap.exec(context, text2, 332, canvas.height / 2, 300, canvas.height / 2);

    const attachment = new MessageAttachment(canvas.toBuffer(), "drake-meme.jpg");
    message.channel.send(attachment);
  }
};

async function createImage(version) {
  const person = versions.includes(version) ? version : "original"
  const canvas = Canvas.createCanvas(640, 518);
  const context = canvas.getContext("2d");
  const background = await Canvas.loadImage(`./assets/meme/${ person }-drake.jpg`);
  context.drawImage(background, 0, 0, canvas.width, canvas.height);

  return [context, canvas];
}