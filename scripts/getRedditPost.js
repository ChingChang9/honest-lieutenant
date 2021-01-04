const axios = require("axios");

module.exports = {
	async exec(subreddits, options = { nsfw: true, message: null }) {
		if (options.nsfw) return await axios(`https://www.reddit.com/r/${ subreddits.join("+") }/random.json`).then(response => {
			const post = resolveRandomPost(response);
			return resolvePostEmbed(post);
		});

		options.message.embed({
			author: {
				name: "Filtering NSFW content..."
			},
			description: "Use in a NSFW channel to remove the filter and speed me up"
		}, "loading");

		const posts = await fetchAndFilter(subreddits).catch(error => {
			if (error.response.status === 503) fetchAndFilter(subreddits);
			options.message.error(error);
		});

		const post = posts[Math.floor(Math.random() * posts.length)];
		return {
			author: {
				name: post.title,
				url: post.url
			},
			image: {
				url: post.imageUrl
			}
		};
	}
};

function resolveRandomPost(response) {
	if (response.data[0]?.data.children[0].data) return response.data[0].data.children[0].data;

	const children = response.data.data.children;
	return children[Math.floor(Math.random() * children.length)].data;
}

function resolvePostEmbed(post) {
	if (post.url.startsWith("https://i.redd.it") || post.url.startsWith("https://preview.redd.it")) return {
		author: {
			name: post.title.slice(0, 256),
			url: `https://www.reddit.com${ post.permalink }`
		},
		image: {
			url: post.url
		}
	};

	if (post.selftext.startsWith("&amp;#x200B;\n")) return {
		author: {
			name: post.title.slice(0, 256),
			url: `https://www.reddit.com${ post.permalink }`
		},
		description: `[Censored](https://www.reddit.com${ post.permalink })`
	};

	return {
		author: {
			name: post.title.slice(0, 256),
			url: `https://www.reddit.com${ post.permalink }`
		},
		description: post.selftext.slice(0, 2048) || post.url_overridden_by_dest
	};
}

function fetchAndFilter(subreddits) {
	return axios(`https://www.reddit.com/r/${ subreddits.join("+") }.json`, {
		params: {
			limit: 64,
			sort: "hot",
			t: "week",
			restrict_sr: false,
			include_facets: false
		}
	}).then(response => {
		return response.data.data.children.reduce((posts, child) => {
			if (!child.data.over_18) posts.push({
				title: child.data.title.slice(0, 256),
				url: `https://www.reddit.com${ child.data.permalink }`,
				imageUrl: child.data.url
			});

			return posts;
		}, []);
	});
}