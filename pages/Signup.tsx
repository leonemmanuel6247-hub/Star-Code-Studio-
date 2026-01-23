
import React, { useState } from 'react';
import { UserData } from '../types';
import { ChevronLeft, AlertCircle, UserPlus, Sparkles, Loader2 } from 'lucide-react';

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
    country: 'Maroc'
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

  const countries = [...africanCountries, ...otherCountries];
  const classes = ["Seconde", "Première", "Terminale", "Université", "Prépa", "Autre"];

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
    if (age < 12) return "Vous devez avoir au moins 12 ans.";

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
      const payload = {
        nom: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        classe: `${formData.classe} (${formData.country})`
      };

      const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzsrXMlQelnu1hBgn-DPoplUJJx2rFi46Ru3PQ5iB_nVh_oUWHfKVO3KyTbnkVw3sxg/exec";

      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      onSuccess({
        lastName: formData.lastName,
        firstName: formData.firstName,
        birthDate: { day: parseInt(formData.day), month: parseInt(formData.month), year: parseInt(formData.year) },
        email: formData.email,
        country: formData.country
      });

    } catch (e) {
      setError("Erreur de connexion avec la base de données SuccessPolaris.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-16 px-6">
      <button onClick={onBack} disabled={isSubmitting} className="flex items-center gap-2 text-slate-500 hover:text-white mb-10 transition-all font-bold text-xs uppercase tracking-widest group">
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
        Retour
      </button>

      <div className="bg-slate-900/60 backdrop-blur-3xl border border-slate-800 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl"></div>
        
        <header className="mb-10 text-center">
          <div className="inline-flex p-3 bg-cyan-500/10 rounded-2xl mb-4">
            <UserPlus className="text-cyan-400 w-6 h-6" />
          </div>
          <h2 className="text-4xl font-heading font-bold text-white">Création du Profil</h2>
          <p className="text-slate-500 mt-2 text-sm">Rejoignez la constellation Star Code Studio.</p>
        </header>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Prénom</label>
              <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-cyan-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Nom</label>
              <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-cyan-500 outline-none transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Classe</label>
              <select value={formData.classe} onChange={e => setFormData({...formData, classe: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-cyan-500 appearance-none cursor-pointer">
                {classes.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Pays d'origine</label>
              <select value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-cyan-500 appearance-none cursor-pointer">
                <optgroup label="Afrique (Priorité Polaris)" className="bg-slate-900 text-cyan-400">
                  {africanCountries.map(c => <option key={c} value={c} className="bg-slate-900 text-white">{c}</option>)}
                </optgroup>
                <optgroup label="Reste du monde" className="bg-slate-900 text-slate-500">
                  {otherCountries.map(c => <option key={c} value={c} className="bg-slate-900 text-white">{c}</option>)}
                </optgroup>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Date de Naissance</label>
            <div className="grid grid-cols-3 gap-3">
              <input required type="number" placeholder="JJ" min="1" max="31" value={formData.day} onChange={e => setFormData({...formData, day: e.target.value})} className="bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-4 text-center text-white focus:border-cyan-500 outline-none" />
              <input required type="number" placeholder="MM" min="1" max="12" value={formData.month} onChange={e => setFormData({...formData, month: e.target.value})} className="bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-4 text-center text-white focus:border-cyan-500 outline-none" />
              <input required type="number" placeholder="AAAA" min="1950" max="2024" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-4 text-center text-white focus:border-cyan-500 outline-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Email</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-cyan-500 outline-none transition-all" />
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" disabled={isSubmitting} className="w-full bg-white text-black font-bold py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all shadow-xl active:scale-95 disabled:opacity-50">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {isSubmitting ? "Synchronisation..." : "Valider l'Inscription"}
          </button>
        </form>
      </div>
    </div>
  );
};
