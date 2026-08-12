import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Skull,
  Award,
  Sparkles,
  Trash2,
  CheckCircle2,
  Circle,
  Flame,
  AlertOctagon,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { Difficulty, StatType, Quest } from '../../types';
import { DIFFICULTY_XP } from '../../lib/constants';

export const QuestsTab: React.FC = () => {
  const {
    state,
    addQuest,
    completeQuest,
    deleteQuest,
    triggerTemptationSkip,
    triggerTemptationPush,
    manuallyEndDayCheck,
  } = useSystem();

  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stat, setStat] = useState<StatType>('STR');
  const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM');
  const [scheduledDay, setScheduledDay] = useState<Quest['scheduledDay']>('Mon');

  // Temptation Check target
  const incompleteQuests = state.quests.filter((q) => !q.completed);
  const [temptationQuestId, setTemptationQuestId] = useState<string | null>(null);

  const handleCreateQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addQuest(title, description, stat, difficulty, scheduledDay);
    setTitle('');
    setDescription('');
    setShowAddModal(false);
  };

  const getDifficultyBadge = (diff: Difficulty) => {
    switch (diff) {
      case 'EASY':
        return <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">Easy (E) +10 XP</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-mono">Medium (C) +25 XP</span>;
      case 'HARD':
        return <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-mono">Hard (A) +50 XP</span>;
      case 'VERY_HARD':
        return <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-mono font-bold animate-pulse">Very Hard (S) +100 XP</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Boss Rush Header if active */}
      {state.isBossRushMode && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border-2 border-rose-600 text-slate-100 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skull className="w-8 h-8 text-rose-400 animate-pulse" />
            <div>
              <div className="text-sm font-bold font-mono text-rose-300 uppercase tracking-widest">
                EXAM / BOSS RUSH MODE ACTIVE
              </div>
              <div className="text-xs text-slate-300">
                Quests upgraded to Boss Battles! Complete all to defeat trial. Exam Target: {state.bossRushExamDate || 'Upcoming Trial'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Temptation Check banner if triggered */}
      {incompleteQuests.length > 0 && temptationQuestId && (
        <div className="p-4 rounded-2xl bg-purple-950/80 border border-purple-600 text-slate-100 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold font-mono text-purple-300">
            <AlertOctagon className="w-5 h-5 text-purple-400" />
            TEMPTATION CHECK: LATE DAY RESOLUTION
          </div>
          <p className="text-xs text-slate-300">
            You have incomplete quests remaining. Do you wish to skip today with no penalty, or Push Through for bonus Willpower XP?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                triggerTemptationSkip(temptationQuestId);
                setTemptationQuestId(null);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-400 text-xs font-mono border border-slate-800"
            >
              Skip (No Penalty / No XP)
            </button>
            <button
              onClick={() => {
                triggerTemptationPush(temptationQuestId);
                setTemptationQuestId(null);
              }}
              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold shadow-md shadow-purple-950"
            >
              Push Through (+20% Willpower XP)
            </button>
          </div>
        </div>
      )}

      {/* Daily Quests Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-cyan-300 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-cyan-400" />
            {state.isBossRushMode ? 'BOSS BATTLES' : 'DAILY QUEST CHECKLIST'}
          </h2>
          <p className="text-xs text-slate-400">
            Complete daily quests to gain XP, raise core stats, and build streak velocity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {incompleteQuests.length > 0 && !temptationQuestId && (
            <button
              onClick={() => setTemptationQuestId(incompleteQuests[0].id)}
              className="px-3 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-700/60 text-purple-300 text-xs font-mono"
            >
              Temptation Check
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs tracking-wider shadow-lg shadow-blue-900/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            ADD QUEST
          </button>
        </div>
      </div>

      {/* Quests List */}
      <div className="space-y-3">
        {state.quests.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 font-mono text-sm">
            No daily quests currently scheduled. Click "ADD QUEST" to create your first quest!
          </div>
        ) : (
          state.quests.map((quest) => (
            <div
              key={quest.id}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                quest.completed
                  ? 'bg-slate-900/40 border-slate-800/50 text-slate-500 opacity-75'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => completeQuest(quest.id)}
                  disabled={quest.completed}
                  className="mt-0.5 text-cyan-400 hover:text-cyan-300 transition-colors disabled:cursor-not-allowed"
                >
                  {quest.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500 hover:text-cyan-400" />
                  )}
                </button>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`font-semibold text-sm ${
                        quest.completed ? 'line-through text-slate-500' : 'text-slate-100'
                      }`}
                    >
                      {quest.title}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-950 text-cyan-400 border border-blue-800 text-[10px] font-mono font-bold uppercase">
                      {quest.stat}
                    </span>
                    {getDifficultyBadge(quest.difficulty)}
                  </div>
                  {quest.description && (
                    <p className="text-xs text-slate-400 mt-1">{quest.description}</p>
                  )}
                  {quest.consecutiveCompletions > 0 && (
                    <div className="mt-1 text-[11px] text-amber-400 font-mono flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-500" />
                      {quest.consecutiveCompletions}/21 Consecutive Days to Locked-In Habit
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 font-mono text-xs">
                <span className="text-slate-400">+{DIFFICULTY_XP[quest.difficulty]} XP</span>
                <button
                  onClick={() => deleteQuest(quest.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-950 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Manual End Day Check trigger for testing */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={manuallyEndDayCheck}
          className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono"
        >
          [Dev Action: Trigger Day Cycle Reset]
        </button>
      </div>

      {/* AUTOMATED HABITS (Locked-In Habits) Section */}
      <div className="pt-6 border-t border-slate-800/80 space-y-4">
        <div>
          <h3 className="text-sm font-bold font-mono text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            LOCKED-IN HABITS (TROPHY WALL)
          </h3>
          <p className="text-xs text-slate-400">
            Quests completed for 21+ consecutive days automatically move here as fully automated subconscious habits.
          </p>
        </div>

        {state.lockedInHabits.length === 0 ? (
          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 text-center text-xs text-slate-500 font-mono">
            No locked-in habits yet. Maintain a quest for 21 days straight to lock it in!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {state.lockedInHabits.map((habit) => (
              <div
                key={habit.id}
                className="p-3.5 rounded-xl bg-slate-900 border border-amber-800/60 flex items-center gap-3 shadow-md shadow-amber-950/20"
              >
                <div className="p-2 rounded-lg bg-amber-950 text-amber-400 border border-amber-700">
                  <Flame className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-xs font-bold font-mono text-slate-200">{habit.title}</div>
                  <div className="text-[10px] text-amber-400 font-mono">
                    Stat: {habit.stat} • {habit.totalCompletions} Days Automated
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Quest Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl">
            <h3 className="text-lg font-bold font-mono text-cyan-300 mb-4">
              CREATE NEW QUEST
            </h3>

            <form onSubmit={handleCreateQuest} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">QUEST TITLE</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g., Complete 30 Pushups & Core Plank"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">DESCRIPTION (OPTIONAL)</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Specific targets or notes"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">STAT CATEGORY</label>
                  <select
                    value={stat}
                    onChange={(e) => setStat(e.target.value as StatType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none"
                  >
                    <option value="STR">STR - Strength (Fitness)</option>
                    <option value="INT">INT - Intelligence (Study/Code)</option>
                    <option value="VIT">VIT - Vitality (Diet/Sleep)</option>
                    <option value="AGI">AGI - Agility (Consistency)</option>
                    <option value="PER">PER - Perception (Social)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">DIFFICULTY RANK</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none"
                  >
                    <option value="EASY">Easy (E) - 10 XP</option>
                    <option value="MEDIUM">Medium (C) - 25 XP</option>
                    <option value="HARD">Hard (A) - 50 XP</option>
                    <option value="VERY_HARD">Very Hard (S) - 100 XP</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-900/30"
                >
                  Add Quest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
