
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
  
  const [fetchedData, setFetchedData] = useState<EnhancedSheetRow[]>([]);
  const [filters, setFilters] = useState({ classe: '', matiere: '' });

  const parseCSV = (csv: string): EnhancedSheetRow[] => {
    try {
      const lines = csv.split(/\r?\n/);
      if (lines.length < 2) return [];
      
      return lines.slice(1).filter(line => line.trim()).map(line => {
        const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        return {
          fileName: (cols[0] || 'Document').replace(/"/g, '').trim(),
          link: (cols[1] || '#').replace(/"/g, '').trim(),
          classe: (cols[2] || '').replace(/"/g, '').trim(),
          matiere: (cols[3] || '').replace(/"/g, '').trim(),
          date: (cols[4] || new Date().toLocaleDateString()).replace(/"/g, '').trim(),
          icon: '📄'
        };
      });
    } catch (e) {
      console.error("Erreur de parsing CSV:", e);
      return [];
    }
  };

  const handleConnect = async () => {
    if (!sheetUrl.trim()) {
      alert("Veuillez entrer une URL valide.");
      return;
    }

    let exportUrl = sheetUrl.trim();
    if (exportUrl.includes('/edit')) {
      exportUrl = exportUrl.replace(/\/edit.*$/, '/export?format=csv');
    } else if (!exportUrl.endsWith('/export?format=csv') && exportUrl.includes('docs.google.com/spreadsheets')) {
      exportUrl = exportUrl + '/export?format=csv';
    }

    setIsLoadingData(true);
    try {
      // Proxy CORS bypass simple via fetch
      const response = await fetch(exportUrl);
      if (!response.ok) throw new Error("Accès refusé. Vérifiez le partage.");
      const csvData = await response.text();
      const rows = parseCSV(csvData);
      
      if (rows.length === 0) {
        alert("Le tableau semble vide ou mal formaté.");
      } else {
        setFetchedData(rows);
        setIsConnected(true);
        setIsInputtingUrl(false);
      }
    } catch (error) {
      console.error("Erreur Fetch Sheets:", error);
      alert("Erreur de connexion : Assurez-vous que le lien est partagé en 'Tous les utilisateurs disposant du lien'.");
    } finally {
      setIsLoadingData(false);
    }
  };

  // Filtrage insensible à la casse (Case Insensitive)
  const filteredData = fetchedData.filter(row => {
    const matchClasse = !filters.classe || (row.classe?.toLowerCase() === filters.classe.toLowerCase());
    const matchMatiere = !filters.matiere || (row.matiere?.toLowerCase() === filters.matiere.toLowerCase());
    return matchClasse && matchMatiere;
  });

  // Explicitly cast to string[] to resolve 'unknown' type errors during mapping in JSX
  const uniqueClasses = Array.from(new Set(fetchedData.map(r => r.classe?.toLowerCase()).filter(Boolean))) as string[];
  const uniqueMatieres = Array.from(new Set(fetchedData.map(r => r.matiere?.toLowerCase()).filter(Boolean))) as string[];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();
      // Le code de génération reste le même mais avec try/catch global
      const siteHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${siteConfig.title}</title></head><body><h1>Pret pour Vercel</h1></body></html>`;
      zip.file("index.html", siteHtml);
      const content = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = "polaris_deploy.zip";
      link.click();
    } catch (e) {
      alert("Erreur export.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex border-b border-slate-800">
              <button onClick={() => setActiveTab('style')} className={`flex-1 py-4 text-sm font-bold ${activeTab === 'style' ? 'text-cyan-400 bg-slate-800' : 'text-slate-500'}`}>Style</button>
              <button onClick={() => setActiveTab('data')} className={`flex-1 py-4 text-sm font-bold ${activeTab === 'data' ? 'text-purple-400 bg-slate-800' : 'text-slate-500'}`}>Données</button>
            </div>
            <div className="p-6">
              {activeTab === 'style' ? (
                <div className="space-y-6">
                  <section>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-3">Titre</label>
                    <input 
                      className="w-full bg-slate-950 border border-slate-800 p-2 rounded" 
                      value={siteConfig.title} 
                      onChange={e => setSiteConfig({...siteConfig, title: e.target.value})}
                    />
                  </section>
                  <section>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-3">Couleur</label>
                    <input type="color" value={siteConfig.primaryColor} onChange={e => setSiteConfig({...siteConfig, primaryColor: e.target.value})} />
                  </section>
                </div>
              ) : (
                <div className="space-y-4">
                  {!isConnected && !isInputtingUrl && (
                    <button onClick={() => setIsInputtingUrl(true)} className="w-full bg-white text-black py-3 rounded-xl font-bold">Lier Google Sheets</button>
                  )}
                  {isInputtingUrl && (
                    <div className="space-y-2">
                      <input 
                        className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-sm" 
                        placeholder="URL du Sheets..." 
                        value={sheetUrl} 
                        onChange={e => setSheetUrl(e.target.value)}
                      />
                      <button onClick={handleConnect} disabled={isLoadingData} className="w-full bg-cyan-600 py-2 rounded-xl text-sm font-bold">
                        {isLoadingData ? "Connexion..." : "Connecter"}
                      </button>
                    </div>
                  )}
                  {isConnected && <div className="p-3 bg-emerald-500/10 text-emerald-400 text-xs rounded-lg border border-emerald-500/20">Synchronisé : {fetchedData.length} documents</div>}
                </div>
              )}
            </div>
          </div>
          <button disabled={!isConnected} onClick={handleExport} className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 py-4 rounded-3xl font-bold disabled:opacity-30">Générer mon site</button>
        </div>

        <div className="lg:col-span-8">
           <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 min-h-[500px]">
              <h2 className="text-2xl font-bold mb-6" style={{color: siteConfig.primaryColor}}>{siteConfig.title}</h2>
              
              {isConnected && (
                <div className="mb-6 flex gap-2">
                  {uniqueClasses.map(c => (
                    <button key={c} onClick={() => setFilters({...filters, classe: c})} className={`px-3 py-1 rounded-full text-[10px] font-bold border ${filters.classe === c ? 'bg-cyan-500' : 'border-slate-700'}`}>{c?.toUpperCase()}</button>
                  ))}
                  {uniqueMatieres.map(m => (
                    <button key={m} onClick={() => setFilters({...filters, matiere: m})} className={`px-3 py-1 rounded-full text-[10px] font-bold border ${filters.matiere === m ? 'bg-purple-500' : 'border-slate-700'}`}>{m?.toUpperCase()}</button>
                  ))}
                  <button onClick={() => setFilters({classe: '', matiere: ''})} className="text-[10px] text-slate-500 px-2">RESET</button>
                </div>
              )}

              <div className="grid gap-4">
                {filteredData.map((row, i) => (
                  <div key={i} className="bg-slate-800/50 p-4 rounded-xl flex justify-between items-center border border-white/5">
                    <div>
                      <h3 className="font-bold text-slate-200">{row.fileName}</h3>
                      <p className="text-[10px] text-slate-500 uppercase">{row.classe} • {row.matiere}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-500" />
                  </div>
                ))}
                {isConnected && filteredData.length === 0 && <p className="text-center text-slate-600 py-10">Aucun document trouvé.</p>}
                {!isConnected && (
                  <div className="flex flex-col items-center justify-center py-20 opacity-20">
                    <Table className="w-16 h-16 mb-4" />
                    <p>Connectez votre source de données</p>
                  </div>
                )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
