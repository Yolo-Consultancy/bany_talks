// src/data/navItems.ts

export type NavItem = {
  label: string;
  value: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Accueil', value: 'home' },
  { label: 'À Propos', value: 'about' },
  { label: 'Émissions', value: 'episodes' },
  { label: 'Hub Audience', value: 'hub' },
  { label: 'Livres', value: 'books' },
]
