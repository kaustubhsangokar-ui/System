import React, { useState } from 'react';
import { Shield, Sparkles, User, AlertCircle } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

export const OnboardingModal: React.FC = () => {
  const { state, loginAsGuest, signInGooglePlaceholder, saveOriginStory } = useSystem();
  const [storyInput, setStoryInput] = useState('');

  // If user has chosen mode and written origin story, do not render
  if ((state.isGuestMode || state.isSignedIn) && state.originStoryCompleted) {
    return null;
  }

  const handleCompleteOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyInput.trim()) return;
    if (!state.isGuestMode && !state.isSignedIn) {
      loginAsGuest();
    }
    saveOriginStory(storyInput);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-slate-100 relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
            <Shield className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-mono text-cyan-300">
              THE SYSTEM : AWAKENING
            </h2>
            <p className="text-xs text-slate-400">
              Personal Self-Improvement Protocol Initialized
            </p>
          </div>
        </div>

        {!state.isGuestMode && !state.isSignedIn ? (
          <div className="space-y-6">
            <p className="text-sm text-slate-300 leading-relaxed">
              Welcome Player. Choose your authentication mode to sync your stats and progress:
            </p>

            <div className="space-y-3">
              <button
                onClick={() => loginAsGuest()}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-blue-950/60 hover:bg-blue-900/60 border border-blue-700/50 text-slate-100 font-semibold transition-all group"
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-cyan-400" />
                  <div className="text-left">
                    <div className="text-sm">Continue as Guest</div>
                    <div className="text-xs text-slate-400 font-normal">
                      Instant setup. Data saved locally on this device.
                    </div>
                  </div>
                </div>
                <span className="text-xs text-cyan-400 group-hover:translate-x-1 transition-transform">
                  Start →
                </span>
              </button>

              <button
                onClick={() => signInGooglePlaceholder()}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800 text-slate-400 font-semibold transition-all"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <div className="text-left">
                    <div className="text-sm text-slate-300">Sign in with Google</div>
                    <div className="text-xs text-slate-500 font-normal">
                      Cloud sync (Guest sandbox mode)
                    </div>
                  </div>
                </div>
                <span className="text-xs text-purple-400 font-mono">
                  Coming Soon
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Guest mode stores your quest history, stats, and achievements safely on your device.</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCompleteOnboarding} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold font-mono text-cyan-300 mb-2">
                DECLARATION OF ORIGIN (MY STORY)
              </label>
              <p className="text-xs text-slate-400 mb-3">
                Why are you awakening The System today? What is your ultimate ambition or transformation target? (Saved permanently in My Story).
              </p>
              <textarea
                value={storyInput}
                onChange={(e) => setStoryInput(e.target.value)}
                required
                rows={4}
                placeholder="E.g., I am embarking on this journey to conquer physical strength, master complex software systems, and achieve relentless focus without compromise..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={!storyInput.trim()}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-mono font-bold text-sm tracking-wider shadow-lg shadow-blue-900/40 transition-all"
            >
              INITIALIZE SYSTEM PROTOCOL
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
