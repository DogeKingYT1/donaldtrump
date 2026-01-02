export default async function handler(req, res){
  try{
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    if(!supabaseUrl || !supabaseKey) return res.status(500).json({ error: 'missing_supabase' });
    const url = new URL(req.url, 'http://localhost');
    const idParam = url.searchParams.get('id');
    let endpoint = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/posts?select=*`;
    if(idParam) endpoint += `&${idParam}`;
    endpoint += '&order=created_at.desc';
    const r = await fetch(endpoint, { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } });
    const data = await r.json();
    res.status(200).json(data);
  }catch(e){ console.error(e); res.status(500).json({ error:'internal' }) }
}
