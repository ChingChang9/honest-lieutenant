module.exports = class Argument {
	constructor(client, info) {
		this.key = info.key;
		this.default = info.default !== undefined ? info.default : null;
		this.oneOf = info.oneOf || null;
		this.validate = info.validate || (() => true);
		this.parse = info.parse || (value => value);
		this.allowAttachment = !!info.allowAttachment;
	}
};
