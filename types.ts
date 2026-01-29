
export interface SiteConfig {
  projectName: string;
  title: string;
  description: string;
  testimonials: { author: string; text: string }[];
  theme: 'neon' | 'golden' | 'cosmic' | 'forest' | 'indigo' | 'yellow' | 'white' | 'grey' | 'cherry' | 'red';
  primaryColor: string;
  fontFamily: 'Outfit' | 'Space Grotesk' | 'Inter' | 'Fira Code' | 'Playfair Display';
  textColor: string;
  animationSpeed: number;
  particleDensity: number;
  backgroundStyle: 'constellation' | 'stars_only' | 'static';
  template: 'standard' | 'locked'; 
  deploymentType: 'free' | 'premium';
  registrationUrl: string; 
  resourcesUrl: string;    
  premiumSheetId?: string;
  projectToken?: string;
}

export interface UserData {
  lastName: string;
  firstName: string;
  birthDate: {
    day: number;
    month: number;
    year: number;
  };
  email: string;
  country: string;
  ip: string;
  userAgent: string;
}

export type Page = 'landing' | 'signup' | 'customization';
