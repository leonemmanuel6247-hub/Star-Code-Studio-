
import React, { useState } from 'react';
import { UserData } from '../types';
import { ChevronLeft, AlertCircle, UserPlus, Sparkles, Loader2, ShieldCheck, Globe, Zap } from 'lucide-react';

interface Props {
  onSuccess: (data: UserData) => void;
  onBack: () => void;
}

export const Signup: React.FC<Props> = ({ onSuccess, onBack }) => {
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    day: '',
    month: '',
    year: '',
    email: '',
    classe: 'Terminale',
    country: 'Togo'
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const africanCountries = [
    "Maroc", "Algérie", "Tunisie", "Sénégal", "Côte d'Ivoire", "Cameroun", "Bénin", "Burkina Faso", 
    "Burundi", "Cabo Verde", "Comores", "Congo (Brazzaville)", "Congo (Kinshasa)", "Djibouti", 
    "Égypte", "Érythrée", "Eswatini", "Éthiopie", "Gabon", "Gambie", "Ghana", "Guinée", 
    "Guinée-Bissau", "Guinée équatoriale", "Kenya", "Lesotho", "Libéria", "Libye", "Madagascar", 
    "Malawi", "Mali", "Maurice", "Mauritanie", "Mozambique", "Namibie", "Niger", "Nigéria", 
    "Ouganda", "Rwanda", "Sao Tomé-et-Principe", "Seychelles", "Sierra Leone", "Somalie", 
    "Soudan", "Soudan du Sud", "Afrique du Sud", "Tanzanie", "Tchad", "Togo", "Zambie", "Zimbabwe"
  ].sort();

  const otherCountries = [
    "France", "Belgique", "Suisse", "Canada", "États-Unis", "Royaume-Uni", "Allemagne", "Espagne", "Italie"
  ].sort();

  const classes = ["Seconde", "Première", "Terminale", "Université", "Prépa", "Autre"];

  const getPublicIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (e) {
      return 'IP Non Détectée';
    }
  };

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return "L'adresse email n'est pas valide.";

    const d = parseInt(formData.day);
    const m = parseInt(formData.month);
    const y = parseInt(formData.year);

    if (isNaN(d) || isNaN(m) || isNaN(y)) return "La date est incomplète.";
    
    const dateObj = new Date(y, m - 1, d);
    if (dateObj.getFullYear() !== y || dateObj.getMonth() !== m - 1 || dateObj.getDate() !== d) {
      return "Date invalide.";
    }

    const today = new Date();
    let age = today.getFullYear() - y;
    const monthDiff = today.getMonth() - (m - 1);
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < d)) {
      age--;
    }

    if (age < 12) return "Accès refusé : Le protocole SuccessPolaris requiert un âge minimum de 12 ans.";

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Détection de l'IP une seule fois
      const userIP = await getPublicIP();
      const fullName = `${formData.firstName} ${formData.lastName}`;
      const timestamp = new Date().toLocaleString('fr-FR');

      // 2. Préparation du payload UNIFIÉ pour éviter les doublons de lignes
      // L'ordre des clés ici devrait correspondre à l'ordre souhaité dans tes colonnes Google Sheets
      const UNIFIED_DB_URL = "https://script.google.com/macros/s/AKfycbzsrXMlQelnu1hBgn-DPoplUJJx2rFi46Ru3PQ5iB_nVh_oUWHfKVO3KyTbnkVw3sxg/exec";
      
      const payload = {
        // Colonnes A, B, C, D (Identité)
        nom: fullName,
        email: formData.email,
        classe: `${formData.classe} (${formData.country})`,
        ip: userIP,
        
        // Colonnes E, F, G (Données techniques en continuité)
        dateInscription: timestamp,
        navigateur: navigator.userAgent,
        source: 'Star Code Studio Builder'
      };

      // 3. Envoi unique
      await fetch(UNIFIED_DB_URL, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // 4. Succès local
      onSuccess({
        lastName: formData.lastName,
        firstName: formData.firstName,
        birthDate: { day: parseInt(formData.day), month: parseInt(formData.month), year: parseInt(formData.year) },
        email: formData.email,
        country: formData.country
      });

    } catch (e) {
      setError("Erreur de synchronisation. La constellation est temporairement hors de portée.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-16 px-6 animate-in fade-in duration-700">
      <button 
        onClick={onBack} 
        disabled={isSubmitting} 
        className="flex items-center gap-2 text-slate-500 hover:text-white mb-10 transition-all font-bold text-[10px] uppercase tracking-[0.3em] group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
        Retour à l'accueil
      </button>

      <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px] group-hover:bg-cyan-500/10 transition-colors duration-1000"></div>
        
        <header className="mb-10 text-center relative z-10">
          <div className="inline-flex p-4 bg-cyan-500/10 rounded-3xl mb-6 ring-1 ring-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            <Zap className="text-cyan-400 w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-4xl font-heading font-black text-white tracking-tighter">Star Code <span className="text-cyan-400">ID</span></h2>
          <p className="text-slate-500 mt-3 text-[9px] font-black uppercase tracking-[0.3em] opacity-60">Synchronisation stellaire unifiée</p>
        </header>
        
        <form id="signup-form" onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">Prénom</label>
              <input required id="firstName" type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:border-cyan-500/50 outline-none transition-all placeholder:text-slate-800" placeholder="Prénom" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">Nom</label>
              <input required id="lastName" type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:border-cyan-500/50 outline-none transition-all placeholder:text-slate-800" placeholder="Nom" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">Classe</label>
              <select value={formData.classe} onChange={e => setFormData({...formData, classe: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-4 text-white outline-none focus:border-cyan-500/50 cursor-pointer appearance-none transition-all">
                {classes.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">Pays</label>
              <select value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-4 text-white outline-none focus:border-cyan-500/50 cursor-pointer appearance-none transition-all">
                <optgroup label="Afrique" className="bg-slate-900 text-cyan-400">
                  {africanCountries.map(c => <option key={c} value={c} className="bg-slate-900 text-white">{c}</option>)}
                </optgroup>
                <optgroup label="International" className="bg-slate-900 text-slate-500">
                  {otherCountries.map(c => <option key={c} value={c} className="bg-slate-900 text-white">{c}</option>)}
                </optgroup>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">Date de Naissance</label>
            <div className="grid grid-cols-3 gap-3">
              <input required type="number" placeholder="JJ" min="1" max="31" value={formData.day} onChange={e => setFormData({...formData, day: e.target.value})} className="bg-slate-950/50 border border-white/5 rounded-2xl px-4 py-4 text-center text-white focus:border-cyan-500/50 outline-none" />
              <input required type="number" placeholder="MM" min="1" max="12" value={formData.month} onChange={e => setFormData({...formData, month: e.target.value})} className="bg-slate-950/50 border border-white/5 rounded-2xl px-4 py-4 text-center text-white focus:border-cyan-500/50 outline-none" />
              <input required type="number" placeholder="AAAA" min="1950" max="2024" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="bg-slate-950/50 border border-white/5 rounded-2xl px-4 py-4 text-center text-white focus:border-cyan-500/50 outline-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">Email</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:border-cyan-500/50 outline-none transition-all placeholder:text-slate-800" placeholder="votre@email.com" />
          </div>

          {error && (
            <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-[2rem] flex items-start gap-4 text-red-400 text-xs leading-relaxed animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full relative group overflow-hidden bg-white text-black font-black py-6 rounded-[2rem] flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin text-cyan-600" />
                  <span className="text-sm tracking-widest uppercase">Liaison en cours...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-6 h-6 text-cyan-600" />
                  <span className="text-sm tracking-widest uppercase">Bâtir mon Profil</span>
                  <Sparkles className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                </>
              )}
            </button>
            <p className="text-center text-[8px] text-slate-600 mt-6 uppercase tracking-[0.4em] font-black flex items-center justify-center gap-2">
              <Globe className="w-3 h-3" /> Données sécurisées sur une ligne unique
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
