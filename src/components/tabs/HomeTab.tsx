import React, { useState } from 'react';
import {
  Shield,
  Dumbbell,
  Brain,
  HeartPulse,
  Zap,
  Eye,
  Sparkles,
  AlertTriangle,
  Flame,
  Moon,
  TrendingUp,
  Skull,
  User,
  Swords,
  ChevronRight,
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { STAT_METADATA, getRankFromLevel, PATH_DESCRIPTIONS } from '../../lib/constants';
import { StatType } from '../../types';

export const HomeTab: React.FC = () => {
  const { state, logSleepHours, completeEmergencyQuest } = useSystem();
  const [sleepInput, setSleepInput] = useState<number>(
    state.dailySleepLogs[new Date().toISOString().split('T')[0]] || 7.5
  );

  const rank = getRankFromLevel(state.level);
  const pathInfo = PATH_DESCRIPTIONS[state.selectedPath];

  // Map icon names
  const getStatIcon = (statCode: StatType) => {
    switch (statCode) {
      case 'STR': return Dumbbell;
      case 'INT': return Brain;
      case 'VIT': return HeartPulse;
      case 'AGI': return Zap;
      case 'PER': return Eye;
      case 'LUK': return Sparkles;
      default: return ActivityIcon;
    }
  };

  const ActivityIcon = TrendingUp;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 0. Emergency Quest Banner if active */}
      {state.emergencyQuestActive && (
        <div className="p-4 rounded-2xl bg-rose-950/90 border-2 border-rose-600 text-slate-100 shadow-xl shadow-rose-950/80 animate-pulse flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-rose-900/60 text-rose-300 border border-rose-500">
              <Skull className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold font-mono text-rose-300 uppercase tracking-wider">
                SYSTEM EMERGENCY PROTOCOL ACTIVE
              </div>
              <div className="text-xs text-rose-200">
                3 consecutive missed days detected! Complete Emergency Restoration Quest to restore streak momentum.
              </div>
            </div>
          </div>
          <button
            onClick={completeEmergencyQuest}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-950"
          >
            RESTORE SYSTEM NOW
          </button>
        </div>
      )}

      {/* 1. Main Player Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/60 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-cyan-300 shadow-xl ring-2 ring-blue-400/40">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold font-mono text-slate-100">
                  PLAYER STATUS
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-950 text-cyan-400 border border-blue-800/80 text-xs font-mono font-bold">
                  {rank}
                </span>
              </div>
              <p className="text-sm text-slate-400 font-medium">
                Title: <span className="text-cyan-300 font-mono">{state.selectedTitle}</span>
              </p>
              <div className="mt-1 flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span>Path: <strong className="text-indigo-400">{pathInfo.name}</strong></span>
                <span>•</span>
                <span>Streak: <strong className="text-amber-400">{state.currentStreak}d</strong></span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="text-slate-400 text-[10px]">TOTAL XP</div>
              <div className="text-lg font-bold text-cyan-400">{state.totalXp} XP</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="text-slate-400 text-[10px]">GOLD</div>
              <div className="text-lg font-bold text-yellow-400">{state.gold} G</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 col-span-2 sm:col-span-1">
              <div className="text-slate-400 text-[10px]">BEST STREAK</div>
              <div className="text-lg font-bold text-amber-400">{state.longestStreak} Days</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Stat Panel (6 Core Stats) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            CORE ATTRIBUTES (STATS)
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            Updated live via quests & events
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Object.keys(state.stats) as StatType[]).map((statCode) => {
            const stat = state.stats[statCode];
            const meta = STAT_METADATA[statCode];
            const IconComponent = getStatIcon(statCode);

            return (
              <div
                key={statCode}
                className={`p-4 rounded-xl bg-slate-900 border transition-all ${
                  stat.isNeglected
                    ? 'border-amber-600/80 bg-amber-950/20 shadow-md shadow-amber-950/30'
                    : 'border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: `${meta.color}25`, border: `1px solid ${meta.color}50` }}
                    >
                      <IconComponent className="w-4 h-4" style={{ color: meta.color }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold font-mono text-slate-100">
                          {statCode} - {meta.name}
                        </span>
                        {stat.isNeglected && (
                          <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-mono font-bold flex items-center gap-1 animate-pulse">
                            <AlertTriangle className="w-3 h-3 text-amber-400" />
                            NEGLECTED (5+ DAYS)
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">{meta.desc}</div>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-base font-bold text-slate-100">
                      {stat.value} <span className="text-xs text-slate-500">XP</span>
                    </div>
                  </div>
                </div>

                {/* Stat progress bar */}
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (stat.value % 500) / 5)}%`,
                      backgroundColor: meta.color,
                      boxShadow: `0 0 10px ${meta.color}80`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Sleep & Fatigue Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sleep Tracker */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-mono font-bold text-indigo-300">
              <Moon className="w-4 h-4 text-indigo-400" />
              SLEEP & RECOVERY MULTIPLIER
            </div>
            {sleepInput >= 7 ? (
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold">
                1.1x XP BOOST ACTIVE
              </span>
            ) : sleepInput < 5 ? (
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-mono">
                SLEEP DEPRIVED
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="number"
              step="0.5"
              min="0"
              max="16"
              value={sleepInput}
              onChange={(e) => setSleepInput(parseFloat(e.target.value) || 0)}
              className="w-24 bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-100 font-mono text-center"
            />
            <span className="text-xs text-slate-400 font-mono">Hours logged today</span>
            <button
              onClick={() => logSleepHours(sleepInput)}
              className="ml-auto px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-semibold"
            >
              Save Sleep
            </button>
          </div>
        </div>

        {/* Rival Tracker Side-by-Side */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-mono font-bold text-amber-300">
              <Swords className="w-4 h-4 text-amber-400" />
              RIVAL TRACKER: {state.rival.name}
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Level Comparison
            </span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-cyan-400 font-bold">YOU (Level {state.level})</span>
              <span className="text-amber-400 font-bold">{state.rival.name} (Level {state.rival.currentLevel})</span>
            </div>

            <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
              <div
                className="bg-cyan-500 h-full transition-all"
                style={{ width: `${(state.level / (state.level + state.rival.currentLevel)) * 100}%` }}
              />
              <div
                className="bg-amber-600 h-full transition-all"
                style={{ width: `${(state.rival.currentLevel / (state.level + state.rival.currentLevel)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
