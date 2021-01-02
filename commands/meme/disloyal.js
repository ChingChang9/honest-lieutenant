const Command = require("@/client/command.js");
const { MessageAttachment } = require("discord.js");
const Canvas = require("canvas");
const wordWrap = require("@/scripts/wordWrap.js");

module.exports = class DisloyalCommand extends Command {
	constructor(client) {
		super(client, {
			name: "disloyal",
			group: "meme",
			description: "Makes a disloyal guy meme",
			format: "<guy> : <ex> : <girl> : [\"weeb\"]",
			examples: [
				{
					input: "Cassio : Bianca : Desdemona"
				},
				{
					input: "Cassio : Bianca : Desdemona : weeb"
				}
			],
			arguments: [
				{
					key: "text",
					parse: text => text.split(" : ")
				}
			]
		});
	}

	async run(message, { text }) {
		const guy = !text[3] ? "man" : "subaru";
		const [context, canvas] = await createImage(guy);

		context.font = "bold 72px Arial";
		context.shadowColor = "#000000";
		context.fillStyle = "#ffffff";
		context.shadowBlur = 6;
		context.lineWidth = 3;

		wordWrap.exec(context, text[0], 490, 100, 350, 200, true);
		wordWrap.exec(context, text[1], 820, 200, 350, 200, true);
		wordWrap.exec(context, text[2], 150, 200, 350, 200, true);

		const attachment = new MessageAttachment(canvas.toBuffer(), "man-looking-back-meme.jpg");
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