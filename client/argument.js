module.exports = class Argument {
	constructor(client, info) {
		this.key = info.key;
		this.default = typeof info.default !== "undefined" ? info.default : null;
		this.oneOf = info.oneOf || null;
		this.validate = info.validate || (_ => true);
		this.parse = info.parse || (value => value);
	}
};