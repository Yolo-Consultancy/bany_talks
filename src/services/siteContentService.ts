const API_BASE = import.meta.env.VITE_API_URL || '';

export type SiteStatistic = {
  label: string;
  value: string;
};

export type TimelineMilestone = {
  year: string;
  month?: number | null;
  title: string;
  desc: string;
};

export type SiteContent = {
  id?: string;
  key?: string;
  statistics: SiteStatistic[];
  timeline?: TimelineMilestone[];
};

const MONTH_LABELS = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

export function formatMilestoneDate(year: string, month?: number | null): string {
  if (month && month >= 1 && month <= 12) {
    return `${MONTH_LABELS[month - 1]} ${year}`;
  }
  return year;
}

export async function fetchSiteContent(): Promise<SiteContent> {
  const res = await fetch(`${API_BASE}/api/site-content`);
  if (!res.ok) {
    throw new Error('Impossible de charger le contenu site');
  }
  return (await res.json()) as SiteContent;
}

export async function fetchSiteStatistics(): Promise<SiteStatistic[]> {
  const data = await fetchSiteContent();
  return Array.isArray(data.statistics) ? data.statistics : [];
}

export async function fetchSiteTimeline(): Promise<TimelineMilestone[]> {
  const data = await fetchSiteContent();
  return Array.isArray(data.timeline) ? data.timeline : [];
}
