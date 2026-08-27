import { Episode, Book } from './types';
import bigo from './assets/images/bigo.png';
import banyAbout from './assets/images/bigo_about.jpg';
import guestFounder from './assets/images/guest_founder_1779362525327.png';
import guestCreator from './assets/images/guest_creator_1779362546167.png';
import guestExecutive from './assets/images/guest_executive_1779362567789.png';

export const HOST_DETAILS = {
  name: 'Bany Talks',
  fullName: 'Banyabo Bigomokero',
  title: 'Hôte & Producteur Média',
  tagline: 'Une voix qui inspire une génération.',
  longBio: [
    'Banyabo Bigomokero est consultant, entrepreneur et homme de média congolais.',
    'Son parcours se situe à la croisée du développement, du conseil, de l’entrepreneuriat et des médias. Après plusieurs expériences dans la gestion de projets, la transformation numérique et l’accompagnement d’organisations, il fonde Yolo Group of Companies et développe parallèlement un écosystème média consacré au business, à l’entrepreneuriat et à l’investissement.',
    'À travers ses activités, ses interventions et BTX, il poursuit une même ambition : mieux comprendre les réalités africaines, contribuer à construire des solutions et rendre les enjeux économiques accessibles au plus grand nombre.',
  ],
  quote: 'Comprendre les réalités. Construire des solutions. Transmettre ce que j’apprends. ',
  avatar: bigo,
  aboutpicture: banyAbout,
  /** Vidéo hero en boucle — déposer le fichier dans public/ (ex. public/hero.mp4) */
  heroVideo: '/hero.mp4',
  heroPoster: banyAbout,
  statistics: [
    { label: 'Auditeurs Mensuels', value: '450K+' },
    { label: 'Épisodes Sortis', value: '124' },
    { label: 'Histoires Inspirantes', value: '2.5M+' },
    { label: 'Note Moyenne (Spotify)', value: '4.9/5' }
  ],
  socialLinks: {
    youtube: 'https://youtube.com/@banybanyabo',
    instagram: 'https://www.instagram.com/banyofficial',
    linkedin: 'https://www.linkedin.com/in/bigomokero-banyabo?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
    tiktok: 'https://www.tiktok.com/@bany_officiel?_r=1&_t=ZS-98POYe9ZAKQ',
    whatsapp: 'https://wa.me/813622975',
  }
};

export const EPISODES: Episode[] = [
  {
    id: 'ep-124',
    number: 124,
    title: 'Bâtir un empire SaaS à 26 ans : Les vérités du bootstrapped',
    description: 'Julie Vasseur, fondatrice de Bloomflow, dévoile sans tabou les secrets d’une hyper-croissance autofinancée, de la première ligne de code aux 5M€ de revenus annuels récurrents.',
    richDescription: 'Comment construire une licorne rentable sans lever le moindre centime auprès de fonds de capital-risque ? Dans cet épisode hautement technique mais accessible, Julie Vasseur nous explique ses principes d’acquisition client organique, de minimalisme d’équipe et comment elle fait face à la solitude du fondateur. Elle aborde la transition de l’agence vers le produit SaaS et donne son plan d’attaque complet structuré mois par mois après 3 ans d’expérience.',
    duration: '01:14:22',
    publishDate: '21 Mai 2026',
    category: 'Émissions',
    thumbnail: guestFounder,
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder responsive video embed
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Functional beautiful audio tracking
    viewsCount: 14500,
    likesCount: 920,
    spotifyUrl: 'https://spotify.com',
    applePodcastsUrl: 'https://podcasts.apple.com',
    guest: {
      id: 'guest-julie',
      name: 'Julie Vasseur',
      role: 'Fondatrice & Directrice Générale',
      company: 'Bloomflow',
      bio: 'Julie est une ancienne développeuse et designer convertie en entrepreneuse de choc. Diplômée de l’École Polytechnique, elle a autofinancé son SaaS marketing de 0 à 5M€ d’ARR en seulement 3 ans, en s’appuyant exclusivement sur le Product-Led Growth.',
      avatar: guestFounder,
      socials: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com'
      }
    },
    timestamps: [
      { time: '00:00', seconds: 0, topic: 'Introduction & Genèse de Bloomflow' },
      { time: '10:45', seconds: 645, topic: 'L’art du Bootstrapping : Avantages et risques de l’autofinancement' },
      { time: '24:12', seconds: 1452, topic: 'Comment décrocher ses 100 premiers clients B2B sans relations' },
      { time: '41:15', seconds: 2475, topic: 'Le management minimaliste : Pourquoi refuser la croissance d’équipe hâtive' },
      { time: '58:30', seconds: 3510, topic: 'Gestion du burn-out et rythme de vie sain en hyper-croissance' },
      { time: '01:08:50', seconds: 4130, topic: 'La vision court-terme vs long-terme : Prochaines étapes de Bloomflow' }
    ],
    quotes: [
      {
        text: 'La meilleure façon de valider un besoin n’est pas de faire répondre à un questionnaire, c’est d’envoyer une facture de pré-vente.',
        author: 'Julie Vasseur'
      },
      {
        text: 'Chaque recrutement non essentiel est une dette organisationnelle que vous payez au prix fort en flexibilité opérationnelle.',
        author: 'Julie Vasseur'
      }
    ]
  },
  {
    id: 'ep-123',
    number: 123,
    title: 'Création de contenu, santé mentale et liberté financière',
    description: 'Le créateur de tendances Kélian Koffi partage sa vision brutale de l’économie de l’attention, la gestion de sa marque personnelle et la transition d’influenceur média à investisseur aguerri.',
    richDescription: 'Derrière les vues et l’algorithme se cache une équation psychologique redoutée par de nombreux créateurs. Kélian Koffi prend le micro de Bany Talks pour un épisode introspectif où il explore comment il a converti son audience de 2M+ d’abonnés en une structure d’investissement diversifiée dans le commerce physique et l’immobilier locatif tout en préservant sa clarté mentale.',
    duration: '58:45',
    publishDate: '14 Mai 2026',
    category: 'Podcasts',
    thumbnail: guestCreator,
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    viewsCount: 28400,
    likesCount: 1950,
    spotifyUrl: 'https://spotify.com',
    applePodcastsUrl: 'https://podcasts.apple.com',
    guest: {
      id: 'guest-kelian',
      name: 'Kélian Koffi',
      role: 'Créateur de contenu & Investisseur',
      bio: 'Kélian est l’un des créateurs les plus respectés de francophonie. Connu pour ses vlogs immersifs sur l’entrepreneuriat et le voyage de marque, il anime aujourd’hui plusieurs incubateurs d’écom-créateurs et gère un portefeuille immobilier estimé à plusieurs millions d’euros.',
      avatar: guestCreator,
      socials: {
        instagram: 'https://instagram.com',
        youtube: 'https://youtube.com',
        tiktok: 'https://tiktok.com'
      }
    },
    timestamps: [
      { time: '00:00', seconds: 0, topic: 'Le déclic : Passer des likes à l’actif financier réel' },
      { time: '12:15', seconds: 735, topic: 'L’économie des créateurs en 2026 : Le mythe de l’ad-sense YouTube' },
      { time: '23:42', seconds: 1422, topic: 'La crise d’identité face aux commentaires d’audience' },
      { time: '38:10', seconds: 2290, topic: 'Stratégies d’investissement immobilier pour profils à flux de trésorerie instables' },
      { time: '51:05', seconds: 3065, topic: 'Routine matinale et discipline de fer : L’arme secrète de Kélian' }
    ],
    quotes: [
      {
        text: 'N’utilisez pas les réseaux pour flatter votre ego. Utilisez-les pour financer votre indépendance physique.',
        author: 'Kélian Koffi'
      }
    ]
  },
  {
    id: 'ep-122',
    number: 122,
    title: 'Négociation de crise & Leadership d’exception',
    description: 'Antoine Dupont, négociateur chevronné et consultant en climat social, livre ses techniques de résolution de conflits majeurs et d’organisation du leadership de crise.',
    richDescription: 'De la restructuration d’entreprises en péril aux négociations d’accords industriels stratégiques, Antoine Dupont décrypte pour Bany Talks la psychologie des tensions relationnelles extrêmes. Un cours magistral sur la persuasion, l’intelligence émotionnelle, et l’art subtil de faire céder l’adversaire tout en le laissant sauvegarder la face.',
    duration: '01:28:10',
    publishDate: '07 Mai 2026',
    category: 'Podcasts',
    thumbnail: guestExecutive,
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    viewsCount: 38900,
    likesCount: 3120,
    spotifyUrl: 'https://spotify.com',
    applePodcastsUrl: 'https://podcasts.apple.com',
    guest: {
      id: 'guest-antoine',
      name: 'Antoine Dupont',
      role: 'Ancien Négociateur Stratégique & Écrivain',
      company: 'Alliance Horizon',
      bio: 'Antoine Dupont a mené des cellules d’arbitrage d’affaires de haut vol. Auteur du best-seller « Le Silence Gagne Toujours », il conseille les comités exécutifs du CAC 40 sur l’alignement culturel et la gestion de crise publique.',
      avatar: guestExecutive,
      socials: {
        linkedin: 'https://linkedin.com'
      }
    },
    timestamps: [
      { time: '00:00', seconds: 0, topic: 'La psychologie du silence en négociation' },
      { time: '15:20', seconds: 920, topic: 'Technique d’ancrage mental : Rester de marbre face aux agressions verbales' },
      { time: '34:40', seconds: 2080, topic: 'La méthode des « Petits Pas » pour débloquer les situations d’impasse' },
      { time: '55:10', seconds: 3310, topic: 'Exemples réels : Arbitrage de conflits industriels à 100M€' },
      { time: '01:15:30', seconds: 4530, topic: 'Comment cultiver un leadership serein au quotidien' }
    ],
    quotes: [
      {
        text: 'Celui qui commence à crier a déjà perdu la partie rationnelle de l’argumentation. Le silence est l’arme absolue.',
        author: 'Antoine Dupont'
      },
      {
        text: 'La confiance se gagne en gouttes d’eau et se perd par seaux entiers.',
        author: 'Antoine Dupont'
      }
    ]
  }
];

export const TIMELINE_MILESTONES = [
  {
    year: 'Aujourd’hui',
    title: 'Construire une voix africaine du business',
    desc: 'À travers le conseil, l’entrepreneuriat, les médias et la prise de parole, Bany construit progressivement une plateforme au service d’une ambition : mieux comprendre les transformations économiques africaines et contribuer à ceux qui les rendent possibles.',
  },
  {
    year: 'Média',
    title: 'De Bany Talks à BTX',
    desc: 'Bany lance Bany Talks pour donner la parole aux entrepreneurs, dirigeants et décideurs. Le projet évolue progressivement vers BTX, un écosystème consacré au business, à l’économie, à l’entrepreneuriat et à l’investissement.',
  },
  {
    year: 'Entrepreneuriat',
    title: 'Création de Yolo Group',
    desc: 'Il fonde Yolo Group of Companies, à travers lequel il développe et expérimente plusieurs activités entrepreneuriales dans des secteurs différents.',
  },
  {
    year: 'Conseil',
    title: 'Stratégie, recherche & accompagnement',
    desc: 'Bany développe une activité de conseil autour de la stratégie, de la gestion de projets, du développement du secteur privé, de l’entrepreneuriat et de la transformation numérique.',
  },
  {
    year: 'Médias & numérique',
    title: 'Transformation des médias',
    desc: 'Il travaille sur des problématiques liées aux médias, aux nouveaux environnements numériques et à la transformation digitale, notamment dans le cadre de programmes accompagnant des organisations médiatiques.',
  },
  {
    year: 'Expérience internationale',
    title: 'Gestion de projets & développement',
    desc: 'Son parcours professionnel l’amène ensuite à travailler sur des programmes de développement et à évoluer dans des environnements internationaux, notamment en Afrique de l’Est.',
  },
  {
    year: 'Premières années',
    title: 'Créativité & communication',
    desc: 'La musique constitue l’un des premiers terrains d’expression de Bany. Une expérience qui lui apprend très tôt la création, la scène, la communication et la construction d’une audience.',
  },
];

export const FREQUENT_EVENT_TYPES = [
  'Conseil / Consultance',
  'Keynote / Conférence',
  'Panel / Modération',
  'BTX – Partenariat média',
  'Partenariat / Collaboration',
  'Autre demande',
] as const;

export type InviteEventType = (typeof FREQUENT_EVENT_TYPES)[number];
export type InviteFormulaTier = 'essentiel' | 'standard' | 'premium';
export type InviteExtraField = 'city' | 'eventFormat' | 'audience' | 'theme';

export type InvitePackageAccent = {
  text: string;
  textMuted: string;
  border: string;
  borderSoft: string;
  icon: string;
  label: string;
  underline: string;
};

export type InvitePackage = {
  tier: string;
  features: string[];
  estHours?: string;
  accent: InvitePackageAccent;
};

export type InviteTypeConfig = {
  introTitle?: string;
  intro?: string;
  note?: string;
  cta: string;
  dateLabel: string;
  dateRequired: boolean;
  showFormulas: boolean;
  formulaLabel?: string;
  extraFields?: InviteExtraField[];
  themes?: string[];
  briefTitle?: string;
  briefPlaceholder?: string;
};

const ACCENT_ESSENTIEL: InvitePackageAccent = {
  text: 'text-stone-300',
  textMuted: 'text-stone-500',
  border: 'border-stone-500',
  borderSoft: 'border-stone-500/45',
  icon: 'text-stone-400',
  label: 'text-stone-500',
  underline: 'border-stone-400',
};

const ACCENT_STANDARD: InvitePackageAccent = {
  text: 'text-rose-400',
  textMuted: 'text-rose-400/70',
  border: 'border-rose-500',
  borderSoft: 'border-rose-500/45',
  icon: 'text-rose-500/80',
  label: 'text-rose-400/80',
  underline: 'border-rose-500',
};

const ACCENT_PREMIUM: InvitePackageAccent = {
  text: 'text-rose-300',
  textMuted: 'text-rose-300/70',
  border: 'border-rose-300',
  borderSoft: 'border-rose-300/50',
  icon: 'text-rose-300',
  label: 'text-rose-300/90',
  underline: 'border-rose-300',
};

export const INVITE_TYPE_CONFIG: Record<InviteEventType, InviteTypeConfig> = {
  'Conseil / Consultance': {
    introTitle: 'Conseil & accompagnement',
    intro:
      'Stratégie, développement d’entreprise, entrepreneuriat, études, programmes, communication stratégique ou accompagnement spécifique.',
    note: 'Aucun prix n’est affiché à ce stade. La proposition financière vient après cadrage.',
    cta: 'Demander un échange',
    dateLabel: 'Échéance',
    dateRequired: false,
    showFormulas: true,
    formulaLabel: 'Format',
    briefPlaceholder: 'Problématique, objectif, contexte…',
  },
  'Keynote / Conférence': {
    introTitle: 'Prise de parole',
    intro: 'Keynote ou conférence autour d’une thématique convenue.',
    cta: 'Soumettre une invitation',
    dateLabel: 'Date souhaitée',
    dateRequired: true,
    showFormulas: true,
    formulaLabel: 'Format',
    extraFields: ['city', 'eventFormat', 'audience', 'theme'],
    themes: [
      'Business & entrepreneuriat',
      'Investissement & économie',
      'PME & croissance',
      'Jeunesse & compétences',
      'Médias & transformation numérique',
      'Entreprendre en Afrique',
    ],
    briefPlaceholder: 'Contexte de l’événement, attentes, message clé…',
  },
  'Panel / Modération': {
    introTitle: 'Panel & modération',
    intro: 'Participation, préparation éditoriale ou conduite de conversation.',
    cta: 'Soumettre une invitation',
    dateLabel: 'Date souhaitée',
    dateRequired: true,
    showFormulas: true,
    formulaLabel: 'Format',
    briefPlaceholder: 'Thème du panel, intervenants, format attendu…',
  },
  'BTX – Partenariat média': {
    introTitle: 'Partenariat média BTX',
    intro: 'Épisode, campagne ou dispositif sur mesure autour de la marque BTX.',
    cta: 'Discuter d’un partenariat',
    dateLabel: 'Échéance',
    dateRequired: false,
    showFormulas: true,
    formulaLabel: 'Offre',
    briefPlaceholder: 'Marque, objectifs de visibilité, audience cible…',
  },
  'Partenariat / Collaboration': {
    introTitle: 'Parlez-nous de votre idée',
    intro:
      'Organisation, nature du partenariat, objectifs, ce que vous proposez, ce que vous attendez de Bany / BTX, échéance éventuelle et budget indicatif facultatif.',
    cta: 'Envoyer la proposition',
    dateLabel: 'Échéance éventuelle',
    dateRequired: false,
    showFormulas: false,
    briefTitle: 'Votre proposition',
    briefPlaceholder:
      'Nature du partenariat, objectifs, ce que vous proposez, ce que vous attendez de Bany / BTX, budget indicatif…',
  },
  'Autre demande': {
    introTitle: 'Autre demande',
    intro: 'Décrivez votre besoin : nous reviendrons vers vous avec le format le plus adapté.',
    cta: 'Envoyer la demande',
    dateLabel: 'Échéance',
    dateRequired: false,
    showFormulas: false,
    briefPlaceholder: 'Décrivez votre besoin, le contexte et vos objectifs…',
  },
};

/** Formules distinctes par type de demande */
export const INVITE_PACKAGES_BY_EVENT: Partial<
  Record<InviteEventType, Record<InviteFormulaTier, InvitePackage>>
> = {
  'Conseil / Consultance': {
    essentiel: {
      tier: 'Session stratégique',
      features: [
        'Une intervention ponctuelle pour challenger une problématique ou une décision.',
      ],
      accent: ACCENT_ESSENTIEL,
    },
    standard: {
      tier: 'Mission ciblée',
      features: [
        'Un mandat défini autour d’un objectif, d’un livrable ou d’une problématique spécifique.',
      ],
      accent: ACCENT_STANDARD,
    },
    premium: {
      tier: 'Accompagnement',
      features: [
        'Une collaboration plus longue avec suivi et appui dans l’exécution.',
      ],
      accent: ACCENT_PREMIUM,
    },
  },
  'Keynote / Conférence': {
    essentiel: {
      tier: 'Intervention',
      features: ['Keynote ou conférence autour d’une thématique convenue.'],
      accent: ACCENT_ESSENTIEL,
    },
    standard: {
      tier: 'Intervention + échange',
      features: [
        'Keynote suivie d’une session Q&A, fireside chat ou échange avec le public.',
      ],
      accent: ACCENT_STANDARD,
    },
    premium: {
      tier: 'Expérience complète',
      features: [
        'Keynote + échange + session spécifique avec dirigeants, entrepreneurs ou participants.',
      ],
      accent: ACCENT_PREMIUM,
    },
  },
  'Panel / Modération': {
    essentiel: {
      tier: 'Panel',
      features: ['Participation comme panéliste ou intervenant.'],
      accent: ACCENT_ESSENTIEL,
    },
    standard: {
      tier: 'Modération',
      features: ['Préparation éditoriale et conduite du panel ou de la conversation.'],
      accent: ACCENT_STANDARD,
    },
    premium: {
      tier: 'Modération éditoriale',
      features: [
        'Recherche sur les intervenants, structuration de la conversation et modération approfondie.',
      ],
      accent: ACCENT_PREMIUM,
    },
  },
  'BTX – Partenariat média': {
    essentiel: {
      tier: 'Épisode partenaire',
      features: [
        'Concept et préparation éditoriale',
        'Enregistrement d’un épisode BTX',
        'Publication sur les plateformes BTX',
        'Extraits courts issus de l’épisode',
      ],
      accent: ACCENT_ESSENTIEL,
    },
    standard: {
      tier: 'Campagne BTX',
      features: [
        'Épisode partenaire',
        'Plusieurs contenus courts',
        'Diffusion renforcée sur les réseaux',
        'Mentions / intégration de marque',
        'Relais via les canaux BTX',
      ],
      accent: ACCENT_STANDARD,
    },
    premium: {
      tier: 'Partenariat sur mesure',
      features: [
        'Série de contenus',
        'Podcast / BTX Daily / BBM',
        'Événements et lives',
        'Distribution multi-plateforme',
        'Reporting',
        'Dispositif conçu sur mesure',
      ],
      accent: ACCENT_PREMIUM,
    },
  },
};

export function getInviteTypeConfig(eventType: string): InviteTypeConfig {
  const type = (FREQUENT_EVENT_TYPES as readonly string[]).includes(eventType)
    ? (eventType as InviteEventType)
    : FREQUENT_EVENT_TYPES[0];
  return INVITE_TYPE_CONFIG[type];
}

export function getInvitePackage(
  eventType: string,
  budgetRange: string
): InvitePackage | null {
  const type = (FREQUENT_EVENT_TYPES as readonly string[]).includes(eventType)
    ? (eventType as InviteEventType)
    : FREQUENT_EVENT_TYPES[0];

  const packages = INVITE_PACKAGES_BY_EVENT[type];
  if (!packages) return null;

  let tier: InviteFormulaTier = 'standard';
  if (budgetRange === 'essentiel' || budgetRange === 'under-3000') tier = 'essentiel';
  else if (budgetRange === 'premium' || budgetRange === 'above-5000') tier = 'premium';
  else tier = 'standard';

  return packages[tier];
}

export function getInviteFormulaOptions(
  eventType: string
): { value: InviteFormulaTier; label: string }[] {
  const type = (FREQUENT_EVENT_TYPES as readonly string[]).includes(eventType)
    ? (eventType as InviteEventType)
    : FREQUENT_EVENT_TYPES[0];
  const packages = INVITE_PACKAGES_BY_EVENT[type];
  if (!packages) return [];

  return (['essentiel', 'standard', 'premium'] as InviteFormulaTier[]).map((value) => ({
    value,
    label: packages[value].tier,
  }));
}

export const BOOKS: Book[] = [
  {
    id: 'book-attention',
    title: 'L’Empire de l’Attention',
    subtitle: 'Comment capter l’esprit d’une époque et fédérer des millions de passionnés.',
    author: 'Banyabo Bigomokero',
    description: 'Le tout premier ouvrage officiel de Banyabo Bigomokero. Un condensé d’analyses stratégiques et de techniques psychologiques tirées de 5 ans d’entretiens immersifs. Apprenez comment bâtir une présence magnétique, convertir la curiosité passive en loyauté inconditionnelle et transformer les médias modernes en vecteurs de liberté financière.',
    coverGradient: 'from-amber-600 via-stone-900 to-amber-950',
    category: 'Média & Business',
    publishedYear: '2025',
    pagesCount: 264,
    rating: 4.9,
    buyUrl: '#',
    highlights: [
      'Le switch d’attention passible à actif : comment transformer un simple clic en investissement intentionnel.',
      'Le secret de l’entretien sans filtre : poser des questions inconfortables avec totale bienveilliance.',
      'Les structures internes de valorisation d’audience sans dépendre des banques de régies publicitaires.'
    ]
  },
  {
    id: 'book-silence',
    title: 'Le Silence Gagne Toujours',
    subtitle: 'Négociation, influence émotionnelle et résolution des conflits de haute voltige.',
    author: 'Banyabo Bigomokero',
    description: 'Le deuxième livre d’élite écrit par Banyabo Bigomokero. Une exploration sans fard des techniques de négociation silencieuse, d’influence émotionnelle et de résolution de conflits de haute voltige, inspirées des récits de négociateurs d’élite et experts en relations de pouvoir reçus dans l’émission.',
    coverGradient: 'from-stone-900 via-stone-800 to-amber-900/60',
    category: 'Négociation & Leadership',
    publishedYear: '2025',
    pagesCount: 320,
    rating: 4.8,
    buyUrl: '#',
    highlights: [
      'La loi du silence stratégique : pourquoi se taire pendant 5 secondes force l’autre partie à capituler.',
      'Le désamorçage par l’empathie tactique : valider la colère d’autrui pour mieux la réorienter.',
      'Comment asseoir un statut de leader d’exception face à des dynamiques de pouvoir asymétriques.'
    ]
  }
];

