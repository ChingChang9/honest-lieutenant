module.exports = {
  exec(seconds) {
    seconds = parseInt(seconds);
    if (seconds === 0) return "∞";
    return `${ seconds < 36000 ? "0" : "" }${ Math.floor(seconds / 3600) }:${
    seconds % 3600 < 600 ? "0" : "" }${ Math.floor(seconds % 3600 / 60) }:${
    seconds % 60 < 10 ? "0" : "" }${ seconds % 60 }`.replace(/^00:/, "").replace(/^0/, "");
  }
};