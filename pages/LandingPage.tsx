
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Loader2, User as UserIcon, Plus, Eye, EyeOff, Lock, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { StorageService } from '../services/storageService';
import { PressKit } from '../types';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginStep, setLoginStep] = useState<'picker' | 'email' | 'password'>('picker');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const [publicArtists, setPublicArtists] = useState<PressKit[]>([]);
  const [rememberedAccounts, setRememberedAccounts] = useState<any[]>([]);

  useEffect(() => {
    setPublicArtists(StorageService.getPublicArtists());
    const accounts = StorageService.getRememberedAccounts();
    setRememberedAccounts(accounts);
    if (accounts.length === 0) setLoginStep('email');
  }, []);

  const handleSelectAccount = (selectedEmail: string) => {
    setEmail(selectedEmail);
    setLoginStep('password');
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Enter a valid email address');
      return;
    }
    setError('');
    setLoginStep('password');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Password is required');
      return;
    }
    
    // In this simulation, we'll allow "password123" for any account
    // except for the admin who has their own secret (for the user to know: any password works for demo, but we add the field for realism)
    performLogin(email);
  };

  const performLogin = (targetEmail: string) => {
    setIsLoggingIn(true);
    setError('');
    
    setTimeout(() => {
      const user = StorageService.login(targetEmail);
      setIsLoggingIn(false);
      setShowLoginModal(false);
      
      if (user.isAdmin) {
        navigate('/admin');
      } else if (!user.pressKit.bio) {
        navigate('/magic-setup');
      } else {
        navigate('/dashboard');
      }
      window.location.reload();
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-indigo-500">
      <Navbar />
      
      <section className="relative pt-40 pb-32 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/15 via-transparent to-transparent -z-10 opacity-60"></div>
        
        <div className="max-w-5xl mx-auto text-center space-y-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black tracking-[0.2em] uppercase">
            The Industry Standard EPK
          </div>
          
          <h1 className="text-6xl md:text-8xl font-heading font-black text-white leading-[0.9] tracking-tighter italic">
            GET BOOKED. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 uppercase">Stay Professional.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto font-light leading-relaxed">
            Create a stunning electronic press kit in minutes. Manage assets, generate bios with AI, and share a single professional link with agents and promoters.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <button 
              onClick={() => {
                setLoginStep(rememberedAccounts.length > 0 ? 'picker' : 'email');
                setShowLoginModal(true);
              }}
              className="group relative w-full sm:w-auto px-10 py-5 bg-white text-black rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-4 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
            >
              <img src="https://www.google.com/favicon.ico" className="w-6 h-6" alt="Google" />
              <span>Continue with Google</span>
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById('showcase');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-10 py-5 bg-zinc-900 text-white rounded-2xl font-black text-lg transition-all border border-zinc-800 hover:bg-zinc-800"
            >
              View Roster
            </button>
          </div>
        </div>
      </section>

      {/* Real Artists Showcase - Only shows if data exists */}
      {publicArtists.length > 0 && (
        <section id="showcase" className="py-24 bg-black/50 border-y border-zinc-900">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-sm font-black text-zinc-500 uppercase tracking-[0.4em] mb-12 text-center italic">Verified Artists</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {publicArtists.map((artist) => (
                <div 
                  key={artist.username}
                  className="group relative aspect-[4/5] bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-zinc-800 hover:border-indigo-500/50 transition-all duration-700 cursor-pointer shadow-2xl"
                  onClick={() => navigate(`/u/${artist.username}`)}
                >
                  {artist.photos[0] ? (
                    <img src={artist.photos[0].url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" alt={artist.displayName} />
                  ) : (
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center"><Music className="w-12 h-12 text-zinc-700" /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-10 flex flex-col justify-end">
                    <h3 className="text-4xl font-heading font-black text-white italic tracking-tighter uppercase">{artist.displayName}</h3>
                    <p className="text-indigo-400 text-xs font-black uppercase tracking-[0.3em] mt-3">{artist.genres[0] || 'Producer'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />

      {/* High-Fidelity Multi-Step Google Login */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => !isLoggingIn && setShowLoginModal(false)}></div>
          
          <div className="relative bg-white text-zinc-900 rounded-xl p-0 max-w-md w-full shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-200">
            {isLoggingIn && (
              <div className="absolute inset-0 z-50 bg-white/90 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <p className="text-sm font-bold text-zinc-600">Securely signing you in...</p>
              </div>
            )}

            <div className="p-10 flex flex-col items-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" className="w-20 mb-8" alt="Google" />
              
              {loginStep === 'picker' && (
                <div className="w-full">
                  <h3 className="text-2xl font-normal text-zinc-900 mb-1 text-center">Choose an account</h3>
                  <p className="text-zinc-600 text-sm mb-8 text-center">to continue to <span className="text-blue-600 font-semibold">DJPress</span></p>
                  
                  <div className="w-full border-t border-zinc-200">
                    {rememberedAccounts.map((acc: any) => (
                      <button 
                        key={acc.email}
                        onClick={() => handleSelectAccount(acc.email)}
                        className="w-full flex items-center px-4 py-5 hover:bg-zinc-50 border-b border-zinc-200 transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center mr-4 overflow-hidden border border-zinc-100 shadow-inner">
                           {acc.avatar ? <img src={acc.avatar} className="w-full h-full object-cover" /> : <UserIcon className="w-5 h-5 text-zinc-500" />}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="font-semibold text-sm truncate">{acc.name || acc.email.split('@')[0]}</p>
                          <p className="text-xs text-zinc-500 truncate">{acc.email}</p>
                        </div>
                      </button>
                    ))}
                    
                    <button 
                      onClick={() => {
                        setEmail('');
                        setLoginStep('email');
                      }}
                      className="w-full flex items-center px-4 py-5 hover:bg-zinc-50 border-b border-zinc-200 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center mr-4">
                         <Plus className="w-5 h-5 text-zinc-500" />
                      </div>
                      <span className="font-semibold text-sm text-zinc-700">Use another account</span>
                    </button>
                  </div>
                </div>
              )}

              {loginStep === 'email' && (
                <div className="w-full">
                  <h3 className="text-2xl font-normal text-zinc-900 mb-1 text-center">Sign in</h3>
                  <p className="text-zinc-600 text-sm mb-10 text-center">to continue to <span className="text-blue-600 font-semibold">DJPress</span></p>
                  
                  <form onSubmit={handleEmailSubmit} className="space-y-6">
                    <div className="relative group">
                      <input 
                        type="email" 
                        placeholder="Email or phone" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full border ${error ? 'border-red-500' : 'border-zinc-300'} rounded px-4 py-4 text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-base`}
                        required
                        autoFocus
                      />
                      {error && <p className="text-red-600 text-xs mt-2 flex items-center"><Lock className="w-3 h-3 mr-1" /> {error}</p>}
                    </div>
                    
                    <div className="flex justify-between items-center pt-6">
                      <button 
                        type="button"
                        onClick={() => rememberedAccounts.length > 0 && setLoginStep('picker')}
                        className="text-blue-600 text-sm font-semibold hover:bg-blue-50 px-4 py-2 rounded-md transition-colors"
                      >
                        {rememberedAccounts.length > 0 ? 'Back' : 'Create account'}
                      </button>
                      <button 
                        type="submit"
                        className="bg-blue-600 text-white px-8 py-2.5 rounded font-semibold hover:bg-blue-700 transition-colors shadow-md"
                      >
                        Next
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {loginStep === 'password' && (
                <div className="w-full animate-in slide-in-from-right-4 duration-300">
                  <button onClick={() => setLoginStep('email')} className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-zinc-200 mb-6 hover:bg-zinc-50 transition-colors mx-auto">
                     <div className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center overflow-hidden">
                        <UserIcon className="w-3 h-3 text-zinc-500" />
                     </div>
                     <span className="text-xs font-medium text-zinc-700">{email}</span>
                  </button>
                  
                  <h3 className="text-2xl font-normal text-zinc-900 mb-1 text-center">Welcome</h3>
                  <p className="text-zinc-600 text-sm mb-10 text-center">Enter your password to continue</p>
                  
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div className="relative group">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Enter your password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-zinc-300 rounded px-4 py-4 text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-base"
                        required
                        autoFocus
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                       <input type="checkbox" id="show-pwd" checked={showPassword} onChange={() => setShowPassword(!showPassword)} className="w-4 h-4 rounded border-zinc-300" />
                       <label htmlFor="show-pwd" className="text-sm text-zinc-700 font-medium cursor-pointer">Show password</label>
                    </div>
                    
                    <div className="flex justify-between items-center pt-6">
                      <button 
                        type="button"
                        className="text-blue-600 text-sm font-semibold hover:bg-blue-50 px-4 py-2 rounded-md transition-colors"
                      >
                        Forgot password?
                      </button>
                      <button 
                        type="submit"
                        className="bg-blue-600 text-white px-8 py-2.5 rounded font-semibold hover:bg-blue-700 transition-colors shadow-md"
                      >
                        Next
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            <div className="bg-zinc-50 p-6 text-[11px] text-zinc-500 leading-relaxed border-t border-zinc-100">
              By continuing, you agree to DJPress sharing your profile with connected agents and promoters. Standard Google authentication applies.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
