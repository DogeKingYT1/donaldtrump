import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const LEANINGS = {
  left: { label: 'Left', color: '#1976d2', icon: '←' },
  center: { label: 'Center', color: '#388e3c', icon: '↔️' },
  right: { label: 'Right', color: '#d32f2f', icon: '→' },
  independent: { label: 'Independent', color: '#f57c00', icon: '◇' }
};

export default function BlindspotPage() {
  const [loading, setLoading] = useState(true);
  const [userLeaning, setUserLeaning] = useState(null);
  const [blindspotArticles, setBlindspotArticles] = useState([]);
  const [explanation, setExplanation] = useState('');

  useEffect(() => {
    analyzeUserPreferencesAndFetchBlindspot();
  }, []);

  async function analyzeUserPreferencesAndFetchBlindspot() {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setExplanation('Please log in to see your Blindspot');
        setLoading(false);
        return;
      }

      // Get user's liked articles to determine their leaning preference
      const { data: likedArticles } = await supabase
        .from('likes')
        .select('article_id, articles(leaning)')
        .eq('user_id', user.id)
        .limit(50);

      // Count which leanings the user has interacted with
      const leaningCounts = {};
      if (likedArticles && likedArticles.length > 0) {
        for (const like of likedArticles) {
          if (like.articles?.leaning) {
            leaningCounts[like.articles.leaning] = (leaningCounts[like.articles.leaning] || 0) + 1;
          }
        }
      }

      // Determine user's primary leaning
      const primaryLeaning = Object.keys(leaningCounts).length > 0
        ? Object.keys(leaningCounts).reduce((a, b) => leaningCounts[a] > leaningCounts[b] ? a : b)
        : null;

      // If user has a clear preference, show them the opposite
      let targetLeanings = ['left', 'center', 'right', 'independent'];
      let blindspotExplanation = '';

      if (primaryLeaning) {
        setUserLeaning(primaryLeaning);
        
        // Remove their primary leaning from suggestions
        targetLeanings = targetLeanings.filter(l => l !== primaryLeaning);
        
        const opposite = primaryLeaning === 'left' ? 'right' : primaryLeaning === 'right' ? 'left' : 'center';
        blindspotExplanation = `You mainly read ${LEANINGS[primaryLeaning].label}-leaning news. Here are articles from ${LEANINGS[opposite].label}-leaning sources to broaden your perspective.`;
      } else {
        blindspotExplanation = 'Start liking articles to personalize your Blindspot. We\'ll show you perspectives you haven\'t explored yet.';
      }

      setExplanation(blindspotExplanation);

      // Fetch articles from opposite leanings
      const { data: articles } = await supabase
        .from('articles')
        .select('*')
        .in('leaning', targetLeanings.slice(0, 2)) // Show top 2 opposite leanings
        .order('published_at', { ascending: false })
        .limit(20);

      setBlindspotArticles(articles || []);
    } catch (err) {
      console.error(err);
      setExplanation('Error analyzing your reading preferences');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Analyzing your preferences...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#fff', padding: '20px', borderBottom: '1px solid #ddd' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ margin: '0 0 8px 0' }}>🔍 Your Blindspot</h1>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            {explanation}
          </p>
          {userLeaning && (
            <p style={{ margin: '8px 0 0 0', color: '#999', fontSize: '12px' }}>
              You typically read {LEANINGS[userLeaning].label}-leaning news • <Link href="/feed">← Back to Feed</Link>
            </p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        {blindspotArticles.length === 0 ? (
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '40px', textAlign: 'center' }}>
            <p style={{ fontSize: '16px', color: '#999' }}>No articles found for your Blindspot.</p>
            <p style={{ fontSize: '14px', color: '#ccc' }}>
              Like some articles to help us personalize your Blindspot experience.
            </p>
            <Link href="/feed" style={{ color: '#1976d2', textDecoration: 'none' }}>
              Go to Feed
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {blindspotArticles.map(article => (
              <BlindspotArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function BlindspotArticleCard({ article }) {
  const leaning = LEANINGS[article.leaning] || { label: article.leaning, color: '#999', icon: '?' };

  return (
    <Link href={`/articles/${article.id}`}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        display: 'flex',
        gap: '16px',
        padding: '16px',
        borderLeft: `4px solid ${leaning.color}`
      }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}
      >
        {/* Image */}
        {article.image && (
          <div style={{ flex: '0 0 180px', minHeight: '120px', backgroundColor: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
            <img
              src={article.image}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{
              backgroundColor: leaning.color,
              color: '#fff',
              padding: '4px 8px',
              borderRadius: '4px',
              fontWeight: 'bold',
              fontSize: '12px'
            }}>
              {leaning.icon} {leaning.label}
            </span>
            <span style={{ fontSize: '11px', color: '#999', fontStyle: 'italic' }}>
              Different perspective
            </span>
          </div>

          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', lineHeight: '1.4' }}>
            {article.title}
          </h3>

          <p style={{ margin: '0 0 12px 0', color: '#666', fontSize: '14px', lineHeight: '1.5' }}>
            {article.excerpt || article.content?.slice(0, 150)}...
          </p>

          <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#999' }}>
            <span>{article.source_name}</span>
            <span>{article.published_at ? new Date(article.published_at).toLocaleDateString() : ''}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
