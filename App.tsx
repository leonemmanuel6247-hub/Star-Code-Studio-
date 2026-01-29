
import React, { useState, useEffect } from 'react';
import { Landing } from './pages/Landing';
import { Signup } from './pages/Signup';
import { Customization } from './pages/Customization';
import { PolarisAssistant } from './components/PolarisAssistant';
import { GalaxyBackground } from './components/GalaxyBackground';
import { Page, SiteConfig, UserData } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
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
    deploymentType: 'free',
    registrationUrl: '',
    resourcesUrl: ''
  });
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const themeColors = {
      neon: '#06b6d4',
      golden: '#FFD700',
      cosmic: '#A855F7',
      forest: '#10B981'
    };
    setSiteConfig(prev => ({ ...prev, primaryColor: themeColors[siteConfig.theme] }));
  }, [siteConfig.theme]);

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
