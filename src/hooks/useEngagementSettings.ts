import { useEffect, useState } from 'react';
import {
  DEFAULT_ENGAGEMENT,
  fetchSiteContent,
  type EngagementSettings,
} from '../services/siteContentService';

let cached: EngagementSettings | null = null;
let pending: Promise<EngagementSettings> | null = null;

function readEngagement(raw: Partial<EngagementSettings> | undefined): EngagementSettings {
  return {
    showLikes: raw?.showLikes !== false,
    showComments: raw?.showComments !== false,
    showShare: raw?.showShare !== false,
  };
}

function loadEngagement(): Promise<EngagementSettings> {
  if (cached) return Promise.resolve(cached);
  if (!pending) {
    pending = fetchSiteContent()
      .then((data) => {
        cached = readEngagement(data.engagement);
        return cached;
      })
      .catch(() => DEFAULT_ENGAGEMENT)
      .finally(() => {
        pending = null;
      });
  }
  return pending;
}

export function useEngagementSettings(): EngagementSettings {
  const [settings, setSettings] = useState<EngagementSettings>(cached || DEFAULT_ENGAGEMENT);

  useEffect(() => {
    let cancelled = false;
    loadEngagement().then((next) => {
      if (!cancelled) setSettings(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return settings;
}

export function engagementGridClass(settings: EngagementSettings): string {
  const count = [settings.showLikes, settings.showComments, settings.showShare].filter(Boolean).length;
  if (count <= 1) return 'grid-cols-1';
  if (count === 2) return 'grid-cols-2';
  return 'grid-cols-3';
}
