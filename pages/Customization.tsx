
import React, { useState, useEffect } from 'react';
import { SiteConfig, UserData } from '../types';
import { 
  Trash2, PlusCircle, ExternalLink, Download, Sparkles, 
  Files, Palette, Settings, Globe, Loader2, Crown, Type, MousePointer2
} from 'lucide-react';
import JSZip from 'jszip';
import { APPS_SCRIPT_URL } from '../App';

interface Props {
  siteConfig: SiteConfig;
  setSiteConfig: React.Dispatch<React.SetStateAction<SiteConfig>>;
  user: UserData | null;
}

export const Customization: React.FC<Props> = ({ siteConfig, setSiteConfig, user }) => {
  const [items, setItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState({ title: '', link: '', meta: 'PDF' });
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (user) fetchItems();
  }, [user]);

  const fetchItems = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${APPS_SCRIPT_URL}?action=fetch&email=${user.email}&project=${siteConfig.projectName}`);
      const data = await res.json();
      setItems(data.items || []);
    } catch (e) {
      console.error("Erreur cloud.");
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async () => {
    if (!newItem.title || !newItem.link || !user) return;
    setIsLoading(true);
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        body: JSON.stringify({
          action: 'update',
          email: user.email,
          project: siteConfig.projectName,
          item: newItem
        })
      });
      setNewItem({ title: '', link: '', meta: 'PDF' });
      setTimeout(fetchItems, 1500);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const removeItem = async (index: number) => {
    if (!user) return;
    setIsLoading(true);
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({
          action: 'delete',
          email: user.email,
          project: siteConfig.projectName,
          index: index
        })
      });
      setTimeout(fetchItems, 1000);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const themes: { id: SiteConfig['theme']; name: string; color: string }[] = [
    { id: 'golden', name: 'Or', color: '#FFD700' },
    { id: 'neon', name: 'Cyan', color: '#06b6d4' },
    { id: 'cosmic', name: 'Cosmic', color: '#A855F7' },
    { id: 'forest', name: 'Emerald', color: '#10B981' },
    { id: 'indigo', name: 'Indigo', color: '#4F46E5' },
    { id: 'yellow', name: 'Jaune', color: '#FACC15' },
    { id: 'white', name: 'Blanc', color: '#FFFFFF' },
    { id: 'grey', name: 'Gris', color: '#94A3B8' },
    { id: 'cherry', name: 'Cerise', color: '#F43F5E' },
    { id: 'red', name: 'Rouge', color: '#EF4444' }
  ];

  const fonts: SiteConfig['fontFamily'][] = [
    'Outfit', 'Space Grotesk', 'Inter', 'Fira Code', 'Playfair Display'
  ];

  const textColors = [
    { name: 'Pure White', value: '#FFFFFF' },
    { name: 'Silver', value: '#CBD5E1' },
    { name: 'Royal Gold', value: '#FDE047' },
    { name: 'Deep Black', value: '#0F172A' },
    { name: 'Soft Rose', value: '#FDA4AF' },
    { name: 'Neon Cyan', value: '#67E8F9' }
  ];

  const handleDownload = async () => {
    setIsExporting(true);
    const zip = new JSZip();
    
    const indexHTML = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${siteConfig.title} | SuccessPolaris</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;900&family=Space+Grotesk:wght@300;700&family=Inter:wght@400;900&family=Fira+Code:wght@400;700&family=Playfair+Display:wght@400;900&display=swap" rel="stylesheet">
    <style>
        :root { 
          --accent: ${siteConfig.primaryColor}; 
          --bg: #000; 
          --text: ${siteConfig.textColor};
          --font: '${siteConfig.fontFamily}', sans-serif;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--bg); color: var(--text); font-family: var(--font); overflow-x: hidden; }
        .galaxy { position: fixed; inset: 0; background: radial-gradient(circle at 50% 50%, #111 0%, #000 100%); z-index: -1; }
        .container { max-width: 1000px; margin: 0 auto; padding: 8rem 2rem; }
        header { text-align: center; margin-bottom: 8rem; }
        h1 { font-size: 5rem; font-weight: 900; letter-spacing: -0.05em; margin: 0; color: var(--accent); text-transform: uppercase; line-height: 0.9; }
        p.desc { opacity: 0.6; margin-top: 1.5rem; font-size: 1.1rem; max-width: 600px; margin-inline: auto; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem; }
        .card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 2.5rem; padding: 3rem; backdrop-filter: blur(20px); transition: 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .card:hover { border-color: var(--accent); transform: translateY(-10px); }
        .tag { font-size: 0.6rem; font-weight: 900; color: var(--accent); opacity: 0.8; letter-spacing: 0.3em; margin-bottom: 1rem; display: block; text-transform: uppercase; }
        h3 { font-size: 1.6rem; font-weight: 900; margin-bottom: 2.5rem; line-height: 1.2; text-transform: uppercase; }
        .btn { background: var(--accent); color: #000; padding: 1.2rem 2rem; border-radius: 1.2rem; font-weight: 900; text-decoration: none; display: inline-flex; align-items: center; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em; transition: 0.3s; }
        footer { margin-top: 10rem; text-align: center; opacity: 0.2; font-size: 0.7rem; letter-spacing: 0.4em; text-transform: uppercase; font-weight: 900; }
    </style>
</head>
<body>
    <div class="galaxy"></div>
    <div class="container">
        <header>
            <h1 id="title">${siteConfig.title}</h1>
            <p class="desc">${siteConfig.description}</p>
        </header>
        <div id="content" class="grid"></div>
        <footer>Propulsé par SuccessPolaris Remote Engine</footer>
    </div>
    <script>
        async function sync() {
            try {
                const ipRes = await fetch('https://api.ipify.org?format=json');
                const { ip } = await ipRes.json();
                const res = await fetch("${APPS_SCRIPT_URL}?action=fetchByIP&ip=" + ip);
                const data = await res.json();
                const grid = document.getElementById('content');
                grid.innerHTML = (data.items || []).map(item => \`
                    <div class="card">
                        <span class="tag">\${item.meta}</span>
                        <h3>\${item.title}</h3>
                        <a href="\${item.link}" target="_blank" class="btn">Visualiser</a>
                    </div>
                \`).join('');
                if(data.projectName) document.getElementById('title').innerText = data.projectName;
            } catch(e) { console.error(e); }
        }
        sync();
    </script>
</body>
</html>`;

    zip.file("index.html", indexHTML);
    const blob = await zip.generateAsync({ type: "blob" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `POLARIS_${siteConfig.projectName}.zip`;
    a.click();
    setIsExporting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* PANEL EDITION */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-slate-900/60 border border-white/5 rounded-[4rem] p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
            <header className="flex items-center justify-between mb-16">
              <div className="flex items-center gap-6">
                <div className="p-5 bg-yellow-500/10 rounded-3xl border border-yellow-500/20">
                  <Globe className="text-yellow-500 w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-4xl font-black tracking-tighter uppercase italic">{siteConfig.projectName || "PROJET"}</h2>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">SuccessPolaris Cloud Studio</p>
                </div>
              </div>
            </header>

            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-white/5 rounded-[2.5rem] border border-white/10">
                <input 
                  value={newItem.title} 
                  onChange={e => setNewItem({...newItem, title: e.target.value})} 
                  placeholder="Nom de la ressource..." 
                  className="md:col-span-5 bg-transparent border-none px-6 py-4 text-sm focus:ring-0 outline-none font-bold uppercase placeholder:text-slate-700" 
                />
                <input 
                  value={newItem.link} 
                  onChange={e => setNewItem({...newItem, link: e.target.value})} 
                  placeholder="Lien PDF..." 
                  className="md:col-span-5 bg-transparent border-none px-6 py-4 text-sm focus:ring-0 outline-none placeholder:text-slate-700" 
                />
                <button onClick={addItem} className="md:col-span-2 bg-yellow-500 text-black rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
                  <PlusCircle className="w-7 h-7" />
                </button>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-3 custom-scrollbar">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white/5 border border-white/5 p-6 rounded-[2rem] hover:border-yellow-500/30 transition-all backdrop-blur-sm">
                    <div className="flex-1 min-w-0">
                      <div className="text-[8px] font-black text-yellow-500 uppercase mb-1.5 tracking-widest">{item.meta}</div>
                      <div className="font-bold text-sm truncate pr-8 uppercase tracking-tight">{item.title}</div>
                    </div>
                    <div className="flex gap-3">
                      <a href={item.link} target="_blank" className="p-4 bg-white/5 rounded-2xl text-slate-600 hover:text-white transition-all"><ExternalLink className="w-4 h-4" /></a>
                      <button onClick={() => removeItem(idx)} className="p-4 bg-red-500/5 rounded-2xl text-red-500/30 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR PERSONNALISATION */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-slate-900/60 border border-white/5 rounded-[4rem] p-10 shadow-2xl backdrop-blur-3xl">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
              <Palette className="w-4 h-4 text-yellow-500" /> Thèmes Galactiques
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-10">
              {themes.map(t => (
                <button 
                  key={t.id}
                  onClick={() => setSiteConfig({...siteConfig, theme: t.id, primaryColor: t.color})}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all ${siteConfig.theme === t.id ? 'bg-white/10 border-white/20' : 'bg-black/20 border-white/5 opacity-40 hover:opacity-100'}`}
                >
                  <div className="w-5 h-5 rounded-full" style={{ backgroundColor: t.color }}></div>
                  <span className="text-[7px] font-black uppercase tracking-widest">{t.name}</span>
                </button>
              ))}
            </div>

            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
              <Type className="w-4 h-4 text-yellow-500" /> Typographie
            </h3>
            <div className="grid grid-cols-1 gap-2 mb-10">
              {fonts.map(f => (
                <button 
                  key={f}
                  onClick={() => setSiteConfig({...siteConfig, fontFamily: f})}
                  className={`px-6 py-4 rounded-2xl border text-left text-xs transition-all ${siteConfig.fontFamily === f ? 'bg-white/10 border-white/20' : 'bg-black/20 border-white/5 opacity-40'}`}
                  style={{ fontFamily: f }}
                >
                  {f} - SuccessPolaris
                </button>
              ))}
            </div>

            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
              <MousePointer2 className="w-4 h-4 text-yellow-500" /> Couleur d'Écriture
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {textColors.map(c => (
                <button 
                  key={c.value}
                  onClick={() => setSiteConfig({...siteConfig, textColor: c.value})}
                  className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-1 ${siteConfig.textColor === c.value ? 'bg-white/10 border-white/20' : 'bg-black/20 border-white/5'}`}
                >
                  <div className="w-4 h-4 rounded-md shadow-sm border border-white/10" style={{ backgroundColor: c.value }}></div>
                  <span className="text-[6px] font-black uppercase truncate w-full text-center">{c.name}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="bg-slate-900/60 border border-white/5 rounded-[4rem] p-10 shadow-2xl backdrop-blur-3xl">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
              <Settings className="w-4 h-4 text-yellow-500" /> Déploiement
            </h3>
            <button 
              onClick={handleDownload} 
              disabled={isExporting} 
              className="w-full bg-white text-black font-black py-8 rounded-[2.5rem] flex items-center justify-center gap-4 hover:scale-[1.03] transition-all"
            >
              {isExporting ? <Loader2 className="animate-spin" /> : <Download className="w-6 h-6" />}
              <span className="tracking-tighter uppercase">GÉNÉRER MON SITE</span>
            </button>
          </section>
        </div>

      </div>
    </div>
  );
};
