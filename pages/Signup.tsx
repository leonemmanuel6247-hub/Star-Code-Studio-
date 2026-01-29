
import React, { useState, useEffect } from 'react';
import { UserData } from '../types';
import { ChevronLeft, ShieldCheck, Loader2, Zap, CheckCircle2 } from 'lucide-react';

interface Props {
  onSuccess: (data: UserData) => void;
  onBack: () => void;
}

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzsrXMlQelnu1hBgn-DPoplUJJx2rFi46Ru3PQ5iB_nVh_oUWHfKVO3KyTbnkVw3sxg/exec";

const BLACK_COUNTRIES = [
  "Togo", "Bénin", "Côte d'Ivoire", "Sénégal", "Cameroun", "Gabon", "Mali", 
  "Burkina Faso", "Guinée", "Congo (Brazzaville)", "Congo (RDC)", "Ghana", 
  "Nigéria", "Niger", "Tchad", "Centrafrique", "Mauritanie", "Rwanda", 
  "Burundi", "Haïti", "Guadeloupe", "Martinique", "Guyane", "Angola", "Soudan", "Éthiopie", "Kenya"
];

export const Signup: React.FC<Props> = ({ onSuccess, onBack }) => {
  const [formData, setFormData] = useState({
    lastName: '', firstName: '', day: '01', month: '01', year: '2010', email: '', country: 'Togo'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userIP, setUserIP] = useState<string>('');

  useEffect(() => {
    fetch('https://api.ipify.org?format=json').then(res => res.json()).then(data => {
      setUserIP(data.ip);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // On passe directement à Customization, l'inscription effective se fera dans initializeProject
    setTimeout(() => {
      onSuccess({
        ...formData,
        birthDate: { day: parseInt(formData.day), month: parseInt(formData.month), year: parseInt(formData.year) },
        ip: userIP,
        userAgent: navigator.userAgent
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="max-w-xl mx-auto py-16 px-6">
      <button onClick={onBack} className="text-slate-500 hover:text-white mb-8 flex items-center gap-2 uppercase font-black text-[10px] tracking-widest">
        <ChevronLeft className="w-4 h-4" /> Retour Studio
      </button>

      <div className="bg-slate-950/80 border border-white/5 rounded-[3.5rem] p-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20"><Zap className="text-yellow-400 w-10 h-10" /></div>
        
        <header className="mb-10 text-center">
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2">Inscription <span className="text-yellow-400">SaaS</span></h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Lien définitif avec votre adresse IP</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <input required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} placeholder="Prénom" className="bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white focus:border-yellow-500 outline-none" />
            <input required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} placeholder="Nom" className="bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white focus:border-yellow-500 outline-none" />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-slate-500 ml-1">Pays de résidence</label>
            <select value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white outline-none">
                {BLACK_COUNTRIES.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
            </select>
          </div>

          <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Email de gestion" className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white focus:border-yellow-500 outline-none" />

          <button disabled={isSubmitting} className="w-full bg-yellow-500 text-black font-black py-6 rounded-3xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all disabled:opacity-50">
            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShieldCheck className="w-6 h-6" />}
            CRÉER MON ACCÈS PERSISTANT
          </button>
        </form>
      </div>
    </div>
  );
};
