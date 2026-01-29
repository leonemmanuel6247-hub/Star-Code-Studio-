
import React, { useState, useEffect } from 'react';
import { Landing } from './pages/Landing';
import { Signup } from './pages/Signup';
import { Customization } from './pages/Customization';
import { PolarisAssistant } from './components/PolarisAssistant';
import { GalaxyBackground } from './components/GalaxyBackground';
import { Page, SiteConfig, UserData } from './types';

export const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyYUhNhsmqtOkSHP0SX9lqmw33lPv_ZZxd_W1Myw5TqIdH1CSROY34xFQ6tCwNko89KUg/exec";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isChecking, setIsChecking] = useState(true);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    projectName: '',
    title: 'SuccessPolaris Studio',
    description: 'Bâtissez votre espace de ressources éducatives en quelques clics.',
    testimonials: [
      { author: 'Léon Emmanuel', text: 'Un outil simple pour partager mes cours.' },
      { author: 'Polaris Brain', text: 'Le succès est au bout du clic.' }
    ],
    theme: 'golden',
    primaryColor: '#FFD700',
    fontFamily: 'Outfit',
    textColor: '#FFFFFF',
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
    checkExistingUser();
  }, []);

  const checkExistingUser = async () => {
    try {
      const ipRes = await fetch('https://api.ipify.org?format=json');
      const { ip } = await ipRes.json();
      
      const res = await fetch(`${APPS_SCRIPT_URL}?action=check&ip=${ip}`);
      const data = await res.json();
      
      if (data.found) {
        setUser({
          firstName: data.firstName,
          lastName: data.lastName || '',
          email: data.email,
          country: data.country || 'Togo',
          ip: ip,
          birthDate: { day: 1, month: 1, year: 2000 },
          userAgent: navigator.userAgent
        });
        setCurrentPage('customization');
      }
    } catch (e) {
      console.log("Nouvel utilisateur détecté.");
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.3em]">Synchronisation Polaris...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'landing': 
        return <Landing 
          siteConfig={siteConfig} 
          setSiteConfig={setSiteConfig} 
          onNavigate={() => setCurrentPage('signup')} 
        />;
      case 'signup': 
        return <Signup 
          siteConfig={siteConfig}
          onSuccess={(userData) => { 
            setUser(userData); 
            setCurrentPage('customization'); 
          }} 
          onBack={() => setCurrentPage('landing')} 
        />;
      case 'customization': 
        return <Customization 
          siteConfig={siteConfig} 
          setSiteConfig={setSiteConfig} 
          user={user} 
        />;
      default: 
        return <Landing siteConfig={siteConfig} setSiteConfig={setSiteConfig} onNavigate={() => setCurrentPage('signup')} />;
    }
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden bg-black transition-all duration-700" 
      style={{ 
        fontFamily: siteConfig.fontFamily,
        color: siteConfig.textColor 
      }}
    >
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
