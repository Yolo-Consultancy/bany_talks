const API_BASE = import.meta.env.VITE_API_URL || '';

export type SiteStatistic = {
  label: string;
  value: string;
};

export type SiteContent = {
  id?: string;
  key?: string;
  statistics: SiteStatistic[];
};

export async function fetchSiteStatistics(): Promise<SiteStatistic[]> {
  const res = await fetch(`${API_BASE}/api/site-content`);
  if (!res.ok) {
    throw new Error('Impossible de charger les chiffres clés');
  }
  const data = (await res.json()) as SiteContent;
  return Array.isArray(data.statistics) ? data.statistics : [];
}
