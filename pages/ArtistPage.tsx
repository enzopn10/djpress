
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Instagram, 
  Twitter, 
  Download, 
  MapPin, 
  Mail, 
  Music as MusicIcon,
  FileText,
  Image as ImageIcon,
  Globe,
  Play,
  Award,
  ArrowLeft
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { PressKit } from '../types';

const ArtistPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [artist, setArtist] = useState<PressKit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    
    // Attempt to find real user in storage
    const user = StorageService.getUserByUsername(username);
    if (user) {
      setArtist(user.pressKit);
    } else {
      // Fallback for demo accounts if not found in storage
      if (username === 'honjo') {
        const honjo = StorageService.login('honjo@example.com');
        setArtist(honjo.pressKit);
      }
    }
    setLoading(false);
    window.scrollTo(0, 0);
  }, [username]);

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-zinc-500 font-black uppercase tracking-widest text-xs">Locating Profile...</p>
    </div>
  );

  if (!artist) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-6xl font-heading font-black text-white mb-4 italic tracking-tighter">ARTIST NOT FOUND</h1>
      <p className="text-zinc-500 max-w-sm mb-10">This artist profile hasn't been created yet or has been moved.</p>
      <button onClick={() => navigate('/')} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center space-x-2">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Directory</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-light selection:bg-indigo-500 selection:text-white pb-32">
      {/* Dynamic Header Section */}
      <section className="relative h-[90vh] w-full overflow-hidden">
        {artist.photos[0] ? (
          <img 
            src={artist.photos[0].url} 
            alt={artist.displayName} 
            className="w-full h-full object-cover opacity-70 scale-105"
          />
        ) : (
          <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
             <MusicIcon className="w-32 h-32 text-zinc-800" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-24">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-wrap gap-2">
              {artist.genres.map(g => (
                <span key={g} className="px-4 py-1.5 rounded-full bg-indigo-500 text-[10px] uppercase tracking-[0.25em] text-white font-black">
                  {g}
                </span>
              ))}
            </div>
            <h1 className="text-7xl md:text-[12rem] font-heading font-black text-white tracking-tighter leading-[0.8] italic uppercase">
              {artist.displayName}
            </h1>
            <p className="text-xl md:text-3xl text-zinc-400 font-light max-w-3xl leading-relaxed italic">
              {artist.tagline}
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 md:px-12 mt-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          <div className="lg:col-span-8 space-y-40">
            
            <section id="biography">
              <div className="flex items-center space-x-6 mb-12">
                <span className="w-16 h-[2px] bg-indigo-500"></span>
                <h2 className="text-white uppercase tracking-[0.4em] text-xs font-black">STORY</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                <div className="md:col-span-8">
                  <p className="text-xl md:text-3xl leading-relaxed text-zinc-100 font-normal">
                    {artist.bio}
                  </p>
                </div>
                <div className="md:col-span-4 border-l border-zinc-900 pl-10 space-y-10">
                  <h3 className="text-white font-black text-xs mb-6 flex items-center uppercase tracking-[0.2em]">
                    <Award className="w-4 h-4 mr-3 text-indigo-500" /> TIMELINE
                  </h3>
                  {artist.achievements.map(a => (
                    <div key={a.id} className="space-y-1">
                       <span className="text-[10px] text-indigo-500 font-black block">{a.year}</span>
                       <p className="text-white font-bold text-lg leading-tight tracking-tight">{a.title}</p>
                       <p className="text-zinc-500 text-sm mt-2 font-normal leading-relaxed">{a.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {artist.musicEmbeds.length > 0 && (
              <section id="music">
                <div className="flex items-center space-x-6 mb-12">
                  <span className="w-16 h-[2px] bg-indigo-500"></span>
                  <h2 className="text-white uppercase tracking-[0.4em] text-xs font-black">SOUNDS</h2>
                </div>
                <div className="space-y-10">
                  {artist.musicEmbeds.map(m => (
                    <div key={m.id} className="w-full bg-zinc-900/40 rounded-3xl overflow-hidden border border-zinc-800 p-1">
                      {m.platform === 'spotify' ? (
                        <iframe 
                          src={m.url.includes('embed') ? m.url : m.url.replace('open.spotify.com/', 'open.spotify.com/embed/')} 
                          width="100%" height="200" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                      ) : (
                        <iframe width="100%" height="200" scrolling="no" frameBorder="no" allow="autoplay" src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(m.url)}&color=%236366f1&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}></iframe>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section id="gallery">
              <div className="flex items-center space-x-6 mb-12">
                <span className="w-16 h-[2px] bg-indigo-500"></span>
                <h2 className="text-white uppercase tracking-[0.4em] text-xs font-black">VISUALS</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {artist.photos.map((photo) => (
                  <div key={photo.id} className="relative group overflow-hidden rounded-[2.5rem] bg-zinc-900 aspect-[3/4] border border-zinc-900">
                    <img src={photo.url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" alt="Press" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="bg-white text-black px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center space-x-2">
                        <Download className="w-4 h-4" />
                        <span>Download HQ</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 space-y-12">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-[3rem] p-12 sticky top-24 backdrop-blur-2xl">
              <h3 className="text-white font-black text-3xl mb-12 tracking-tighter italic">ASSET PACK</h3>
              <div className="space-y-4">
                <AssetButton icon={<ImageIcon className="w-5 h-5" />} label="Press Kit (.ZIP)" detail="HQ Photos & Bio" />
                <AssetButton icon={<FileText className="w-5 h-5" />} label="Technical Rider" detail="Sound & Lighting" />
                <AssetButton icon={<FileText className="w-5 h-5" />} label="Hospitality Rider" detail="Logistics" />
                <AssetButton icon={<MusicIcon className="w-5 h-5" />} label="Logos (.SVG)" detail="Vector Assets" />
              </div>

              <div className="mt-16 pt-16 border-t border-zinc-800/50">
                <h4 className="text-zinc-600 uppercase tracking-[0.4em] text-[10px] font-black mb-8">SOCIAL CHANNELS</h4>
                <div className="flex flex-wrap gap-5">
                  {artist.socials.instagram && <SocialLinkItem href={artist.socials.instagram} icon={<Instagram />} />}
                  {artist.socials.soundcloud && <SocialLinkItem href={artist.socials.soundcloud} icon={<MusicIcon />} />}
                  {artist.socials.spotify && <SocialLinkItem href={artist.socials.spotify} icon={<Play />} />}
                  {artist.socials.twitter && <SocialLinkItem href={artist.socials.twitter} icon={<Twitter />} />}
                </div>
              </div>

              <div className="mt-16 pt-16 border-t border-zinc-800/50">
                <h4 className="text-zinc-600 uppercase tracking-[0.4em] text-[10px] font-black mb-8">CONTACT & INQUIRIES</h4>
                <div className="space-y-10">
                  <ContactItem icon={<MapPin className="w-5 h-5 text-indigo-500" />} label="BASE" value={artist.location} />
                  <ContactItem icon={<Mail className="w-5 h-5 text-indigo-500" />} label="DIRECT" value={artist.contactEmail} isLink />
                  {artist.bookingAgent && (
                    <ContactItem icon={<Globe className="w-5 h-5 text-indigo-500" />} label="AGENT" value={artist.bookingAgent} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-60 py-24 border-t border-zinc-900 px-6 text-center">
        <div className="flex items-center justify-center space-x-3 mb-8">
           <MusicIcon className="w-10 h-10 text-indigo-600" />
           <span className="font-heading font-black text-4xl text-white tracking-tighter uppercase italic">DJPRESS</span>
        </div>
        <p className="text-zinc-600 text-[10px] tracking-[0.5em] font-black uppercase">Professional Press Kit Experience &bull; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

const AssetButton: React.FC<{ icon: React.ReactNode, label: string, detail: string }> = ({ icon, label, detail }) => (
  <button className="w-full flex items-center justify-between p-6 bg-black border border-zinc-800/50 hover:bg-indigo-600 hover:border-indigo-500 transition-all rounded-3xl group">
    <div className="flex items-center space-x-5">
      <span className="text-zinc-600 group-hover:text-white transition-colors">{icon}</span>
      <div className="text-left">
        <p className="text-white font-bold text-sm tracking-tight">{label}</p>
        <p className="text-zinc-600 group-hover:text-indigo-200 text-[10px] font-black uppercase tracking-widest">{detail}</p>
      </div>
    </div>
    <Download className="w-5 h-5 text-zinc-800 group-hover:text-white transition-colors" />
  </button>
);

const SocialLinkItem: React.FC<{ href: string, icon: React.ReactNode }> = ({ href, icon }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="w-14 h-14 flex items-center justify-center bg-black border border-zinc-800 rounded-2xl text-zinc-500 hover:bg-indigo-600 hover:text-white transition-all transform hover:-translate-y-1"
  >
    {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
  </a>
);

const ContactItem = ({ icon, label, value, isLink }: { icon: React.ReactNode, label: string, value: string, isLink?: boolean }) => (
  <div className="flex items-start space-x-5">
    <div className="mt-1">{icon}</div>
    <div>
      <p className="text-zinc-600 text-[10px] uppercase font-black tracking-[0.2em] mb-1">{label}</p>
      {isLink ? (
        <a href={`mailto:${value}`} className="text-white font-bold hover:text-indigo-400 break-all transition-colors">{value}</a>
      ) : (
        <p className="text-white font-bold">{value}</p>
      )}
    </div>
  </div>
);

export default ArtistPage;
