const library = require("../library.js");

module.exports = {
  name: "translate",
  description: "Translate a text to English",
  arguments: true,
  usage: "<text-to-translate>",
  async execute(message, arguments) {
    const originalText = arguments.join(" ");
    const translatedText = await library.translate(originalText);
    return message.channel.send(translatedText);
  }
};