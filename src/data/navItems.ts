// src/data/navItems.ts

export type NavItem = {
  label: string;
  value: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Accueil', value: 'home' },
  { label: 'À Propos', value: 'about' },
  { label: 'BTX', value: 'episodes' },
  { label: 'Blog', value: 'blog' },
  { label: 'Contact', value: 'contact' },
];

/** Classe CSS : scale + soulignement animé (voir index.css) */
export const NAV_ITEM_HOVER_CLASS = 'nav-link';

export const NAV_ITEM_MOBILE_HOVER_CLASS = 'nav-link-mobile';
