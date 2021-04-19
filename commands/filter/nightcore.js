const Command = require("@/client/command.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "nightcore",
			group: "filter",
			aliases: ["nc"],
			description: "Toggle or set nightcore on a scale of 0 to 1 (inclusive)",
			voiceOnly: true,
			format: "[on/off/number]",
			examples: [
				{
					explanation: "Toggle nightcore on and off"
				},
				{
					input: "on",
					explanation: "Turn on nightcore"
				},
				{
					input: "0.3",
					explanation: "Set nightcore-ness to 0.3"
				}
			],
			arguments: [
				{
					key: "nightcore",
					default: "toggle"
				}
			]
		});
	}

	async run(message, { nightcore }) {
		await message.member.voice.channel.join().then(connection => connection.voice.setSelfDeaf(true));
		const voiceState = message.guild.voice;
		nightcore = calculateNightcore(voiceState, nightcore);

		if (isNaN(nightcore)) {
			return message.reply(`The input must be a number between 0 and 1 inclusive. Use \`${ message.guild.commandPrefix }help nightcore\` to see examples`);
		}

		if (voiceState.speed === 1 + 0.28 * nightcore) {
			return message.reply(`Nightcore is already set to ${ nightcore }`);
		}

		voiceState.filters.Nightcore = `aresample=48000,asetrate=${ 48000 * (1 + 0.28 * nightcore) }`;
		voiceState.removeFilter("Vaporwave");
		voiceState.applyFilter(message, "Nightcore", {
			newSpeed: 1 + 0.28 * nightcore
		});
	}
};

function calculateNightcore(voiceState, nightcore) {
	const nightcoreFloat = parseFloat(nightcore);

	if (nightcoreFloat >= 0 && nightcoreFloat <= 1) {
		return nightcoreFloat;
	} else if (nightcore === "toggle") {
		return voiceState.appliedFilterNames.has("Nightcore") ? 0 : 0.5;
	} else if (nightcore === "off") {
		return 0;
	} else if (nightcore === "on") {
		return 0.5;
	}

	return NaN;
}