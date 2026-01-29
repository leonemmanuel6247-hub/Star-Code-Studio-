
import React, { useState, useEffect } from 'react';
import { Landing } from './pages/Landing';
import { Signup } from './pages/Signup';
import { Customization } from './pages/Customization';
import { PolarisAssistant } from './components/PolarisAssistant';
import { GalaxyBackground } from './components/GalaxyBackground';
import { Page, SiteConfig, UserData } from './types';

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzsrXMlQelnu1hBgn-DPoplUJJx2rFi46Ru3PQ5iB_nVh_oUWHfKVO3KyTbnkVw3sxg/exec";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isCheckingIP, setIsCheckingIP] = useState(true);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    projectName: '',
    title: 'SuccessPolaris Universe',
    description: 'La plateforme ultime pour réussir mes examens.',
    testimonials: [
      { author: 'Amadou K.', text: 'Grâce à ce site, j\'ai eu mon BAC avec mention !' },
      { author: 'Sarah L.', text: 'Les ressources sont claires et bien organisées.' }
    ],
    theme: 'golden',
    primaryColor: '#FFD700',
    animationSpeed: 0.5,
    particleDensity: 80,
    backgroundStyle: 'constellation',
    template: 'standard',
    deploymentType: 'premium',
    registrationUrl: '',
    resourcesUrl: ''
  });
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    checkPersistence();
  }, []);

  const checkPersistence = async () => {
    try {
      const ipRes = await fetch('https://api.ipify.org?format=json');
      const { ip } = await ipRes.json();
      const res = await fetch(`${APPS_SCRIPT_URL}?ip=${ip}&action=check`);
      const data = await res.json();
      
      if (data.found) {
        setUser({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          country: data.country || 'Togo',
          ip: ip,
          birthDate: { day: 1, month: 1, year: 2000 },
          userAgent: navigator.userAgent
        });
        setSiteConfig(prev => ({ ...prev, projectName: data.projectName || 'Projet_Existant' }));
        setCurrentPage('customization');
      }
    } catch (e) {
      console.error("Persistance check failed");
    } finally {
      setIsCheckingIP(false);
    }
  };

  useEffect(() => {
    const themeColors = {
      neon: '#06b6d4',
      golden: '#FFD700',
      cosmic: '#A855F7',
      forest: '#10B981'
    };
    setSiteConfig(prev => ({ ...prev, primaryColor: themeColors[siteConfig.theme] }));
  }, [siteConfig.theme]);

  if (isCheckingIP) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-yellow-500 font-black tracking-widest text-[10px] uppercase">Synchronisation Polaris...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'landing': return <Landing 
          siteConfig={siteConfig} 
          setSiteConfig={setSiteConfig} 
          onNavigate={() => setCurrentPage('signup')} 
        />;
      case 'signup': return <Signup 
          onSuccess={(userData) => { 
            setUser(userData); 
            setCurrentPage('customization'); 
          }} 
          onBack={() => setCurrentPage('landing')}
        />;
      case 'customization': return <Customization 
          siteConfig={siteConfig} 
          setSiteConfig={setSiteConfig} 
          user={user}
        />;
      default: return <Landing siteConfig={siteConfig} setSiteConfig={setSiteConfig} onNavigate={() => setCurrentPage('signup')} />;
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-1000 font-['Inter'] ${
      siteConfig.theme === 'golden' ? 'bg-black' : 
      siteConfig.theme === 'cosmic' ? 'bg-[#0B0118]' : 
      siteConfig.theme === 'forest' ? 'bg-[#061A14]' : 'bg-[#020617]'
    }`}>
      <GalaxyBackground 
        theme={siteConfig.theme} 
        speed={siteConfig.animationSpeed} 
        density={siteConfig.particleDensity} 
        style={siteConfig.backgroundStyle}
      />
      <main className="relative z-10">{renderPage()}</main>
      <PolarisAssistant />
    </div>
  );
};

export default App;
