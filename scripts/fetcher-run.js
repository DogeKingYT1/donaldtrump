const { fetchFeeds, saveToSupabase, getActiveSources } = require('../lib/news/fetcher');

(async function run() {
  try {
    console.log('Fetching active sources from Supabase...');
    const sources = await getActiveSources();

    if (sources.length === 0) {
      console.log('No active sources found. Add sources via the admin panel or SQL:');
      console.log(`
INSERT INTO public.sources (name, feed_url, leaning, description, active)
VALUES 
  ('CNN', 'https://rss.cnn.com/rss/cnn_topstories.rss', 'center', 'CNN Top Stories', true),
  ('MSNBC', 'https://feeds.nbcnews.com/nbcnews/public/news', 'left', 'NBC News', true),
  ('BBC News', 'https://feeds.bbci.co.uk/news/rss.xml', 'center', 'BBC World News', true),
  ('Fox News', 'https://feeds.foxnews.com/foxnews/latest', 'right', 'Fox News', true);
      `);
      return;
    }

    console.log(`Found ${sources.length} sources. Starting fetch...`);
    const articles = await fetchFeeds(sources);
    console.log(`Fetched ${articles.length} articles total`);

    console.log('Saving new articles to Supabase...');
    const added = await saveToSupabase(articles);
    console.log(`Saved ${added.length} new articles`);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
