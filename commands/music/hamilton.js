const Command = require("@/client/command.js");
const addPlaylist = require("@/scripts/addPlaylist.js");

const original = [
	"https://www.youtube.com/watch?v=VhinPd5RRJw",
	"https://www.youtube.com/watch?v=LOUf8Z0RQic",
	"https://www.youtube.com/watch?v=Ic7NqP_YGlg",
	"https://www.youtube.com/watch?v=3vqwrepaMR0",
	"https://www.youtube.com/watch?v=UeqKF_NF1Qs",
	"https://www.youtube.com/watch?v=IRImIezjxRg",
	"https://www.youtube.com/watch?v=eKFN-aqPJH8",
	"https://www.youtube.com/watch?v=0JR0ApUALOQ",
	"https://www.youtube.com/watch?v=WO8Z6S7oHTw",
	"https://www.youtube.com/watch?v=6frd_dHxPRs",
	"https://www.youtube.com/watch?v=InupuylYdcY",
	"https://www.youtube.com/watch?v=7ZY36ygpgSQ",
	"https://www.youtube.com/watch?v=ulsLI029rH0",
	"https://www.youtube.com/watch?v=u44jORNkM3g",
	"https://www.youtube.com/watch?v=m7iHmuco_zo",
	"https://www.youtube.com/watch?v=alQKTQdEE-0",
	"https://www.youtube.com/watch?v=kK9c41WgNpc",
	"https://www.youtube.com/watch?v=WOb8-C6jw0M",
	"https://www.youtube.com/watch?v=-nmqQlW-sMo",
	"https://www.youtube.com/watch?v=WQt1RRW_xv0",
	"https://www.youtube.com/watch?v=jKw6n0PnTMY",
	"https://www.youtube.com/watch?v=TKpJjdKcjeo",
	"https://www.youtube.com/watch?v=MCGM2xzQ9gg",
	"https://www.youtube.com/watch?v=DPgE7PNzXag",
	"https://www.youtube.com/watch?v=2JNRo7OipYc",
	"https://www.youtube.com/watch?v=dSYW61XQZeo",
	"https://www.youtube.com/watch?v=itKtosLoGk4",
	"https://www.youtube.com/watch?v=7sB8ITujc3w",
	"https://www.youtube.com/watch?v=WySzEXKUSZw",
	"https://www.youtube.com/watch?v=9cATAAgy7Zc",
	"https://www.youtube.com/watch?v=_jWVKYjy7E8",
	"https://www.youtube.com/watch?v=9014vq1lqXM",
	"https://www.youtube.com/watch?v=pEqnXNsAFL8",
	"https://www.youtube.com/watch?v=kkG-KT_Comw",
	"https://www.youtube.com/watch?v=JhP0SmkrTpE",
	"https://www.youtube.com/watch?v=tBj2GL_12R4",
	"https://www.youtube.com/watch?v=7ZfzuJ8oVpE",
	"https://www.youtube.com/watch?v=0h2I8Dlu3_U",
	"https://www.youtube.com/watch?v=cnVS3X_2h4E",
	"https://www.youtube.com/watch?v=a0k0FJrY4a8",
	"https://www.youtube.com/watch?v=yxG37MyQfoc",
	"https://www.youtube.com/watch?v=thFXSNSO9xQ",
	"https://www.youtube.com/watch?v=bMAoOGnw9qQ",
	"https://www.youtube.com/watch?v=WrfPvuNUBg8",
	"https://www.youtube.com/watch?v=Yr-mO1o1uHk",
	"https://www.youtube.com/watch?v=hfmvDjPa2TU",
	"https://www.youtube.com/watch?v=Fj3AeBAJlQI",
	"https://www.youtube.com/watch?v=_gnypiKNaJE"
];
const cut = [
	"https://www.youtube.com/watch?v=VhinPd5RRJw",
	"https://www.youtube.com/watch?v=LOUf8Z0RQic",
	"https://www.youtube.com/watch?v=Ic7NqP_YGlg",
	"https://www.youtube.com/watch?v=3vqwrepaMR0",
	"https://www.youtube.com/watch?v=UeqKF_NF1Qs",
	"https://www.youtube.com/watch?v=IRImIezjxRg",
	"https://www.youtube.com/watch?v=eKFN-aqPJH8",
	"https://www.youtube.com/watch?v=0JR0ApUALOQ",
	"https://www.youtube.com/watch?v=WO8Z6S7oHTw",
	"https://www.youtube.com/watch?v=6frd_dHxPRs",
	"https://www.youtube.com/watch?v=InupuylYdcY",
	"https://www.youtube.com/watch?v=7ZY36ygpgSQ",
	"https://www.youtube.com/watch?v=ulsLI029rH0",
	"https://www.youtube.com/watch?v=u44jORNkM3g",
	"https://www.youtube.com/watch?v=m7iHmuco_zo",
	"https://www.youtube.com/watch?v=alQKTQdEE-0",
	"https://www.youtube.com/watch?v=kK9c41WgNpc",
	"https://www.youtube.com/watch?v=WOb8-C6jw0M",
	"https://www.youtube.com/watch?v=-nmqQlW-sMo",
	"https://www.youtube.com/watch?v=WQt1RRW_xv0",
	"https://www.youtube.com/watch?v=jKw6n0PnTMY",
	"https://www.youtube.com/watch?v=TKpJjdKcjeo",
	"https://www.youtube.com/watch?v=DPgE7PNzXag",
	"https://www.youtube.com/watch?v=2JNRo7OipYc",
	"https://www.youtube.com/watch?v=dSYW61XQZeo",
	"https://www.youtube.com/watch?v=itKtosLoGk4",
	"https://www.youtube.com/watch?v=7sB8ITujc3w",
	"https://www.youtube.com/watch?v=WySzEXKUSZw",
	"https://www.youtube.com/watch?v=9cATAAgy7Zc",
	"https://www.youtube.com/watch?v=_jWVKYjy7E8",
	"https://www.youtube.com/watch?v=9014vq1lqXM",
	"https://www.youtube.com/watch?v=pEqnXNsAFL8",
	"https://www.youtube.com/watch?v=kkG-KT_Comw",
	"https://www.youtube.com/watch?v=PouTf9gYZMw",
	"https://www.youtube.com/watch?v=tBj2GL_12R4",
	"https://www.youtube.com/watch?v=7ZfzuJ8oVpE",
	"https://www.youtube.com/watch?v=0h2I8Dlu3_U",
	"https://www.youtube.com/watch?v=a0k0FJrY4a8",
	"https://www.youtube.com/watch?v=yxG37MyQfoc",
	"https://www.youtube.com/watch?v=thFXSNSO9xQ",
	"https://www.youtube.com/watch?v=bMAoOGnw9qQ",
	"https://www.youtube.com/watch?v=WrfPvuNUBg8",
	"https://www.youtube.com/watch?v=Yr-mO1o1uHk",
	"https://www.youtube.com/watch?v=hfmvDjPa2TU",
	"https://www.youtube.com/watch?v=BQ1ZwqaXJaQ",
	"https://www.youtube.com/watch?v=_gnypiKNaJE"
];

module.exports = class HamiltonCommand extends Command {
	constructor(client) {
		super(client, {
			name: "hamilton",
			group: "music",
			aliases: ["ham"],
			description: "Queues the entire Hamilton soundtrack!! 😃😃",
			format: "[original/cut]",
			guildOnly: true,
			arguments: [
				{
					key: "version",
					prompt: "What version do you want?",
					type: "string",
					oneOf: ["original", "cut"],
					default: "original"
				}
			]
		});
	}

	run(message, { version }) {
		const playList = version === "original" ? original : cut;
		addPlaylist.exec(message, playList, "all");
	}
};