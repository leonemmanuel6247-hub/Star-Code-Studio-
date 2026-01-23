
export interface SiteConfig {
  title: string;
  description: string;
  theme: 'neon' | 'glass' | 'minimal' | 'cyber';
  primaryColor: string;
  font: 'Inter' | 'Space Grotesk' | 'Outfit' | 'Fira Code';
  layout: 'centered' | 'grid' | 'split';
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
}

export interface SheetRow {
  icon: string;
  link: string;
  fileName: string;
  date: string;
}

export type Page = 'landing' | 'signup' | 'customization';
