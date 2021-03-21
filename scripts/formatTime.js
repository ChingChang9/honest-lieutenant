module.exports = {
	stringToSeconds: timeString => {
		const timeArray = timeString.split(":");

		if (timeArray.length && timeArray.length <= 3) {
			return timeArray.reduce((accumulator, element, index) => accumulator + parseInt(element) * 60 ** (timeArray.length - index - 1), 0);
		} else {
			return NaN;
		}
	},
	secondsToString: seconds => {
		seconds = parseInt(seconds);
		if (seconds === 0) return "∞";
		return `${ seconds < 36000 ? "0" : "" }${ Math.floor(seconds / 3600) }:${
			seconds % 3600 < 600 ? "0" : "" }${ Math.floor(seconds % 3600 / 60) }:${
			seconds % 60 < 10 ? "0" : "" }${ seconds % 60 }`.replace(/^00:/, "").replace(/^0/, "");
	}
};