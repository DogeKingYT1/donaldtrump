async function readJson(req){ if (req.body) return req.body; return new Promise((resolve)=>{let d=''; req.on('data',c=>d+=c); req.on('end',()=>{try{resolve(JSON.parse(d||'{}'))}catch(e){resolve({})}});}); }

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'method'});
  try{
    const body = await readJson(req);
    const { password } = body;
    if(!password) return res.status(400).json({ error: 'missing_password' });
    if(password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: 'unauthorized' });
    const token = process.env.ADMIN_TOKEN || 'changeme';
    res.status(200).json({ token });
  }catch(e){console.error(e); res.status(500).json({ error:'internal' })}
}
