import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Flame,
  Swords,
  AlertTriangle,
  Copy,
  Check,
  LogOut,
  Sparkles,
  Settings,
  RefreshCw,
  Smartphone,
  Download,
  ExternalLink,
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { PATH_DESCRIPTIONS, getRankFromLevel } from '../../lib/constants';
import { PathType, StatType } from '../../types';

export const ProfileTab: React.FC = () => {
  const {
    state,
    setSelectedPath,
    toggleHardcoreMode,
    updateRivalInfo,
    signOutAndClearData,
    signInGooglePlaceholder,
  } = useSystem();

  const [copied, setCopied] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  // Rival form state
  const [rivalName, setRivalName] = useState(state.rival.name);
  const [rivalLevel, setRivalLevel] = useState(state.rival.currentLevel);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert(
        'To install on Android:\n1. Tap your browser menu (3 dots at top right).\n2. Select "Add to Home screen" or "Install App".\n3. Enjoy as a standalone full-screen Android application!'
      );
    }
  };

  const handleCopyProfileSummary = () => {
    const summary = `THE SYSTEM PLAYER CARD\nPlayer Level: ${state.level} (${getRankFromLevel(state.level)})\nTitle: ${state.selectedTitle}\nPath: ${PATH_DESCRIPTIONS[state.selectedPath].name}\nTotal XP: ${state.totalXp}\nCurrent Streak: ${state.currentStreak} Days\nSTR: ${state.stats.STR.value} | INT: ${state.stats.INT.value} | VIT: ${state.stats.VIT.value} | AGI: ${state.stats.AGI.value} | PER: ${state.stats.PER.value} | LUK: ${state.stats.LUK.value}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdateRival = (e: React.FormEvent) => {
    e.preventDefault();
    updateRivalInfo(rivalName, state.rival.startingLevel, rivalLevel, rivalLevel * 100);
    alert('Rival benchmark updated!');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* 1. Shareable Profile Summary Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950/80 border-2 border-blue-500/40 text-slate-100 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400 flex items-center justify-center text-cyan-300">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-mono text-cyan-300">PLAYER PROFILE CARD</h2>
              <p className="text-xs text-slate-400">Shareable status overview</p>
            </div>
          </div>

          <button
            onClick={handleCopyProfileSummary}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold shadow-md shadow-blue-900/40"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Card!' : 'Copy Summary'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs mb-4">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-slate-500 text-[10px]">LEVEL & RANK</div>
            <div className="text-sm font-bold text-cyan-300">
              LVL {state.level} ({getRankFromLevel(state.level)})
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-slate-500 text-[10px]">TITLE</div>
            <div className="text-sm font-bold text-slate-100 truncate">{state.selectedTitle}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-slate-500 text-[10px]">CURRENT PATH</div>
            <div className="text-sm font-bold text-indigo-300 truncate">
              {PATH_DESCRIPTIONS[state.selectedPath].name}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-slate-500 text-[10px]">STREAK</div>
            <div className="text-sm font-bold text-amber-400">{state.currentStreak} Days</div>
          </div>
        </div>

        {/* Core Stats Overview Pills */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 font-mono text-[11px] text-center">
          {(Object.keys(state.stats) as StatType[]).map((s) => (
            <div key={s} className="p-2 rounded-lg bg-slate-950 border border-slate-800/80">
              <span className="text-slate-400 block text-[9px]">{s}</span>
              <strong className="text-cyan-300">{state.stats[s].value} XP</strong>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Path / Class Selection */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider">
          CLASS / PATH SELECTION
        </h3>
        <p className="text-xs text-slate-400">
          Select your primary growth focus to unlock passive XP multipliers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
          {(Object.keys(PATH_DESCRIPTIONS) as PathType[]).map((pKey) => {
            const pathObj = PATH_DESCRIPTIONS[pKey];
            const isSelected = state.selectedPath === pKey;

            return (
              <button
                key={pKey}
                onClick={() => setSelectedPath(pKey)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-950/80 border-cyan-400 text-slate-100 shadow-md shadow-blue-950'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-100">{pathObj.name}</span>
                  <span className="text-[10px] text-cyan-400 font-bold">{pathObj.bonus}</span>
                </div>
                <p className="text-[11px] text-slate-400 font-normal">{pathObj.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Hardcore Mode Toggle */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-sm font-bold text-rose-300">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            HARDCORE MODE
          </div>

          <button
            onClick={() => {
              if (!state.isHardcoreMode) {
                if (
                  confirm(
                    'WARNING: Hardcore Mode Enabled!\nMissing all daily quests in a single day will reset your streak to 0 AND deduct 10% of total XP as a penalty. Are you sure?'
                  )
                ) {
                  toggleHardcoreMode(true);
                }
              } else {
                toggleHardcoreMode(false);
              }
            }}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
              state.isHardcoreMode
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            {state.isHardcoreMode ? 'ENABLED (RISK ACTIVE)' : 'DISABLED'}
          </button>
        </div>
        <p className="text-xs text-slate-400 font-mono">
          When enabled, missing all daily quests results in a 10% total XP penalty and streak reset.
        </p>
      </div>

      {/* 4. Rival Configuration */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl font-mono text-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-amber-300 uppercase flex items-center gap-2">
            <Swords className="w-4 h-4 text-amber-400" />
            RIVAL BENCHMARK CONFIGURATION
          </h3>
        </div>

        <form onSubmit={handleUpdateRival} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-400 mb-1">RIVAL NAME</label>
            <input
              type="text"
              required
              value={rivalName}
              onChange={(e) => setRivalName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">RIVAL TARGET LEVEL</label>
            <input
              type="number"
              required
              value={rivalLevel}
              onChange={(e) => setRivalLevel(parseInt(e.target.value) || 1)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold"
            >
              Update Benchmark
            </button>
          </div>
        </form>
      </div>

      {/* 5. Android Play Store & App Installation */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h3 className="text-sm font-bold text-emerald-400 uppercase flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            ANDROID PLAY STORE & MOBILE INSTALLATION
          </h3>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-[10px]">
            PWA & APK READY
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Direct Install Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <Download className="w-4 h-4 text-cyan-400" />
              1. Direct Mobile App Install
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Install "The System" as a native standalone app on your Android phone or tablet. Works offline with smooth full-screen layout.
            </p>
            <button
              onClick={handleInstallApp}
              className={`w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                isInstalled
                  ? 'bg-emerald-900/60 border border-emerald-700 text-emerald-300'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              {isInstalled ? 'App Installed on Device' : 'Install App on Android'}
            </button>
          </div>

          {/* Google Play Store Export Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-purple-400" />
              2. Google Play Store (.aab / .apk)
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Convert this React PWA into a Google Play Store Android App (.aab/.apk) using standard Capacitor or PWABuilder toolkits:
            </p>
            <div className="space-y-1 text-[10px] text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
              <div>• <strong>Option A (Zero Code)</strong>: Paste app URL into <code className="text-cyan-300">pwabuilder.com</code> to generate Play Store bundle.</div>
              <div>• <strong>Option B (Capacitor)</strong>: Run <code className="text-cyan-300">npm i @capacitor/core @capacitor/android</code> to export native Android Studio project.</div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Account & Guest Mode Section */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl font-mono text-xs">
        <h3 className="text-sm font-bold text-cyan-300 uppercase flex items-center gap-2">
          <Settings className="w-4 h-4 text-cyan-400" />
          ACCOUNT & DATA MANAGEMENT
        </h3>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Current Mode:</span>
            <span className="text-cyan-400 font-bold">
              {state.isGuestMode ? `Guest Mode (${state.guestId})` : 'Signed In'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            You're using Guest Mode - your data is only saved on this device.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={signInGooglePlaceholder}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-800 text-purple-400 font-bold hover:bg-slate-800 text-center"
          >
            Upgrade to Google Account (Coming Soon)
          </button>

          <button
            onClick={signOutAndClearData}
            className="flex-1 py-2.5 px-4 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 text-rose-300 font-bold flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out & Reset Device Data
          </button>
        </div>
      </div>
    </div>
  );
};
