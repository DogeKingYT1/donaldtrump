const RSSParser = require('rss-parser');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');
const crypto = require('crypto');

const parser = new RSSParser({ timeout: 10000 });

async function fetchArticleContent(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'showmethelight/1.0 (+https://example.com)' } });
    const html = await res.text();
    const dom = new JSDOM(html, { url });
    const doc = dom.window.document;

    // canonical URL if provided
    const canonEl = doc.querySelector('link[rel="canonical"]');
    const canonical = canonEl ? canonEl.href : url;

    const reader = new Readability(doc);
    const article = reader.parse();

    const image = (article && article.lead_image_url) || (doc.querySelector('meta[property="og:image"]') || {}).content || null;
    const excerpt = (article && article.excerpt) || (doc.querySelector('meta[name="description"]') || {}).content || null;

    return {
      canonical,
      title: (article && article.title) || doc.title || null,
      content: (article && article.textContent) || excerpt || null,
      html: (article && article.content) || html,
      excerpt,
      image
    };
  } catch (err) {
    return { canonical: url, title: null, content: null, html: null, excerpt: null, image: null, error: err.message };
  }
}

function fingerprintFor(article) {
  const hash = crypto.createHash('sha256');
  const seed = (article.title || '') + '\n' + (article.content || '') + '\n' + (article.link || '');
  hash.update(seed);
  return hash.digest('hex');
}

async function fetchFeeds(feedUrls = []) {
  const results = [];

  for (const feedUrl of feedUrls) {
    try {
      const feed = await parser.parseURL(feedUrl);
      const sourceTitle = feed.title || feedUrl;

      for (const item of feed.items || []) {
        const link = item.link || item.guid || item.id;
        const fetched = await fetchArticleContent(link);

        const article = {
          source: sourceTitle,
          sourceFeed: feedUrl,
          title: item.title || fetched.title || null,
          link,
          publishedAt: item.isoDate || item.pubDate || null,
          canonical: fetched.canonical || link,
          content: fetched.content || item.contentSnippet || null,
          html: fetched.html || item['content:encoded'] || null,
          excerpt: fetched.excerpt || item.contentSnippet || null,
          image: fetched.image || item.enclosure?.url || null,
          fetchedAt: new Date().toISOString()
        };

        article.fingerprint = fingerprintFor(article);
        results.push(article);
      }
    } catch (err) {
      console.warn('Failed to parse feed', feedUrl, err.message || err);
    }
  }

  return results;
}

module.exports = { fetchFeeds };
