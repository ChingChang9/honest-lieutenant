const request = require("@/workers/request.js");

module.exports = text => {
	return request(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${ encodeURIComponent(text) }`)
		.then(response => response.data[0].reduce((accumulator, currentValue) => accumulator + currentValue[0], ""));
};
