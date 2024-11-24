// 11ty Plugins
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const eleventySass = require("@11tyrocks/eleventy-plugin-sass-lightningcss");

// Helper packages
const slugify = require("slugify");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItTaskLists = require("markdown-it-task-lists");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(eleventySass);

  eleventyConfig.addPassthroughCopy("./src/fonts");
  eleventyConfig.addPassthroughCopy("./src/img");
  eleventyConfig.addPassthroughCopy("./src/favicon.png");
  eleventyConfig.addPassthroughCopy("./src/dpp-logo.svg");

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Collection for "topics" pages
  eleventyConfig.addCollection("topics", function (collectionApi) {
    return collectionApi.getFilteredByGlob("./src/pages/topics/*.md");
  });
  
  // Collection for all other pages
  eleventyConfig.addCollection("pages", function (collectionApi) {
    const pages = collectionApi.getFilteredByGlob("./src/pages/*.md");
  
    // Define the desired order
    const customOrder = [
      "🏗️ The Framework",
      "🛠️ The Basics",
      "📚 Glossary",
      "📖 About",
      "❓ FAQ"
    ];
  
    // Sort pages based on the custom order
    return pages.sort((a, b) => {
      const aIndex = customOrder.indexOf(a.data.title) !== -1 ? customOrder.indexOf(a.data.title) : Infinity;
      const bIndex = customOrder.indexOf(b.data.title) !== -1 ? customOrder.indexOf(b.data.title) : Infinity;
      return aIndex - bIndex;
    });
  });
  
  

  /* Markdown Overrides */
  let markdownLibrary = markdownIt({
    html: true,
  })
    .use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.ariaHidden({
        class: "tdbc-anchor",
        space: false,
      }),
      level: [1, 2, 3],
    })
    .use(markdownItTaskLists, { enabled: true });

  eleventyConfig.setLibrary("md", markdownLibrary);

  return {
    dir: {
      input: "src",
      output: "public",
      layouts: "_layouts",
    },
  };
};
