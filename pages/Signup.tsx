
import React, { useState } from 'react';
import { UserData } from '../types';
import { ChevronLeft, AlertCircle } from 'lucide-react';

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
    country: 'France'
  });
  const [error, setError] = useState<string | null>(null);

  const countries = ["France", "Belgique", "Suisse", "Canada", "Maroc", "Algérie", "Tunisie", "Sénégal", "Côte d'Ivoire"];

  const validate = () => {
    // 1. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "L'adresse email n'est pas valide.";
    }

    // 2. Date validation (Feb 31 etc)
    const d = parseInt(formData.day);
    const m = parseInt(formData.month);
    const y = parseInt(formData.year);

    if (isNaN(d) || isNaN(m) || isNaN(y)) return "La date est incomplète.";
    
    const dateObj = new Date(y, m - 1, d);
    if (dateObj.getFullYear() !== y || dateObj.getMonth() !== m - 1 || dateObj.getDate() !== d) {
      return "Cette date n'existe pas (ex: pas de 31 février).";
    }

    // 3. Age validation (12 years min)
    const today = new Date();
    let age = today.getFullYear() - y;
    const monthDiff = today.getMonth() - (m - 1);
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < d)) {
      age--;
    }

    if (age < 12) {
      return "Accès refusé : tu dois avoir au moins 12 ans pour utiliser Polaris.";
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    
    onSuccess({
      lastName: formData.lastName,
      firstName: formData.firstName,
      birthDate: { day: parseInt(formData.day), month: parseInt(formData.month), year: parseInt(formData.year) },
      email: formData.email,
      country: formData.country
    });
  };

  return (
    <div className="max-w-md mx-auto py-20 px-4">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
        <ChevronLeft className="w-5 h-5" /> Retour
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <h2 className="text-3xl font-heading font-bold mb-6">Inscription</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Prénom</label>
              <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 focus:ring-1 focus:ring-cyan-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Nom</label>
              <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 focus:ring-1 focus:ring-cyan-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Date de Naissance</label>
            <div className="grid grid-cols-3 gap-2">
              <input required type="number" placeholder="Jour" min="1" max="31" value={formData.day} onChange={e => setFormData({...formData, day: e.target.value})} className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-2 text-center" />
              <input required type="number" placeholder="Mois" min="1" max="12" value={formData.month} onChange={e => setFormData({...formData, month: e.target.value})} className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-2 text-center" />
              <input required type="number" placeholder="Année" min="1950" max="2024" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-2 text-center" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">E-mail</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 focus:ring-1 focus:ring-cyan-500 outline-none" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Pays</label>
            <select value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 outline-none">
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl transition-all mt-4">
            Valider et Continuer
          </button>
        </form>
      </div>
    </div>
  );
};
