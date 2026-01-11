import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function SourcesManagement() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', feed_url: '', leaning: 'center', description: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    checkAdminAndFetchSources();
  }, []);

  async function checkAdminAndFetchSources() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      setIsAdmin(profile?.is_admin || false);
      fetchSources();
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchSources() {
    try {
      const { data } = await supabase
        .from('sources')
        .select('*')
        .order('created_at', { ascending: false });
      setSources(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddSource(e) {
    e.preventDefault();
    setError('');

    if (!isAdmin) {
      setError('Only admins can add sources');
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from('sources')
        .insert([formData]);

      if (insertError) throw insertError;

      setFormData({ name: '', feed_url: '', leaning: 'center', description: '' });
      setShowForm(false);
      fetchSources();
    } catch (err) {
      setError(err.message || 'Failed to add source');
    }
  }

  async function toggleSourceActive(source) {
    try {
      await supabase
        .from('sources')
        .update({ active: !source.active })
        .eq('id', source.id);
      fetchSources();
    } catch (err) {
      setError(err.message || 'Failed to update source');
    }
  }

  async function deleteSource(id) {
    if (!confirm('Delete this source? Articles already fetched will remain.')) return;

    try {
      await supabase.from('sources').delete().eq('id', id);
      fetchSources();
    } catch (err) {
      setError(err.message || 'Failed to delete source');
    }
  }

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

  if (!isAdmin) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <h2>News Sources</h2>
        <p style={{ color: '#999' }}>Only admins can manage sources.</p>
      </div>
    );
  }

  const leaningLabels = { left: 'Left', center: 'Center', right: 'Right', independent: 'Independent' };
  const leaningColors = { left: '#1976d2', center: '#388e3c', right: '#d32f2f', independent: '#f57c00' };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h2>Manage News Sources</h2>
      {error && <div style={{ backgroundColor: '#f44336', color: '#fff', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>{error}</div>}

      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          padding: '8px 16px',
          backgroundColor: '#1976d2',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        {showForm ? 'Cancel' : '+ Add Source'}
      </button>

      {showForm && (
        <form onSubmit={handleAddSource} style={{
          backgroundColor: '#fff',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'grid',
          gap: '12px'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px' }}>Source Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., CNN"
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px' }}>Feed URL</label>
            <input
              type="url"
              value={formData.feed_url}
              onChange={(e) => setFormData({ ...formData, feed_url: e.target.value })}
              placeholder="https://rss.example.com/feed"
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px' }}>Political Leaning</label>
            <select
              value={formData.leaning}
              onChange={(e) => setFormData({ ...formData, leaning: e.target.value })}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="independent">Independent</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px' }}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '60px' }}
            />
          </div>

          <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Add Source
          </button>
        </form>
      )}

      <div style={{ display: 'grid', gap: '12px' }}>
        {sources.map(source => (
          <div key={source.id} style={{
            backgroundColor: '#fff',
            padding: '16px',
            borderRadius: '8px',
            borderLeft: `4px solid ${leaningColors[source.leaning]}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0' }}>{source.name}</h3>
                <span style={{
                  display: 'inline-block',
                  backgroundColor: leaningColors[source.leaning],
                  color: '#fff',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {leaningLabels[source.leaning]}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => toggleSourceActive(source)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: source.active ? '#4caf50' : '#ccc',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  {source.active ? 'Active' : 'Inactive'}
                </button>
                <button
                  onClick={() => deleteSource(source.id)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#f44336',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>

            <p style={{ margin: '8px 0', color: '#666', fontSize: '14px' }}>{source.description}</p>
            <p style={{ margin: '4px 0', color: '#999', fontSize: '12px', wordBreak: 'break-all' }}>{source.feed_url}</p>
            <p style={{ margin: '4px 0', color: '#ccc', fontSize: '11px' }}>
              Added: {new Date(source.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
