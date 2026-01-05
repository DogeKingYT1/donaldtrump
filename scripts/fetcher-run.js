const fs = require('fs');
const path = require('path');
const { fetchFeeds } = require('../lib/news/fetcher');

const DATA_FILE = path.join(__dirname, '..', 'data', 'articles.json');

const feeds = [
  'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
  'https://feeds.bbci.co.uk/news/rss.xml',
  'https://www.reutersagency.com/feed/?best-topics=world',
  'https://feeds.a.dj.com/rss/RSSWorldNews.xml'
];

(async function run() {
  try {
    const newArticles = await fetchFeeds(feeds);

    // ensure data directory exists
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });

    let existing = [];
    if (fs.existsSync(DATA_FILE)) {
      existing = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) || [];
    }

    const existingFingerprints = new Set(existing.map(a => a.fingerprint));

    const deduped = [];
    for (const a of newArticles) {
      if (!existingFingerprints.has(a.fingerprint)) {
        deduped.push(a);
        existing.push(a);
        existingFingerprints.add(a.fingerprint);
      }
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(existing, null, 2));

    console.log(`Fetched ${newArticles.length} items, ${deduped.length} new saved.`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
