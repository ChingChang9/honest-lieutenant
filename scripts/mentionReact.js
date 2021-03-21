module.exports = (message, action, embed) => {
	const userId = message.argString.match(/^(?:<@!?)?([0-9]+)>?$/)?.[1];
	if (userId && action) {
		const actions = action.split(" @");
		embed.description = `<@${ message.author.id }> ${ actions[0] } <@${ userId }>${ actions[1] || "" }`;
	} else {
		embed.author = {
			name: message.member.displayName,
			icon_url: `https://cdn.discordapp.com/avatars/${ message.author.id }/${ message.author.avatar }.jpg`
		};
		embed.description = message.argString;
	}
	return embed;
};