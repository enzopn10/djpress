
import { PressKit, ArtistProfile } from './types';

export const MOCK_ARTISTS: ArtistProfile[] = [
  {
    username: 'honjo',
    displayName: 'HONJO',
    avatarUrl: 'https://picsum.photos/seed/honjo/400/400',
    genres: ['Melodic Techno', 'Indie Dance']
  },
  {
    username: 'stelar',
    displayName: 'Stelar Flux',
    avatarUrl: 'https://picsum.photos/seed/stelar/400/400',
    genres: ['Hard Techno', 'Industrial']
  },
  {
    username: 'luna',
    displayName: 'Luna Ray',
    avatarUrl: 'https://picsum.photos/seed/luna/400/400',
    genres: ['House', 'Deep Tech']
  }
];

export const INITIAL_PRESS_KIT: PressKit = {
  username: 'honjo',
  displayName: 'HONJO',
  tagline: 'Deep melodic sounds from the underground of Tokyo.',
  bio: "HONJO is a Tokyo-based DJ and producer who has been carving a unique niche in the melodic techno scene. With over a decade of experience behind the decks, his sets are known for their emotional depth and driving rhythms. Having performed at major festivals across Asia and Europe, HONJO continues to push boundaries with his original productions on labels like Afterlife and Anjunadeep.",
  location: 'Tokyo, Japan',
  genres: ['Melodic Techno', 'Progressive House'],
  socials: {
    instagram: 'https://instagram.com/honjomusic',
    soundcloud: 'https://soundcloud.com/honjomusic',
    spotify: 'https://spotify.com/artist/honjo',
    facebook: 'https://facebook.com/honjomusic'
  },
  photos: [
    { id: '1', url: 'https://picsum.photos/seed/press1/800/1000', isCover: true },
    { id: '2', url: 'https://picsum.photos/seed/press2/800/600' },
    { id: '3', url: 'https://picsum.photos/seed/press3/1000/800' }
  ],
  logos: [
    'https://picsum.photos/seed/logo1/400/200',
    'https://picsum.photos/seed/logo2/400/200'
  ],
  releases: [
    {
      id: 'r1',
      title: 'Neon Nights EP',
      label: 'Afterlife',
      year: '2023',
      coverUrl: 'https://picsum.photos/seed/rel1/400/400',
      link: '#'
    },
    {
      id: 'r2',
      title: 'Lost in Shibuya',
      label: 'Anjunadeep',
      year: '2022',
      coverUrl: 'https://picsum.photos/seed/rel2/400/400',
      link: '#'
    }
  ],
  videos: [
    { id: 'v1', title: 'Live at Ultra Japan 2023', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
  ],
  achievements: [
    { id: 'a1', year: '2023', title: 'Top 100 DJs (Melodic)', description: 'Ranked #14 in the yearly melodic techno charts.' },
    { id: 'a2', year: '2022', title: 'Afterlife Residency', description: 'Selected as monthly resident for Afterlife Tokyo.' }
  ],
  musicEmbeds: [
    { id: 'm1', platform: 'spotify', url: 'https://open.spotify.com/embed/track/4uLU6YJuEkOuzvU6bpS2pL' },
    { id: 'm2', platform: 'soundcloud', url: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/123456789' }
  ],
  technicalRiderUrl: '#',
  contactEmail: 'bookings@honjomusic.com',
  bookingAgent: 'United Talent Agency'
};
