
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, Sparkles, Loader2, ArrowRight, Music, AlertCircle } from 'lucide-react';
import { parsePressKitDump } from '../services/geminiService';
import Navbar from '../components/Navbar';

const MagicSetup: React.FC = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMagicSetup = async () => {
    if (!input.trim()) return;
    setIsProcessing(true);
    setError(null);

    try {
      const organizedData = await parsePressKitDump(input);
      // Store in session storage or state management to be picked up by the dashboard
      sessionStorage.setItem('pending_ai_kit', JSON.stringify(organizedData));
      navigate('/dashboard?source=ai');
    } catch (err) {
      setError("Something went wrong with the AI processing. Try giving it a bit more detail!");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500">
      <Navbar />
      
      <div className="max-w-4xl mx-auto pt-32 px-6">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-bold tracking-widest uppercase">
            <Sparkles className="w-3 h-3" />
            <span>Phase 1: The Magic Setup</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tight">
            Dump your info. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">We'll do the rest.</span>
          </h1>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
            Paste your bio, social links, tour dates, and any URLs for photos or riders. 
            Gemini AI will organize it all into a professional EPK instantly.
          </p>
        </div>

        <div className="relative group">
          <div className={`absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-25 transition-opacity duration-1000 ${isProcessing ? 'opacity-75 animate-pulse' : 'group-hover:opacity-40'}`}></div>
          <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-2">
            <textarea
              className="w-full h-80 bg-transparent p-6 text-zinc-100 placeholder:text-zinc-600 focus:outline-none resize-none text-lg font-light leading-relaxed"
              placeholder="Example: My DJ name is VORTEX. I play techno and house. Based in Berlin. I've played at Berghain and Tomorrowland. Here are my links: instagram.com/vortex, soundcloud.com/vortex... bio: Vortex is a producer known for..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isProcessing}
            />
            
            <div className="p-4 border-t border-zinc-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2 text-zinc-500 text-xs">
                <Music className="w-4 h-4" />
                <span>Links to Spotify, SoundCloud, YouTube, and Photos are supported.</span>
              </div>
              
              <button
                onClick={handleMagicSetup}
                disabled={isProcessing || !input.trim()}
                className="w-full md:w-auto px-8 py-4 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>AI is Organizing...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    <span>Start the Magic</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 flex items-center space-x-2 text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20 text-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
          <Feature icon="⚡" title="Blazing Fast" text="Skip the forms. Just paste what you already have." />
          <Feature icon="🧠" title="Smart Parsing" text="AI understands context, years, and media types." />
          <Feature icon="🎨" title="Perfect Design" text="Layout is automatically optimized for bookers." />
        </div>
      </div>
    </div>
  );
};

const Feature = ({ icon, title, text }: { icon: string, title: string, text: string }) => (
  <div className="space-y-2">
    <div className="text-2xl mb-4">{icon}</div>
    <h3 className="text-white font-bold">{title}</h3>
    <p className="text-zinc-500 text-sm leading-relaxed">{text}</p>
  </div>
);

export default MagicSetup;
