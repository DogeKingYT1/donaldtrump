import { useState, useEffect } from 'react';

const leaningColors = {
  left: '#e74c3c',      // Red
  center: '#95a5a6',    // Gray
  right: '#3498db',     // Blue
  independent: '#f39c12' // Orange
};

const leaningLabels = {
  left: '← Left',
  center: 'Center',
  right: 'Right →',
  independent: 'Independent'
};

export default function SourcesPage() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    async function fetchSources() {
      try {
        const res = await fetch('/api/sources');
        const data = await res.json();
        setSources(data);
      } catch (err) {
        console.error('Failed to fetch sources:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSources();
  }, []);

  const filtered = filter === 'all' 
    ? sources 
    : sources.filter(s => s.leaning === filter);

  const grouped = {
    left: filtered.filter(s => s.leaning === 'left'),
    center: filtered.filter(s => s.leaning === 'center'),
    right: filtered.filter(s => s.leaning === 'right'),
    independent: filtered.filter(s => s.leaning === 'independent')
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h1 style={{ marginBottom: '10px' }}>News Sources</h1>
      <p style={{ color: '#666', marginBottom: '40px' }}>
        Here are the news outlets we aggregate content from, organized by political leaning.
      </p>

      {/* Filter Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '40px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            background: filter === 'all' ? '#333' : '#f0f0f0',
            color: filter === 'all' ? 'white' : '#333',
            fontSize: '14px'
          }}
        >
          All Sources
        </button>
        {['left', 'center', 'right', 'independent'].map(leaning => (
          <button
            key={leaning}
            onClick={() => setFilter(leaning)}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              background: filter === leaning ? leaningColors[leaning] : '#f0f0f0',
              color: filter === leaning ? 'white' : '#333',
              fontSize: '14px',
              textTransform: 'capitalize'
            }}
          >
            {leaningLabels[leaning]}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#666' }}>Loading sources...</p>
      ) : filtered.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>No sources found.</p>
      ) : (
        <>
          {/* Left-Leaning */}
          {grouped.left.length > 0 && (
            <div style={{ marginBottom: '50px' }}>
              <h2 style={{ 
                color: leaningColors.left, 
                borderBottom: `3px solid ${leaningColors.left}`,
                paddingBottom: '10px',
                marginBottom: '20px'
              }}>
                ← Left-Leaning
              </h2>
              <div style={{ display: 'grid', gap: '15px' }}>
                {grouped.left.map(source => (
                  <SourceCard key={source.id} source={source} />
                ))}
              </div>
            </div>
          )}

          {/* Center */}
          {grouped.center.length > 0 && (
            <div style={{ marginBottom: '50px' }}>
              <h2 style={{ 
                color: leaningColors.center, 
                borderBottom: `3px solid ${leaningColors.center}`,
                paddingBottom: '10px',
                marginBottom: '20px'
              }}>
                Center / Mainstream
              </h2>
              <div style={{ display: 'grid', gap: '15px' }}>
                {grouped.center.map(source => (
                  <SourceCard key={source.id} source={source} />
                ))}
              </div>
            </div>
          )}

          {/* Right-Leaning */}
          {grouped.right.length > 0 && (
            <div style={{ marginBottom: '50px' }}>
              <h2 style={{ 
                color: leaningColors.right, 
                borderBottom: `3px solid ${leaningColors.right}`,
                paddingBottom: '10px',
                marginBottom: '20px'
              }}>
                Right-Leaning →
              </h2>
              <div style={{ display: 'grid', gap: '15px' }}>
                {grouped.right.map(source => (
                  <SourceCard key={source.id} source={source} />
                ))}
              </div>
            </div>
          )}

          {/* Independent */}
          {grouped.independent.length > 0 && (
            <div style={{ marginBottom: '50px' }}>
              <h2 style={{ 
                color: leaningColors.independent, 
                borderBottom: `3px solid ${leaningColors.independent}`,
                paddingBottom: '10px',
                marginBottom: '20px'
              }}>
                Independent
              </h2>
              <div style={{ display: 'grid', gap: '15px' }}>
                {grouped.independent.map(source => (
                  <SourceCard key={source.id} source={source} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div style={{ 
        marginTop: '60px', 
        padding: '20px', 
        background: '#f9f9f9', 
        borderRadius: '4px',
        borderLeft: `4px solid #333`
      }}>
        <h3>About Our Sources</h3>
        <p style={{ color: '#666', lineHeight: '1.6' }}>
          We aggregate news from outlets across the political spectrum to provide balanced coverage. 
          Each source is labeled by its typical editorial leaning to help you understand different perspectives. 
          We encourage you to read articles from all sides to form well-rounded opinions.
        </p>
      </div>
    </div>
  );
}

function SourceCard({ source }) {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderLeft: `4px solid ${leaningColors[source.leaning]}`,
      padding: '20px',
      borderRadius: '4px',
      background: '#fff'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '15px' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>
            {source.name}
          </h3>
          <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
            {source.description}
          </p>
          <p style={{ margin: '0', fontSize: '12px', color: '#999' }}>
            Added {new Date(source.created_at).toLocaleDateString()}
          </p>
        </div>
        <div style={{
          background: leaningColors[source.leaning],
          color: 'white',
          padding: '8px 15px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          textTransform: 'capitalize'
        }}>
          {leaningLabels[source.leaning]}
        </div>
      </div>
    </div>
  );
}
