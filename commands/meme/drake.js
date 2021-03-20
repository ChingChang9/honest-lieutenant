const Command = require("@/client/command.js");
const { MessageAttachment } = require("discord.js");
const Canvas = require("canvas");
const wordWrap = require("@/scripts/wordWrap.js");

const versions = [
	"original",
	"chika"
];

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "drake",
			group: "meme",
			description: "Make a drake meme",
			format: "<bad> : <good> : [version]",
			examples: [
				{
					input: "due date : do date"
				},
				{
					input: "1 hour : 3 episodes : chika"
				}
			],
			default: "original",
			arguments: [
				{
					key: "text",
					parse: text => text.split(" : "),
					validate: textArray => {
						const [, text2, text3] = textArray;
						if (!text2) return "you didn't provide the second argument!";
						if (text3 && !versions.includes(text3)) {
							return `invalid version! Please enter one of: \`${ versions.join("`, `") }\``;
						}
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

		wordWrap(context, text1, 332, 0, 300, canvas.height / 2);
		wordWrap(context, text2, 332, canvas.height / 2, 300, canvas.height / 2);

		const attachment = new MessageAttachment(canvas.toBuffer(), "drake-meme.jpg");
		message.say(attachment);
	}
};

async function createImage(version) {
	const person = versions.includes(version) ? version : "original";
	const canvas = Canvas.createCanvas(640, 518);
	const context = canvas.getContext("2d");
	const background = await Canvas.loadImage(`./assets/meme/${ person }-drake.jpg`);
	context.drawImage(background, 0, 0, canvas.width, canvas.height);

	return [context, canvas];
}