module.exports = (message, action, embed) => {
	const match = message.argString.match(/^<@!([0-9]+)>$|^\\<@([0-9]+)>$/);
	if (match && action) {
		const actions = action.split(" @");
		embed.description = `<@${ message.author.id }> ${ actions[0] } <@${ match[1] || match[2] }>${ actions[1] || "" }`;
	} else {
		embed.author = {
			name: message.member.displayName,
			icon_url: message.author.displayAvatarURL()
		};
		embed.description = message.argString;
	}
	return embed;
};