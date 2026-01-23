
import React from 'react';
import { Page } from '../types';
import { Rocket, Sparkles, Shield, ArrowRight, Star, Code2 } from 'lucide-react';

interface Props {
  onNavigate: (page: Page) => void;
}

export const Landing: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16 space-y-8 animate-in fade-in slide-in-from-top-10 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
          <Code2 className="w-4 h-4" />
          <span>Propulsé par Star Code Studio</span>
        </div>
        
        <h1 className="text-6xl sm:text-9xl font-heading font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500 leading-none">
          Star Code <br/><span className="text-cyan-400">Studio</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-xl text-slate-400 font-light leading-relaxed">
          Le moteur de clonage ultime pour SuccessPolaris. <br/>
          Inscris-toi pour accéder à l'atelier de création et bâtir ton propre empire digital.
        </p>

        <div className="flex justify-center pt-8">
          <button 
            onClick={() => onNavigate('signup')}
            className="group relative px-12 py-6 bg-white text-black font-black rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <span className="relative flex items-center gap-3 text-lg">
              COMMENCER L'AVENTURE
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 opacity-50">
        {[
          { icon: <Shield className="text-emerald-400" />, title: "Accès Privé", desc: "Inscription obligatoire pour sécuriser ton futur clone." },
          { icon: <Star className="text-yellow-400" />, title: "ADN Polaris", desc: "Réplique exacte du design system SuccessPolaris." },
          { icon: <Rocket className="text-purple-400" />, title: "Déploiement Flash", desc: "Ton code source prêt en moins de 30 secondes." }
        ].map((f, i) => (
          <div key={i} className="p-8 rounded-3xl bg-slate-900/20 border border-slate-800/50">
            <div className="mb-4">{f.icon}</div>
            <h3 className="text-lg font-heading font-bold mb-2 text-slate-100">{f.title}</h3>
            <p className="text-slate-500 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
