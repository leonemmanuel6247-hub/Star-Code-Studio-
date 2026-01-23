
import React, { useState } from 'react';
import { SiteConfig, UserData } from '../types';
import { 
  Palette, Database, ExternalLink, CheckCircle, 
  Terminal, Eye, Link as LinkIcon, 
  Loader2, Sparkles, Monitor, Smartphone,
  FileCode, Files, ShieldCheck, Zap, MessageSquare,
  Type
} from 'lucide-react';
import JSZip from 'jszip';

interface Props {
  siteConfig: SiteConfig;
  setSiteConfig: React.Dispatch<React.SetStateAction<SiteConfig>>;
  user: UserData | null;
}

export const Customization: React.FC<Props> = ({ siteConfig, setSiteConfig, user }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [sheetUrl, setSheetUrl] = useState('');
  const [previewData, setPreviewData] = useState<any[]>([]);

  const transformToExportUrl = (url: string) => {
    let cleanUrl = url.trim();
    if (cleanUrl.includes('/edit')) {
      return cleanUrl.replace(/\/edit.*$/, '/export?format=csv');
    } else if (cleanUrl.includes('docs.google.com') && !cleanUrl.includes('/export')) {
      return cleanUrl.replace(/\/$/, '') + '/export?format=csv';
    }
    return cleanUrl;
  };

  const parseCSV = (text: string) => {
    const lines = text.split(/\r?\n/);
    return lines.map(line => {
      const result = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') inQuotes = !inQuotes;
        else if (char === ',' && !inQuotes) {
          result.push(current);
          current = '';
        } else current += char;
      }
      result.push(current);
      return result;
    });
  };

  const handleConnect = async () => {
    if (!sheetUrl.trim()) return;
    setIsLoadingData(true);
    try {
      const exportUrl = transformToExportUrl(sheetUrl);
      const response = await fetch(exportUrl);
      if (!response.ok) throw new Error("Accès refusé");
      const csvText = await response.text();
      const rows = parseCSV(csvText).slice(1).map(cols => ({
        title: cols[0]?.trim().replace(/^"|"$/g, ''),
        link: cols[1]?.trim().replace(/^"|"$/g, ''),
        meta: cols[2]?.trim().replace(/^"|"$/g, '') || 'Ressource'
      }));
      
      setPreviewData(rows.filter(r => r.title));
      setIsConnected(true);
    } catch (e) {
      alert("Erreur de liaison : Assurez-vous que votre fichier est bien 'Publié sur le Web' (Fichier > Partager > Publier sur le Web) et que l'URL est correcte.");
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleClone = async () => {
    setIsExporting(true);
    const zip = new JSZip();
    const finalExportUrl = transformToExportUrl(sheetUrl);

    const cssContent = `
      :root { --primary: ${siteConfig.primaryColor}; --bg: #020617; --card: rgba(15, 23, 42, 0.7); }
      * { box-sizing: border-box; }
      body { background: var(--bg); color: #f1f5f9; font-family: 'Space Grotesk', sans-serif; margin: 0; line-height: 1.6; overflow-x: hidden; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
      .glass { background: var(--card); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 2.5rem; }
      .neon-text { color: var(--primary); text-shadow: 0 0 10px var(--primary); }
      .btn-polaris { 
        background: var(--primary); color: white; padding: 1.2rem 2.5rem; border-radius: 1.5rem; 
        font-weight: 800; text-decoration: none; display: inline-flex; align-items: center; gap: 0.8rem;
        transition: 0.4s; border: none; cursor: pointer; text-transform: uppercase; letter-spacing: 0.1em;
      }
      .btn-polaris:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.3); opacity: 0.9; }
      .nav { padding: 2.5rem 0; display: flex; justify-content: space-between; align-items: center; }
      .nav-links a { text-decoration: none; color: #64748b; font-weight: 800; font-size: 0.8rem; text-transform: uppercase; margin-left: 2rem; transition: 0.3s; }
      .nav-links a:hover { color: var(--primary); }
      .hero { padding: 8rem 0; text-align: center; }
      .hero h1 { font-size: 4.5rem; font-weight: 900; margin-bottom: 2rem; line-height: 1.1; }
      .resource-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem; padding-bottom: 5rem; }
      .card { padding: 2.5rem; display: flex; flex-direction: column; transition: 0.4s; height: 100%; position: relative; overflow: hidden; }
      .card:hover { border-color: var(--primary); transform: translateY(-5px); }
      .card-tag { font-size: 0.7rem; font-weight: 900; color: var(--primary); text-transform: uppercase; margin-bottom: 1rem; letter-spacing: 0.2em; }
      .error-msg { padding: 3rem; text-align: center; border: 1px dashed rgba(255,0,0,0.3); border-radius: 2rem; color: #ef4444; background: rgba(239, 68, 68, 0.05); }
    `;

    const homeHTML = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${siteConfig.title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <nav class="nav">
            <div class="neon-text" style="font-size: 1.5rem; font-weight: 900;">${siteConfig.title.toUpperCase()}</div>
            <div class="nav-links"><a href="bibliotheque.html">Bibliothèque</a></div>
        </nav>
        <section class="hero">
            <h1 class="neon-text">${siteConfig.title}</h1>
            <p style="color: #94a3b8; font-size: 1.3rem; max-width: 800px; margin: 0 auto 4rem;">${siteConfig.description}</p>
            <a href="bibliotheque.html" class="btn-polaris">Accéder aux ressources</a>
        </section>
    </div>
</body>
</html>`;

    const libHTML = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bibliothèque | ${siteConfig.title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <nav class="nav">
            <div class="neon-text" style="font-size: 1.5rem; font-weight: 900;">${siteConfig.title.toUpperCase()}</div>
            <div class="nav-links"><a href="index.html">Accueil</a></div>
        </nav>
        <header style="margin-bottom: 5rem;">
            <h2 style="font-size: 3.5rem; font-weight: 900;">${siteConfig.title} <span class="neon-text">Cloud</span></h2>
            <p style="color: #64748b;">Espace de ressources géré par ${user?.firstName}.</p>
        </header>
        <div id="grid" class="resource-grid">
            <div id="loading" style="grid-column: 1/-1; text-align: center; padding: 10rem; opacity: 0.5;">INITIALISATION DES DONNÉES...</div>
        </div>
    </div>
    <script>
        function parseCSVLine(line) {
            const result = [];
            let current = '';
            let inQuotes = false;
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (char === '"') inQuotes = !inQuotes;
                else if (char === ',' && !inQuotes) {
                    result.push(current);
                    current = '';
                } else current += char;
            }
            result.push(current);
            return result;
        }

        async function loadData() {
            const url = "${finalExportUrl}";
            const container = document.getElementById('grid');
            try {
                const res = await fetch(url);
                if (!res.ok) throw new Error("CORS_OR_NOT_FOUND");
                
                const csv = await res.text();
                const lines = csv.split(/\\r?\\n/);
                const rows = lines.slice(1);
                
                let html = '';
                rows.forEach(line => {
                    if (!line.trim()) return;
                    const c = parseCSVLine(line);
                    const title = (c[0] || '').replace(/^"|"$/g, '').trim();
                    if (!title) return;
                    
                    const link = (c[1] || '').replace(/^"|"$/g, '').trim() || '#';
                    const tag = (c[2] || '').replace(/^"|"$/g, '').trim() || 'RESSOURCE';
                    
                    html += \`<div class="glass card">
                        <div class="card-tag">\${tag}</div>
                        <h3 style="font-size: 1.5rem; font-weight: 900; margin-bottom: 2.5rem; flex: 1;">\${title}</h3>
                        <a href="\${link}" target="_blank" class="btn-polaris" style="padding: 1rem; font-size: 0.7rem; justify-content: center;">CONSULTER</a>
                    </div>\`;
                });

                if (html === '') {
                    container.innerHTML = '<div class="error-msg">Aucune donnée trouvée dans la feuille Google Sheets.</div>';
                } else {
                    container.innerHTML = html;
                }
            } catch(e) { 
                console.error("Erreur Polaris :", e);
                container.innerHTML = \`<div class="error-msg" style="grid-column: 1/-1;">
                    <h3 style="margin-bottom: 1rem; font-weight: 900;">ERREUR DE LIAISON</h3>
                    <p style="font-size: 0.9rem; opacity: 0.8;">Impossible de récupérer les données.</p>
                    <p style="font-size: 0.8rem; margin-top: 1.5rem;">Vérifiez que votre Google Sheets est bien <b>"Publié sur le Web"</b> :<br/>
                    (Fichier > Partager > Publier sur le Web > Publier)</p>
                </div>\`;
            }
        }
        loadData();
    </script>
</body>
</html>`;

    zip.file("index.html", homeHTML);
    zip.file("bibliotheque.html", libHTML);
    zip.file("style.css", cssContent);
    zip.file("POLARIS_IDENTITE.txt", `Cloné par : ${user?.firstName} ${user?.lastName}\nSource : SuccessPolaris Builder\nDate : ${new Date().toLocaleDateString()}`);
    
    const blob = await zip.generateAsync({ type: "blob" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SuccessPolaris_${siteConfig.title.replace(/\s+/g, '_')}.zip`;
    a.click();
    setIsExporting(false);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12">
      <div className="flex flex-col xl:flex-row gap-12">
        
        {/* Pilotage */}
        <div className="w-full xl:w-[500px] space-y-6">
          <div className="bg-slate-900/90 backdrop-blur-3xl border border-slate-800 rounded-[3rem] p-10 shadow-2xl space-y-10">
            <header className="flex items-center gap-5">
              <div className="p-4 bg-cyan-500/10 rounded-3xl"><Zap className="w-8 h-8 text-cyan-400" /></div>
              <div>
                <h2 className="text-3xl font-heading font-black text-white">Atelier Clone</h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Personnalisation Finale</p>
              </div>
            </header>

            <div className="space-y-8">
              <section className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nom du Site (Apparaîtra dans le clone)</label>
                <input 
                  type="text" 
                  value={siteConfig.title}
                  onChange={(e) => setSiteConfig({...siteConfig, title: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-cyan-500/50 outline-none transition-all"
                />
                <textarea 
                  value={siteConfig.description}
                  onChange={(e) => setSiteConfig({...siteConfig, description: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-cyan-500/50 outline-none h-24 transition-all"
                />
              </section>

              <section className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Liaison Google Sheets</label>
                <div className="space-y-4">
                  <div className="relative group">
                    <input 
                      type="text" 
                      placeholder="URL de partage ou de publication..."
                      value={sheetUrl}
                      onChange={(e) => setSheetUrl(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-5 text-sm text-cyan-100 placeholder:text-slate-700 focus:border-cyan-500 outline-none transition-all"
                    />
                    <LinkIcon className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
                  </div>
                  <button 
                    onClick={handleConnect}
                    disabled={isLoadingData || !sheetUrl}
                    className="w-full bg-slate-800 text-white font-black py-5 rounded-2xl text-xs flex items-center justify-center gap-3 border border-slate-700 hover:bg-slate-700 transition-all disabled:opacity-20"
                  >
                    {isLoadingData ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    TESTER LA LIAISON
                  </button>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest leading-relaxed text-center font-bold px-4">
                    Astuce : Utilisez "Fichier > Partager > Publier sur le web" pour une compatibilité maximale.
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aura Visuelle</label>
                <div className="flex gap-4">
                  {['#06b6d4', '#a855f7', '#f43f5e', '#10b981'].map(c => (
                    <button 
                      key={c} 
                      onClick={() => setSiteConfig({...siteConfig, primaryColor: c})} 
                      className={`w-12 h-12 rounded-xl transition-all ${siteConfig.primaryColor === c ? 'ring-4 ring-white/20 scale-110' : 'opacity-40 hover:opacity-100'}`} 
                      style={{ backgroundColor: c }} 
                    />
                  ))}
                </div>
              </section>
            </div>

            <button 
              onClick={handleClone} 
              disabled={!isConnected || isExporting} 
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black py-7 rounded-[2rem] flex flex-col items-center gap-1 shadow-2xl disabled:opacity-20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-3">
                {isExporting ? <Loader2 className="w-7 h-7 animate-spin" /> : <Files className="w-7 h-7" />}
                <span className="text-2xl tracking-tight">CLONER LE SITE</span>
              </div>
              <span className="text-[9px] uppercase tracking-[0.3em] opacity-60">Générer l'archive ZIP</span>
            </button>
          </div>
        </div>

        {/* Aperçu */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between px-10">
            <div className="flex gap-4 bg-slate-900/50 p-2 rounded-2xl border border-slate-800">
              <button onClick={() => setPreviewDevice('desktop')} className={`p-4 rounded-xl transition-all ${previewDevice === 'desktop' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-600 hover:text-white'}`}><Monitor /></button>
              <button onClick={() => setPreviewDevice('mobile')} className={`p-4 rounded-xl transition-all ${previewDevice === 'mobile' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-600 hover:text-white'}`}><Smartphone /></button>
            </div>
          </div>

          <div className={`mx-auto bg-[#020617] rounded-[4rem] border-[16px] border-slate-900 shadow-2xl overflow-hidden relative transition-all duration-700 ${previewDevice === 'mobile' ? 'max-w-[420px] h-[800px]' : 'w-full h-[800px]'}`}>
            <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-14">
              <nav className="flex justify-between items-center mb-20">
                <div className="text-2xl font-black" style={{ color: siteConfig.primaryColor }}>{siteConfig.title}</div>
                <div className="flex gap-6 text-[10px] font-black uppercase text-slate-600">
                  <span className="hover:text-white cursor-pointer transition-colors">Accueil</span>
                  <span className="text-white cursor-pointer">Bibliothèque</span>
                </div>
              </nav>

              <header className="mb-20">
                <h2 className="text-6xl font-black mb-8 leading-none">{siteConfig.title} <span style={{ color: siteConfig.primaryColor }}>Cloud</span></h2>
                <p className="text-slate-500 text-xl max-w-xl">Vos ressources sont synchronisées avec succès.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {isConnected ? previewData.map((row, i) => (
                  <div key={i} className="bg-slate-900/40 border border-white/5 p-10 rounded-[3rem] hover:border-white/20 transition-all cursor-default group">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-700 mb-6 group-hover:text-cyan-400 transition-colors">{row.meta}</div>
                    <h4 className="text-2xl font-bold text-white mb-10 leading-tight">{row.title}</h4>
                    <div className="text-xs font-black uppercase flex items-center gap-2" style={{ color: siteConfig.primaryColor }}>
                      CONSULTER <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full py-48 text-center opacity-10 flex flex-col items-center">
                    <Database className="w-24 h-24 mb-6 animate-pulse" />
                    <p className="font-black uppercase tracking-widest text-sm">Synchronisation requise...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
