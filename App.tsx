
import React, { useState } from 'react';
import { Landing } from './pages/Landing';
import { Signup } from './pages/Signup';
import { Customization } from './pages/Customization';
import { PolarisAssistant } from './components/PolarisAssistant';
import { Page, SiteConfig, UserData } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    title: 'Mon Super Projet',
    description: 'Une description captivante pour mon site vitrine futuriste.',
    theme: 'neon',
    primaryColor: '#06b6d4',
    font: 'Space Grotesk',
    layout: 'centered'
  });
  const [user, setUser] = useState<UserData | null>(null);

  const navigateTo = (page: Page) => setCurrentPage(page);

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <Landing 
          siteConfig={siteConfig} 
          setSiteConfig={setSiteConfig} 
          onNavigate={navigateTo} 
        />;
      case 'signup':
        return <Signup 
          onSuccess={(userData) => {
            setUser(userData);
            navigateTo('customization');
          }} 
          onBack={() => navigateTo('landing')}
        />;
      case 'customization':
        return <Customization 
          siteConfig={siteConfig} 
          setSiteConfig={setSiteConfig} 
          user={user}
        />;
      default:
        return <Landing 
          siteConfig={siteConfig} 
          setSiteConfig={setSiteConfig} 
          onNavigate={navigateTo} 
        />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#020617]">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[120px]"></div>
      </div>

      <main className="relative z-10">
        {renderPage()}
      </main>

      <PolarisAssistant />
    </div>
  );
};

export default App;
