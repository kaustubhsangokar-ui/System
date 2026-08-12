import React from 'react';
import { Shield, Sparkles, Coins, Flame, Skull, Settings, UserCheck } from 'lucide-react';
import { useSystem } from '../context/SystemContext';
import { getRankFromLevel, getXpForNextLevel } from '../lib/constants';

interface HeaderProps {
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  const { state, toggleBossRushMode } = useSystem();

  const rank = getRankFromLevel(state.level);
  const xpNeeded = getXpForNextLevel(state.level);
  const currentXpProgress = state.totalXp % xpNeeded;
  const xpPercentage = Math.min(100, Math.round((currentXpProgress / xpNeeded) * 100));

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 text-slate-100 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: App Logo & Title */}
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center shadow-lg shadow-blue-900/30 ring-1 ring-blue-400/30">
              <Shield className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg tracking-wider text-slate-100 font-mono">
                  THE SYSTEM
                </h1>
                <span className="text-[10px] font-semibold tracking-widest px-2 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-800/60 uppercase">
                  {rank}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {state.selectedTitle}
              </p>
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={() => toggleBossRushMode()}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                state.isBossRushMode
                  ? 'bg-rose-950 text-rose-300 border border-rose-700 shadow-md shadow-rose-950/50 animate-pulse'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
              title="Toggle Boss Rush (Exam) Mode"
            >
              <Skull className="w-4 h-4 text-rose-400" />
            </button>
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: XP Progress Bar & Level */}
        <div className="flex-1 max-w-md mx-auto w-full sm:mx-4">
          <div className="flex items-center justify-between text-xs font-mono font-semibold text-slate-300 mb-1">
            <span className="text-cyan-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> LVL {state.level}
            </span>
            <span className="text-slate-400">
              {currentXpProgress} / {xpNeeded} XP ({xpPercentage}%)
            </span>
          </div>
          <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 rounded-full transition-all duration-500 shadow-sm shadow-cyan-500/50"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
        </div>

        {/* Right Stats & desktop actions */}
        <div className="hidden sm:flex items-center gap-4 text-xs font-mono">
          {/* Streak badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/50 border border-amber-800/60 text-amber-300">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-500/30" />
            <span>{state.currentStreak}d Streak</span>
          </div>

          {/* Gold Currency */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-950/40 border border-yellow-700/50 text-yellow-300">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span>{state.gold} Gold</span>
          </div>

          {/* Boss Rush Toggle */}
          <button
            onClick={() => toggleBossRushMode()}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              state.isBossRushMode
                ? 'bg-rose-950 text-rose-300 border border-rose-700 shadow-lg shadow-rose-950/50 animate-pulse'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <Skull className="w-4 h-4 text-rose-400" />
            <span>{state.isBossRushMode ? 'BOSS RUSH' : 'Exam Mode'}</span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            title="Settings & Profile"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
