
import React, { useState, useEffect } from 'react';
import { SiteConfig, UserData } from '../types';
import { 
  Database, Loader2, Files, ShieldCheck, Layout, Crown, 
  Trash2, PlusCircle, ExternalLink, RefreshCw, Copy
} from 'lucide-react';
import JSZip from 'jszip';

interface Props {
  siteConfig: SiteConfig;
  setSiteConfig: React.Dispatch<React.SetStateAction<SiteConfig>>;
  user: UserData | null;
}

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzsrXMlQelnu1hBgn-DPoplUJJx2rFi46Ru3PQ5iB_nVh_oUWHfKVO3KyTbnkVw3sxg/exec";

export const Customization: React.FC<Props> = ({ siteConfig, setSiteConfig, user }) => {
  const [items, setItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState({ title: '', link: '', meta: 'PDF' });
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialisation du projet Premium sur le serveur Admin
  useEffect(() => {
    if (user && !isInitialized) {
      initializeProject();
    }
  }, [user]);

  const initializeProject = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({
          action: 'register',
          email: user?.email,
          projectName: siteConfig.projectName,
          firstName: user?.firstName,
          lastName: user?.lastName,
          ip: user?.ip,
          config: siteConfig
        })
      });
      
      // On récupère le token de session
      setIsInitialized(true);
      fetchItems();
    } catch (e) {
      console.error("Erreur SaaS Init", e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${APPS_SCRIPT_URL}?action=fetch&email=${user?.email}&project=${siteConfig.projectName}`);
      const data = await res.json();
      setItems(data.items || []);
      if (data.sheetId) setSiteConfig(prev => ({ ...prev, premiumSheetId: data.sheetId }));
    } catch (e) {}
    finally { setIsLoading(false); }
  };

  const addItem = async () => {
    if (!newItem.title || !newItem.link) return;
    setIsLoading(true);
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({
          action: 'update',
          email: user?.email,
          project: siteConfig.projectName,
          item: newItem
        })
      });
      setNewItem({ title: '', link: '', meta: 'PDF' });
      // Attente artificielle pour laisser Google Sync finir
      setTimeout(fetchItems, 1500);
    } catch (e) {}
  };

  const removeItem = async (index: number) => {
    setIsLoading(true);
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({
          action: 'delete',
          email: user?.email,
          project: siteConfig.projectName,
          index: index
        })
      });
      setTimeout(fetchItems, 1500);
    } catch (e) {}
  };

  const handleClone = async () => {
    setIsExporting(true);
    const zip = new JSZip();
    
    // URL directe pour le fetch dynamique du site cloné
    const resourcesUrl = `https://docs.google.com/spreadsheets/d/${siteConfig.premiumSheetId}/export?format=csv`;

    const themeColors = {
      neon: { bg: '#020617', primary: '#06b6d4', text: 'white' },
      golden: { bg: '#000000', primary: '#FFD700', text: 'black' },
      cosmic: { bg: '#0B0118', primary: '#A855F7', text: 'white' },
      forest: { bg: '#061A14', primary: '#10B981', text: 'white' }
    }[siteConfig.theme];

    // Contenu CSS
    const cssContent = `
      :root { --primary: ${themeColors.primary}; --bg: ${themeColors.bg}; }
      * { box-sizing: border-box; font-family: 'Outfit', sans-serif; }
      body { background: var(--bg); color: #f1f5f9; margin: 0; overflow-x: hidden; }
      canvas { position: fixed; inset: 0; pointer-events: none; z-index: 1; opacity: 0.6; }
      .container { max-width: 1100px; margin: 0 auto; padding: 6rem 2rem; position: relative; z-index: 10; }
      .glass { background: rgba(255,255,255,0.02); backdrop-filter: blur(30px); border: 1px solid rgba(255,255,255,0.05); border-radius: 3rem; }
      .btn-polaris { background: var(--primary); color: ${themeColors.text}; padding: 1.4rem 2.8rem; border-radius: 1.5rem; font-weight: 900; text-decoration: none; display: inline-flex; align-items: center; gap: 0.8rem; transition: 0.3s; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
      .btn-polaris:hover { transform: translateY(-5px); opacity: 0.9; }
      .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2.5rem; }
      .card { padding: 3.5rem; transition: 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); border: 1px solid rgba(255,255,255,0.03); }
      .card:hover { transform: scale(1.03); background: rgba(255,255,255,0.05); border-color: var(--primary); }
      .hidden { display: none !important; }
      .gatekeeper { position: fixed; inset: 0; background: var(--bg); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 2rem; }
      h1 { font-size: 4rem; letter-spacing: -0.05em; font-weight: 900; margin-bottom: 0.5rem; }
      .tag { font-size: 0.65rem; color: var(--primary); font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 1.5rem; display: block; }
    `;

    const backgroundScript = `
        const canvas = document.createElement('canvas'); document.body.prepend(canvas);
        const ctx = canvas.getContext('2d');
        let particles = [];
        const themeColor = "${themeColors.primary}";
        const speed = ${siteConfig.animationSpeed};
        const density = ${siteConfig.particleDensity};
        const style = "${siteConfig.backgroundStyle}";

        function init() {
            canvas.width = window.innerWidth; canvas.height = window.innerHeight;
            particles = Array.from({length: density}, () => ({
                x: Math.random() * canvas.width, y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * speed, vy: (Math.random() - 0.5) * speed, size: Math.random() * 2.5
            }));
        }
        function animate() {
            ctx.clearRect(0,0,canvas.width, canvas.height);
            particles.forEach(p => {
                if(style !== 'static') { p.x += p.vx; p.y += p.vy; }
                if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if(p.y < 0 || p.y > canvas.height) p.vy *= -1;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
                ctx.fillStyle = themeColor + "cc"; ctx.fill();
            });
            if(style === 'constellation') {
                for(let i=0; i<particles.length; i++) {
                    for(let j=i+1; j<particles.length; j++) {
                        const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                        if(d < 180) {
                            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.strokeStyle = themeColor + Math.floor((1 - d/180)*30).toString(16).padStart(2, '0');
                            ctx.lineWidth = 0.8; ctx.stroke();
                        }
                    }
                }
            }
            requestAnimationFrame(animate);
        }
        window.onresize = init; init(); animate();
    `;

    const indexHTML = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${siteConfig.title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    ${siteConfig.template === 'locked' ? `
    <div id="gate" class="gatekeeper">
        <div class="glass" style="max-width:450px; padding:4rem; text-align:center; box-shadow: 0 50px 100px rgba(0,0,0,0.8);">
            <h2 style="color:var(--primary); font-size:2.5rem; margin-bottom:1rem; font-weight:900;">ACCÈS SÉCURISÉ</h2>
            <p style="color:#64748b; font-size:0.9rem; margin-bottom:2.5rem; line-height:1.6;">Veuillez entrer votre nom pour déverrouiller les ressources SuccessPolaris.</p>
            <input type="text" id="name" placeholder="Votre Identité" style="width:100%; padding:1.2rem; border-radius:1.5rem; border:1px solid #ffffff10; background:rgba(0,0,0,0.5); color:#fff; margin-bottom:1.5rem; outline:none; text-align:center; font-size:1.1rem;">
            <button onclick="unlock()" class="btn-polaris" style="width:100%; justify-content:center; cursor:pointer;">DÉBLOQUER LES COURS</button>
        </div>
    </div>` : ''}

    <div class="container">
        <header style="margin-bottom: 7rem; text-align: center;">
            <div style="font-size:0.7rem; color:var(--primary); font-weight:900; margin-bottom:1.5rem; letter-spacing:0.5em;">SUCCESS POLARIS ARCHITECTURE</div>
            <h1>${siteConfig.title}</h1>
            <p style="color: #64748b; font-size:1.2rem; max-width:600px; margin: 0 auto;">${siteConfig.description}</p>
        </header>
        <div id="grid" class="grid"></div>
        <footer style="margin-top:10rem; text-align:center; opacity:0.3; font-size:0.6rem; letter-spacing:0.2em;">BÂTI PAR POLARIS STUDIO • 2025</footer>
    </div>

    <script>
        ${backgroundScript}
        const RES_URL = "${resourcesUrl}";
        
        async function load() {
            try {
                const grid = document.getElementById('grid');
                const res = await fetch(RES_URL);
                const csv = await res.text();
                const rows = csv.split(/\\r?\\n/).slice(1);
                grid.innerHTML = rows.map(line => {
                    const c = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                    if(!c[0]) return '';
                    const title = (c[0]||'Sans titre').replace(/^"|"$/g,'');
                    const link = (c[1]||'#').replace(/^"|"$/g,'');
                    const meta = (c[2]||'RESOURCE').replace(/^"|"$/g,'');
                    return \`<div class="glass card">
                        <span class="tag">\${meta}</span>
                        <h3 style="margin-bottom:2.5rem; font-size:1.4rem; font-weight:900; line-height:1.2;">\${title}</h3>
                        <a href="\${link}" target="_blank" class="btn-polaris">VOIR LE CONTENU</a>
                    </div>\`;
                }).join('');
            } catch(e) { console.error("Sync Error", e); }
        }

        function unlock() {
            const name = document.getElementById('name').value;
            if(name.length > 2) {
                localStorage.setItem('polaris_${siteConfig.projectName}_unlocked', 'true');
                document.getElementById('gate').classList.add('hidden');
                load();
            }
        }

        if(localStorage.getItem('polaris_${siteConfig.projectName}_unlocked') || "${siteConfig.template}" === "standard") {
            if(document.getElementById('gate')) document.getElementById('gate').classList.add('hidden');
            load();
        }
    </script>
</body>
</html>`;

    zip.file("index.html", indexHTML);
    zip.file("style.css", cssContent);
    const blob = await zip.generateAsync({ type: "blob" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SaaS_Polaris_${siteConfig.projectName}.zip`;
    a.click();
    setIsExporting(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* DASHBOARD DE GESTION */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/60 border border-white/5 rounded-[3rem] p-8 backdrop-blur-3xl">
            <header className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20"><Database className="text-cyan-400" /></div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tighter">Boutique de Ressources</h2>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Connecté à : {user?.email}</p>
                </div>
              </div>
              <button onClick={fetchItems} disabled={isLoading} className="p-3 hover:bg-white/5 rounded-xl transition-all">
                <RefreshCw className={`w-5 h-5 text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </header>

            {/* FORMULAIRE D'AJOUT */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-8">
              <input value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} placeholder="Titre du cours..." className="md:col-span-5 bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm" />
              <input value={newItem.link} onChange={e => setNewItem({...newItem, link: e.target.value})} placeholder="Lien PDF/Drive..." className="md:col-span-5 bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm" />
              <button onClick={addItem} disabled={isLoading} className="md:col-span-2 bg-white text-black rounded-2xl flex items-center justify-center hover:scale-105 transition-all">
                <PlusCircle className="w-6 h-6" />
              </button>
            </div>

            {/* LISTE DES ITEMS DANS LE CLOUD */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {items.length === 0 && !isLoading && <div className="py-20 text-center opacity-20 text-[10px] uppercase font-black tracking-widest">Aucune ressource dans le nuage</div>}
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white/5 border border-white/5 p-4 rounded-2xl group transition-all hover:bg-white/[0.08]">
                  <div className="flex-1">
                    <div className="text-[8px] font-black text-cyan-400 uppercase mb-1">{item.meta}</div>
                    <div className="text-white font-bold text-sm truncate max-w-[200px]">{item.title}</div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href={item.link} target="_blank" className="p-2 text-slate-400 hover:text-white"><ExternalLink className="w-4 h-4" /></a>
                    <button onClick={() => removeItem(idx)} className="p-2 text-red-500/50 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-[2.5rem] p-6 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <ShieldCheck className="text-emerald-400 w-5 h-5" />
               <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Base de données isolée et sécurisée</span>
             </div>
             <div className="text-[9px] text-slate-600 font-bold">ID: {siteConfig.premiumSheetId?.substring(0,10)}...</div>
          </div>
        </div>

        {/* ACTIONS CLONAGE & INFOS */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-slate-900/60 border border-white/5 rounded-[3rem] p-8 backdrop-blur-3xl">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2"><Layout className="w-4 h-4" /> Exportation Finale</h3>
            
            <div className="p-6 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl mb-8">
               <h4 className="text-yellow-500 text-[10px] font-black uppercase mb-3 flex items-center gap-2"><RefreshCw className="w-3 h-3" /> Persistance du Projet</h4>
               <p className="text-slate-400 text-xs leading-relaxed mb-4">
                 Votre site reste connecté à ce tableau de bord. Chaque modification ici sera répercutée sur votre site cloné en 2 secondes.
               </p>
               <button onClick={() => {
                 const link = `${window.location.origin}?project=${siteConfig.projectName}&email=${user?.email}`;
                 navigator.clipboard.writeText(link);
                 alert("Lien de gestion copié !");
               }} className="w-full bg-white/5 py-3 rounded-xl text-white text-[10px] font-black uppercase tracking-widest border border-white/10 flex items-center justify-center gap-2 hover:bg-white/10">
                 <Copy className="w-3 h-3" /> Copier le lien de gestion
               </button>
            </div>

            <button onClick={handleClone} disabled={isExporting} className="w-full bg-white text-black font-black py-7 rounded-[2rem] flex items-center justify-center gap-3 shadow-2xl transition-all hover:scale-[1.03] disabled:opacity-20">
               {isExporting ? <Loader2 className="animate-spin" /> : <Files className="w-6 h-6" />}
               DÉPLOYER MON SITE
            </button>
          </section>

          <section className="bg-cyan-500/5 border border-cyan-500/10 rounded-[2.5rem] p-8">
            <h4 className="text-cyan-400 text-[10px] font-black uppercase mb-4 tracking-widest">Résumé du Design</h4>
            <div className="space-y-2">
               <div className="flex justify-between text-[10px]"><span className="text-slate-500">Thème :</span> <span className="text-white uppercase">{siteConfig.theme}</span></div>
               <div className="flex justify-between text-[10px]"><span className="text-slate-500">Animation :</span> <span className="text-white">{siteConfig.animationSpeed}x</span></div>
               <div className="flex justify-between text-[10px]"><span className="text-slate-500">Mode :</span> <span className="text-white uppercase">{siteConfig.template}</span></div>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
};
