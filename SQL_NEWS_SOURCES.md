# News Sources by Political Leaning

This file contains SQL to populate your `sources` table with real news outlets categorized by political leaning.

## How to Use

1. Open Supabase → **SQL Editor** → **New Query**
2. Copy the SQL code block below
3. Paste into the SQL Editor
4. Click **Run**

---

## News Sources SQL

```sql
-- ============================================================================
-- NEWS SOURCES - CATEGORIZED BY POLITICAL LEANING
-- Run this to populate your sources table with real news outlets
-- ============================================================================

-- LEFT-LEANING SOURCES
INSERT INTO public.sources (name, feed_url, leaning, description, active)
VALUES 
  ('MSNBC', 'https://feeds.nbcnews.com/nbcnews/public/news', 'left', 'NBC News - Left-leaning cable news', true),
  ('CNN', 'https://rss.cnn.com/rss/cnn_topstories.rss', 'center', 'CNN Top Stories - Center-left leaning', true),
  ('The Guardian', 'https://www.theguardian.com/international/rss', 'left', 'The Guardian - UK-based left-leaning', true),
  ('Salon', 'https://www.salon.com/feed/rss', 'left', 'Salon - Progressive left-leaning', true),
  ('HuffPost', 'https://www.huffpost.com/section/homepage/feed', 'left', 'HuffPost - Left-leaning news', true),
  ('The Daily Beast', 'https://feeds.thedailybeast.com/rss/articles', 'left', 'The Daily Beast - Liberal news outlet', true),
  ('Vox', 'https://www.vox.com/rss/index.xml', 'left', 'Vox - Explanatory left-leaning journalism', true),
  ('Mother Jones', 'https://www.motherjones.com/feed/', 'left', 'Mother Jones - Progressive investigative news', true),
  ('Slate', 'https://feeds.slate.com/slate', 'left', 'Slate - Liberal commentary and news', true),
  ('CNBC Politics', 'https://feeds.cnbc.com/id/100003114/rss', 'left', 'CNBC - Center-left business news', true);

-- CENTER/INDEPENDENT SOURCES
INSERT INTO public.sources (name, feed_url, leaning, description, active)
VALUES 
  ('BBC News', 'https://feeds.bbci.co.uk/news/rss.xml', 'center', 'BBC - British public broadcaster (neutral)', true),
  ('Reuters', 'https://www.reutersagency.com/feed/?taxonomy=best-topics&query=world', 'center', 'Reuters - Wire service (neutral)', true),
  ('Associated Press', 'https://apnews.com/hub/ap-top-news', 'center', 'AP News - Wire service (neutral)', true),
  ('NPR', 'https://feeds.npr.org/1001/rss.xml', 'center', 'NPR - Public radio (neutral-leaning)', true),
  ('PBS NewsHour', 'https://www.pbs.org/newshour/feeds/rss/newshour', 'center', 'PBS - Public television (neutral)', true),
  ('The New York Times', 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', 'center', 'NYT World - Center-left mainstream', true),
  ('The Wall Street Journal', 'https://feeds.wsj.com/xml/rss/3_7085.xml', 'center', 'WSJ - Business-focused center', true),
  ('The Washington Post', 'https://feeds.washingtonpost.com/rss/world', 'center', 'WaPo - Center-left mainstream', true),
  ('The Economist', 'https://www.economist.com/leaders/rss.xml', 'center', 'The Economist - Center-right international', true),
  ('The Hill', 'https://thehill.com/feed/', 'center', 'The Hill - Centrist political news', true);

-- RIGHT-LEANING SOURCES
INSERT INTO public.sources (name, feed_url, leaning, description, active)
VALUES 
  ('Fox News', 'https://feeds.foxnews.com/foxnews/latest', 'right', 'Fox News - Right-leaning cable news', true),
  ('The Wall Street Journal Opinion', 'https://feeds.wsj.com/xml/rss/3_7014.xml', 'right', 'WSJ Opinion - Right-leaning editorial', true),
  ('National Review', 'https://www.nationalreview.com/feed/', 'right', 'National Review - Conservative magazine', true),
  ('The American Conservative', 'https://www.theamericanconservative.com/feed/', 'right', 'American Conservative - Paleoconservative', true),
  ('Breitbart News', 'https://feeds.breitbart.com/breitbart/index', 'right', 'Breitbart - Far-right populist', true),
  ('The Daily Wire', 'https://www.dailywire.com/feeds/feed.rss', 'right', 'The Daily Wire - Right-wing news', true),
  ('Newsmax', 'https://www.newsmax.com/feeds/rss/', 'right', 'Newsmax - Right-leaning news', true),
  ('RedState', 'https://www.redstate.com/feed/', 'right', 'RedState - Conservative outlet', true),
  ('Washington Examiner', 'https://www.washingtonexaminer.com/feed/', 'right', 'Washington Examiner - Conservative news', true),
  ('The Dispatch', 'https://thedispatch.com/feed/', 'right', 'The Dispatch - Center-right commentary', true);

-- INDEPENDENT SOURCES
INSERT INTO public.sources (name, feed_url, leaning, description, active)
VALUES 
  ('The Intercept', 'https://theintercept.com/feed/?rss', 'independent', 'The Intercept - Independent investigative journalism', true),
  ('ProPublica', 'https://feeds.propublica.org/propublica/main', 'independent', 'ProPublica - Independent nonprofit journalism', true),
  ('The Texas Tribune', 'https://feeds.texastribune.org/texastribune/latest/', 'independent', 'Texas Tribune - Independent state news', true),
  ('Common Dreams', 'https://feeds.commondreams.org/rss/', 'independent', 'Common Dreams - Independent progressive', true),
  ('TruthOut', 'https://truthout.org/feed/', 'independent', 'Truthout - Independent news outlet', true),
  ('CounterPunch', 'https://www.counterpunch.org/feed/', 'independent', 'CounterPunch - Independent left outlet', true),
  ('LewRockwell.com', 'https://www.lewrockwell.com/feed/', 'independent', 'LewRockwell - Independent libertarian', true),
  ('Reason', 'https://reason.com/feed/', 'independent', 'Reason - Libertarian independent', true),
  ('The Spectator', 'https://feeds.thespectatornews.com/rss/', 'independent', 'The Spectator - Independent commentary', true),
  ('Antiwar.com', 'https://feeds.antiwar.com/antiwar-latest/', 'independent', 'Antiwar.com - Independent foreign policy', true);

-- ============================================================================
-- VERIFY YOUR SOURCES
-- Run this to see all sources organized by leaning
-- ============================================================================

SELECT leaning, COUNT(*) as count FROM public.sources GROUP BY leaning ORDER BY leaning;
SELECT name, leaning, active FROM public.sources ORDER BY leaning, name;
```

---

## Sources by Leaning

### Left-Leaning (10 sources)
- **MSNBC** — Cable news, very progressive
- **The Guardian** — UK outlet, progressive
- **Salon** — Investigative progressive news
- **HuffPost** — Liberal lifestyle + politics
- **The Daily Beast** — Liberal commentary
- **Vox** — Explanatory left-leaning
- **Mother Jones** — Progressive investigative
- **Slate** — Liberal magazine
- **CNBC Politics** — Business-focused left

### Center/Mainstream (10 sources)
- **BBC News** — Neutral international
- **Reuters** — Wire service neutral
- **Associated Press** — Wire service neutral
- **NPR** — Public radio (slight left lean)
- **PBS NewsHour** — Public TV neutral
- **New York Times** — Mainstream center-left
- **Wall Street Journal** — Business center-right
- **Washington Post** — Mainstream center-left
- **The Economist** — International center-right
- **The Hill** — Political centrist

### Right-Leaning (10 sources)
- **Fox News** — Cable news, conservative
- **National Review** — Conservative magazine
- **The Daily Wire** — Right-wing commentary
- **Newsmax** — Trump-friendly news
- **Washington Examiner** — Republican-focused
- **Breitbart** — Alt-right populist
- **American Conservative** — Paleoconservative
- **RedState** — Conservative outlet
- **The Dispatch** — Center-right politics

### Independent (10 sources)
- **The Intercept** — Progressive investigative
- **ProPublica** — Nonprofit investigative
- **Reason** — Libertarian commentary
- **Common Dreams** — Progressive news
- **Antiwar.com** — Foreign policy focus
- **LewRockwell.com** — Libertarian economics
- **TruthOut** — Alternative news
- **CounterPunch** — Left critique

---

## Notes

- **Leaning values:** Must be `'left'`, `'center'`, `'right'`, or `'independent'`
- **Active column:** Set to `true` to fetch; `false` to skip
- **Feed URLs:** Some may change. Update via admin panel if needed
- **Flexibility:** You can add/remove sources anytime without losing articles

---

## Customize Your List

Want to add/remove sources? You can:

1. **Add a source:**
```sql
INSERT INTO public.sources (name, feed_url, leaning, description, active)
VALUES ('Source Name', 'https://feed-url.com/rss', 'leaning', 'Description', true);
```

2. **Disable a source** (keeps existing articles):
```sql
UPDATE public.sources SET active = false WHERE name = 'Source Name';
```

3. **Delete a source** (keeps existing articles):
```sql
DELETE FROM public.sources WHERE name = 'Source Name';
```
