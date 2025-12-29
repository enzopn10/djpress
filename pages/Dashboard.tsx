
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Save, Eye, Wand2, Plus, Trash2, Camera, Music, Check, Loader2, 
  Video, Award, Globe, ExternalLink, Play, LayoutGrid, Sparkles, User as UserIcon, Upload, File
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { PressKit, Achievement, MusicEmbed, VideoEntry, PressPhoto } from '../types';
import { generateBio } from '../services/geminiService';
import { StorageService } from '../services/storageService';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState(StorageService.getCurrentSession());
  const [kit, setKit] = useState<PressKit | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'content' | 'media' | 'socials'>('info');
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [bioKeywords, setBioKeywords] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showAiSuccess, setShowAiSuccess] = useState(false);
  
  const photoInputRef = useRef<HTMLInputElement>(null);
  const riderInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!session) {
      navigate('/');
      return;
    }
    
    const pendingData = sessionStorage.getItem('pending_ai_kit');
    if (pendingData && location.search.includes('source=ai')) {
      const parsed = JSON.parse(pendingData);
      const merged = { ...session.pressKit, ...parsed };
      setKit(merged);
      StorageService.updatePressKit(session.email, merged);
      setShowAiSuccess(true);
      sessionStorage.removeItem('pending_ai_kit');
    } else {
      setKit(session.pressKit);
    }
  }, [session, location]);

  const handleSave = () => {
    if (!kit || !session) return;
    setSaveStatus('saving');
    StorageService.updatePressKit(kit.contactEmail, kit);
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 800);
  };

  const handleGenerateBio = async () => {
    if (!bioKeywords || !kit) return;
    setIsGeneratingBio(true);
    const newBio = await generateBio(kit.displayName, kit.genres, bioKeywords);
    setKit({ ...kit, bio: newBio });
    setIsGeneratingBio(false);
    document.getElementById('ai-modal')?.classList.add('hidden');
  };

  // Real File Upload Handler (Base64)
  const handlePhotoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !kit) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const newPhoto: PressPhoto = { id: Date.now().toString(), url: base64String };
      setKit({...kit, photos: [...kit.photos, newPhoto]});
    };
    reader.readAsDataURL(file);
  };

  const handleRiderFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !kit) return;

    // Simulate PDF/Document handling (just storing a name/link for demo)
    const mockUrl = `/uploads/${file.name}`;
    setKit({...kit, technicalRiderUrl: mockUrl});
    alert(`File "${file.name}" ready. In a production app, this would be uploaded to S3/Cloudinary.`);
  };

  // CRUD for Milestones
  const addAchievement = () => {
    if (!kit) return;
    const newA: Achievement = { id: Date.now().toString(), year: new Date().getFullYear().toString(), title: 'New Achievement', description: '' };
    setKit({...kit, achievements: [...kit.achievements, newA]});
  };

  const removeAchievement = (id: string) => {
    if (!kit) return;
    setKit({...kit, achievements: kit.achievements.filter(a => a.id !== id)});
  };

  // CRUD for Music
  const addMusic = (platform: 'spotify' | 'soundcloud') => {
    if (!kit) return;
    const newM: MusicEmbed = { id: Date.now().toString(), platform, url: '' };
    setKit({...kit, musicEmbeds: [...kit.musicEmbeds, newM]});
  };

  const removeMusic = (id: string) => {
    if (!kit) return;
    setKit({...kit, musicEmbeds: kit.musicEmbeds.filter(m => m.id !== id)});
  };

  if (!kit || !session) return null;

  return (
    <div className="min-h-screen bg-zinc-950 pt-20 pb-20">
      <Navbar />
      
      {/* Real File Inputs (Hidden) */}
      <input type="file" ref={photoInputRef} onChange={handlePhotoFile} accept="image/*" className="hidden" />
      <input type="file" ref={riderInputRef} onChange={handleRiderFile} accept=".pdf,.doc,.docx" className="hidden" />

      <div className="max-w-6xl mx-auto px-4">
        {showAiSuccess && (
          <div className="mb-6 bg-indigo-500/20 border border-indigo-500/30 text-indigo-100 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <p className="text-sm font-medium italic">Gemini AI has parsed your data dump! Review your profile below.</p>
            </div>
            <button onClick={() => setShowAiSuccess(false)}><Trash2 className="w-4 h-4" /></button>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-1">
            <h1 className="text-5xl font-heading font-black text-white italic tracking-tighter uppercase">Studio</h1>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">
              Editing Profile: <span className="text-indigo-500">@{kit.username}</span>
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate(`/u/${kit.username}`)}
              className="px-6 py-3 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 border border-zinc-800 transition-all flex items-center space-x-2 font-bold text-xs uppercase tracking-widest"
            >
              <Eye className="w-4 h-4" />
              <span>Live Preview</span>
            </button>
            <button 
              onClick={handleSave}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all flex items-center space-x-2 font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-indigo-600/30"
            >
              {saveStatus === 'saving' ? <Loader2 className="w-4 h-4 animate-spin" /> : saveStatus === 'saved' ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Success' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-3">
            <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-[2rem] p-4 space-y-2 sticky top-24 shadow-2xl">
              <NavBtn active={activeTab === 'info'} onClick={() => setActiveTab('info')} label="Identity" icon={<UserIcon className="w-4 h-4" />} />
              <NavBtn active={activeTab === 'content'} onClick={() => setActiveTab('content')} label="Media" icon={<Play className="w-4 h-4" />} />
              <NavBtn active={activeTab === 'media'} onClick={() => setActiveTab('media')} label="Assets" icon={<Camera className="w-4 h-4" />} />
              <NavBtn active={activeTab === 'socials'} onClick={() => setActiveTab('socials')} label="Socials" icon={<Globe className="w-4 h-4" />} />
            </div>
          </div>

          <div className="lg:col-span-9">
            <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl min-h-[700px]">
              
              {activeTab === 'info' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-400">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputField label="Artist Name" value={kit.displayName} onChange={v => setKit({...kit, displayName: v})} />
                    <InputField label="Public URL" value={kit.username} onChange={v => setKit({...kit, username: v.toLowerCase().replace(/[^a-z0-9]/g, '')})} prefix="djpress.app/u/" />
                  </div>
                  <InputField label="Headline" value={kit.tagline} onChange={v => setKit({...kit, tagline: v})} placeholder="e.g. Minimal Techno explorer based in Berlin" />
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Biography</label>
                      <button onClick={() => document.getElementById('ai-modal')?.classList.remove('hidden')} className="flex items-center space-x-2 text-indigo-400 text-[10px] font-black hover:text-indigo-300 transition-colors tracking-widest uppercase">
                         <Wand2 className="w-3 h-3" />
                         <span>Gemini Rewriter</span>
                      </button>
                    </div>
                    <textarea 
                      rows={8} 
                      value={kit.bio} 
                      onChange={e => setKit({...kit, bio: e.target.value})} 
                      className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-5 text-zinc-300 focus:ring-2 focus:ring-indigo-500/50 outline-none resize-none leading-relaxed transition-all"
                      placeholder="Write your story..."
                    />
                  </div>

                  <div className="pt-10 border-t border-zinc-800">
                     <div className="flex justify-between items-center mb-8">
                        <h3 className="text-white font-black text-xl italic uppercase tracking-tighter">Career Milestones</h3>
                        <button onClick={addAchievement} className="p-2 bg-zinc-800 text-indigo-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-lg">
                           <Plus className="w-5 h-5" />
                        </button>
                     </div>
                     <div className="space-y-6">
                        {kit.achievements.map((a, idx) => (
                           <div key={a.id} className="flex gap-6 items-start bg-black/40 p-6 rounded-[1.5rem] border border-zinc-800 group relative">
                              <input className="w-20 bg-transparent text-indigo-400 font-black text-base border-b border-zinc-800 outline-none" placeholder="Year" value={a.year} onChange={e => {
                                 const next = [...kit.achievements];
                                 next[idx].year = e.target.value;
                                 setKit({...kit, achievements: next});
                              }} />
                              <div className="flex-1 space-y-3">
                                 <input className="w-full bg-transparent text-white font-black text-lg outline-none italic tracking-tight" placeholder="Event/Achievement Title" value={a.title} onChange={e => {
                                    const next = [...kit.achievements];
                                    next[idx].title = e.target.value;
                                    setKit({...kit, achievements: next});
                                 }} />
                                 <textarea className="w-full bg-transparent text-zinc-500 text-sm outline-none resize-none h-12" placeholder="Tell us more about this milestone..." value={a.description} onChange={e => {
                                    const next = [...kit.achievements];
                                    next[idx].description = e.target.value;
                                    setKit({...kit, achievements: next});
                                 }} />
                              </div>
                              <button onClick={() => removeAchievement(a.id)} className="absolute top-4 right-4 text-zinc-800 hover:text-red-500 transition-colors p-2">
                                 <Trash2 className="w-5 h-5" />
                              </button>
                           </div>
                        ))}
                        {kit.achievements.length === 0 && (
                          <div className="text-center py-12 border-2 border-dashed border-zinc-800 rounded-3xl">
                             <Award className="w-10 h-10 text-zinc-800 mx-auto mb-4" />
                             <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest italic">No milestones added yet</p>
                          </div>
                        )}
                     </div>
                  </div>
                </div>
              )}

              {activeTab === 'content' && (
                <div className="space-y-12 animate-in fade-in duration-400">
                   <div>
                      <h3 className="text-white font-black text-xl italic uppercase tracking-tighter mb-8">Streaming Players</h3>
                      <div className="grid gap-6">
                         {kit.musicEmbeds.map((m, idx) => (
                           <div key={m.id} className="bg-black/40 border border-zinc-800 p-8 rounded-[2rem] flex items-center justify-between gap-10">
                              <div className="flex-1 space-y-4">
                                 <div className="flex items-center space-x-3">
                                   <div className={`w-3 h-3 rounded-full ${m.platform === 'spotify' ? 'bg-green-500' : 'bg-orange-500'}`} />
                                   <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{m.platform} URL</span>
                                 </div>
                                 <input className="w-full bg-transparent text-zinc-300 text-sm border-b border-zinc-800 outline-none py-2 font-mono" placeholder="Paste full track/playlist URL" value={m.url} onChange={e => {
                                    const next = [...kit.musicEmbeds];
                                    next[idx].url = e.target.value;
                                    setKit({...kit, musicEmbeds: next});
                                 }} />
                              </div>
                              <button onClick={() => removeMusic(m.id)} className="p-4 bg-zinc-900 text-zinc-700 hover:text-red-500 rounded-2xl transition-colors"><Trash2 className="w-6 h-6" /></button>
                           </div>
                         ))}
                      </div>
                      <div className="flex items-center space-x-4 mt-10">
                        <button onClick={() => addMusic('spotify')} className="flex-1 py-4 bg-zinc-900 border border-green-500/20 text-green-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all">+ Add Spotify</button>
                        <button onClick={() => addMusic('soundcloud')} className="flex-1 py-4 bg-zinc-900 border border-orange-500/20 text-orange-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all">+ Add SoundCloud</button>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'media' && (
                 <div className="space-y-12 animate-in fade-in duration-400">
                    <div>
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="text-white font-black text-xl italic uppercase tracking-tighter">High-Res Gallery</h3>
                        <button onClick={() => photoInputRef.current?.click()} className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center space-x-2">
                          <Upload className="w-4 h-4" />
                          <span>Choose Files</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {kit.photos.map(p => (
                          <div key={p.id} className="relative aspect-[3/4] bg-black rounded-3xl overflow-hidden group border border-zinc-800 shadow-xl">
                              <img src={p.url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" alt="Press" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              <button onClick={() => setKit({...kit, photos: kit.photos.filter(x => x.id !== p.id)})} className="absolute top-4 right-4 p-3 bg-red-600/20 text-red-500 rounded-2xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all">
                                <Trash2 className="w-5 h-5" />
                              </button>
                          </div>
                        ))}
                        {kit.photos.length === 0 && (
                          <div className="col-span-full py-20 border-2 border-dashed border-zinc-800 rounded-[2.5rem] flex flex-col items-center justify-center space-y-4">
                             <Camera className="w-12 h-12 text-zinc-800" />
                             <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">No photos uploaded yet</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-12 border-t border-zinc-800">
                      <h3 className="text-white font-black text-xl italic uppercase tracking-tighter mb-8">Documents & Riders</h3>
                      <div className="bg-black/60 border border-zinc-800 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center space-x-6">
                           <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800">
                              <File className="w-8 h-8 text-indigo-500" />
                           </div>
                           <div>
                              <p className="text-white font-black text-lg italic tracking-tight">Technical Rider</p>
                              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">
                                {kit.technicalRiderUrl ? 'File ready for download' : 'No file selected (PDF/DOC)'}
                              </p>
                           </div>
                        </div>
                        <button onClick={() => riderInputRef.current?.click()} className="px-10 py-4 bg-zinc-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-700 transition-all">
                           {kit.technicalRiderUrl ? 'Change Rider' : 'Select PDF'}
                        </button>
                      </div>
                    </div>
                 </div>
              )}

              {activeTab === 'socials' && (
                <div className="space-y-12 animate-in fade-in duration-400">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <InputField label="Booking Agency" value={kit.bookingAgent || ''} onChange={v => setKit({...kit, bookingAgent: v})} />
                      <InputField label="Public Inquiries" value={kit.contactEmail} onChange={v => setKit({...kit, contactEmail: v})} />
                      <InputField label="Current Base" value={kit.location} onChange={v => setKit({...kit, location: v})} />
                   </div>
                   <div className="pt-12 border-t border-zinc-800">
                      <h3 className="text-white font-black text-xl italic uppercase tracking-tighter mb-10">Social Network Identity</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <SocialBox label="Instagram Handle" value={kit.socials.instagram} onChange={v => setKit({...kit, socials: {...kit.socials, instagram: v}})} />
                         <SocialBox label="SoundCloud Link" value={kit.socials.soundcloud} onChange={v => setKit({...kit, socials: {...kit.socials, soundcloud: v}})} />
                         <SocialBox label="Spotify Artist ID" value={kit.socials.spotify} onChange={v => setKit({...kit, socials: {...kit.socials, spotify: v}})} />
                         <SocialBox label="YouTube Channel" value={kit.socials.youtube} onChange={v => setKit({...kit, socials: {...kit.socials, youtube: v}})} />
                      </div>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Modal Simulation */}
      <div id="ai-modal" className="hidden fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={() => document.getElementById('ai-modal')?.classList.add('hidden')}></div>
        <div className="relative bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-12 max-w-lg w-full shadow-2xl">
          <div className="flex items-center space-x-4 mb-8">
            <Sparkles className="w-8 h-8 text-indigo-400" />
            <h3 className="text-3xl font-heading font-black text-white italic tracking-tighter uppercase italic">Gemini Pro</h3>
          </div>
          <p className="text-zinc-500 text-sm mb-8 leading-relaxed">Tell Gemini about your sound, your origins, and your biggest performances. We'll generate a world-class professional biography for you.</p>
          <textarea 
            className="w-full bg-black border border-zinc-800 rounded-2xl p-8 text-white mb-8 focus:ring-2 focus:ring-indigo-500/50 outline-none text-base" 
            placeholder="e.g. DJ/Producer from Lisbon, started in the underground scene in 2012, sound blends deep melodic techno with ethnic vocals..."
            rows={5}
            value={bioKeywords}
            onChange={e => setBioKeywords(e.target.value)}
          />
          <div className="flex flex-col gap-4">
            <button 
              onClick={handleGenerateBio} 
              disabled={isGeneratingBio}
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all flex items-center justify-center space-x-3 shadow-2xl shadow-indigo-600/40"
            >
              {isGeneratingBio ? <Loader2 className="w-6 h-6 animate-spin" /> : <Wand2 className="w-6 h-6" />}
              <span>{isGeneratingBio ? 'Processing Soundscape...' : 'Re-Generate Biography'}</span>
            </button>
            <button onClick={() => document.getElementById('ai-modal')?.classList.add('hidden')} className="w-full py-2 text-zinc-600 text-xs font-black uppercase tracking-widest hover:text-white transition-colors">Dismiss</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NavBtn = ({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: React.ReactNode }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-5 px-8 py-5 rounded-[1.5rem] transition-all font-black text-xs uppercase tracking-[0.2em] ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50'}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const InputField = ({ label, value, onChange, prefix, placeholder }: { label: string, value: string, onChange: (v: string) => void, prefix?: string, placeholder?: string }) => (
  <div className="space-y-4">
    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">{label}</label>
    <div className="flex items-center bg-black border border-zinc-800 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
      {prefix && <span className="pl-6 text-zinc-600 font-mono text-xs italic">{prefix}</span>}
      <input 
        type="text" 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        placeholder={placeholder}
        className="w-full bg-transparent px-6 py-5 text-zinc-100 outline-none text-sm font-bold tracking-tight" 
      />
    </div>
  </div>
);

const SocialBox = ({ label, value, onChange }: { label: string, value?: string, onChange: (v: string) => void }) => (
  <div className="space-y-4">
    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">{label}</label>
    <div className="flex items-center bg-black border border-zinc-800 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
      <input 
        type="text" 
        value={value || ''} 
        onChange={e => onChange(e.target.value)} 
        placeholder={`Profile Link / Handle`}
        className="w-full bg-transparent px-6 py-5 text-zinc-200 outline-none text-sm font-bold" 
      />
    </div>
  </div>
);

export default Dashboard;
