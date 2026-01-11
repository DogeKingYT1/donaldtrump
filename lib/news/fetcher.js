const RSSParser = require('rss-parser');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const parser = new RSSParser({ timeout: 10000 });

// Initialize Supabase (server-side only)
const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY)
  : null;

async function fetchArticleContent(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'showmethelight/1.0 (+https://example.com)' } });
    const html = await res.text();
    const dom = new JSDOM(html, { url });
    const doc = dom.window.document;

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

async function fetchFeeds(feedData = []) {
  const results = [];

  for (const source of feedData) {
    try {
      const feed = await parser.parseURL(source.feed_url);
      const sourceTitle = feed.title || source.name || source.feed_url;

      for (const item of feed.items || []) {
        const link = item.link || item.guid || item.id;
        const fetched = await fetchArticleContent(link);

        const article = {
          source_id: source.id,
          source_name: sourceTitle,
          leaning: source.leaning,
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
      console.warn('Failed to parse feed', source.name || source.feed_url, err.message || err);
    }
  }

  return results;
}

async function saveToSupabase(articles) {
  if (!supabase || articles.length === 0) {
    console.log('Supabase not configured or no articles to save');
    return [];
  }

  const added = [];
  for (const a of articles) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .insert({
          fingerprint: a.fingerprint,
          title: a.title,
          link: a.link,
          source_id: a.source_id,
          source_name: a.source_name,
          leaning: a.leaning,
          published_at: a.publishedAt,
          content: a.content,
          canonical: a.canonical,
          image: a.image,
          excerpt: a.excerpt,
          fetched_at: a.fetchedAt
        })
        .select();

      if (error) {
        if (error.code === '23505') {
          console.log('Article already exists:', a.fingerprint);
        } else {
          throw error;
        }
      } else if (data && data.length > 0) {
        added.push(data[0]);
      }
    } catch (err) {
      console.warn('Failed to save article to Supabase:', err.message || err);
    }
  }

  return added;
}

async function getActiveSources() {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('sources')
      .select('id, name, feed_url, leaning, active')
      .eq('active', true);

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Failed to fetch sources:', err.message || err);
    return [];
  }
}

module.exports = { fetchFeeds, saveToSupabase, getActiveSources, fingerprintFor };
