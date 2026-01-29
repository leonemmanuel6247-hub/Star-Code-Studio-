
import React from 'react';
import { SiteConfig } from '../types';
import { 
  ArrowRight, Palette, Sparkles, Plus, X, Monitor, 
  Zap, Waves, Star, Layers, Box
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
      <div className="text-center mb-12">
        <h1 className="text-7xl font-heading font-black text-white mb-4 tracking-tighter">
          POLARIS <span style={{ color: siteConfig.primaryColor }}>STUDIO</span>
        </h1>
        <p className="text-slate-500 text-lg font-medium">Bâtissez votre empire éducatif sur mesure.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CONFIGURATION */}
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
            <div className="flex items-center gap-3 mb-6 text-white/80">
              <Box className="w-5 h-5 text-cyan-400" />
              <h2 className="text-sm font-black uppercase tracking-widest">Identité du Projet</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="Nom unique du projet (ex: MathsSup_2025)"
                value={siteConfig.projectName}
                onChange={(e) => setSiteConfig({...siteConfig, projectName: e.target.value})}
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-5 text-white focus:border-cyan-500 outline-none transition-all placeholder:text-slate-700 font-bold"
              />
              <input 
                type="text" 
                placeholder="Titre affiché sur le site"
                value={siteConfig.title}
                onChange={(e) => setSiteConfig({...siteConfig, title: e.target.value})}
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-5 text-white focus:border-cyan-500 outline-none transition-all placeholder:text-slate-700"
              />
            </div>
            <textarea 
              placeholder="Description du site..."
              value={siteConfig.description}
              onChange={(e) => setSiteConfig({...siteConfig, description: e.target.value})}
              className="w-full mt-4 bg-black/40 border border-white/5 rounded-2xl px-6 py-5 text-white focus:border-cyan-500 outline-none h-24 resize-none placeholder:text-slate-700"
            />
          </section>

          <section className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3 text-white/80">
                <Plus className="w-5 h-5 text-cyan-400" />
                <h2 className="text-sm font-black uppercase tracking-widest">Témoignages</h2>
              </div>
              <button onClick={addTestimonial} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-white transition-all uppercase">Ajouter</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {siteConfig.testimonials.map((t, i) => (
                <div key={i} className="bg-black/40 p-5 rounded-2xl border border-white/5 group relative">
                  <input 
                    type="text" placeholder="Auteur" value={t.author}
                    onChange={(e) => updateTestimonial(i, 'author', e.target.value)}
                    className="w-full bg-transparent border-b border-white/5 text-white text-sm mb-2 outline-none focus:border-cyan-500 font-bold"
                  />
                  <input 
                    type="text" placeholder="Citation..." value={t.text}
                    onChange={(e) => updateTestimonial(i, 'text', e.target.value)}
                    className="w-full bg-transparent text-slate-500 text-xs outline-none"
                  />
                  <button onClick={() => removeTestimonial(i)} className="absolute top-2 right-2 text-red-500/30 hover:text-red-500"><X className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* STUDIO LATÉRAL */}
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
                  <span className="flex items-center gap-1"><Zap className="w-3 h-3"/> Vitesse Constellation</span>
                  <span className="text-white">{siteConfig.animationSpeed}x</span>
                </div>
                <input type="range" min="0.1" max="2" step="0.1" value={siteConfig.animationSpeed} onChange={(e) => setSiteConfig({...siteConfig, animationSpeed: parseFloat(e.target.value)})} className="w-full accent-cyan-500" />
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
