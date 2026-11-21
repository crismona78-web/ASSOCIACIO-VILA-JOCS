export type PageId =
  | 'inici'
  | 'ludoteca'
  | 'normativa'
  | 'galeria'
  | 'contacte';

export type GameTrack =
  | 'expert'
  | 'strategy'
  | 'wargame'
  | 'gateway';

export interface BoardGame {
  id: string;
  title: string;
  bestPlayers: string;
  recommendedPlayers: string;
  age: string;
  description: string;
  track: GameTrack;
  duration?: string;
}

export interface FeaturedGame {
  id: string;
  title: string;
  subtitle: string;
  players: string;
  age: string;
  duration: string;
  trackLabel: string;
  description: string;
  image: string;
  imageAlt: string;
  imageFit?: 'cover' | 'contain';
}

export interface PlayerTrack {
  id: string;
  index: string;
  title: string;
  audience: string;
  description: string;
  examples: string;
}

export interface GalleryPhoto {
  id: string;
  image: string;
  alt: string;
  caption: string;
  gameTag: string;
}

export interface RuleDocument {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  highlights: string[];
  externalUrl: string;
  fileName?: string;
}

export interface SiteData {
  home: {
    kicker: string;
    headline: string;
    introParagraph1: string;
    introParagraph2: string;
    primaryCta: string;
    secondaryCta: string;
    tabletopImage: string;
    tabletopImageAlt: string;
    tabletopImageCaption: string;
    quotaTitle: string;
    quotaNote: string;
    buildingSectionTitle: string;
    buildingSectionSubtitle: string;
    buildingImage: string;
    buildingImageAlt: string;
    buildingCaption: string;
    scheduleTitle: string;
    scheduleText: string;
    scheduleSubnote: string;
    tracksTitle: string;
    tracks: PlayerTrack[];
    tabletopHighlightsTitle: string;
    tabletopHighlightsSubtitle: string;
    featuredGames: FeaturedGame[];
  };
  ludotecaSection: {
    eyebrow: string;
    title: string;
    intro: string;
    noteBringYourOwn: string;
    games: BoardGame[];
  };
  funcionamentSection: {
    eyebrow: string;
    title: string;
    quotaImage: string;
    quotaImageAlt: string;
    associacioTitle: string;
    associacioBody: string;
    dirigitTitle: string;
    dirigitParagraphs: string[];
    dirigitImage: string;
    dirigitImageAlt: string;
    organitzacioTitle: string;
    organitzacioParagraphs: string[];
    organitzacioImage: string;
    organitzacioImageAlt: string;
    normativaTitle: string;
    normativaIntro: string;
    documents: RuleDocument[];
  };
  galeriaSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
    photos: GalleryPhoto[];
  };
  contacteSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
    email: string;
    phoneAdults: string;
    phoneKids: string;
    instagramUrl: string;
    instagramHandle: string;
    facebookUrl: string;
    facebookLabel: string;
    venueName: string;
    address: string;
    mapsUrl: string;
    contactNote: string;
  };
}
