/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require('path');
const _ = require('lodash');
const https = require('https');
const http = require('http');

// ─── Medium RSS helpers ───────────────────────────────────────────────────────

function fetchURL(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) return reject(new Error('Too many redirects'));
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchURL(res.headers.location, redirects + 1));
      }
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });
    req.on('error', reject);
  });
}

function extractCDATA(str) {
  const m = str.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  return m ? m[1].trim() : str.trim();
}

function parseRSSItems(xml) {
  const items = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = itemRe.exec(xml)) !== null) {
    const raw = m[1];
    const titleRaw = raw.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '';
    const title = extractCDATA(titleRaw);
    const link =
      raw.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() ??
      raw.match(/<guid[^>]*>([\s\S]*?)<\/guid>/)?.[1]?.trim() ??
      '';
    const pubDate = raw.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() ?? '';
    const encoded =
      raw.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/)?.[1] ?? '';
    const thumbnail =
      encoded.match(/<img[^>]+src="([^"]+)"/)?.[1] ??
      raw.match(/<description>[\s\S]*?<img[^>]+src="([^"]+)"/)?.[1] ??
      '';
    const subtitle = extractCDATA(
      raw.match(/<description>([\s\S]*?)<\/description>/)?.[1] ?? '',
    )
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim()
      .substring(0, 220);

    if (title && link) {
      items.push({ title, link, pubDate, thumbnail, subtitle });
    }
  }
  return items;
}

// ─────────────────────────────────────────────────────────────────────────────

// Prevent frontmatter type inference conflicts (e.g., `cover` as String vs File)
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type MarkdownRemarkFrontmatter {
      cover: File @fileByRelativePath
    }
    type MediumPost implements Node {
      title: String
      link: String
      pubDate: String
      thumbnail: String
      subtitle: String
    }
  `);
};

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest, reporter }) => {
  const { createNode } = actions;
  try {
    const xml = await fetchURL('https://medium.com/feed/@yasser.namez');
    const posts = parseRSSItems(xml);
    posts.forEach(post => {
      createNode({
        ...post,
        id: createNodeId(`MediumPost-${post.link}`),
        internal: {
          type: 'MediumPost',
          contentDigest: createContentDigest(post),
        },
      });
    });
    reporter.info(`[Medium] Fetched ${posts.length} articles`);
  } catch (e) {
    reporter.warn(`[Medium] Could not fetch RSS feed: ${e.message}`);
  }
};

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;
  const postTemplate = path.resolve(`src/templates/post.js`);
  const tagTemplate = path.resolve('src/templates/tag.js');

  const result = await graphql(`
    {
      postsRemark: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/posts/" } }
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              slug
            }
          }
        }
      }
      tagsGroup: allMarkdownRemark(limit: 2000) {
        group(field: frontmatter___tags) {
          fieldValue
        }
      }
    }
  `);

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  // Create post detail pages
  const posts = result.data.postsRemark.edges;

  posts.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.slug,
      component: postTemplate,
      context: {},
    });
  });

  // Extract tag data from query
  const tags = result.data.tagsGroup.group;
  // Make tag pages
  tags.forEach(tag => {
    createPage({
      path: `/pensieve/tags/${_.kebabCase(tag.fieldValue)}/`,
      component: tagTemplate,
      context: {
        tag: tag.fieldValue,
      },
    });
  });
};

// https://www.gatsbyjs.org/docs/node-apis/#onCreateWebpackConfig
exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  // https://www.gatsbyjs.org/docs/debugging-html-builds/#fixing-third-party-modules
  if (stage === 'build-html' || stage === 'develop-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /scrollreveal/,
            use: loaders.null(),
          },
          {
            test: /animejs/,
            use: loaders.null(),
          },
          {
            test: /miniraf/,
            use: loaders.null(),
          },
        ],
      },
    });
  }

  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@components': path.resolve(__dirname, 'src/components'),
        '@config': path.resolve(__dirname, 'src/config'),
        '@fonts': path.resolve(__dirname, 'src/fonts'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@images': path.resolve(__dirname, 'src/images'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@styles': path.resolve(__dirname, 'src/styles'),
        '@utils': path.resolve(__dirname, 'src/utils'),
      },
    },
  });
};
