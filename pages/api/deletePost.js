async function readJson(req){ if (req.body) return req.body; return new Promise((resolve)=>{let d=''; req.on('data',c=>d+=c); req.on('end',()=>{try{resolve(JSON.parse(d||'{}'))}catch(e){resolve({})}});}); }

export default async function handler(req,res){
  if(req.method!=='POST' && req.method!=='DELETE') return res.status(405).json({error:'method'});
  try{
    const auth = (req.headers.authorization||'');
    const token = auth.replace(/^Bearer\s+/i,'');
    if(!token || token !== process.env.ADMIN_TOKEN) return res.status(401).json({ error: 'unauthorized' });
    const body = await readJson(req);
    const { id } = body;
    if(!id) return res.status(400).json({ error:'missing_id' });
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
    const endpoint = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/posts?id=eq.${encodeURIComponent(id)}`;
    const r = await fetch(endpoint, { method:'DELETE', headers: { apikey: supabaseServiceKey, Authorization: `Bearer ${supabaseServiceKey}`, Prefer:'return=representation' } });
    const data = await r.json();
    res.status(200).json(data);
  }catch(e){console.error(e); res.status(500).json({ error:'internal' })}
}
