import React from 'react';
import { HOST_DETAILS } from '../data';
import {
  YouTubeIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
  WhatsAppIcon,
} from './SocialBrandIcons';

type IconSize = 'sm' | 'md';

const SIZE_CLASS: Record<IconSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
};

const SOCIALS = [
  {
    key: 'youtube' as const,
    label: 'YouTube',
    Icon: YouTubeIcon,
    brandClass: 'text-[#FF0000] hover:opacity-80',
  },
  {
    key: 'instagram' as const,
    label: 'Instagram',
    Icon: InstagramIcon,
    brandClass: 'text-[#E4405F] hover:opacity-80',
  },
  {
    key: 'linkedin' as const,
    label: 'LinkedIn',
    Icon: LinkedInIcon,
    brandClass: 'text-[#0A66C2] hover:opacity-80',
  },
  {
    key: 'tiktok' as const,
    label: 'TikTok',
    Icon: TikTokIcon,
    brandClass: 'text-stone-100 hover:opacity-80',
  },
  {
    key: 'whatsapp' as const,
    label: 'WhatsApp',
    Icon: WhatsAppIcon,
    brandClass: 'text-[#25D366] hover:opacity-80',
  },
];

function normalizeHref(href: string) {
  return href.startsWith('http') ? href : `https://${href}`;
}

interface SocialLinksProps {
  size?: IconSize;
  className?: string;
}

export default function SocialLinks({ size = 'sm', className = 'flex items-center gap-4' }: SocialLinksProps) {
  const iconClass = SIZE_CLASS[size];

  return (
    <div className={className}>
      {SOCIALS.map(({ key, label, Icon, brandClass }) => {
        const href = HOST_DETAILS.socialLinks[key];
        if (!href) return null;
        return (
          <a
            key={key}
            href={normalizeHref(href)}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className={`transition ${brandClass}`}
          >
            <Icon className={iconClass} />
          </a>
        );
      })}
    </div>
  );
}
