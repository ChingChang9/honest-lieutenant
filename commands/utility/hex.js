const Command = require("@/client/command.js");
const { MessageAttachment } = require("discord.js");
const { createCanvas } = require("canvas");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "hex",
			group: "utility",
			aliases: ["rgba", "colour", "color"],
			description: "Convert hex to rgba or rgba to hex",
			format: "<hex/rgba>",
			arguments: [
				{
					key: "code"
				}
			]
		});
	}

	run(message, { code }) {
		const [hex, rgba] = getHexAndRGBA(code);
		if (!hex && !rgba) return message.reply("Invalid input format. Please enter a hex or rgba code");

		const colourAttachment = getColourAttachment(hex);

		message.embed({
			files: [colourAttachment],
			image: {
				url: `attachment://${ hex.slice(1) }.jpg`
			},
			fields: [
				{
					name: "Hex",
					value: hex,
					inline: true
				},
				{
					name: "RGBA",
					value: rgba,
					inline: true
				}
			]
		});
	}
};

function getHexAndRGBA(code) {
	const rgbaMatched = code.match(/(\d+),\s?(\d+),\s?(\d+)/);
	if (rgbaMatched) {
		return [
			`#${ parseInt(rgbaMatched[1]).toString(16) }${ parseInt(rgbaMatched[2]).toString(16) }${ parseInt(rgbaMatched[3]).toString(16) }`,
			`${ rgbaMatched[1] }, ${ rgbaMatched[2] }, ${ rgbaMatched[3] }`
		];
	} else {
		const hexMatched = code.match(/^#?([\dABCDEF]{6}$)/i)?.[1];
		if (hexMatched) {
			return [
				`#${ hexMatched }`.toLowerCase(),
				`${ parseInt(`0x${ hexMatched.substring(0, 2) }`) }, ${ parseInt(`0x${ hexMatched.substring(2, 4) }`) }, ${ parseInt(`0x${ hexMatched.substring(4, 6) }`) }`
			];
		} else {
			return [];
		}
	}
}

function getColourAttachment(hex) {
	const canvas = createCanvas(512, 512);
	const context = canvas.getContext("2d");
	context.fillStyle = hex;
	context.fillRect(0, 0, 512, 512);
	return new MessageAttachment(canvas.toBuffer(), `${ hex.slice(1) }.jpg`);
}