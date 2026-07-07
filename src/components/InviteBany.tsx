import React, { useState, useEffect } from 'react';
import { Mail, Calendar, Send, CheckCircle2, ArrowRight } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { FREQUENT_EVENT_TYPES } from '../data';
import { SpeakerRequest } from '../types';
import { initAuth, googleSignIn, logout } from '../firebaseAuth';
import { createNewSpreadsheet, getFirstSheetTitle, appendRowToSheet, extractSpreadsheetId } from '../sheetsService';
import { User as FirebaseUser } from 'firebase/auth';

const inputClass =
  'w-full px-0 py-3 bg-transparent border-b border-white/10 focus:border-rose-500/60 text-stone-200 placeholder-stone-600 focus:outline-none transition text-sm font-body';

const labelClass = 'block text-xs text-stone-500 font-body mb-2';

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

export default function InviteBany() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    eventType: FREQUENT_EVENT_TYPES[0],
    date: '',
    budgetRange: '3000-5000',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingSummary, setBookingSummary] = useState<SpeakerRequest | null>(null);

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [spreadsheetUrl, setSpreadsheetUrl] = useState('');
  const [spreadsheetTitle, setSpreadsheetTitle] = useState('');
  const [syncingSheets, setSyncingSheets] = useState(false);
  const [sheetsError, setSheetsError] = useState<string | null>(null);
  const [successSheetsSync, setSuccessSheetsSync] = useState(false);
  const [manualInputSheetId, setManualInputSheetId] = useState('');

  useEffect(() => {
    const savedId = localStorage.getItem('bany_sheets_id');
    const savedUrl = localStorage.getItem('bany_sheets_url');
    const savedTitle = localStorage.getItem('bany_sheets_title');
    if (savedId) setSpreadsheetId(savedId);
    if (savedUrl) setSpreadsheetUrl(savedUrl);
    if (savedTitle) setSpreadsheetTitle(savedTitle);

    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setAccessToken(null);
        setNeedsAuth(true);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setSheetsError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setAccessToken(result.accessToken);
        setNeedsAuth(false);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setSheetsError(`Connexion échouée : ${message}`);
    }
  };

  const handleGoogleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setAccessToken(null);
      setNeedsAuth(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setSheetsError(`Déconnexion échouée : ${message}`);
    }
  };

  const handleCreateSheet = async () => {
    if (!accessToken) {
      setSheetsError('Veuillez vous connecter à Google en premier.');
      return;
    }
    setSyncingSheets(true);
    setSheetsError(null);
    try {
      const sheet = await createNewSpreadsheet(accessToken, "Bany Talks - Demandes d'Invitations");
      setSpreadsheetId(sheet.spreadsheetId);
      setSpreadsheetUrl(sheet.spreadsheetUrl);
      setSpreadsheetTitle(sheet.title);
      localStorage.setItem('bany_sheets_id', sheet.spreadsheetId);
      localStorage.setItem('bany_sheets_url', sheet.spreadsheetUrl);
      localStorage.setItem('bany_sheets_title', sheet.title);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setSheetsError(`Erreur lors de la création : ${message}`);
    } finally {
      setSyncingSheets(false);
    }
  };

  const handleConnectSheet = async () => {
    if (!accessToken) {
      setSheetsError('Veuillez vous connecter à Google en premier.');
      return;
    }
    if (!manualInputSheetId.trim()) {
      setSheetsError('Veuillez entrer une URL ou un ID de feuille Google Sheets.');
      return;
    }
    setSyncingSheets(true);
    setSheetsError(null);
    const targetId = extractSpreadsheetId(manualInputSheetId);
    try {
      const tabTitle = await getFirstSheetTitle(targetId, accessToken);
      const sheetUrl = `https://docs.google.com/spreadsheets/d/${targetId}/edit`;
      const sheetTitle = `Feuille connectée (${tabTitle})`;
      setSpreadsheetId(targetId);
      setSpreadsheetUrl(sheetUrl);
      setSpreadsheetTitle(sheetTitle);
      localStorage.setItem('bany_sheets_id', targetId);
      localStorage.setItem('bany_sheets_url', sheetUrl);
      localStorage.setItem('bany_sheets_title', sheetTitle);
      setManualInputSheetId('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setSheetsError(`Erreur lors de la connexion : ${message}`);
    } finally {
      setSyncingSheets(false);
    }
  };

  const handleClearSpreadsheet = () => {
    setSpreadsheetId('');
    setSpreadsheetUrl('');
    setSpreadsheetTitle('');
    localStorage.removeItem('bany_sheets_id');
    localStorage.removeItem('bany_sheets_url');
    localStorage.removeItem('bany_sheets_title');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculatePackage = (budget: string) => {
    if (budget === 'under-3000') {
      return {
        tier: 'Bronze Spark',
        features: [
          "Séance d'interview de 30 min",
          "Intégration logo d'entreprise",
          'Diffusion sur les réseaux sociaux',
        ],
        estHours: '1–2 heures',
      };
    }
    if (budget === '3000-5000') {
      return {
        tier: 'Silver Momentum',
        features: [
          'Conférence Keynote de 45 min',
          'Table ronde interactive de 30 min',
          "Session Q&A avec l'audience",
          'Pack photos professionnelles',
        ],
        estHours: '3–4 heures',
      };
    }
    return {
      tier: 'Gold Sovereign Elite',
      features: [
        'Animation exclusive demi-journée',
        'Interview enregistrée au studio Bany Talks',
        'Post sponsorisé VIP sur tous les réseaux',
        'Newsletter dédiée (40K abonnés)',
      ],
      estHours: '6+ heures',
    };
  };

  const currentPackage = calculatePackage(formData.budgetRange);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.date) {
      alert('Veuillez remplir tous les champs requis.');
      return;
    }

    setLoading(true);
    setSheetsError(null);
    setSuccessSheetsSync(false);

    const liveBooking: SpeakerRequest = {
      id: `book-${Date.now().toString().slice(-4)}`,
      name: formData.name,
      company: formData.company || 'Indépendant',
      email: formData.email,
      eventType: formData.eventType,
      date: formData.date,
      budgetRange: formData.budgetRange,
      message: formData.message,
      createdAt: new Date().toLocaleDateString('fr-FR'),
    };

    const existing = localStorage.getItem('bany_speaker_requests');
    const list = existing ? JSON.parse(existing) : [];
    list.unshift(liveBooking);
    localStorage.setItem('bany_speaker_requests', JSON.stringify(list));

    try {
      const response = await fetch('https://formspree.io/f/xykvdqnd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(liveBooking),
      });
      if (!response.ok) {
        throw new Error(`Formspree responded with ${response.status}`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('Formspree submission failed:', err);
      setSheetsError(`Échec d'envoi : ${message}`);
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
          budgetDisplay(liveBooking.budgetRange),
          currentPackage.tier,
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

  const budgetDisplay = (val: string) => {
    switch (val) {
      case 'under-3000': return 'Moins de 3 000 €';
      case '3000-5000': return '3 000 € – 5 000 €';
      case 'above-5000': return 'Plus de 5 000 €';
      default: return 'Non défini';
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      company: '',
      email: '',
      eventType: FREQUENT_EVENT_TYPES[0],
      date: '',
      budgetRange: '3000-5000',
      message: '',
    });
  };

  return (
    <section id="booking-section" className="bg-stone-950 py-20 lg:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 lg:mb-20">
          <div className="lg:col-span-7 space-y-5">
            <p className="section-label">Speaking Engagements</p>
            <h2 className="font-display text-4xl sm:text-5xl text-stone-100 font-medium leading-tight">
              Inviter Bany à votre événement
            </h2>
            <p className="text-stone-500 font-body text-base leading-relaxed max-w-lg">
              Conférences d'inspiration, tables rondes ou partenariats média. Alignez votre marque avec une voix qui compte en Afrique et au-delà.
            </p>
          </div>
          <div className="lg:col-span-5 flex items-end">
            <p className="text-sm text-stone-600 font-body leading-relaxed">
              Bany et son équipe reviennent vers vous sous 48h ouvrées. Transport et hébergement (hôtel 4★ minimum) à la charge de l'organisateur.
            </p>
          </div>
        </div>

        {submitted && bookingSummary ? (
          <div className="max-w-xl mx-auto border border-white/8 p-10 space-y-8 animate-fade-in-up text-center">
            <CheckCircle2 className="w-10 h-10 text-rose-500 mx-auto" strokeWidth={1.5} />
            <div className="space-y-3">
              <h3 className="font-display text-2xl text-stone-100 font-medium">
                Demande envoyée
              </h3>
              <p className="text-sm text-stone-500 font-body">
                Merci {bookingSummary.name}. Bany et son équipe passeront en revue votre proposition sous 48h ouvrées.
              </p>
            </div>

            <div className="border-t border-white/5 pt-6 text-left space-y-3 font-body text-sm">
              {[
                ['Référence', bookingSummary.id],
                ['Organisme', bookingSummary.company],
                ['Type', bookingSummary.eventType],
                ['Date', bookingSummary.date],
                ['Budget', budgetDisplay(bookingSummary.budgetRange)],
                ['Formule', currentPackage.tier],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="text-stone-600">{label}</span>
                  <span className="text-stone-300 text-right">{value}</span>
                </div>
              ))}
              {successSheetsSync && (
                <p className="text-emerald-500 text-xs pt-2">Synchronisé sur Google Sheets</p>
              )}
            </div>

            <button onClick={resetForm} className="btn-primary mx-auto">
              Nouvelle demande
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">

            {/* Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <FormLabel htmlFor="name-input" required>Nom complet</FormLabel>
                  <input
                    id="name-input"
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Hope Kakesa"
                    className={inputClass}
                  />
                </div>
                <div>
                  <FormLabel htmlFor="company-input">Entreprise ou marque</FormLabel>
                  <input
                    id="company-input"
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Orange, Stripe…"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <FormLabel htmlFor="email-input" required>Email professionnel</FormLabel>
                <input
                  id="email-input"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="hope@entreprise.com"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <FormLabel htmlFor="eventType-select">Type de demande</FormLabel>
                  <select
                    id="eventType-select"
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    className={`${inputClass} cursor-pointer`}
                  >
                    {FREQUENT_EVENT_TYPES.map((type, i) => (
                      <option key={i} value={type} className="bg-stone-950">{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <FormLabel htmlFor="date-input" required>Date souhaitée</FormLabel>
                  <input
                    id="date-input"
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <FormLabel required>Enveloppe budgétaire</FormLabel>
                <div className="flex flex-col sm:flex-row gap-0 border-b border-white/10">
                  {[
                    { value: 'under-3000', label: '< 3 000 €' },
                    { value: '3000-5000', label: '3k – 5k €' },
                    { value: 'above-5000', label: '> 5 000 €' },
                  ].map((elem) => (
                    <label
                      key={elem.value}
                      className={`flex-1 py-3 text-sm font-body text-center cursor-pointer border-b-2 -mb-px transition ${
                        formData.budgetRange === elem.value
                          ? 'text-stone-100 border-rose-500'
                          : 'text-stone-600 border-transparent hover:text-stone-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="budgetRange"
                        value={elem.value}
                        checked={formData.budgetRange === elem.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      {elem.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <FormLabel htmlFor="message-textarea">Brief / objectifs</FormLabel>
                <textarea
                  id="message-textarea"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Audience cible, thèmes à aborder, timing…"
                  className={`${inputClass} resize-none leading-relaxed`}
                />
              </div>

              {sheetsError && (
                <p className="text-sm text-rose-400 font-body">{sheetsError}</p>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto justify-center">
                {loading ? (
                  <span className="w-4 h-4 rounded-full border-2 border-stone-950 border-t-transparent animate-spin" />
                ) : (
                  <>
                    Envoyer la demande
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Package sidebar */}
            <aside className="lg:col-span-5 lg:sticky lg:top-32 space-y-10">
              <div className="border-l-2 border-rose-500/40 pl-8 space-y-6">
                <div>
                  <p className="section-label text-[0.6rem] mb-3">Formule recommandée</p>
                  <h3 className="font-display text-2xl text-stone-100 font-medium">
                    {currentPackage.tier}
                  </h3>
                  <p className="text-sm text-stone-600 font-body mt-2">
                    Durée conseillée : {currentPackage.estHours}
                  </p>
                </div>

                <ul className="space-y-3">
                  {currentPackage.features.map((feat, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-stone-400 font-body">
                      <CheckCircle2 className="w-4 h-4 text-rose-500/70 shrink-0 mt-0.5" strokeWidth={1.5} />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <hr className="editorial-rule" />

              <div className="space-y-5">
                <p className="section-label text-[0.6rem]">Contact direct</p>
                <div className="space-y-3">
                  <a
                    href="mailto:contact@banyofficial.com"
                    className="flex items-center gap-4 p-4 border border-white/8 hover:border-rose-500/30 transition group"
                  >
                    <span className="flex items-center justify-center w-10 h-10 shrink-0 border border-white/10 text-rose-500/80 group-hover:border-rose-500/40 transition">
                      <Mail className="w-4 h-4" strokeWidth={1.5} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[10px] uppercase tracking-wider text-stone-600 font-body mb-1">Email</span>
                      <span className="block text-sm text-stone-300 font-body break-all group-hover:text-rose-400 transition">
                        contact@banyofficial.com
                      </span>
                    </span>
                  </a>
                  <a
                    href="https://wa.me/813622975"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-4 p-4 border border-white/8 hover:border-rose-500/30 transition group"
                  >
                    <span className="flex items-center justify-center w-10 h-10 shrink-0 border border-white/10 text-[#25D366] group-hover:border-[#25D366]/40 transition">
                      <WhatsAppIcon className="w-5 h-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[10px] uppercase tracking-wider text-stone-600 font-body mb-1">WhatsApp</span>
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
