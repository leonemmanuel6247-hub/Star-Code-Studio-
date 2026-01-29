
import React, { useState, useEffect } from 'react';
import { UserData, SiteConfig } from '../types';
import { ChevronLeft, ShieldCheck, Loader2, Crown } from 'lucide-react';
import { APPS_SCRIPT_URL } from '../App';

interface Props {
  siteConfig: SiteConfig;
  onSuccess: (data: UserData) => void;
  onBack: () => void;
}

export const Signup: React.FC<Props> = ({ siteConfig, onSuccess, onBack }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    country: 'Togo'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ip, setIp] = useState('');

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setIp(data.ip));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        body: JSON.stringify({
          action: 'register',
          email: formData.email,
          firstName: formData.firstName,
          projectName: siteConfig.projectName,
          ip: ip,
          config: {
            theme: siteConfig.theme,
            country: formData.country
          }
        })
      });

      // Simulation de délai pour laisser GAS travailler
      setTimeout(() => {
        onSuccess({
          firstName: formData.firstName,
          lastName: '',
          email: formData.email,
          country: formData.country,
          ip: ip,
          birthDate: { day: 1, month: 1, year: 2000 },
          userAgent: navigator.userAgent
        });
        setIsSubmitting(false);
      }, 2000);
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-24 px-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <button onClick={onBack} className="text-slate-500 hover:text-white mb-10 flex items-center gap-2 uppercase font-black text-[10px] tracking-widest transition-colors">
        <ChevronLeft className="w-4 h-4" /> Retour Studio
      </button>

      <div className="bg-slate-900/60 border border-yellow-500/20 rounded-[4rem] p-12 backdrop-blur-3xl shadow-[0_0_50px_rgba(255,215,0,0.05)] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 text-yellow-500"><Crown className="w-24 h-24" /></div>
        
        <header className="mb-12">
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2 uppercase italic">Accès <span className="text-yellow-500">Cloud</span></h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Déploiement sur l'architecture Polaris</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-600 ml-5 tracking-widest">Identité de l'auteur</label>
            <input 
              required 
              value={formData.firstName} 
              onChange={e => setFormData({...formData, firstName: e.target.value})} 
              placeholder="Ex: Léon Emmanuel" 
              className="w-full bg-black/40 border border-white/10 rounded-3xl px-8 py-6 text-white focus:border-yellow-500 outline-none transition-all" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-600 ml-5 tracking-widest">Email de gestion</label>
            <input 
              required 
              type="email" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              placeholder="votre@email.com" 
              className="w-full bg-black/40 border border-white/10 rounded-3xl px-8 py-6 text-white focus:border-yellow-500 outline-none transition-all" 
            />
          </div>

          <button 
            disabled={isSubmitting}
            className="w-full bg-yellow-500 text-black font-black py-8 rounded-[2.5rem] flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_40px_rgba(255,215,0,0.2)] group mt-10"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <ShieldCheck className="w-6 h-6" />}
            <span className="tracking-tighter uppercase">CRÉER MON EMPIRE</span>
          </button>
        </form>
      </div>
    </div>
  );
};
