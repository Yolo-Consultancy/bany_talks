import React, { useState, useEffect } from 'react';
import { Mail, Calendar, DollarSign, Send, CheckCircle2, User, Building, Settings, Sparkles } from 'lucide-react';
import { FREQUENT_EVENT_TYPES } from '../data';
import { SpeakerRequest } from '../types';
import { initAuth, googleSignIn, logout } from '../firebaseAuth';
import { createNewSpreadsheet, getFirstSheetTitle, appendRowToSheet, extractSpreadsheetId } from '../sheetsService';
import { User as FirebaseUser } from 'firebase/auth';

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

  // Google Sheets integration state
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
    // Check if we already have spreadsheet info stored
    const savedId = localStorage.getItem('bany_sheets_id');
    const savedUrl = localStorage.getItem('bany_sheets_url');
    const savedTitle = localStorage.getItem('bany_sheets_title');
    if (savedId) setSpreadsheetId(savedId);
    if (savedUrl) setSpreadsheetUrl(savedUrl);
    if (savedTitle) setSpreadsheetTitle(savedTitle);

    // Initialize Firebase Auth
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
    } catch (err: any) {
      setSheetsError(`Connexion échouée : ${err.message || err}`);
    }
  };

  const handleGoogleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setAccessToken(null);
      setNeedsAuth(true);
    } catch (err: any) {
      setSheetsError(`Déconnexion échouée : ${err.message || err}`);
    }
  };

  const handleCreateSheet = async () => {
    if (!accessToken) {
      setSheetsError("Veuillez vous connecter à Google en premier.");
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
    } catch (err: any) {
      setSheetsError(`Erreur lors de la création : ${err.message || err}`);
    } finally {
      setSyncingSheets(false);
    }
  };

  const handleConnectSheet = async () => {
    if (!accessToken) {
      setSheetsError("Veuillez vous connecter à Google en premier.");
      return;
    }
    if (!manualInputSheetId.trim()) {
      setSheetsError("Veuillez entrer une URL ou un ID de feuille Google Sheets.");
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
    } catch (err: any) {
      setSheetsError(`Erreur lors de la connexion : ${err.message || err}`);
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

  const calculatePackage = (budget: string, eventType: string) => {
    if (budget === 'under-3000') {
      return {
        tier: 'Bronze Spark',
        features: ['Séance d’interview de 30 min', 'Intégration logo d’entreprise basique', 'Diffusion via les réseaux sociaux standards (Instagram, TikTok)'],
        estHours: '1-2 Heures'
      };
    } else if (budget === '3000-5000') {
      return {
        tier: 'Silver Momentum',
        features: ['Conférence Keynote thématique de 45 mins', 'Table ronde interactive de 30 mins', 'Session questions/réponses avec l’audience', 'Pack de photos professionnelles souvenirs'],
        estHours: '3-4 Heures'
      };
    } else {
      return {
        tier: 'Gold Sovereign Elite',
        features: ['Animation exclusive de toute la demi-journée', 'Interview exclusive enregistrée au studio Dany Talks (Paris)', 'Post-sponsorisé dédié VIP permanent sur tous les réseaux', 'Newsletter Bany Talks exclusive dédiée (Capacité 40K mails)'],
        estHours: '6+ Heures'
      };
    }
  };

  const currentPackage = calculatePackage(formData.budgetRange, formData.eventType);

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

    // Store booking request in local storage
    const existing = localStorage.getItem('bany_speaker_requests');
    const list = existing ? JSON.parse(existing) : [];
    list.unshift(liveBooking);
    localStorage.setItem('bany_speaker_requests', JSON.stringify(list));

    // Submit to Formspree
    try {
      const response = await fetch('https://formspree.io/f/xykvdqnd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(liveBooking),
      });
      if (!response.ok) {
        throw new Error(`Formspree responded with ${response.status}`);
      }
    } catch (err: any) {
      console.error('Formspree submission failed:', err);
      setSheetsError(`Échec d'envoi Formspree : ${err.message || err}`);
    }

    let synced = false;
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
          liveBooking.message || 'Aucun message de brief',
          new Date().toISOString()
        ];
        await appendRowToSheet(spreadsheetId, accessToken, rowData);
        synced = true;
        setSuccessSheetsSync(true);
      } catch (err: any) {
        console.error("Sheets sync failed:", err);
        setSheetsError(`Sauvegarde locale réussie, mais échec Google Sheets : ${err.message || err}`);
      }
    }

    setBookingSummary(liveBooking);
    setLoading(false);
    setSubmitted(true);
  };

  const budgetDisplay = (val: string) => {
    switch (val) {
      case 'under-3000': return 'Moins de 3 000 €';
      case '3000-5000': return '3 000 € - 5 000 € (Recommandé)';
      case 'above-5000': return 'Plus de 5 000 €';
      default: return 'Non défini';
    }
  };

  return (
    <section 
      id="booking-section"
      className="bg-stone-900 py-16 lg:py-24 border-b border-stone-800/60"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-rose-500 uppercase bg-rose-500/10 px-3 py-1 rounded-full">
            FORMULAIRE PROFESSIONNEL DE COLLABORATION
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-100 tracking-tight uppercase leading-none">
            Inviter Bany à votre événement
          </h2>
          <p className="text-sm font-sans text-stone-400 leading-relaxed">
            Conférences d'inspiration, animation de tables rondes ou projets de sponsoring média. Alignez votre marque avec une voix d'impact.
          </p>
        </div>

        {submitted && bookingSummary ? (
          /* Confirmation State Box with details */
          <div className="max-w-xl mx-auto bg-stone-950 border border-rose-500/20 rounded-2xl p-8 text-center space-y-6 animate-fade-in-up">
            <div className="w-14 h-14 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-stone-150 uppercase tracking-wide">Demande envoyée avec succès !</h3>
              <p className="text-xs text-stone-400 leading-relaxed font-sans">
                Merci {bookingSummary.name}. Bany et son équipe media passeront en revue votre proposition d'événement sous 48h jours ouvrés.
              </p>
            </div>

            {/* Recipient breakdown receipt card */}
            <div className="bg-stone-900/60 border border-stone-850 p-5 rounded-xl text-left space-y-2 font-mono text-xs text-stone-300">
              <div><span className="text-stone-500">ID Réservation :</span> {bookingSummary.id}</div>
              <div><span className="text-stone-500">Organisme :</span> {bookingSummary.company}</div>
              <div><span className="text-stone-500">Type de Service :</span> {bookingSummary.eventType}</div>
              <div><span className="text-stone-500">Date planifiée :</span> {bookingSummary.date}</div>
              <div><span className="text-stone-500">Budget alloué :</span> {budgetDisplay(bookingSummary.budgetRange)}</div>
              <div className="pt-2 border-t border-stone-800 text-[11px] text-rose-500/80 flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3.5 h-3.5" /> Option validée : {currentPackage.tier}
              </div>
              {successSheetsSync && (
                <div className="pt-2 border-t border-stone-800 text-[11px] text-emerald-450 flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Synchronisé sur Google Sheets !
                </div>
              )}
            </div>

            <button
              onClick={() => {
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
              }}
              className="w-full py-3 bg-rose-500 hover:bg-rose-400 text-stone-950 font-bold font-mono text-xs rounded-xl transition cursor-pointer"
            >
              SOUMETTRE UNE NOUVELLE COLLABORATION
            </button>
          </div>
        ) : (
          /* Live Interactive Estimator Grid (2 columns layout) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left items-start">
            
            {/* Interactive Form / 7 cols */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 bg-stone-950 border border-stone-850 p-6 sm:p-8 rounded-2xl shadow-xl space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name-input" className="block text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400">
                    Votre Nom Complet *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-550"><User className="w-3.5 h-3.5" /></span>
                    <input
                      id="name-input"
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Jean Dupont"
                      className="w-full pl-9 pr-4 py-2 bg-stone-900 border border-stone-800 focus:border-rose-500 text-stone-100 rounded-xl focus:outline-none transition duration-200 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Company */}
                <div className="space-y-1.5">
                  <label htmlFor="company-input" className="block text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400">
                    Nom de l'Entreprise ou Marque
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-550"><Building className="w-3.5 h-3.5" /></span>
                    <input
                      id="company-input"
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Ex: Orange, Stripe, Agence Web"
                      className="w-full pl-9 pr-4 py-2 bg-stone-900 border border-stone-800 focus:border-rose-500 text-stone-100 rounded-xl focus:outline-none transition duration-200 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label htmlFor="email-input" className="block text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400">
                  Adresse Email Professionnelle *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-550"><Mail className="w-3.5 h-3.5" /></span>
                  <input
                    id="email-input"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="jean@entreprise.com"
                    className="w-full pl-9 pr-4 py-2 bg-stone-900 border border-stone-800 focus:border-rose-500 text-stone-100 rounded-xl focus:outline-none transition duration-200 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Event Type selector */}
                <div className="space-y-1.5">
                  <label htmlFor="eventType-select" className="block text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400">
                    Sujet de la Demande
                  </label>
                  <select
                    id="eventType-select"
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-stone-900 border border-stone-800 focus:border-rose-500 text-stone-100 rounded-xl focus:outline-none transition duration-205 text-xs font-mono"
                  >
                    {FREQUENT_EVENT_TYPES.map((type, i) => (
                      <option key={i} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Event Date */}
                <div className="space-y-1.5">
                  <label htmlFor="date-input" className="block text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400">
                    date de l'exécution *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-550"><Calendar className="w-3.5 h-3.5" /></span>
                    <input
                      id="date-input"
                      type="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full pl-9 pr-4 py-2 bg-stone-900 border border-stone-800 focus:border-rose-500 text-stone-100 rounded-xl focus:outline-none transition duration-200 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Budget Picker Radios */}
              <div className="space-y-2">
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400">
                  Enveloppe Budgétaire Allouée *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: 'under-3000', label: 'Moins de 3 000 €' },
                    { value: '3000-5000', label: '3k € - 5k €' },
                    { value: 'above-5000', label: 'Plus de 5 000 €' }
                  ].map((elem, i) => (
                    <label 
                      key={i} 
                      className={`flex items-center gap-2 p-3 bg-stone-900 border border-stone-800 rounded-xl cursor-pointer transition select-none text-xs font-mono font-bold ${
                        formData.budgetRange === elem.value 
                          ? 'border-rose-500 text-rose-500 bg-rose-500/5' 
                          : 'text-stone-300 hover:text-stone-100 hover:border-stone-700'
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
                      <span>{elem.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label htmlFor="message-textarea" className="block text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400">
                  Brief / Objectifs du Meeting
                </label>
                <textarea
                  id="message-textarea"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Expliquez en quelques mots l'audience cible, les thèmes à aborder et le timing..."
                  className="w-full px-4 py-2.5 bg-stone-901 border border-stone-800 focus:border-rose-500 text-stone-100 placeholder-stone-500 rounded-xl focus:outline-none transition duration-200 text-xs font-mono resize-none leading-relaxed"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-rose-500 hover:bg-rose-400 disabled:bg-stone-800 text-stone-950 font-bold font-mono text-xs rounded-xl transition cursor-pointer transform active:scale-95 shadow-xl"
              >
                {loading ? (
                  <span className="w-4 h-4 rounded-full border-2 border-stone-950 border-t-transparent animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    SOUMETTRE LA DEMANDE D'INVITATION
                  </>
                )}
              </button>

            </form>

            {/* Simulated Live Pitch Blueprint / 5 cols */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Recipient speaking package breakdown */}
              <div className="bg-linear-to-br from-rose-500/10 via-stone-950 to-stone-950 border border-rose-500/15 rounded-2xl p-6 space-y-5">
                <div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded uppercase">
                    Offre Recommandée
                  </span>
                  <h3 className="text-xl font-bold uppercase tracking-tight text-stone-100 mt-2 font-mono">
                    {currentPackage.tier}
                  </h3>
                  <p className="text-xs text-stone-400 font-sans mt-1">
                    Estimation du format basé sur votre type de budget de collaboration.
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-stone-803 border-dashed">
                  <div className="text-xs text-stone-400 font-mono">
                    <span className="text-stone-500 uppercase font-bold text-[10px] block mb-1">Durée d'exécution conseillée :</span>
                    {currentPackage.estHours}
                  </div>

                  <div className="space-y-2">
                    <span className="text-stone-500 uppercase font-bold text-[10px] block">Services Inclus :</span>
                    {currentPackage.features.map((feat, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start text-xs text-stone-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-stone-900/40 p-4 rounded-xl text-[11px] font-mono text-stone-400 leading-relaxed">
                  💡 <b className="text-stone-200">Bany Talks Media Group :</b> Les frais de transport (train/avion) et l'hébergement (hôtel 4★ minimum) depuis Paris sont à la charge de l'organisateur de l'événement.
                </div>
              </div>

              {/* Google Sheets Synchronization Control Panel */}
              <div className="bg-stone-950 border border-stone-850 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-900 pb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-rose-500 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Google Sheets Sync
                  </span>
                  {user && (
                    <button 
                      onClick={handleGoogleLogout}
                      className="text-[9px] font-mono uppercase bg-stone-900 hover:bg-stone-850 text-stone-400 hover:text-stone-200 px-2 py-0.5 rounded transition cursor-pointer"
                    >
                      Déconnexion
                    </button>
                  )}
                </div>

                {!user ? (
                  <div className="space-y-3">
                    <p className="text-xs text-stone-400 font-sans leading-relaxed">
                      Connectez votre compte Google pour sauvegarder automatiquement chaque demande d'invitation directement dans une feuille de calcul Sheets.
                    </p>
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="w-full flex items-center justify-center gap-2.5 py-2.5 bg-white hover:bg-stone-200 text-stone-950 font-bold font-mono text-xs rounded-xl transition cursor-pointer"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                      </svg>
                      Connexion Google Sheets
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      {user.photoURL ? (
                        <img referrerPolicy="no-referrer" src={user.photoURL} alt={user.displayName || ''} className="w-5 h-5 rounded-full border border-stone-800" />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-500 font-bold flex items-center justify-center text-[10px]">{user.displayName?.[0] || 'U'}</div>
                      )}
                      <span className="text-xs font-mono text-stone-300 font-bold truncate">
                        {user.displayName || user.email}
                      </span>
                    </div>

                    {!spreadsheetId ? (
                      <div className="space-y-3 pt-2 border-t border-stone-900">
                        <p className="text-[11px] text-stone-400 font-sans leading-relaxed">
                          Sélectionnez une option pour configurer la feuille cible :
                        </p>
                        <button
                          type="button"
                          onClick={handleCreateSheet}
                          disabled={syncingSheets}
                          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-rose-500 hover:bg-rose-400 disabled:bg-stone-800 text-stone-950 font-bold font-mono text-[10px] rounded-lg transition"
                        >
                          {syncingSheets ? (
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-stone-950 border-t-transparent animate-spin" />
                          ) : (
                            "🪄 CRÉER FEUILLE AUTOMATIQUEMENT"
                          )}
                        </button>

                        <div className="relative flex items-center justify-center border-t border-stone-900 my-4">
                          <span className="absolute bg-stone-950 px-2 text-[9px] font-mono text-stone-500 tracking-wider">OU EXPORT EXISTANT</span>
                        </div>

                        <div className="space-y-2">
                          <input
                            type="text"
                            value={manualInputSheetId}
                            onChange={(e) => setManualInputSheetId(e.target.value)}
                            placeholder="Coller l'URL ou ID de feuille..."
                            className="w-full px-3 py-1.5 bg-stone-900 border border-stone-800 focus:border-rose-500 rounded-lg text-[11px] font-mono text-stone-350 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleConnectSheet}
                            disabled={syncingSheets}
                            className="w-full py-2 bg-stone-800 hover:bg-stone-750 disabled:bg-stone-900 border border-stone-800 text-stone-300 font-bold font-mono text-[10px] rounded-lg transition"
                          >
                            CONNECTER CETTE FEUILLE
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 pt-2 border-t border-stone-900">
                        <div className="bg-stone-900 border border-stone-850 p-3 rounded-xl space-y-1.5">
                          <span className="text-[9px] font-mono text-stone-500 font-bold uppercase tracking-widest block">STATUT DE LIAISON</span>
                          <span className="text-xs text-stone-300 font-bold font-mono block truncate">
                            {spreadsheetTitle || 'Feuille Active'}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono block truncate">
                            ID: {spreadsheetId.slice(0, 8)}...{spreadsheetId.slice(-8)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={spreadsheetUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-1 py-2 bg-rose-500 hover:bg-rose-400 text-stone-950 text-center font-bold font-mono text-[10px] rounded-lg transition"
                          >
                            OUVRIR SHEET ↗
                          </a>
                          <button
                            type="button"
                            onClick={handleClearSpreadsheet}
                            className="py-2 bg-stone-900 hover:bg-stone-850 border border-stone-800 text-rose-400 hover:text-rose-350 font-bold font-mono text-[10px] rounded-lg transition"
                          >
                            DÉTACHER LA FEUILLE
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {sheetsError && (
                  <p className="text-[10px] font-mono text-rose-400 leading-relaxed pt-2 border-t bg-rose-500/5 p-2.5 rounded-lg border border-rose-500/10">
                    ⚠️ {sheetsError}
                  </p>
                )}
              </div>

              {/* Direct channels widget */}
              <div className="bg-stone-950 border border-stone-850 rounded-2xl p-5 space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 block">Autres Canaux</span>
                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <a 
                    href="mailto:contact@banytalks.com" 
                    className="flex items-center gap-2 p-3 bg-stone-900 rounded-xl hover:bg-stone-850 transition text-stone-300 hover:text-stone-100 border border-stone-850"
                  >
                    <Mail className="w-4 h-4 text-rose-500" />
                    <span>Email Direct</span>
                  </a>
                  <a 
                    href="https://wa.me/33600000000" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 p-3 bg-stone-900 rounded-xl hover:bg-stone-850 transition text-stone-300 hover:text-stone-100 border border-stone-850"
                  >
                    <Mail className="w-4 h-4 text-emerald-500" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
