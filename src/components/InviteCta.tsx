import React from 'react';
import { ArrowRight } from 'lucide-react';

interface InviteCtaProps {
  onInvite: () => void;
  /** Libellé du bouton, adapté au contexte de la page */
  label: string;
  /** Titre court au-dessus du bouton (variante bandeau) */
  title?: string;
  /** Phrase d’appui */
  subtitle?: string;
  /** `banner` = bandeau éditorial ; `button` = CTA seul */
  variant?: 'banner' | 'button';
  className?: string;
}

export default function InviteCta({
  onInvite,
  label,
  title,
  subtitle,
  variant = 'banner',
  className = '',
}: InviteCtaProps) {
  if (variant === 'button') {
    return (
      <button type="button" onClick={onInvite} className={`btn-primary text-xs sm:text-sm ${className}`}>
        {label}
        <ArrowRight className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div
      className={`border border-rose-500/25 bg-rose-500/5 px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 ${className}`}
    >
      <div className="space-y-2 max-w-xl">
        {title && (
          <h3 className="font-display text-xl sm:text-2xl text-stone-100 font-medium leading-snug">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-sm text-stone-500 font-body leading-relaxed">{subtitle}</p>
        )}
      </div>
      <button type="button" onClick={onInvite} className="btn-primary text-xs sm:text-sm shrink-0 self-start sm:self-center">
        {label}
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
