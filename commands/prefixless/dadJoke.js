let { readdirSync } = require("fs");
const folderSize = readdirSync("./assets/snake").length;
readdirSync = null;
delete require.cache[require.resolve("fs")];

const dadTriggerWords = ["am", "i'm", "im", "i’m"];
const emojis = ["😂", "😇", "🙃", "😉", "😏", "😘", "😝", "😎", "🤗", "🤣"];
const vowels = ["a", "e", "i", "o", "u", "honest"];

module.exports = (message, content) => {
	for (const triggerWord of dadTriggerWords) {
		if (content.includes(triggerWord)) {
			if (triggerWord === "am" && (!content[content.indexOf(triggerWord) - 1] ||
        content[content.indexOf(triggerWord) - 1] !== "i") ||
        Math.random() < 0.75) return;

			const sonName = content.slice(content.indexOf(triggerWord) + 1).join(" ");
			if (!sonName && message.author.id == "195217084974759936") return message.reply("Stop doing that 🙄");

			const emoji = emojis[Math.floor(Math.random() * emojis.length)];
			if (sonName.match(/^not /) && sonName.length > 4) return message.say(`We know you're ${ sonName }, you're ${
				message.member.displayName }! ${ emoji }`);

			if (message.author.id === "633488684116606976") return message.say(`Hi ${ sonName }, I'm also ${ sonName }! ❤️`);

			if (message.author.id === "180472559148597249") {
				return message.say({
					files: [`./assets/snake/${ Math.floor(Math.random() * folderSize) }.jpg`]
				}, `No, you're not ${ sonName }\nYou're a`);
			}

			const dadNames = [
				"a comedian",
				"so funny",
				"dad",
				message.guild.clientName,
				`something of a${ vowels.some(vowel => message.guild.clientName.toLowerCase().startsWith(vowel)) ? "n" : "" } ${
					message.guild.clientName } myself`,
				`your friendly neighbourhood ${ message.guild.clientName }`,
				"gonna put some dirt in your eye"
			];

			if (Math.random() < 1 / (dadNames.length + 1)) {
				return message.say(`You are ${ sonName }?? I thought you were ${ message.member.displayName } 🤔🤔`);
			}

			return message.say(`Hi ${ sonName }, I'm ${ dadNames[Math.floor(Math.random() *  dadNames.length)] }! ${ emoji }`);
		}
	}
};