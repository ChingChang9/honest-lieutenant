module.exports = (message, action, embed) => {
	const userId = message.argString.match(/^(?:<@!?)?([0-9]+)>?$/)?.[1];
	if (userId && action) {
		const actions = action.split(" @");
		embed.description = `<@${ message.author.id }> ${ actions[0] } <@${ userId }>${ actions[1] || "" }`;
	} else {
		embed.author = {
			name: message.member.displayName,
			icon_url: message.author.displayAvatarURL()
		};
		embed.description = message.argString;
	}
	return embed;
};