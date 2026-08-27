import React, { useState, useEffect, useMemo } from 'react';
import { Mail, Send, CheckCircle2, ArrowRight } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import {
  FREQUENT_EVENT_TYPES,
  getInviteFormulaOptions,
  getInvitePackage,
  getInviteTypeConfig,
  type InviteEventType,
} from '../data';
import { SpeakerRequest } from '../types';
import { initAuth } from '../firebaseAuth';
import { appendRowToSheet } from '../sheetsService';
import { sendContactMail } from '../services/contactMailService';

const inputClass = 'field-input';

const labelClass = 'block text-xs text-stone-500 font-body mb-2';

function FieldWrap({
  children,
  filled = false,
  className = '',
}: {
  children: React.ReactNode;
  filled?: boolean;
  className?: string;
}) {
  return (
    <div className={`field-wrap${filled ? ' is-filled' : ''} ${className}`.trim()}>
      {children}
    </div>
  );
}

const FORMULA_STYLE = [
  {
    value: 'essentiel',
    bg: 'bg-white/[0.06]',
    bgActive: 'bg-stone-200',
    text: 'text-stone-400',
    textActive: 'text-stone-950',
    border: 'border-white/10',
    borderActive: 'border-stone-200',
  },
  {
    value: 'standard',
    bg: 'bg-rose-500/15',
    bgActive: 'bg-rose-500',
    text: 'text-rose-400/80',
    textActive: 'text-stone-950',
    border: 'border-rose-500/25',
    borderActive: 'border-rose-500',
  },
  {
    value: 'premium',
    bg: 'bg-rose-300/15',
    bgActive: 'bg-rose-300',
    text: 'text-rose-300/90',
    textActive: 'text-stone-950',
    border: 'border-rose-300/25',
    borderActive: 'border-rose-300',
  },
] as const;

function FormLabel({
  htmlFor,
  children,
  required = false,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className={labelClass}>
      {children}
      {required && (
        <span className="text-rose-500 ml-0.5" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

const emptyForm = {
  name: '',
  company: '',
  email: '',
  eventType: FREQUENT_EVENT_TYPES[0] as InviteEventType,
  date: '',
  budgetRange: 'standard',
  message: '',
  city: '',
  eventFormat: '',
  audience: '',
  theme: '',
};

export default function InviteBany() {
  const [formData, setFormData] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingSummary, setBookingSummary] = useState<SpeakerRequest | null>(null);

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [sheetsError, setSheetsError] = useState<string | null>(null);
  const [successSheetsSync, setSuccessSheetsSync] = useState(false);

  const typeConfig = useMemo(() => getInviteTypeConfig(formData.eventType), [formData.eventType]);
  const formulaOptions = useMemo(() => getInviteFormulaOptions(formData.eventType), [formData.eventType]);
  const currentPackage = useMemo(
    () => getInvitePackage(formData.eventType, formData.budgetRange),
    [formData.eventType, formData.budgetRange]
  );
  const accent = currentPackage?.accent;
  const extraFields = typeConfig.extraFields ?? [];

  useEffect(() => {
    const savedId = localStorage.getItem('bany_sheets_id');
    if (savedId) setSpreadsheetId(savedId);

    const unsubscribe = initAuth(
      (_currentUser, token) => {
        setAccessToken(token);
      },
      () => {
        setAccessToken(null);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === 'eventType') {
        const nextType = (FREQUENT_EVENT_TYPES as readonly string[]).includes(value)
          ? (value as InviteEventType)
          : FREQUENT_EVENT_TYPES[0];
        return {
          ...prev,
          eventType: nextType,
          budgetRange: 'standard',
          city: '',
          eventFormat: '',
          audience: '',
          theme: '',
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const packagePanelBg =
    formData.budgetRange === 'essentiel' || formData.budgetRange === 'under-3000'
      ? 'bg-white/[0.04] border-white/10'
      : formData.budgetRange === 'standard' || formData.budgetRange === '3000-5000'
        ? 'bg-rose-500/10 border-rose-500/25'
        : 'bg-rose-300/10 border-rose-300/25';

  const packageDetails = currentPackage && accent ? (
    <div
      className={`border ${packagePanelBg} border-l-4 ${accent.border} p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5 lg:space-y-6 transition-colors duration-300`}
    >
      <div>
        <p className={`text-[0.6rem] font-display font-semibold tracking-[0.18em] uppercase mb-3 ${accent.label}`}>
          {typeConfig.formulaLabel || 'Format'} · {formData.eventType}
        </p>
        <h3 className={`font-display text-xl sm:text-2xl font-medium ${accent.text}`}>
          {currentPackage.tier}
        </h3>
        {currentPackage.estHours && (
          <p className={`text-sm font-body mt-2 ${accent.textMuted}`}>
            Durée conseillée : {currentPackage.estHours}
          </p>
        )}
      </div>

      <ul className="space-y-3">
        {currentPackage.features.map((feat, idx) => (
          <li key={idx} className="flex gap-3 text-sm text-stone-400 font-body">
            <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${accent.icon}`} strokeWidth={1.5} />
            {feat}
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <div className="border border-white/8 border-l-4 border-l-rose-500/50 p-5 sm:p-6 space-y-3">
      {typeConfig.introTitle && (
        <h3 className="font-display text-xl sm:text-2xl text-stone-100 font-medium">
          {typeConfig.introTitle}
        </h3>
      )}
      {typeConfig.intro && (
        <p className="text-sm text-stone-500 font-body leading-relaxed">{typeConfig.intro}</p>
      )}
    </div>
  );

  const formulaDisplay = (eventType: string, val: string) => {
    const pkg = getInvitePackage(eventType, val);
    return pkg?.tier || '—';
  };

  const buildDetailsMessage = () => {
    const parts: string[] = [];
    if (formData.message.trim()) parts.push(formData.message.trim());
    if (formData.city.trim()) parts.push(`Ville / pays : ${formData.city.trim()}`);
    if (formData.eventFormat.trim()) parts.push(`Type d’événement : ${formData.eventFormat.trim()}`);
    if (formData.audience.trim()) parts.push(`Audience estimée : ${formData.audience.trim()}`);
    if (formData.theme.trim()) parts.push(`Thématique : ${formData.theme.trim()}`);
    return parts.join('\n');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Veuillez remplir tous les champs requis.');
      return;
    }
    if (typeConfig.dateRequired && !formData.date) {
      alert('Veuillez indiquer la date souhaitée.');
      return;
    }

    setLoading(true);
    setSheetsError(null);
    setSuccessSheetsSync(false);

    const details = buildDetailsMessage();
    const formuleLabel = typeConfig.showFormulas
      ? getInvitePackage(formData.eventType, formData.budgetRange)?.tier || '—'
      : '—';

    const liveBooking: SpeakerRequest = {
      id: `book-${Date.now().toString().slice(-4)}`,
      name: formData.name,
      company: formData.company || 'Indépendant',
      email: formData.email,
      eventType: formData.eventType,
      date: formData.date || 'Non précisée',
      budgetRange: formData.budgetRange,
      message: details,
      city: formData.city || undefined,
      eventFormat: formData.eventFormat || undefined,
      audience: formData.audience || undefined,
      theme: formData.theme || undefined,
      createdAt: new Date().toLocaleDateString('fr-FR'),
    };

    const existing = localStorage.getItem('bany_speaker_requests');
    const list = existing ? JSON.parse(existing) : [];
    list.unshift(liveBooking);
    localStorage.setItem('bany_speaker_requests', JSON.stringify(list));

    try {
      await sendContactMail({
        type: 'invite',
        name: liveBooking.name,
        email: liveBooking.email,
        company: liveBooking.company,
        eventType: liveBooking.eventType,
        date: liveBooking.date,
        formule: formuleLabel,
        message: liveBooking.message,
        city: liveBooking.city,
        eventFormat: liveBooking.eventFormat,
        audience: liveBooking.audience,
        theme: liveBooking.theme,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('Contact mail submission failed:', err);
      setSheetsError(`Échec d'envoi : ${message}`);
      setLoading(false);
      return;
    }

    if (spreadsheetId && accessToken) {
      try {
        const rowData = [
          liveBooking.id,
          liveBooking.company,
          liveBooking.name,
          liveBooking.email,
          liveBooking.eventType,
          liveBooking.date,
          formuleLabel,
          liveBooking.city || '',
          liveBooking.eventFormat || '',
          liveBooking.audience || '',
          liveBooking.theme || '',
          liveBooking.message || 'Aucun message',
          new Date().toISOString(),
        ];
        await appendRowToSheet(spreadsheetId, accessToken, rowData);
        setSuccessSheetsSync(true);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error('Sheets sync failed:', err);
        setSheetsError(`Sauvegarde locale réussie, mais échec Google Sheets : ${message}`);
      }
    }

    setBookingSummary(liveBooking);
    setLoading(false);
    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormData(emptyForm);
  };

  return (
    <section id="booking-section" className="bg-stone-950 py-12 sm:py-16 lg:py-28 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mb-10 sm:mb-14 lg:mb-20">
          <div className="lg:col-span-7 space-y-3 sm:space-y-5">
            <p className="section-label">Travaillons ensemble</p>
            <h2 className="font-display text-[1.85rem] leading-[1.1] sm:text-4xl lg:text-5xl text-stone-100 font-medium break-words">
              TRAVAILLER AVEC BANY
            </h2>
            <p className="text-stone-500 font-body text-sm sm:text-base leading-relaxed max-w-lg">
              Conseil, prise de parole, collaborations média ou partenariats : présentez-nous votre besoin et construisons le format le plus adapté.
            </p>
          </div>
          <div className="lg:col-span-5 flex items-end">
            <p className="text-xs sm:text-sm text-stone-600 font-body leading-relaxed">
              Bany et son équipe reviennent vers vous sous 48h ouvrées. Transport et hébergement (hôtel 4★ minimum) à la charge de l&apos;organisateur pour les interventions physiques.
            </p>
          </div>
        </div>

        {submitted && bookingSummary ? (
          <div className="max-w-xl mx-auto border border-white/8 p-5 sm:p-8 lg:p-10 space-y-6 sm:space-y-8 animate-fade-in-up text-center">
            <CheckCircle2 className="w-10 h-10 text-rose-500 mx-auto" strokeWidth={1.5} />
            <div className="space-y-3">
              <h3 className="font-display text-xl sm:text-2xl text-stone-100 font-medium">Demande envoyée</h3>
              <p className="text-sm text-stone-500 font-body px-1">
                Merci {bookingSummary.name}. Bany et son équipe passeront en revue votre proposition sous 48h ouvrées.
              </p>
            </div>

            <div className="border-t border-white/5 pt-6 text-left space-y-3 font-body text-sm">
              {[
                ['Référence', bookingSummary.id],
                ['Organisation', bookingSummary.company],
                ['Type', bookingSummary.eventType],
                ['Date / échéance', bookingSummary.date],
                ['Format', formulaDisplay(bookingSummary.eventType, bookingSummary.budgetRange)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex flex-col gap-0.5 xs:flex-row sm:flex-row sm:justify-between sm:gap-4"
                >
                  <span className="text-stone-600 shrink-0">{label}</span>
                  <span className="text-stone-300 sm:text-right break-words min-w-0">{value}</span>
                </div>
              ))}
              {successSheetsSync && (
                <p className="text-emerald-500 text-xs pt-2">Synchronisé sur Google Sheets</p>
              )}
            </div>

            <button onClick={resetForm} className="btn-primary w-full sm:w-auto mx-auto justify-center">
              Nouvelle demande
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16 xl:gap-20 items-start">
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6 sm:space-y-8 min-w-0">
              {/* Intro mobile — pour les types avec formats (le détail format suit plus bas) */}
              {typeConfig.showFormulas && (typeConfig.introTitle || typeConfig.intro) && (
                <div className="lg:hidden space-y-2 pb-1 border-b border-white/5">
                  {typeConfig.introTitle && (
                    <h3 className="font-display text-xl text-stone-100 font-medium">
                      {typeConfig.introTitle}
                    </h3>
                  )}
                  {typeConfig.intro && (
                    <p className="text-sm text-stone-500 font-body leading-relaxed">{typeConfig.intro}</p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
                <div className="min-w-0">
                  <FormLabel htmlFor="name-input" required>
                    Nom complet
                  </FormLabel>
                  <FieldWrap filled={Boolean(formData.name)}>
                    <input
                      id="name-input"
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Hope Kakesa"
                      className={inputClass}
                      autoComplete="name"
                    />
                  </FieldWrap>
                </div>
                <div className="min-w-0">
                  <FormLabel htmlFor="company-input">Entreprise / organisation</FormLabel>
                  <FieldWrap filled={Boolean(formData.company)}>
                    <input
                      id="company-input"
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Votre organisation"
                      className={inputClass}
                      autoComplete="organization"
                    />
                  </FieldWrap>
                </div>
              </div>

              <div className="min-w-0">
                <FormLabel htmlFor="email-input" required>
                  Email professionnel
                </FormLabel>
                <FieldWrap filled={Boolean(formData.email)}>
                  <input
                    id="email-input"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="hope@entreprise.com"
                    className={inputClass}
                    autoComplete="email"
                    inputMode="email"
                  />
                </FieldWrap>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
                <div className="min-w-0">
                  <FormLabel htmlFor="eventType-select" required>
                    Type de demande
                  </FormLabel>
                  <FieldWrap filled>
                    <select
                      id="eventType-select"
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleInputChange}
                      className={`${inputClass} cursor-pointer`}
                    >
                      {FREQUENT_EVENT_TYPES.map((type) => (
                        <option key={type} value={type} className="bg-stone-950">
                          {type}
                        </option>
                      ))}
                    </select>
                  </FieldWrap>
                </div>
                <div className="min-w-0">
                  <FormLabel htmlFor="date-input" required={typeConfig.dateRequired}>
                    {typeConfig.dateLabel}
                  </FormLabel>
                  <FieldWrap filled={Boolean(formData.date)}>
                    <input
                      id="date-input"
                      type="date"
                      name="date"
                      required={typeConfig.dateRequired}
                      value={formData.date}
                      onChange={handleInputChange}
                      className={`${inputClass} appearance-none`}
                    />
                  </FieldWrap>
                </div>
              </div>

              {extraFields.length > 0 && (
                <div className="space-y-5 sm:space-y-8 animate-fade-in-up">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
                    {extraFields.includes('city') && (
                      <div className="min-w-0">
                        <FormLabel htmlFor="city-input">Ville / pays</FormLabel>
                        <FieldWrap filled={Boolean(formData.city)}>
                          <input
                            id="city-input"
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="Kinshasa, RDC"
                            className={inputClass}
                          />
                        </FieldWrap>
                      </div>
                    )}
                    {extraFields.includes('eventFormat') && (
                      <div className="min-w-0">
                        <FormLabel htmlFor="eventFormat-input">Type d’événement</FormLabel>
                        <FieldWrap filled={Boolean(formData.eventFormat)}>
                          <input
                            id="eventFormat-input"
                            type="text"
                            name="eventFormat"
                            value={formData.eventFormat}
                            onChange={handleInputChange}
                            placeholder="Sommet, forum, séminaire…"
                            className={inputClass}
                          />
                        </FieldWrap>
                      </div>
                    )}
                    {extraFields.includes('audience') && (
                      <div className="min-w-0">
                        <FormLabel htmlFor="audience-input">Audience estimée</FormLabel>
                        <FieldWrap filled={Boolean(formData.audience)}>
                          <input
                            id="audience-input"
                            type="text"
                            name="audience"
                            value={formData.audience}
                            onChange={handleInputChange}
                            placeholder="Ex. 200 personnes"
                            className={inputClass}
                          />
                        </FieldWrap>
                      </div>
                    )}
                    {extraFields.includes('theme') && (
                      <div className="min-w-0 sm:col-span-2">
                        <FormLabel htmlFor="theme-input">Thématique envisagée</FormLabel>
                        <FieldWrap filled={Boolean(formData.theme)}>
                          <input
                            id="theme-input"
                            type="text"
                            name="theme"
                            value={formData.theme}
                            onChange={handleInputChange}
                            placeholder="Ex. Entreprendre en Afrique"
                            className={inputClass}
                            list="invite-themes"
                          />
                        </FieldWrap>
                        {typeConfig.themes && (
                          <datalist id="invite-themes">
                            {typeConfig.themes.map((theme) => (
                              <option key={theme} value={theme} />
                            ))}
                          </datalist>
                        )}
                      </div>
                    )}
                  </div>
                  {typeConfig.themes && (
                    <div>
                      <p className="text-xs text-stone-600 font-body mb-3">Thématiques fréquentes</p>
                      <div className="flex flex-wrap gap-2">
                        {typeConfig.themes.map((theme) => (
                          <button
                            key={theme}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, theme }))}
                            className={`text-[10px] sm:text-[11px] font-body px-2.5 sm:px-3 py-1.5 border transition leading-snug text-left ${
                              formData.theme === theme
                                ? 'border-rose-500/50 text-rose-300 bg-rose-500/10'
                                : 'border-white/10 text-stone-500 hover:border-white/20 hover:text-stone-300'
                            }`}
                          >
                            {theme}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {typeConfig.showFormulas && formulaOptions.length > 0 && (
                <div>
                  <FormLabel required>{typeConfig.formulaLabel || 'Format'}</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3">
                    {formulaOptions.map((opt) => {
                      const style = FORMULA_STYLE.find((s) => s.value === opt.value)!;
                      const active = formData.budgetRange === opt.value;
                      return (
                        <label
                          key={opt.value}
                          className={`flex items-center md:justify-center py-3.5 px-4 md:px-2 text-sm md:text-xs lg:text-sm font-body font-medium cursor-pointer border transition duration-200 leading-snug ${
                            active
                              ? `${style.bgActive} ${style.textActive} ${style.borderActive}`
                              : `${style.bg} ${style.text} ${style.border} hover:brightness-110`
                          }`}
                        >
                          <input
                            type="radio"
                            name="budgetRange"
                            value={opt.value}
                            checked={active}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <span className="text-left md:text-center w-full">{opt.label}</span>
                        </label>
                      );
                    })}
                  </div>

                  <div
                    key={`${formData.eventType}-${formData.budgetRange}`}
                    className="lg:hidden mt-5 sm:mt-6 animate-fade-in-up"
                  >
                    {packageDetails}
                  </div>
                </div>
              )}

              {!typeConfig.showFormulas && (
                <div className="lg:hidden animate-fade-in-up">{packageDetails}</div>
              )}

              <div className="min-w-0">
                <FormLabel htmlFor="message-textarea">
                  {typeConfig.briefTitle || 'Brief / objectifs'}
                </FormLabel>
                <FieldWrap filled={Boolean(formData.message)}>
                  <textarea
                    id="message-textarea"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder={typeConfig.briefPlaceholder || 'Décrivez votre besoin…'}
                    className={`${inputClass} resize-none leading-relaxed min-h-[7rem]`}
                  />
                </FieldWrap>
              </div>

              {typeConfig.note && (
                <p className="text-xs text-stone-600 font-body leading-relaxed">{typeConfig.note}</p>
              )}

              {sheetsError && <p className="text-sm text-rose-400 font-body break-words">{sheetsError}</p>}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full sm:w-auto justify-center text-[11px] sm:text-xs px-5 sm:px-7 whitespace-normal text-center leading-snug min-h-[3rem]"
              >
                {loading ? (
                  <span className="w-4 h-4 rounded-full border-2 border-stone-950 border-t-transparent animate-spin shrink-0" />
                ) : (
                  <>
                    <span>{typeConfig.cta}</span>
                    <Send className="w-4 h-4 shrink-0" />
                  </>
                )}
              </button>
            </form>

            <aside className="lg:col-span-5 lg:sticky lg:top-28 space-y-8 sm:space-y-10 min-w-0 pt-2 lg:pt-0 border-t border-white/5 lg:border-0">
              <div className="hidden lg:block space-y-4">
                {typeConfig.introTitle && typeConfig.showFormulas && (
                  <div className="space-y-2">
                    <h3 className="font-display text-2xl text-stone-100 font-medium">{typeConfig.introTitle}</h3>
                    {typeConfig.intro && (
                      <p className="text-sm text-stone-500 font-body leading-relaxed">{typeConfig.intro}</p>
                    )}
                  </div>
                )}
                {packageDetails}
                {typeConfig.note && typeConfig.showFormulas && (
                  <p className="text-xs text-stone-600 font-body leading-relaxed">{typeConfig.note}</p>
                )}
              </div>

              <hr className="editorial-rule hidden lg:block" />

              <div className="space-y-4 sm:space-y-5">
                <p className="section-label text-[0.6rem]">Contact direct</p>
                <div className="space-y-3">
                  <a
                    href="mailto:contact@banyofficial.com"
                    className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 border border-white/8 hover:border-rose-500/30 transition group"
                  >
                    <span className="flex items-center justify-center w-10 h-10 shrink-0 border border-white/10 text-rose-500/80 group-hover:border-rose-500/40 transition">
                      <Mail className="w-4 h-4" strokeWidth={1.5} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[10px] uppercase tracking-wider text-stone-600 font-body mb-1">
                        Email
                      </span>
                      <span className="block text-sm text-stone-300 font-body break-all group-hover:text-rose-400 transition">
                        contact@banyofficial.com
                      </span>
                    </span>
                  </a>
                  <a
                    href="https://wa.me/813622975"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 border border-white/8 hover:border-rose-500/30 transition group"
                  >
                    <span className="flex items-center justify-center w-10 h-10 shrink-0 border border-white/10 text-[#25D366] group-hover:border-[#25D366]/40 transition">
                      <WhatsAppIcon className="w-5 h-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[10px] uppercase tracking-wider text-stone-600 font-body mb-1">
                        WhatsApp
                      </span>
                      <span className="block text-sm text-stone-300 font-body group-hover:text-rose-400 transition">
                        Écrire sur WhatsApp
                      </span>
                    </span>
                    <ArrowRight className="w-4 h-4 text-stone-600 group-hover:text-rose-400 shrink-0 transition" />
                  </a>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
