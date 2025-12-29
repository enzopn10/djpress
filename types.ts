
export interface SocialLinks {
  instagram?: string;
  soundcloud?: string;
  spotify?: string;
  facebook?: string;
  twitter?: string;
  youtube?: string;
}

export interface PressPhoto {
  id: string;
  url: string;
  isCover?: boolean;
}

export interface Release {
  id: string;
  title: string;
  label: string;
  year: string;
  coverUrl: string;
  link: string;
}

export interface VideoEntry {
  id: string;
  title: string;
  url: string;
}

export interface Achievement {
  id: string;
  year: string;
  title: string;
  description: string;
}

export interface MusicEmbed {
  id: string;
  platform: 'spotify' | 'soundcloud';
  url: string;
}

export interface PressKit {
  username: string;
  displayName: string;
  tagline: string;
  bio: string;
  location: string;
  genres: string[];
  socials: SocialLinks;
  photos: PressPhoto[];
  logos: string[];
  releases: Release[];
  videos: VideoEntry[];
  achievements: Achievement[];
  musicEmbeds: MusicEmbed[];
  technicalRiderUrl?: string;
  contactEmail: string;
  bookingAgent?: string;
}

export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  pressKit: PressKit;
  createdAt: string;
}

export interface ArtistProfile {
  username: string;
  displayName: string;
  avatarUrl: string;
  genres: string[];
}
