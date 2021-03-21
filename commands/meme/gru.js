const Command = require("@/client/command.js");
const { MessageAttachment } = require("discord.js");
const Canvas = require("canvas");
const wordWrap = require("@/scripts/wordWrap.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "gru",
			group: "meme",
			description: "Make a gru presentation meme",
			format: "<step-1> : <2> : <3> : [4] : [5]",
			arguments: [
				{
					key: "text",
					parse: text => text.split(" : "),
					validate: textArray => textArray.length >= 3 || "Please give me at least 3 arguments"
				}
			]
		});
	}

	async run(message, { text}) {
		if (text.length < 3) return message.reply("Please enter at least 3 arguments");
		if (text.length === 4 && text[2] !== text[3]) text.splice(3, 0, text[2]);
		if (text.length === 3) text.push(text[2]);

		const [context, canvas] = await createImage(text.length);
		context.font = "bold 40px Arial";
		context.fillStyle = "#000000";

		wordWrap(context, text[0], 130, 25, 100, 135);
		wordWrap(context, text[1], 395, 30, 90, 130);
		wordWrap(context, text[2], 135, 195, 95, 125);
		wordWrap(context, text[3], 395, 195, 95, 120);
		if (text[4]) wordWrap(context, text[4], 280, 350, 115, 145);

		const attachment = new MessageAttachment(canvas.toBuffer(), "gru-presentation-meme.jpg");
		message.say(attachment);
	}
};

async function createImage(size) {
	const canvas = size > 4 ? Canvas.createCanvas(500, 500) : Canvas.createCanvas(500, 320);
	const context = canvas.getContext("2d");
	const background = await Canvas.loadImage("./assets/meme/gru-presentation.jpg");
	context.drawImage(background, 0, 0, 500, 500);

	return [context, canvas];
}