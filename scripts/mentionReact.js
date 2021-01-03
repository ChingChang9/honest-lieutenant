module.exports = {
	exec(message, action, embed) {
		const match = message.argString.match(/^<@!([0-9]+)>$|^\\<@([0-9]+)>$/);
		if (match && action) {
			const actions = action.split(" @");
			embed.description = `<@${ message.author.id }> ${ actions[0] } <@${ match[1] || match[2] }>${ actions[1] || "" }`;
		} else {
			embed.author = {
				name: message.member.displayName,
				icon_url: `https://cdn.discordapp.com/avatars/${ message.author.id }/${ message.author.avatar }.jpg`
			};
			embed.description = message.argString;
		}
		return embed;
	}
};