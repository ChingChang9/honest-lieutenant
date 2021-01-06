const Command = require("@/client/command.js");

module.exports = class VaporwaveCommand extends Command {
	constructor(client) {
		super(client, {
			name: "vaporwave",
			group: "filter",
			aliases: ["vw"],
			description: "Toggles or sets vaporwave on a scale of 0 to 1 (inclusive)",
			guildOnly: true,
			format: "[on/off/number]",
			examples: [
				{
					input: "",
					explanation: "Toggles vaporwave on and off"
				},
				{
					input: "on",
					explanation: "Turns on vaporwave"
				},
				{
					input: "0.3",
					explanation: "Sets vaporwave-ness to 0.3"
				}
			],
			arguments: [
				{
					key: "vaporwave",
					default: "toggle"
				}
			]
		});
	}

	async run(message, { vaporwave }) {
		if (!message.member.voice.channel) {
			return message.reply("please only use this when you're in a voice channel")
		}

		await message.member.voice.channel.join().then(connection => connection.voice.setSelfDeaf(true));
		const voiceState = message.guild.voice;
		vaporwave = calculateVaporwave(voiceState, vaporwave);

		if (isNaN(vaporwave)) {
			return message.reply(`the input must be a number between 0 and 1 inclusive. Use \`${ message.guild.commandPrefix }help vaporwave\` to see examples`);
		}

		if (voiceState.speed === 1 - 0.32 * vaporwave) {
			return message.reply(`Vaporwave is already set to ${ vaporwave }`);
		}

		voiceState.filters.Vaporwave = `aresample=48000,asetrate=${ 48000 * (1 - 0.32 * vaporwave) }`;
		voiceState.removeFilter("Nightcore");
		voiceState.applyFilter(message, "Vaporwave", {
			newSpeed: 1 - 0.32 * vaporwave
		});
	}
};

function calculateVaporwave(voiceState, vaporwave) {
	const vaporwaveFloat = parseFloat(vaporwave);

	if (vaporwaveFloat >= 0 && vaporwaveFloat <= 1) {
		return vaporwaveFloat;
	} else if (vaporwave === "toggle") {
		return voiceState.appliedFilterNames.has("Vaporwave") ? 0 : 0.5;
	} else if (vaporwave === "off") {
		return 0;
	} else if (vaporwave === "on") {
		return 0.5;
	}

	return NaN;
}