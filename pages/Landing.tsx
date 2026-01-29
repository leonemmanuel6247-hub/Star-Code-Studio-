
import React from 'react';
import { SiteConfig } from '../types';
import { 
  ArrowRight, Palette, Star, Crown, Layout, ShieldCheck, Rocket
} from 'lucide-react';

interface Props {
  siteConfig: SiteConfig;
  setSiteConfig: React.Dispatch<React.SetStateAction<SiteConfig>>;
  onNavigate: () => void;
}

export const Landing: React.FC<Props> = ({ siteConfig, setSiteConfig, onNavigate }) => {
  const themes: { id: SiteConfig['theme']; name: string; color: string }[] = [
    { id: 'golden', name: 'Golden Galaxy', color: '#FFD700' },
    { id: 'neon', name: 'Neon City', color: '#06b6d4' },
    { id: 'cosmic', name: 'Cosmic Nebula', color: '#A855F7' },
    { id: 'forest', name: 'Emerald Forest', color: '#10B981' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-in fade-in duration-1000 pb-32">
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-500 text-[10px] font-black uppercase tracking-widest mb-4">
           <Star className="w-3 h-3 fill-yellow-500" /> SuccessPolaris Builder v3.0
        </div>
        <h1 className="text-7xl sm:text-8xl font-black text-white mb-4 tracking-tighter leading-none">
          POLARIS <span style={{ color: siteConfig.primaryColor }} className="drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]">STUDIO</span>
        </h1>
        <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">Générez votre portail éducatif en quelques secondes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          
          <section className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5"><Rocket className="w-32 h-32" /></div>
            <div className="flex items-center gap-3 mb-10 text-white/80">
              <ShieldCheck className="w-5 h-5 text-yellow-500" />
              <h2 className="text-sm font-black uppercase tracking-widest">Configuration de votre Espace</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-5 tracking-[0.2em]">Identifiant Projet</label>
                <input 
                  type="text" 
                  placeholder="EX: CLASSE_TERMINALE"
                  value={siteConfig.projectName}
                  onChange={(e) => setSiteConfig({...siteConfig, projectName: e.target.value.toUpperCase()})}
                  className="w-full bg-black/60 border border-white/10 rounded-3xl px-8 py-6 text-white focus:border-yellow-500 outline-none font-bold placeholder:text-slate-800"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-5 tracking-[0.2em]">Titre Public</label>
                <input 
                  type="text" 
                  placeholder="Ex: Mes Cours de Physique"
                  value={siteConfig.title}
                  onChange={(e) => setSiteConfig({...siteConfig, title: e.target.value})}
                  className="w-full bg-black/60 border border-white/10 rounded-3xl px-8 py-6 text-white focus:border-yellow-500 outline-none font-bold placeholder:text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-5 tracking-[0.2em]">Brève Description</label>
              <textarea 
                placeholder="Décrivez votre portail en une phrase..."
                value={siteConfig.description}
                onChange={(e) => setSiteConfig({...siteConfig, description: e.target.value})}
                className="w-full bg-black/60 border border-white/10 rounded-3xl px-8 py-6 text-white focus:border-yellow-500 outline-none min-h-[120px] resize-none placeholder:text-slate-800"
              />
            </div>
          </section>

          <section className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 p-10 rounded-[3.5rem] shadow-2xl">
            <div className="flex items-center gap-3 mb-8 text-white/80">
              <Layout className="w-5 h-5 text-cyan-400" />
              <h2 className="text-sm font-black uppercase tracking-widest">Choix du Modèle</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button 
                onClick={() => setSiteConfig({...siteConfig, template: 'standard'})}
                className={`p-10 rounded-[2.5rem] border transition-all text-left group relative overflow-hidden ${siteConfig.template === 'standard' ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/5 bg-black/20 opacity-40 hover:opacity-100'}`}
              >
                <h4 className="text-2xl font-black mb-1">LISTE CLASSIQUE</h4>
                <div className="text-[9px] font-bold uppercase text-cyan-500 tracking-widest mb-4">Efficacité Maximale</div>
                <div className="w-12 h-1 bg-white/10 mb-4"></div>
                <p className="text-[10px] text-slate-500 leading-relaxed uppercase">Idéal pour une navigation rapide entre les documents PDF.</p>
              </button>

              <button 
                onClick={() => setSiteConfig({...siteConfig, template: 'locked'})}
                className={`p-10 rounded-[2.5rem] border transition-all text-left group relative overflow-hidden ${siteConfig.template === 'locked' ? 'border-purple-500 bg-purple-500/10' : 'border-white/5 bg-black/20 opacity-40 hover:opacity-100'}`}
              >
                <h4 className="text-2xl font-black mb-1">GRILLE MODERNE</h4>
                <div className="text-[9px] font-bold uppercase text-purple-500 tracking-widest mb-4">Immersion Visuelle</div>
                <div className="w-12 h-1 bg-white/10 mb-4"></div>
                <p className="text-[10px] text-slate-500 leading-relaxed uppercase">Affichage en cartes avec icônes dynamiques.</p>
              </button>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <section className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 p-10 rounded-[3.5rem] shadow-2xl sticky top-8">
            <div className="flex items-center gap-3 mb-10 text-white/80">
              <Palette className="w-5 h-5" />
              <h2 className="text-sm font-black uppercase tracking-widest">Esthétique</h2>
            </div>

            <div className="space-y-8">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-4 block">Thème Galactique</label>
                <div className="grid grid-cols-2 gap-3">
                  {themes.map(t => (
                    <button 
                      key={t.id}
                      onClick={() => setSiteConfig({...siteConfig, theme: t.id, primaryColor: t.color})}
                      className={`p-4 rounded-2xl border transition-all text-center flex flex-col items-center gap-2 ${siteConfig.theme === t.id ? 'bg-white/10 border-white/20' : 'bg-transparent border-white/5 opacity-40 hover:opacity-100'}`}
                    >
                      <div className="w-6 h-6 rounded-full shadow-lg" style={{ backgroundColor: t.color }}></div>
                      <span className="text-[8px] font-black uppercase text-white tracking-widest">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black text-slate-500">
                  <span className="uppercase tracking-widest">Vitesse Animation</span>
                  <span className="text-white font-black">{siteConfig.animationSpeed}x</span>
                </div>
                <input 
                  type="range" min="0.1" max="2" step="0.1" 
                  value={siteConfig.animationSpeed} 
                  onChange={(e) => setSiteConfig({...siteConfig, animationSpeed: parseFloat(e.target.value)})} 
                  className="w-full accent-yellow-500 bg-white/5 h-1 rounded-full appearance-none cursor-pointer" 
                />
              </div>
            </div>

            <button 
              onClick={onNavigate}
              disabled={!siteConfig.projectName || !siteConfig.title}
              className="w-full mt-12 py-8 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter flex items-center justify-center gap-3 transition-all hover:scale-[1.03] active:scale-95 disabled:opacity-20 shadow-[0_20px_40px_rgba(255,215,0,0.2)]"
              style={{ backgroundColor: siteConfig.primaryColor, color: siteConfig.theme === 'golden' ? '#000' : '#fff' }}
            >
              DÉMARRER <ArrowRight className="w-6 h-6" />
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};
