const Command = require("@/client/command.js");
const { MessageAttachment } = require("discord.js");
const { createCanvas, loadImage } = require("canvas");
const wordWrap = require("@/scripts/wordWrap.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "tough",
			group: "meme",
			description: "Make a spongebob getting tough meme",
			format: "<text1> : <text2> : [...]*",
			arguments: [
				{
					key: "text",
					parse: text => text.split(" : "),
					validate: textArray => {
						if (textArray.length < 2) return "Please have at least two arguments";
						if (textArray.length > 17) return "That's too many arguments. The max I can do is 6";
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
			wordWrap(context, text[index], 224, 140 * index, 266, 135);
		}
		const attachment = new MessageAttachment(canvas.toBuffer(), "spongebob-getting-tough-meme.jpg");
		message.say(attachment);
	}
};

async function createImage(size) {
	const canvas = createCanvas(500, 145 * size - 29);
	const context = canvas.getContext("2d");
	const background = await loadImage("./assets/meme/spongebob-getting-tough.jpg");
	if (size === 6) {
		context.drawImage(background, 0, 0, 500, 841);
	} else {
		context.drawImage(background, 0, -155, 500, 841);
	}

	return [context, canvas];
}