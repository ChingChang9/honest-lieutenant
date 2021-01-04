const axios = require("axios");

module.exports = {
  async exec(subreddits) {
    return await axios(`https://www.reddit.com/r/${ subreddits.join("+") }/random.json`).then(response => {
      const post = resolveRandomPost(response);

      if (post.post_hint === "image") return {
  			color: "#fefefe",
  			author: {
  				name: post.title.slice(0, 256),
  				url: `https://www.reddit.com${ post.permalink }`
  			},
  			image: {
  				url: post.url
  			}
  		};

      if (post.selftext.startsWith("&amp;#x200B;\n")) return {
  			color: "#fefefe",
  			author: {
  				name: post.title.slice(0, 256),
  				url: `https://www.reddit.com${ post.permalink }`
  			},
  			image: {
  				url: `[Censored](https://www.reddit.com${ post.permalink })`
  			}
  		};

      return {
  			color: "#fefefe",
  			author: {
  				name: post.title.slice(0, 256),
  				url: `https://www.reddit.com${ post.permalink }`
  			},
  			description: post.selftext.slice(0, 2048) || post.url_overridden_by_dest
  		};
    });
  }
};

function resolveRandomPost(response) {
  if (response.data[0]?.data.children[0].data) return response.data[0].data.children[0].data;

  const children = response.data.data.children;
  return children[Math.floor(Math.random() * children.length)].data;
}

/*
Genshin Impact
KanojoOkarishimasu
AraAra
Hentai
*/