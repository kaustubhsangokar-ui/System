import React from 'react';
import { Sparkles, Trophy, ArrowRight } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { getRankFromLevel } from '../../lib/constants';

export const LevelUpModal: React.FC = () => {
  const { levelUpModal, dismissLevelUpModal } = useSystem();

  if (!levelUpModal || !levelUpModal.show) return null;

  const rank = getRankFromLevel(levelUpModal.newLevel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border-2 border-cyan-500/60 rounded-2xl max-w-md w-full p-6 text-center text-slate-100 shadow-2xl shadow-cyan-900/50 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-400">
          <Trophy className="w-8 h-8 text-white" />
        </div>

        <div className="inline-block px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/60 text-xs font-mono font-bold tracking-widest uppercase mb-2">
          LEVEL UP
        </div>

        <h2 className="text-3xl font-extrabold font-mono text-cyan-300 mb-1">
          LEVEL {levelUpModal.newLevel}
        </h2>

        <p className="text-sm font-semibold text-slate-300 mb-4">
          Rank: <span className="text-amber-400 font-mono">{rank}</span> • Title: <span className="text-blue-400 font-mono">{levelUpModal.newTitle}</span>
        </p>

        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          Your stats have reached new heights. All attributes have expanded and your capacity for focus grows stronger.
        </p>

        <button
          onClick={dismissLevelUpModal}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono font-bold text-sm tracking-wider shadow-lg shadow-cyan-900/40 flex items-center justify-center gap-2 transition-all"
        >
          <span>CONTINUE PROGRESSION</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const BonusEventModal: React.FC = () => {
  const { bonusEventModal, dismissBonusEventModal } = useSystem();

  if (!bonusEventModal || !bonusEventModal.show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border-2 border-yellow-500/60 rounded-2xl max-w-md w-full p-6 text-center text-slate-100 shadow-2xl shadow-yellow-900/40">
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-yellow-950/80 border border-yellow-500/50 flex items-center justify-center">
          <Sparkles className="w-7 h-7 text-yellow-400 animate-pulse" />
        </div>

        <div className="inline-block px-3 py-1 rounded-full bg-yellow-950 text-yellow-300 border border-yellow-700/60 text-xs font-mono font-bold tracking-widest uppercase mb-2">
          RANDOM BONUS EVENT
        </div>

        <h3 className="text-xl font-bold font-mono text-yellow-300 mb-2">
          2X XP SURGE ACTIVE!
        </h3>

        <p className="text-xs text-slate-300 mb-6 leading-relaxed">
          {bonusEventModal.text}
        </p>

        <button
          onClick={dismissBonusEventModal}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-slate-950 font-mono font-bold text-sm tracking-wider shadow-lg shadow-yellow-950/50"
        >
          CLAIM SURGE XP
        </button>
      </div>
    </div>
  );
};

export const HiddenQuestModal: React.FC = () => {
  const { hiddenQuestModal, completeHiddenQuest, dismissHiddenQuestModal } = useSystem();

  if (!hiddenQuestModal || !hiddenQuestModal.show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border-2 border-pink-500/60 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl shadow-pink-900/40 relative">
        <div className="inline-block px-3 py-1 rounded-full bg-pink-950 text-pink-300 border border-pink-700/60 text-xs font-mono font-bold tracking-widest uppercase mb-3">
          HIDDEN FEAT UNLOCKED
        </div>

        <h3 className="text-lg font-bold font-mono text-pink-300 mb-2">
          SURPRISE CHALLENGE!
        </h3>

        <p className="text-sm font-medium text-slate-200 mb-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
          "{hiddenQuestModal.questTitle}"
        </p>

        <p className="text-xs text-slate-400 mb-6">
          Rewards: <span className="text-pink-400 font-mono font-bold">+{hiddenQuestModal.xp} XP</span> + <span className="text-pink-400 font-mono font-bold">+2 LUK Stat</span>
        </p>

        <div className="flex gap-3">
          <button
            onClick={dismissHiddenQuestModal}
            className="flex-1 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs font-mono hover:text-slate-200"
          >
            Pass for Now
          </button>
          <button
            onClick={completeHiddenQuest}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-mono font-bold shadow-lg shadow-pink-900/30"
          >
            Mark Completed!
          </button>
        </div>
      </div>
    </div>
  );
};
