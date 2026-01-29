
import React from 'react';
import { SiteConfig } from '../types';
import { 
  ArrowRight, Palette, Sparkles, Plus, X, Monitor, 
  Zap, Waves, Star, Layers, Box, Crown, Layout
} from 'lucide-react';

interface Props {
  siteConfig: SiteConfig;
  setSiteConfig: React.Dispatch<React.SetStateAction<SiteConfig>>;
  onNavigate: () => void;
}

export const Landing: React.FC<Props> = ({ siteConfig, setSiteConfig, onNavigate }) => {
  const addTestimonial = () => {
    setSiteConfig({
      ...siteConfig,
      testimonials: [...siteConfig.testimonials, { author: '', text: '' }]
    });
  };

  const updateTestimonial = (index: number, field: 'author' | 'text', value: string) => {
    const newTestimonials = [...siteConfig.testimonials];
    newTestimonials[index][field] = value;
    setSiteConfig({ ...siteConfig, testimonials: newTestimonials });
  };

  const removeTestimonial = (index: number) => {
    setSiteConfig({
      ...siteConfig,
      testimonials: siteConfig.testimonials.filter((_, i) => i !== index)
    });
  };

  const themes: { id: SiteConfig['theme']; name: string; color: string }[] = [
    { id: 'golden', name: 'Golden Galaxy', color: '#FFD700' },
    { id: 'neon', name: 'Neon City', color: '#06b6d4' },
    { id: 'cosmic', name: 'Cosmic Nebula', color: '#A855F7' },
    { id: 'forest', name: 'Emerald Forest', color: '#10B981' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-in fade-in duration-1000 pb-32">
      <div className="text-center mb-16">
        <h1 className="text-7xl font-heading font-black text-white mb-4 tracking-tighter">
          POLARIS <span style={{ color: siteConfig.primaryColor }}>STUDIO</span>
        </h1>
        <p className="text-slate-500 text-lg font-medium">Configurez votre environnement de succès.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* SECTION GAUCHE : IDENTITÉ & OPTION */}
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
            <div className="flex items-center gap-3 mb-6 text-white/80">
              <Box className="w-5 h-5 text-cyan-400" />
              <h2 className="text-sm font-black uppercase tracking-widest">Type de Service</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <button 
                onClick={() => setSiteConfig({...siteConfig, deploymentType: 'free'})}
                className={`p-6 rounded-3xl border transition-all flex flex-col items-center gap-3 ${siteConfig.deploymentType === 'free' ? 'border-white bg-white/10 text-white' : 'border-white/5 text-slate-500'}`}
              >
                <Monitor className="w-6 h-6" />
                <div className="text-center">
                  <div className="text-xs font-black uppercase">Option Free</div>
                  <div className="text-[9px] opacity-50">Lien Google Sheet Externe</div>
                </div>
              </button>
              <button 
                onClick={() => setSiteConfig({...siteConfig, deploymentType: 'premium'})}
                className={`p-6 rounded-3xl border transition-all flex flex-col items-center gap-3 ${siteConfig.deploymentType === 'premium' ? 'border-yellow-500 bg-yellow-500/10 text-white' : 'border-white/5 text-slate-500'}`}
              >
                <Crown className="w-6 h-6 text-yellow-500" />
                <div className="text-center">
                  <div className="text-xs font-black uppercase">Option Premium</div>
                  <div className="text-[9px] opacity-50 text-yellow-500/50">Gestion Cloud Polaris (Centralisée)</div>
                </div>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="Identifiant du Projet (Nom Unique)"
                value={siteConfig.projectName}
                onChange={(e) => setSiteConfig({...siteConfig, projectName: e.target.value})}
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-5 text-white focus:border-cyan-500 outline-none font-bold placeholder:text-slate-700"
              />
              <input 
                type="text" 
                placeholder="Titre de la plateforme"
                value={siteConfig.title}
                onChange={(e) => setSiteConfig({...siteConfig, title: e.target.value})}
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-5 text-white focus:border-cyan-500 outline-none"
              />
            </div>
          </section>

          <section className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
            <div className="flex items-center gap-3 mb-6 text-white/80">
              <Layout className="w-5 h-5 text-cyan-400" />
              <h2 className="text-sm font-black uppercase tracking-widest">Modèle de Site</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setSiteConfig({...siteConfig, template: 'standard'})}
                className={`p-6 rounded-3xl border transition-all text-center ${siteConfig.template === 'standard' ? 'border-cyan-500 bg-cyan-500/10 text-white' : 'border-white/5 text-slate-500'}`}
              >
                <div className="text-xs font-black uppercase mb-1">Modèle A</div>
                <div className="text-[9px] opacity-50">Accès Direct aux Cours</div>
              </button>
              <button 
                onClick={() => setSiteConfig({...siteConfig, template: 'locked'})}
                className={`p-6 rounded-3xl border transition-all text-center ${siteConfig.template === 'locked' ? 'border-red-500 bg-red-500/10 text-white' : 'border-white/5 text-slate-500'}`}
              >
                <div className="text-xs font-black uppercase mb-1">Modèle B</div>
                <div className="text-[9px] opacity-50">Inscription Obligatoire (Gatekeeper)</div>
              </button>
            </div>
          </section>
        </div>

        {/* STUDIO LATÉRAL DESIGN */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl sticky top-8">
            <div className="flex items-center gap-3 mb-8 text-white/80">
              <Palette className="w-5 h-5" />
              <h2 className="text-sm font-black uppercase tracking-widest">Design Studio</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-3 block">Thèmes Galactiques</label>
                <div className="grid grid-cols-2 gap-2">
                  {themes.map(t => (
                    <button 
                      key={t.id}
                      onClick={() => setSiteConfig({...siteConfig, theme: t.id})}
                      className={`p-3 rounded-xl border transition-all text-center ${siteConfig.theme === t.id ? 'bg-white/10 border-white/20' : 'bg-transparent border-white/5 opacity-40'}`}
                    >
                      <div className="w-4 h-4 rounded-full mx-auto mb-1" style={{ backgroundColor: t.color }}></div>
                      <span className="text-[8px] font-black uppercase text-white">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500">
                  <span className="flex items-center gap-1"><Zap className="w-3 h-3"/> Vitesse</span>
                  <span className="text-white">{siteConfig.animationSpeed}x</span>
                </div>
                <input type="range" min="0.1" max="2" step="0.1" value={siteConfig.animationSpeed} onChange={(e) => setSiteConfig({...siteConfig, animationSpeed: parseFloat(e.target.value)})} className="w-full accent-yellow-500" />
              </div>

              <div>
                 <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-3 block">Rendu du Fond</label>
                 <div className="flex gap-2">
                   {[
                     { id: 'constellation', icon: Waves },
                     { id: 'stars_only', icon: Sparkles },
                     { id: 'static', icon: Layers }
                   ].map(s => (
                     <button key={s.id} onClick={() => setSiteConfig({...siteConfig, backgroundStyle: s.id as any})}
                       className={`flex-1 p-3 rounded-xl border flex justify-center transition-all ${siteConfig.backgroundStyle === s.id ? 'bg-white text-black' : 'border-white/5 text-slate-500'}`}
                     ><s.icon className="w-4 h-4" /></button>
                   ))}
                 </div>
              </div>
            </div>

            <button 
              onClick={onNavigate}
              disabled={!siteConfig.projectName}
              className="w-full mt-10 py-6 rounded-[2rem] font-black text-lg tracking-tight uppercase flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-2xl disabled:opacity-20"
              style={{ backgroundColor: siteConfig.primaryColor, color: siteConfig.theme === 'golden' ? 'black' : 'white' }}
            >
              Étape Suivante <ArrowRight className="w-5 h-5" />
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};
