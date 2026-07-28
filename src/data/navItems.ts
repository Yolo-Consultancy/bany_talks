// src/data/navItems.ts

export type NavItem = {
  label: string;
  value: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Accueil', value: 'home' },
  { label: 'À Propos', value: 'about' },
  { label: 'Btx', value: 'episodes' },
  { label: 'Blog', value: 'blog' },
  { label: 'Contact', value: 'contact' },
];
