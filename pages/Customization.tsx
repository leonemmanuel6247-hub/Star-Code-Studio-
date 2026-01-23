
import React, { useState, useEffect } from 'react';
import { SiteConfig, UserData, SheetRow } from '../types';
import { 
  Palette, Table, Download, Database, FileText, 
  ExternalLink, CheckCircle, Type, Layout as LayoutIcon, 
  Settings2, Eye, Link as LinkIcon, Calendar, X, Globe,
  Search, Filter, Loader2, Sparkles
} from 'lucide-react';
import JSZip from 'jszip';

interface Props {
  siteConfig: SiteConfig;
  setSiteConfig: React.Dispatch<React.SetStateAction<SiteConfig>>;
  user: UserData | null;
}

// Étendons le type SheetRow pour le filtrage avancé
interface EnhancedSheetRow extends SheetRow {
  classe?: string;
  matiere?: string;
}

export const Customization: React.FC<Props> = ({ siteConfig, setSiteConfig, user }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [activeTab, setActiveTab] = useState<'style' | 'data'>('style');
  const [sheetUrl, setSheetUrl] = useState('');
  const [isInputtingUrl, setIsInputtingUrl] = useState(false);
  
  // Données réelles récupérées du Sheets
  const [fetchedData, setFetchedData] = useState<EnhancedSheetRow[]>([]);
  const [filters, setFilters] = useState({ classe: '', matiere: '' });

  // Parsing CSV simplifié
  const parseCSV = (csv: string): EnhancedSheetRow[] => {
    const lines = csv.split(/\r?\n/);
    if (lines.length < 2) return [];
    
    // On suppose l'ordre des colonnes : A=Nom/Icon, B=Lien, C=Classe, D=Matière/Date
    return lines.slice(1).filter(line => line.trim()).map(line => {
      // Gestion basique des virgules dans les guillemets
      const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      return {
        fileName: cols[0]?.replace(/"/g, '') || 'Sans titre',
        link: cols[1]?.replace(/"/g, '') || '#',
        classe: cols[2]?.replace(/"/g, '') || '',
        matiere: cols[3]?.replace(/"/g, '') || '',
        date: cols[4]?.replace(/"/g, '') || new Date().toLocaleDateString(),
        icon: '📄'
      };
    });
  };

  const handleConnect = async () => {
    if (!sheetUrl.trim()) {
      alert("Veuillez entrer une URL Google Sheets valide.");
      return;
    }

    // Transformation automatique de l'URL vers le format d'export CSV si nécessaire
    let exportUrl = sheetUrl;
    if (sheetUrl.includes('/edit')) {
      exportUrl = sheetUrl.replace(/\/edit.*$/, '/export?format=csv');
    }

    setIsLoadingData(true);
    try {
      const response = await fetch(exportUrl);
      if (!response.ok) throw new Error("Échec de la récupération du fichier");
      const csvData = await response.text();
      const rows = parseCSV(csvData);
      setFetchedData(rows);
      setIsConnected(true);
      setIsInputtingUrl(false);
    } catch (error) {
      console.error(error);
      alert("Erreur : Assurez-vous que le Google Sheet est partagé en 'Tous les utilisateurs disposant du lien' (Lecteur).");
    } finally {
      setIsLoadingData(false);
    }
  };

  const filteredData = fetchedData.filter(row => {
    const matchClasse = !filters.classe || (row.classe?.toLowerCase() === filters.classe.toLowerCase());
    const matchMatiere = !filters.matiere || (row.matiere?.toLowerCase() === filters.matiere.toLowerCase());
    return matchClasse && matchMatiere;
  });

  const uniqueClasses = Array.from(new Set(fetchedData.map(r => r.classe?.toLowerCase()).filter(Boolean)));
  const uniqueMatieres = Array.from(new Set(fetchedData.map(r => r.matiere?.toLowerCase()).filter(Boolean)));

  const generateSiteCode = () => {
    const dataHtml = filteredData.map(row => `
      <div class="card">
        <span class="icon">${row.icon}</span>
        <div class="info">
          <h3>${row.fileName}</h3>
          <p>${row.classe} • ${row.matiere}</p>
        </div>
        <a href="${row.link}" target="_blank">Ouvrir</a>
      </div>
    `).join('');

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>${siteConfig.title}</title>
    <style>
        body { font-family: '${siteConfig.font}', sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 40px; }
        .container { max-width: 900px; margin: 0 auto; text-align: ${siteConfig.layout === 'centered' ? 'center' : 'left'}; }
        h1 { color: ${siteConfig.primaryColor}; font-size: 3rem; margin-bottom: 10px; }
        p.desc { color: #94a3b8; font-size: 1.2rem; margin-bottom: 40px; }
        .grid { display: grid; grid-template-columns: ${siteConfig.layout === 'grid' ? 'repeat(auto-fit, minmax(280px, 1fr))' : '1fr'}; gap: 20px; }
        .card { background: #1e293b; padding: 24px; border-radius: 16px; display: flex; align-items: center; gap: 15px; border: 1px solid #334155; transition: transform 0.2s; }
        .card:hover { transform: translateY(-4px); border-color: ${siteConfig.primaryColor}; }
        .icon { font-size: 2rem; }
        .info { flex: 1; text-align: left; }
        .info h3 { margin: 0; font-size: 1.1rem; color: #f1f5f9; }
        .info p { margin: 5px 0 0; font-size: 0.8rem; color: #94a3b8; text-transform: capitalize; }
        a { color: ${siteConfig.primaryColor}; text-decoration: none; font-weight: bold; padding: 8px 16px; border-radius: 8px; background: rgba(255,255,255,0.05); }
        a:hover { background: rgba(255,255,255,0.1); }
    </style>
</head>
<body>
    <div class="container">
        <h1>${siteConfig.title}</h1>
        <p class="desc">${siteConfig.description}</p>
        <div class="grid">
            ${dataHtml || '<p style="grid-column: 1/-1; opacity: 0.5;">Aucun document trouvé pour cette sélection.</p>'}
        </div>
    </div>
</body>
</html>`;
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();
      zip.file("index.html", generateSiteCode());
      zip.file("config.json", JSON.stringify({ siteConfig, user, sheetUrl, filters }, null, 2));
      
      const content = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = "mon_site_polaris.zip";
      link.click();
    } catch (e) {
      alert("Erreur lors de la génération du ZIP.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Control Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex border-b border-slate-800">
              <button 
                onClick={() => setActiveTab('style')}
                className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'style' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Palette className="w-4 h-4" /> Style
              </button>
              <button 
                onClick={() => setActiveTab('data')}
                className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'data' ? 'bg-slate-800 text-purple-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Database className="w-4 h-4" /> Données
              </button>
            </div>

            <div className="p-6 space-y-6">
              {activeTab === 'style' ? (
                <>
                  <section>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-3">
                      <LayoutIcon className="w-3 h-3" /> Mise en page
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['centered', 'grid', 'split'] as const).map(l => (
                        <button 
                          key={l}
                          onClick={() => setSiteConfig(prev => ({ ...prev, layout: l }))}
                          className={`p-3 rounded-xl border text-[10px] uppercase font-bold transition-all ${siteConfig.layout === l ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-slate-800 bg-slate-950 text-slate-600'}`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-3">
                      <Type className="w-3 h-3" /> Typographie
                    </label>
                    <div className="space-y-2">
                      {(['Space Grotesk', 'Inter', 'Outfit', 'Fira Code'] as const).map(f => (
                        <button 
                          key={f}
                          onClick={() => setSiteConfig(prev => ({ ...prev, font: f }))}
                          style={{ fontFamily: f }}
                          className={`w-full text-left px-4 py-2 rounded-lg border text-sm transition-all ${siteConfig.font === f ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-slate-800 bg-slate-950 text-slate-400'}`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-3">
                      <Settings2 className="w-3 h-3" /> Couleur & Thème
                    </label>
                    <div className="flex gap-4 items-center">
                      <input 
                        type="color" 
                        value={siteConfig.primaryColor}
                        onChange={(e) => setSiteConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="w-12 h-12 bg-transparent cursor-pointer rounded-full overflow-hidden border-2 border-slate-700"
                      />
                      <div className="flex-1 grid grid-cols-4 gap-2">
                        {['#06b6d4', '#8b5cf6', '#10b981', '#f43f5e'].map(c => (
                          <button 
                            key={c}
                            onClick={() => setSiteConfig(prev => ({ ...prev, primaryColor: c }))}
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </section>
                </>
              ) : (
                <>
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                      <Table className="w-3 h-3" /> Mappage Google Sheets
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs p-2 bg-slate-900 rounded-lg">
                        <span className="text-slate-400">Colonne A</span>
                        <span className="text-cyan-400 font-mono">Nom / Titre</span>
                      </div>
                      <div className="flex items-center justify-between text-xs p-2 bg-slate-900 rounded-lg">
                        <span className="text-slate-400">Colonne B</span>
                        <span className="text-cyan-400 font-mono">URL Fichier</span>
                      </div>
                      <div className="flex items-center justify-between text-xs p-2 bg-slate-900 rounded-lg">
                        <span className="text-slate-400">Colonne C</span>
                        <span className="text-cyan-400 font-mono">Classe</span>
                      </div>
                      <div className="flex items-center justify-between text-xs p-2 bg-slate-900 rounded-lg">
                        <span className="text-slate-400">Colonne D</span>
                        <span className="text-cyan-400 font-mono">Matière</span>
                      </div>
                    </div>
                  </div>

                  {!isInputtingUrl && !isConnected && (
                    <button 
                      onClick={() => setIsInputtingUrl(true)}
                      className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold bg-white text-black hover:bg-slate-200 transition-all"
                    >
                      <Database className="w-5 h-5" />
                      Lier mon Google Sheets
                    </button>
                  )}

                  {isInputtingUrl && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                      <div className="relative">
                        <Globe className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                        <input 
                          type="text" 
                          placeholder="Coller l'URL du tableau..."
                          value={sheetUrl}
                          onChange={(e) => setSheetUrl(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-cyan-500 outline-none transition-all"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={handleConnect}
                          disabled={isLoadingData}
                          className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                        >
                          {isLoadingData ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Connecter'}
                        </button>
                        <button 
                          onClick={() => setIsInputtingUrl(false)}
                          className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {isConnected && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex flex-col gap-3 animate-in zoom-in-95">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                          <CheckCircle className="w-4 h-4" /> Synchronisé
                        </div>
                        <button 
                          onClick={() => { setIsConnected(false); setIsInputtingUrl(true); }}
                          className="text-[10px] text-slate-500 hover:text-white uppercase font-bold tracking-widest"
                        >
                          Modifier
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate bg-slate-950/50 p-2 rounded-lg font-mono">
                        {fetchedData.length} documents importés
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <button 
            disabled={isExporting || !isConnected}
            onClick={handleExport}
            className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold py-5 rounded-3xl flex flex-col items-center justify-center gap-1 shadow-2xl transition-all disabled:opacity-50"
          >
            <div className="flex items-center gap-2">
              {isExporting ? <Loader2 className="animate-spin w-5 h-5" /> : <Download className="w-5 h-5" />}
              <span>{isExporting ? 'Génération en cours...' : 'Générer mon site'}</span>
            </div>
            <span className="text-[10px] opacity-70 font-normal">Exportation en format .zip</span>
          </button>
        </div>

        {/* Right Preview Panel */}
        <div className="lg:col-span-8">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Prévisualisation en temps réel</span>
              </div>
            </div>

            <div className="flex-1 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden flex flex-col">
              <div className="p-8 overflow-y-auto max-h-[700px]" style={{ fontFamily: siteConfig.font, textAlign: siteConfig.layout === 'centered' ? 'center' : 'left' }}>
                <header className="mb-8">
                  <h1 className="text-5xl font-bold mb-4" style={{ color: siteConfig.primaryColor }}>{siteConfig.title || 'Mon Titre'}</h1>
                  <p className="text-slate-400 text-xl max-w-2xl mx-auto">{siteConfig.description || 'Ma description personnalisée.'}</p>
                </header>

                {/* Filtres Interactifs de la Prévisualisation */}
                {isConnected && (
                  <div className="mb-10 flex flex-wrap gap-4 justify-center">
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block text-center">Classes</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setFilters(f => ({ ...f, classe: '' }))}
                          className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${!filters.classe ? 'bg-cyan-500 border-cyan-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                        >
                          TOUTES
                        </button>
                        {uniqueClasses.map(c => (
                          <button 
                            key={c}
                            onClick={() => setFilters(f => ({ ...f, classe: c || '' }))}
                            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all uppercase ${filters.classe === c ? 'bg-cyan-500 border-cyan-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block text-center">Matières</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setFilters(f => ({ ...f, matiere: '' }))}
                          className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${!filters.matiere ? 'bg-purple-500 border-purple-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                        >
                          TOUTES
                        </button>
                        {uniqueMatieres.map(m => (
                          <button 
                            key={m}
                            onClick={() => setFilters(f => ({ ...f, matiere: m || '' }))}
                            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all uppercase ${filters.matiere === m ? 'bg-purple-500 border-purple-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className={`grid gap-4 ${siteConfig.layout === 'grid' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {filteredData.map((row, i) => (
                    <div key={i} className="bg-slate-900/80 border border-white/5 rounded-2xl p-5 flex items-center gap-4 group hover:border-cyan-500/50 transition-all text-left">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl">
                        {row.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">{row.fileName}</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{row.classe} • {row.matiere}</span>
                        </div>
                      </div>
                      <ExternalLink className="w-5 h-5 text-slate-600 group-hover:text-white" />
                    </div>
                  ))}
                  {isConnected && filteredData.length === 0 && (
                    <div className="col-span-full py-20 text-center opacity-30 italic">
                      Aucun document ne correspond à vos filtres.
                    </div>
                  )}
                </div>
                
                {!isConnected && (
                  <div className="mt-8 p-12 border-2 border-dashed border-white/5 rounded-3xl text-center text-slate-600">
                    <div className="relative inline-block mb-4">
                      <Table className="w-16 h-16 mx-auto opacity-20" />
                      <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-cyan-500 animate-pulse" />
                    </div>
                    <p className="text-lg mb-2">Prêt pour l'initialisation Polaris ?</p>
                    <p className="text-sm max-w-sm mx-auto">Liez votre Google Sheets pour voir vos documents s'afficher avec style sur votre futur site.</p>
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
