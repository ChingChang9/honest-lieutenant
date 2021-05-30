const tesseract = require("node-tesseract-ocr");
const Command = require("@/client/command.js");
const translate = require("@/scripts/translate.js");

const acceptedFormats = ["jpg", "jpeg", "png", "tif", "tiff"];

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "translate",
			group: "utility",
			aliases: ["tr"],
			description: "Translate a text into English",
			format: "<text/image-to-translate>",
			arguments: [
				{
					key: "text",
					allowAttachment: true
				}
			]
		});
	}

	async run(message, { text }) {
		const imageUrl = message.attachments.entries().next().value?.[1].url;
		if (imageUrl && !acceptedFormats.includes(imageUrl.match(/\..{3,4}$/)[1])) {
		    message.reply("Unaccepted file format");
        } else if (imageUrl) {
			tesseract.recognize(imageUrl, {
				lang: "jpn",
				psm: 12
			}).then(async text => message.embed({
				fields: [
					{
						name: "Original",
						value: text
					},
					{
						name: "Translation",
						value: await translate(text)
					}
				]
			}));
		} else {
			message.say(await translate(text));
		}
	}
};
