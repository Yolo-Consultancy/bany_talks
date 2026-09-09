import { Episode, Book } from './types';
import bigo from './assets/images/bigo.png';
import banyAbout from './assets/images/bigo_about.jpg';
import guestFounder from './assets/images/guest_founder_1779362525327.png';
import guestCreator from './assets/images/guest_creator_1779362546167.png';
import guestExecutive from './assets/images/guest_executive_1779362567789.png';

export const HOST_DETAILS = {
  name: 'Bany Experience',
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
    richDescription: 'Derrière les vues et l’algorithme se cache une équation psychologique redoutée par de nombreux créateurs. Kélian Koffi prend le micro de Bany Experience pour un épisode introspectif où il explore comment il a converti son audience de 2M+ d’abonnés en une structure d’investissement diversifiée dans le commerce physique et l’immobilier locatif tout en préservant sa clarté mentale.',
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
    richDescription: 'De la restructuration d’entreprises en péril aux négociations d’accords industriels stratégiques, Antoine Dupont décrypte pour Bany Experience la psychologie des tensions relationnelles extrêmes. Un cours magistral sur la persuasion, l’intelligence émotionnelle, et l’art subtil de faire céder l’adversaire tout en le laissant sauvegarder la face.',
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
    title: 'De Bany Experience à BTX',
    desc: 'Bany lance Bany Experience pour donner la parole aux entrepreneurs, dirigeants et décideurs. Le projet évolue progressivement vers BTX, un écosystème consacré au business, à l’économie, à l’entrepreneuriat et à l’investissement.',
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
  'BTX – Participer à un épisode',
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
  description: string;
  cta: string;
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
    introTitle: 'Conseil / Consultance',
    intro: 'Trois formats pour clarifier une décision, structurer une mission ou accompagner dans la durée.',
    note: 'Aucun prix n’est affiché à ce stade. La proposition financière vient après cadrage.',
    cta: 'Demander une session',
    dateLabel: 'Échéance',
    dateRequired: false,
    showFormulas: true,
    formulaLabel: 'Formule',
    briefPlaceholder: 'Problématique, objectif, contexte…',
  },
  'Keynote / Conférence': {
    introTitle: 'Keynote / Conférence',
    intro: 'Des formats de prise de parole adaptés au message, au public et à l’ambition de votre événement.',
    cta: 'Inviter Bany',
    dateLabel: 'Date souhaitée',
    dateRequired: true,
    showFormulas: true,
    formulaLabel: 'Formule',
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
    introTitle: 'Panel / Modération',
    intro: 'Participation, modération ou conception éditoriale complète d’une conversation.',
    cta: 'Proposer un panel',
    dateLabel: 'Date souhaitée',
    dateRequired: true,
    showFormulas: true,
    formulaLabel: 'Formule',
    briefPlaceholder: 'Thème du panel, intervenants, format attendu…',
  },
  'BTX – Participer à un épisode': {
    introTitle: 'BTX — Participer à un épisode',
    intro: 'Proposez un invité, une histoire ou un sujet pour BTX.',
    cta: 'Proposer un invité',
    dateLabel: 'Échéance',
    dateRequired: false,
    showFormulas: true,
    formulaLabel: 'Formule',
    briefPlaceholder: 'Personne proposée, parcours, intérêt de la conversation pour l’audience…',
  },
  'BTX – Partenariat média': {
    introTitle: 'BTX — Partenariat média',
    intro: 'Épisode partenaire, campagne ou dispositif sur mesure autour de BTX.',
    cta: 'Discuter d’un épisode partenaire',
    dateLabel: 'Échéance',
    dateRequired: false,
    showFormulas: true,
    formulaLabel: 'Formule',
    briefPlaceholder: 'Marque, objectifs de visibilité, audience cible…',
  },
  'Partenariat / Collaboration': {
    introTitle: 'Partenariat / Collaboration',
    intro: 'Des collaborations ponctuelles aux partenariats stratégiques de plus long terme.',
    cta: 'Proposer une collaboration',
    dateLabel: 'Échéance éventuelle',
    dateRequired: false,
    showFormulas: true,
    formulaLabel: 'Formule',
    briefTitle: 'Votre proposition',
    briefPlaceholder:
      'Nature du partenariat, objectifs, ce que vous proposez, ce que vous attendez de Bany / BTX, budget indicatif…',
  },
  'Autre demande': {
    introTitle: 'Autre demande',
    intro: 'Votre besoin ne correspond à aucune catégorie ? Présentez-nous simplement votre projet.',
    cta: 'Envoyer la demande',
    dateLabel: 'Échéance',
    dateRequired: false,
    showFormulas: true,
    formulaLabel: 'Formule',
    briefPlaceholder: 'Décrivez votre projet, votre objectif et le type de collaboration envisagé…',
  },
};

/** Formules distinctes par type de demande */
export const INVITE_PACKAGES_BY_EVENT: Partial<
  Record<InviteEventType, Partial<Record<InviteFormulaTier, InvitePackage>>>
> = {
  'Conseil / Consultance': {
    essentiel: {
      tier: 'Session stratégique',
      description:
        'Une session ponctuelle de travail pour analyser une problématique précise, challenger une décision et identifier rapidement les options et prochaines actions. Adaptée aux dirigeants et entrepreneurs qui ont besoin d’un regard externe sur un enjeu clairement défini.',
      cta: 'Demander une session',
      accent: ACCENT_ESSENTIEL,
    },
    standard: {
      tier: 'Mission de conseil',
      description:
        'Une mission structurée autour d’une problématique, d’objectifs et de livrables définis ensemble. Elle peut inclure diagnostic, recherche, analyse, recommandations et plan d’action selon les besoins de l’organisation.',
      cta: 'Discuter d’une mission',
      accent: ACCENT_STANDARD,
    },
    premium: {
      tier: 'Accompagnement stratégique',
      description:
        'Un accompagnement dans la durée pour aider un dirigeant ou une organisation à prendre de meilleures décisions, suivre ses priorités et ajuster sa stratégie au fur et à mesure de l’exécution.',
      cta: 'Explorer un accompagnement',
      accent: ACCENT_PREMIUM,
    },
  },
  'Keynote / Conférence': {
    essentiel: {
      tier: 'Keynote',
      description:
        'Une intervention préparée autour d’un message fort et adaptée au thème, au contexte et au public de l’événement. Idéale pour apporter une perspective, provoquer la réflexion et installer une idée centrale.',
      cta: 'Inviter Bany',
      accent: ACCENT_ESSENTIEL,
    },
    standard: {
      tier: 'Keynote + échange',
      description:
        'Une keynote suivie d’un moment interactif avec le public ou un modérateur. Ce format permet d’approfondir les idées présentées et de transformer l’intervention en véritable conversation.',
      cta: 'Organiser une intervention',
      accent: ACCENT_STANDARD,
    },
    premium: {
      tier: 'Expérience sur mesure',
      description:
        'Une intervention entièrement conçue autour des objectifs de l’événement, pouvant combiner keynote, échange, fireside chat ou rencontre avec certains participants. Pensée pour les événements qui veulent faire de l’intervention un véritable temps fort.',
      cta: 'Construire une intervention sur mesure',
      accent: ACCENT_PREMIUM,
    },
  },
  'Panel / Modération': {
    essentiel: {
      tier: 'Participation à un panel',
      description:
        'Bany intervient comme panéliste pour apporter son regard, son expérience et son analyse sur une thématique liée au business, à l’entrepreneuriat, à l’investissement ou aux transformations africaines.',
      cta: 'Proposer un panel',
      accent: ACCENT_ESSENTIEL,
    },
    standard: {
      tier: 'Modération',
      description:
        'Une préparation en amont puis une conduite dynamique de la conversation afin de faire émerger les idées essentielles, maintenir le rythme et créer de véritables échanges entre les intervenants et le public.',
      cta: 'Confier la modération à Bany',
      accent: ACCENT_STANDARD,
    },
    premium: {
      tier: 'Modération éditoriale',
      description:
        'Une modération plus approfondie qui intègre recherche, conception de l’angle, préparation des questions et structuration complète de la conversation. Adaptée aux panels où la qualité du contenu est aussi importante que la conduite de la scène.',
      cta: 'Construire la modération',
      accent: ACCENT_PREMIUM,
    },
  },
  'BTX – Participer à un épisode': {
    standard: {
      tier: 'Proposition éditoriale BTX',
      description:
        'Vous souhaitez proposer un invité, une histoire ou un sujet à BTX ? Présentez-nous la personne, son parcours et l’intérêt de la conversation pour notre audience. Les propositions sont étudiées selon leur pertinence éditoriale et ne garantissent pas automatiquement une participation.',
      cta: 'Proposer un invité',
      accent: ACCENT_STANDARD,
    },
  },
  'BTX – Partenariat média': {
    essentiel: {
      tier: 'Épisode partenaire',
      description:
        'Un épisode BTX conçu avec une entreprise ou une institution autour d’un sujet pertinent pour l’audience, avec préparation éditoriale, production, diffusion et déclinaisons courtes issues de la conversation.',
      cta: 'Discuter d’un épisode partenaire',
      accent: ACCENT_ESSENTIEL,
    },
    standard: {
      tier: 'Campagne BTX',
      description:
        'Un dispositif éditorial combinant plusieurs contenus et points de contact pour porter un message dans la durée. Il peut associer épisode, formats courts, diffusion renforcée et autres activations sur les plateformes BTX.',
      cta: 'Construire une campagne BTX',
      accent: ACCENT_STANDARD,
    },
    premium: {
      tier: 'Partenariat sur mesure',
      description:
        'Une collaboration média conçue spécifiquement autour des objectifs du partenaire et pouvant mobiliser plusieurs formats de l’écosystème BTX, de la série de contenus aux événements, lives ou campagnes multi-plateformes.',
      cta: 'Discuter d’un partenariat sur mesure',
      accent: ACCENT_PREMIUM,
    },
  },
  'Partenariat / Collaboration': {
    essentiel: {
      tier: 'Collaboration ponctuelle',
      description:
        'Une collaboration autour d’une initiative précise et limitée dans le temps : événement, campagne, atelier, programme spécial ou autre action construite autour d’un objectif commun.',
      cta: 'Proposer une collaboration',
      accent: ACCENT_ESSENTIEL,
    },
    standard: {
      tier: 'Partenariat de projet',
      description:
        'Une collaboration structurée pour concevoir et mettre en œuvre ensemble un projet ou une initiative, avec des objectifs, responsabilités, activités et résultats clairement définis.',
      cta: 'Discuter d’un projet',
      accent: ACCENT_STANDARD,
    },
    premium: {
      tier: 'Partenariat stratégique',
      description:
        'Une relation de plus long terme permettant de construire plusieurs initiatives autour d’intérêts communs et de mobiliser, selon les besoins, les différentes expertises et plateformes de l’écosystème Bany, BTX ou Yolo.',
      cta: 'Explorer un partenariat stratégique',
      accent: ACCENT_PREMIUM,
    },
  },
  'Autre demande': {
    standard: {
      tier: 'Autre demande',
      description:
        'Votre besoin ne correspond à aucune des catégories proposées ? Présentez-nous simplement votre projet, votre objectif et le type de collaboration envisagé. Notre équipe déterminera avec vous le format le plus adapté.',
      cta: 'Envoyer la demande',
      accent: ACCENT_STANDARD,
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

  return packages[tier] ?? packages.standard ?? packages.essentiel ?? packages.premium ?? null;
}

export function getInviteFormulaOptions(
  eventType: string
): { value: InviteFormulaTier; label: string }[] {
  const type = (FREQUENT_EVENT_TYPES as readonly string[]).includes(eventType)
    ? (eventType as InviteEventType)
    : FREQUENT_EVENT_TYPES[0];
  const packages = INVITE_PACKAGES_BY_EVENT[type];
  if (!packages) return [];

  return (['essentiel', 'standard', 'premium'] as InviteFormulaTier[])
    .filter((value) => Boolean(packages[value]))
    .map((value) => ({
      value,
      label: packages[value]!.tier,
    }));
}

export function getDefaultInviteFormula(eventType: string): InviteFormulaTier {
  const options = getInviteFormulaOptions(eventType);
  return options[0]?.value ?? 'standard';
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

