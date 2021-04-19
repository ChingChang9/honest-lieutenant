const Command = require("@/client/command.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "bassboost",
			group: "filter",
			aliases: ["bass", "bb"],
			description: "Toggle or set the amount of bass boost on a scale of 0 to 1 (inclusive)",
			voiceOnly: true,
			format: "[on/off/number]",
			examples: [
				{
					explanation: "Toggle bassboost on and off"
				},
				{
					input: "on",
					explanation: "Boost the bass"
				},
				{
					input: "0.3",
					explanation: "Set bassboosted-ness to 0.3"
				}
			],
			arguments: [
				{
					key: "bassboost",
					default: "toggle"
				}
			]
		});
	}

	async run(message, { bassboost }) {
		await message.member.voice.channel.join().then(connection => connection.voice.setSelfDeaf(true));
		const voiceState = message.guild.voice;
		bassboost = calculateBassboost(voiceState, bassboost);

		if (isNaN(bassboost)) {
			return message.reply(`The input must be a number between 0 and 1 inclusive. Use \`${ message.guild.commandPrefix }help bassboost\` to see examples`);
		}

		if (voiceState.bass === bassboost) {
			return message.reply(`Bassboost is already set to ${ bassboost }`);
		}

		voiceState.filters.Bassboost = `bass=g=${ 20 * bassboost - 1 }`;
		voiceState.applyFilter(message, "Bassboost", {
			newBass: bassboost
		});
	}
};

function calculateBassboost(voiceState, bassboost) {
	const bassboostFloat = parseFloat(bassboost);

	if (bassboostFloat >= 0 && bassboostFloat <= 1) {
		return bassboostFloat;
	} else if (bassboost === "toggle") {
		return voiceState.appliedFilterNames.has("Bassboost") ? 0 : 0.5;
	} else if (bassboost === "off") {
		return 0;
	} else if (bassboost === "on") {
		return 0.5;
	}

	return NaN;
}