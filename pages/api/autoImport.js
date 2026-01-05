// API route to trigger an import run. For PoC this writes to data/articles.json
// If SUPABASE_URL and SUPABASE_KEY are set it will attempt to upsert to Supabase.

const fs = require('fs');
const path = require('path');
const { fetchFeeds } = require('../../lib/news/fetcher');

const DATA_FILE = path.join(process.cwd(), 'data', 'articles.json');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const feeds = req.body?.feeds || [
    'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
    'https://feeds.bbci.co.uk/news/rss.xml'
  ];

  try {
    const items = await fetchFeeds(feeds);

    // write to local data file (useful in dev)
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    let existing = [];
    if (fs.existsSync(DATA_FILE)) existing = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) || [];
    const existingSet = new Set(existing.map(a => a.fingerprint));
    const added = [];
    for (const it of items) {
      if (!existingSet.has(it.fingerprint)) {
        existing.push(it);
        existingSet.add(it.fingerprint);
        added.push(it);
      }
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(existing, null, 2));

    // Optional: push to Supabase if configured
    if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
      try {
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
        // expect a table `articles` with appropriate columns
        for (const a of added) {
          await supabase.from('articles').upsert({ fingerprint: a.fingerprint, title: a.title, link: a.link, source: a.source, publishedAt: a.publishedAt, content: a.content, canonical: a.canonical }, { onConflict: 'fingerprint' });
        }
      } catch (err) {
        console.warn('Supabase upsert failed', err.message || err);
      }
    }

    return res.status(200).json({ fetched: items.length, added: added.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || String(err) });
  }
}
