
import React, { useState, useEffect } from 'react';
import { SiteConfig, UserData } from '../types';
import { 
  Database, Loader2, Files, ShieldCheck, Layout, Crown, 
  Trash2, PlusCircle, ExternalLink, RefreshCw, Copy, CheckCircle2
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

  useEffect(() => {
    if (user && !isInitialized) {
      initializeProject();
    }
  }, [user]);

  const initializeProject = async () => {
    setIsLoading(true);
    try {
      // PourPremium : enregistrement sur le compte admin central
      await fetch(APPS_SCRIPT_URL, {
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
      setIsInitialized(true);
      fetchItems();
    } catch (e) {
      console.error("SaaS Connection Error", e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchItems = async () => {
    if (siteConfig.deploymentType === 'free' && !siteConfig.resourcesUrl) return;
    setIsLoading(true);
    try {
      const url = siteConfig.deploymentType === 'premium' 
        ? `${APPS_SCRIPT_URL}?action=fetch&email=${user?.email}&project=${siteConfig.projectName}`
        : `${siteConfig.resourcesUrl}`; // Format CSV direct si Free
      
      const res = await fetch(url);
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
      setTimeout(fetchItems, 1000);
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
      setTimeout(fetchItems, 1000);
    } catch (e) {}
  };

  const handleClone = async () => {
    setIsExporting(true);
    const zip = new JSZip();
    
    const resourcesUrl = siteConfig.deploymentType === 'premium'
      ? `https://docs.google.com/spreadsheets/d/${siteConfig.premiumSheetId}/export?format=csv`
      : siteConfig.resourcesUrl;

    const themeColors = {
      neon: { bg: '#020617', primary: '#06b6d4', text: 'white' },
      golden: { bg: '#000000', primary: '#FFD700', text: 'black' },
      cosmic: { bg: '#0B0118', primary: '#A855F7', text: 'white' },
      forest: { bg: '#061A14', primary: '#10B981', text: 'white' }
    }[siteConfig.theme];

    const cssContent = `
      :root { --primary: ${themeColors.primary}; --bg: ${themeColors.bg}; }
      * { box-sizing: border-box; font-family: 'Outfit', sans-serif; }
      body { background: var(--bg); color: #f1f5f9; margin: 0; overflow-x: hidden; }
      canvas { position: fixed; inset: 0; pointer-events: none; z-index: 1; opacity: 0.5; }
      .container { max-width: 1100px; margin: 0 auto; padding: 6rem 2rem; position: relative; z-index: 10; }
      .glass { background: rgba(255,255,255,0.02); backdrop-filter: blur(30px); border: 1px solid rgba(255,255,255,0.05); border-radius: 3rem; }
      .btn-polaris { background: var(--primary); color: ${themeColors.text}; padding: 1.2rem 2.5rem; border-radius: 1.2rem; font-weight: 900; text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem; transition: 0.3s; }
      .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; }
      .card { padding: 3rem; transition: 0.4s; }
      .card:hover { transform: translateY(-10px); border-color: var(--primary); }
      .gatekeeper { position: fixed; inset: 0; background: var(--bg); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 2rem; }
      .hidden { display: none !important; }
    `;

    const indexHTML = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8"><title>${siteConfig.title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    ${siteConfig.template === 'locked' ? `
    <div id="gate" class="gatekeeper">
        <div class="glass" style="max-width:400px; padding:3rem; text-align:center;">
            <h2 style="color:var(--primary); font-size:2rem; margin-bottom:1rem; font-weight:900;">ACCÈS RÉSERVÉ</h2>
            <input type="text" id="name" placeholder="Votre Nom" style="width:100%; padding:1rem; border-radius:1rem; border:1px solid #ffffff10; background:#000; color:#fff; margin-bottom:1rem; text-align:center;">
            <button onclick="unlock()" class="btn-polaris" style="width:100%; justify-content:center;">DÉBLOQUER</button>
        </div>
    </div>` : ''}
    <div class="container">
        <h1 style="font-size: 3.5rem; color: var(--primary); text-align:center; font-weight:900;">${siteConfig.title}</h1>
        <div id="grid" class="grid" style="margin-top:5rem;"></div>
    </div>
    <script>
        const RES_URL = "${resourcesUrl}";
        async function load() {
            const res = await fetch(RES_URL);
            const csv = await res.text();
            const rows = csv.split(/\\r?\\n/).slice(1);
            document.getElementById('grid').innerHTML = rows.map(line => {
                const c = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                if(!c[0]) return '';
                return \`<div class="glass card">
                    <div style="font-size:0.6rem; color:var(--primary); font-weight:900; margin-bottom:1rem;">\${(c[2]||'PDF').replace(/^"|"$/g,'')}</div>
                    <h3 style="margin-bottom:2rem; font-weight:900;">\${c[0].replace(/^"|"$/g,'')}</h3>
                    <a href="\${(c[1]||'#').replace(/^"|"$/g,'')}" target="_blank" class="btn-polaris">OUVRIR</a>
                </div>\`;
            }).join('');
        }
        function unlock() {
            if(document.getElementById('name').value.length > 2) {
                localStorage.setItem('unlocked_${siteConfig.projectName}', 'true');
                document.getElementById('gate').classList.add('hidden');
                load();
            }
        }
        if(localStorage.getItem('unlocked_${siteConfig.projectName}') || "${siteConfig.template}" === "standard") {
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
    a.download = `SuccessPolaris_${siteConfig.projectName}.zip`;
    a.click();
    setIsExporting(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* DASHBOARD GESTION */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900/60 border border-white/5 rounded-[3rem] p-8 backdrop-blur-3xl shadow-2xl relative">
            <div className="absolute top-8 right-8 flex items-center gap-2 text-emerald-400 text-[9px] font-black uppercase">
              <CheckCircle2 className="w-4 h-4" /> Persistance Active (IP)
            </div>
            
            <header className="flex items-center gap-4 mb-10">
              <div className="p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20"><Database className="text-yellow-500" /></div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase">{siteConfig.projectName}</h2>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{siteConfig.deploymentType === 'premium' ? 'Cloud Polaris Admin' : 'Sheet Externe'}</p>
              </div>
            </header>

            {siteConfig.deploymentType === 'premium' ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <input value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} placeholder="Nom du PDF..." className="md:col-span-5 bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm" />
                  <input value={newItem.link} onChange={e => setNewItem({...newItem, link: e.target.value})} placeholder="Lien Drive/PDF..." className="md:col-span-5 bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm" />
                  <button onClick={addItem} disabled={isLoading} className="md:col-span-2 bg-yellow-500 text-black rounded-2xl flex items-center justify-center hover:scale-105 transition-all">
                    <PlusCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white/5 border border-white/5 p-4 rounded-2xl group transition-all">
                      <div className="text-white font-bold text-xs">{item.title}</div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => removeItem(idx)} className="p-2 text-red-500/50 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-500">Lien Google Sheet (Publié en CSV)</label>
                <input 
                  type="text" 
                  value={siteConfig.resourcesUrl} 
                  onChange={e => setSiteConfig({...siteConfig, resourcesUrl: e.target.value})}
                  placeholder="https://docs.google.com/spreadsheets/d/.../export?format=csv"
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white text-sm"
                />
              </div>
            )}
          </div>
        </div>

        {/* ACTIONS & EXPORT */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-slate-900/60 border border-white/5 rounded-[3rem] p-8 shadow-2xl backdrop-blur-3xl">
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-8">Résumé Configuration</h3>
            <div className="space-y-4 mb-10">
              <div className="flex justify-between items-center"><span className="text-slate-500 text-[10px] uppercase font-bold">Modèle :</span> <span className="text-white font-black uppercase text-xs">{siteConfig.template === 'standard' ? 'A (Libre)' : 'B (Locked)'}</span></div>
              <div className="flex justify-between items-center"><span className="text-slate-500 text-[10px] uppercase font-bold">Service :</span> <span className="text-yellow-500 font-black uppercase text-xs">{siteConfig.deploymentType}</span></div>
            </div>

            <button onClick={handleClone} disabled={isExporting} className="w-full bg-white text-black font-black py-7 rounded-[2rem] flex items-center justify-center gap-3 shadow-2xl transition-all hover:scale-105 active:scale-95">
               {isExporting ? <Loader2 className="animate-spin" /> : <Files className="w-6 h-6" />}
               DÉPLOYER MON SITE
            </button>
          </section>

          <button onClick={() => window.location.reload()} className="w-full py-4 text-slate-500 text-[9px] font-black uppercase tracking-widest hover:text-white transition-colors">
            Réinitialiser la session
          </button>
        </div>
      </div>
    </div>
  );
};
