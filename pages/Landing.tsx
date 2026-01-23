
import React from 'react';
import { SiteConfig, Page } from '../types';
import { Rocket, Layout, Shield, ArrowRight, Star } from 'lucide-react';

interface Props {
  siteConfig: SiteConfig;
  setSiteConfig: React.Dispatch<React.SetStateAction<SiteConfig>>;
  onNavigate: (page: Page) => void;
}

export const Landing: React.FC<Props> = ({ siteConfig, setSiteConfig, onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16 space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
          <Rocket className="w-4 h-4" />
          <span>Propulsé par Polaris AI</span>
        </div>
        
        <h1 className="text-5xl sm:text-7xl font-heading font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500">
          Ton Site Vitrine en <span className="text-cyan-400">Quelques Secondes</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-xl text-slate-400">
          L'outil no-code futuriste de SuccessPolaris. Connecte ton Google Sheets, choisis ton style, et décolle vers le succès.
        </p>

        {/* Dynamic Preview Form */}
        <div className="max-w-xl mx-auto p-8 rounded-3xl bg-slate-900/50 backdrop-blur-md border border-slate-800 shadow-2xl text-left space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Titre de ton site</label>
            <input 
              type="text" 
              value={siteConfig.title}
              onChange={(e) => setSiteConfig(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Mon Portfolio d'Élève"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <textarea 
              rows={3}
              value={siteConfig.description}
              onChange={(e) => setSiteConfig(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décris ton univers..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
            />
          </div>
          <button 
            onClick={() => onNavigate('signup')}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            S'inscrire et Bâtir <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {[
          { icon: <Layout className="text-cyan-400" />, title: "No-Code Total", desc: "Pas une seule ligne de code. Utilise tes outils quotidiens comme Google Sheets." },
          { icon: <Shield className="text-purple-400" />, title: "Sécurité Polaris", desc: "Tes données restent chez toi sur ton Google Drive personnel." },
          { icon: <Rocket className="text-emerald-400" />, title: "Vitesse Lumière", desc: "Génération instantanée et exportation en format ZIP prêt à héberger." }
        ].map((f, i) => (
          <div key={i} className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/30 transition-all group">
            <div className="mb-4 p-3 w-fit rounded-lg bg-slate-800 group-hover:bg-slate-700 transition-colors">
              {f.icon}
            </div>
            <h3 className="text-xl font-heading font-bold mb-2">{f.title}</h3>
            <p className="text-slate-400">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="py-12 border-t border-slate-800">
        <h2 className="text-3xl font-heading font-bold text-center mb-12">Ils ont rejoint la constellation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "Thomas", role: "Élève Terminale", comment: "C'est incroyable, j'ai fait mon site de révision en 10 minutes avec mes fichiers Drive !" },
            { name: "Léa", role: "Étudiante Design", comment: "Le style futuriste colle parfaitement à mes projets. Simple et efficace." },
            { name: "Sarah", role: "Passionnée Tech", comment: "L'assistant Polaris Brain m'a aidé à structurer ma page d'accueil. Un vrai plus." }
          ].map((t, i) => (
            <div key={i} className="p-6 rounded-xl bg-slate-800/30 border border-slate-700 flex flex-col gap-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-500 text-yellow-500" />)}
              </div>
              <p className="italic text-slate-300">"{t.comment}"</p>
              <div>
                <p className="font-bold text-cyan-400">{t.name}</p>
                <p className="text-xs text-slate-500 uppercase tracking-widest">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
