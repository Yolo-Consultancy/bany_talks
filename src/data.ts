import { Episode, Book } from './types';

export const HOST_DETAILS = {
  name: 'Bany Talks',
  fullName: 'Banyabo Bigomokero',
  title: 'Hôte & Producteur Média',
  tagline: 'Une voix qui inspire une génération.',
  longBio: 'Bany est un entrepreneur congolais, stratège et fondateur du Yolo Group, avec une voix forte sur le business, l\'investissement et le développement en Afrique. Il est l\'hôte de Bany Talks, un podcast et programme télé dédié à des conversations locales, audacieuses et stratégiques pour l\'avenir du continent.',
  quote: 'La vraie valeur d’une histoire ne réside pas dans son point d’arrivée, mais dans la clarté des obstacles surmontés durant la transition.',
  avatar: '/src/assets/images/bigo.png',
  aboutpicture: '/src/assets/images/bigo_about.jpg',
  statistics: [
    { label: 'Auditeurs Mensuels', value: '450K+' },
    { label: 'Épisodes Sortis', value: '124' },
    { label: 'Histoires Inspirantes', value: '2.5M+' },
    { label: 'Note Moyenne (Spotify)', value: '4.9/5' }
  ],
  socialLinks: {
    youtube: 'https://youtube.com',
    spotify: 'https://spotify.com',
    apple: 'https://podcasts.apple.com',
    instagram: 'https://instagram.com',
    tiktok: 'https://tiktok.com',
    whatsapp: 'https://wa.me/33600000000'
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
    thumbnail: '/src/assets/images/guest_founder_1779362525327.png',
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
      avatar: '/src/assets/images/guest_founder_1779362525327.png',
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
    thumbnail: '/src/assets/images/guest_creator_1779362546167.png',
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
      avatar: '/src/assets/images/guest_creator_1779362546167.png',
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
    thumbnail: '/src/assets/images/guest_executive_1779362567789.png',
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
      avatar: '/src/assets/images/guest_executive_1779362567789.png',
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
  { year: '2021', title: 'Le Premier Micro', desc: 'Bany lance les émissions de sa propre chambre avec des invités locaux branchés.' },
  { year: '2022', title: 'Audience Explosive', desc: 'Le cap des 100K téléchargements cumulés est franchi grâce à des interviews franches de créateurs.' },
  { year: '2023', title: 'Studio Bany Talks', desc: 'Inauguration du studio professionnel à Paris et passage aux diffusions de haute qualité sur YouTube.' },
  { year: '2024', title: 'Invités de Prestige', desc: 'Entrée des PDG fondateurs du CAC40 et d’investisseurs légendaires de la tech dans l’émission.' },
  { year: '2025', title: 'Référence Européenne', desc: 'Bany Talks élue l’une des émissions de podcasts francophones les plus décisives de la décennie.' }
];

export const FREQUENT_EVENT_TYPES = [
  'Conférence Keynote d’Inspiration',
  'Animation de Table Ronde / Masterclass',
  'Interview Live Publique sur Scène',
  'Consulting de Marque & Direction Artistique Média',
  'Épisode Podcast Sponsorisé Sur Mesure'
];

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

