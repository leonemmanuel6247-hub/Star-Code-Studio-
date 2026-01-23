
import React from 'react';
import { Page } from '../types';
import { Rocket, Sparkles, Shield, ArrowRight, Star, Code2, Database, Globe, Cpu } from 'lucide-react';

interface Props {
  onNavigate: (page: Page) => void;
}

export const Landing: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-24 space-y-8 animate-in fade-in slide-in-from-top-10 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
          <Code2 className="w-4 h-4" />
          <span>Propulsé par Star Code Studio</span>
        </div>
        
        <h1 className="text-6xl sm:text-9xl font-heading font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-600 leading-[0.9]">
          Star Code <br/><span className="text-cyan-400">Studio</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-xl text-slate-400 font-light leading-relaxed">
          L'architecte no-code pour cloner l'univers SuccessPolaris. <br/>
          Bâtis ta propre bibliothèque de ressources en quelques secondes.
        </p>

        <div className="flex justify-center pt-8">
          <button 
            onClick={() => onNavigate('signup')}
            className="group relative px-12 py-6 bg-white text-black font-black rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <span className="relative flex items-center gap-3 text-lg tracking-tight">
              COMMENCER L'AVENTURE
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </div>

      {/* Manifeste / But du site */}
      <section className="mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-heading font-black text-white leading-tight">
              Pourquoi créer ton propre <br/>
              <span className="text-cyan-400">Empire Digital ?</span>
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1 p-2 bg-cyan-500/10 rounded-lg h-fit"><Shield className="w-5 h-5 text-cyan-400" /></div>
                <div>
                  <h4 className="text-white font-bold mb-1">Indépendance Totale</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">Ne sois plus un simple visiteur. Deviens le propriétaire de ta plateforme de révision, personnalisée selon tes besoins.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 p-2 bg-purple-500/10 rounded-lg h-fit"><Cpu className="w-5 h-5 text-purple-400" /></div>
                <div>
                  <h4 className="text-white font-bold mb-1">Automatisation Cloud</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">Mets à jour ton site simplement en modifiant un Google Sheets. Star Code Studio s'occupe de la synchronisation.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[3rem] backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all"></div>
            <h3 className="text-cyan-400 font-black text-xs uppercase tracking-[0.3em] mb-6">Le But Ultime</h3>
            <p className="text-slate-300 text-lg leading-relaxed italic">
              "Notre mission est de démocratiser la création web pour les élèves de la constellation SuccessPolaris. Nous transformons tes données brutes en une expérience utilisateur premium, digne des plus grands sites de tech."
            </p>
            <div className="mt-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500"></div>
              <div>
                <div className="text-white font-bold text-sm">Polaris Brain</div>
                <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Intelligence Artificielle de Succès</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Protocol / How it works */}
      <section className="mb-32 space-y-16">
        <div className="text-center">
          <h2 className="text-3xl font-heading font-black text-white uppercase tracking-[0.2em]">Protocole de Création</h2>
          <div className="h-1 w-20 bg-cyan-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              step: "01", 
              icon: <UserPlus className="w-8 h-8 text-cyan-400" />, 
              title: "Identification", 
              desc: "Inscris-toi sur la plateforme pour sécuriser ton accès au moteur de clonage." 
            },
            { 
              step: "02", 
              icon: <Database className="w-8 h-8 text-purple-400" />, 
              title: "Liaison Data", 
              desc: "Connecte ton Google Sheets. C'est le cerveau qui alimentera ta bibliothèque." 
            },
            { 
              step: "03", 
              icon: <Globe className="w-8 h-8 text-emerald-400" />, 
              title: "Déploiement", 
              desc: "Récupère ton code source prêt à l'emploi et brille sur le web mondial." 
            }
          ].map((item, i) => (
            <div key={i} className="relative p-10 rounded-[2.5rem] bg-slate-900/20 border border-slate-800/50 group hover:border-cyan-500/30 transition-all">
              <span className="absolute top-6 right-10 text-5xl font-black text-white/5 group-hover:text-cyan-500/10 transition-colors">{item.step}</span>
              <div className="mb-6">{item.icon}</div>
              <h3 className="text-xl font-heading font-bold mb-3 text-slate-100">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid (Footer-ish) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 opacity-40 hover:opacity-100 transition-opacity duration-700">
        {[
          { icon: <Shield className="text-emerald-400 w-5 h-5" />, title: "Accès Privé", desc: "Inscription obligatoire." },
          { icon: <Star className="text-yellow-400 w-5 h-5" />, title: "ADN Polaris", desc: "Design System Premium." },
          { icon: <Rocket className="text-purple-400 w-5 h-5" />, title: "Export ZIP", desc: "Code source complet." }
        ].map((f, i) => (
          <div key={i} className="flex items-center gap-4 p-6 rounded-2xl bg-slate-900/10 border border-slate-800/30">
            {f.icon}
            <div>
              <h3 className="text-xs font-heading font-black uppercase text-slate-100">{f.title}</h3>
              <p className="text-slate-600 text-[10px] uppercase font-bold tracking-widest">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Import manquant pour les icônes de la liste
import { UserPlus } from 'lucide-react';
