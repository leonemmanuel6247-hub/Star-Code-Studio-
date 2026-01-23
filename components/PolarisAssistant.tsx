
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { MessageSquare, X, Send, Sparkles, Loader2 } from 'lucide-react';

export const PolarisAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    { role: 'assistant', text: "Salutations ! Je suis Polaris Brain, ton architecte de succès. Comment puis-je t'aider à bâtir ton futur aujourd'hui ?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          { role: 'user', parts: [{ text: userMsg }] }
        ],
        config: {
          systemInstruction: "Tu es Polaris Brain, l'assistant intelligent du site SuccessPolaris. Ton but est d'aider les élèves avec leurs cours. Ton style est Futuriste, poli, extrêmement motivant et inspirant. Tu dois suggérer de consulter les fichiers PDF du site SuccessPolaris pour approfondir les sujets. Réponds toujours en français.",
          temperature: 0.8,
        }
      });

      const aiText = response.text || "Je rencontre une perturbation dans la matrice. Réessayons.";
      setMessages(prev => [...prev, { role: 'assistant', text: aiText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', text: "Désolé, ma connexion avec la constellation SuccessPolaris a été interrompue." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 sm:w-96 h-[500px] bg-slate-900/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="p-4 bg-gradient-to-r from-cyan-600 to-purple-600 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-200" />
              <span className="font-heading font-bold text-white">Polaris Brain</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-sm ${
                  m.role === 'user' 
                    ? 'bg-cyan-600 text-white rounded-tr-none' 
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-3 rounded-xl rounded-tl-none border border-slate-700">
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-800 flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Pose une question à Polaris..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-br from-cyan-500 to-purple-600 p-4 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center text-white"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};
