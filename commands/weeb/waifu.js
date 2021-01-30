const Command = require("@/client/command.js");
const getRedditPost = require("@/scripts/getRedditPost.js");

const subredditsNSFW = [
	"massivefangs",
	"OfficialSenpaiHeat",
	"AnimeBlush",
	"AnimeWallpapersSFW",
	"Animewallpaper",
	"Gesugao",
	"WeaponsMoe",
	"NoneHumanMoe",
	"EvilMoe",
	"Futuremoe",
	"DivineMoe",
	"wetClothesAnime",
	"animeponytails",
	"awenime",
	"awoonime",
	"awwnime",
	"cutelittlefangs",
	"gunime",
	"HimeCut",
	"kemonomimi",
	"kitsunemimi",
	"megane",
	"Pixiv",
	"shorthairedwaifus",
	"streetmoe",
	"Tsunderes",
	"twintails",
	"TwoDeeArt",
	"DreamyAnimeEyes",
	"silverhair",
	"AnimeLounging"
];
const subredditsSFW = [
	"massivefangs",
	"AnimeBlush",
	"AnimeWallpapersSFW",
	"Animewallpaper",
	"WeaponsMoe",
	"NoneHumanMoe",
	"Futuremoe",
	"DivineMoe",
	"animeponytails",
	"awenime",
	"awoonime",
	"awwnime",
	"cutelittlefangs",
	"gunime",
	"HimeCut",
	"megane",
	"Pixiv",
	"shorthairedwaifus",
	"streetmoe",
	"Tsunderes",
	"TwoDeeArt",
	"DreamyAnimeEyes",
	"silverhair",
	"AnimeLounging"
];

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "waifu",
			group: "weeb",
			description: "Sends a waifu (might be a husbando) from Reddit",
			throttling: {
				usages: 5,
				duration: 10
			}
		});
	}

	async run(message) {
		if (message.channel.nsfw) {
			message.embed(await getRedditPost(subredditsNSFW));
		} else {
			const embed = await getRedditPost(subredditsSFW, {
				nsfw: message.channel.nsfw,
				message
			});
			message.embed(embed);
		}
	}
};