import React, { useState } from 'react';
import { Compass, BookOpen, Eye, Plus, CheckCircle2, Circle, Trash2, Sparkles, Shield } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { VisionGoal } from '../../types';

export const VisionAndStoryTab: React.FC = () => {
  const {
    state,
    saveOriginStory,
    addPerceptionEntry,
    addVisionGoal,
    toggleVisionGoal,
    deleteVisionGoal,
  } = useSystem();

  const [activeSubTab, setActiveSubTab] = useState<'VISION' | 'STORY' | 'PERCEPTION'>('VISION');

  // Perception log form
  const [perceptionText, setPerceptionText] = useState('');

  // Vision goal modal
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalCategory, setGoalCategory] = useState<VisionGoal['category']>('CAREER');
  const [goalText, setGoalText] = useState('');
  const [goalDate, setGoalDate] = useState('');

  // Story edit state
  const [isEditingStory, setIsEditingStory] = useState(false);
  const [editedStory, setEditedStory] = useState(state.originStory);

  const handleAddPerception = (e: React.FormEvent) => {
    e.preventDefault();
    if (!perceptionText.trim()) return;
    addPerceptionEntry(perceptionText);
    setPerceptionText('');
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalText.trim()) return;
    addVisionGoal(goalCategory, goalText, goalDate);
    setGoalText('');
    setGoalDate('');
    setShowGoalModal(false);
  };

  const handleSaveEditedStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedStory.trim()) return;
    saveOriginStory(editedStory);
    setIsEditingStory(false);
  };

  const categories: { id: VisionGoal['category']; label: string; color: string }[] = [
    { id: 'CAREER', label: 'Career & Mastery', color: 'text-blue-400 border-blue-800 bg-blue-950/40' },
    { id: 'PHYSIQUE', label: 'Physique & Health', color: 'text-rose-400 border-rose-800 bg-rose-950/40' },
    { id: 'FINANCIAL', label: 'Financial Freedom', color: 'text-emerald-400 border-emerald-800 bg-emerald-950/40' },
    { id: 'PERSONAL', label: 'Personal & Character', color: 'text-purple-400 border-purple-800 bg-purple-950/40' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Sub-tab switcher */}
      <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl max-w-md mx-auto font-mono text-xs">
        <button
          onClick={() => setActiveSubTab('VISION')}
          className={`flex-1 py-2 rounded-lg text-center font-bold transition-all ${
            activeSubTab === 'VISION'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Vision Board
        </button>
        <button
          onClick={() => setActiveSubTab('STORY')}
          className={`flex-1 py-2 rounded-lg text-center font-bold transition-all ${
            activeSubTab === 'STORY'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          My Story
        </button>
        <button
          onClick={() => setActiveSubTab('PERCEPTION')}
          className={`flex-1 py-2 rounded-lg text-center font-bold transition-all ${
            activeSubTab === 'PERCEPTION'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Perception Log
        </button>
      </div>

      {/* 1. VISION BOARD SUB-TAB */}
      {activeSubTab === 'VISION' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-mono text-cyan-300 flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-400" />
                LONG-TERM VISION BOARD
              </h2>
              <p className="text-xs text-slate-400">
                Define core long-term pillars across Career, Physique, Financial, and Personal ambitions.
              </p>
            </div>

            <button
              onClick={() => setShowGoalModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs tracking-wider shadow-lg shadow-blue-900/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              ADD VISION GOAL
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((cat) => {
              const catGoals = state.visionGoals.filter((g) => g.category === cat.id);

              return (
                <div
                  key={cat.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl"
                >
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${cat.color}`}>
                      {cat.label}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      {catGoals.filter((g) => g.completed).length}/{catGoals.length} Done
                    </span>
                  </div>

                  <div className="space-y-2">
                    {catGoals.length === 0 ? (
                      <div className="text-xs text-slate-500 font-mono text-center py-4">
                        No goals added for this pillar yet.
                      </div>
                    ) : (
                      catGoals.map((goal) => (
                        <div
                          key={goal.id}
                          className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start justify-between gap-3 text-xs font-mono"
                        >
                          <button
                            onClick={() => toggleVisionGoal(goal.id)}
                            className="mt-0.5 text-cyan-400 hover:text-cyan-300"
                          >
                            {goal.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-600" />
                            )}
                          </button>

                          <div className="flex-1">
                            <span
                              className={`block font-semibold ${
                                goal.completed ? 'line-through text-slate-500' : 'text-slate-200'
                              }`}
                            >
                              {goal.text}
                            </span>
                            {goal.targetDate && (
                              <span className="text-[10px] text-slate-500">Target: {goal.targetDate}</span>
                            )}
                          </div>

                          <button
                            onClick={() => deleteVisionGoal(goal.id)}
                            className="text-slate-600 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. ORIGIN STORY SUB-TAB */}
      {activeSubTab === 'STORY' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-cyan-400" />
              <div>
                <h2 className="text-lg font-bold font-mono text-cyan-300">MY ORIGIN STORY</h2>
                <p className="text-xs text-slate-400">Your foundational declaration of awakening purpose.</p>
              </div>
            </div>

            <button
              onClick={() => setIsEditingStory(!isEditingStory)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono"
            >
              {isEditingStory ? 'Cancel' : 'Edit Story'}
            </button>
          </div>

          {isEditingStory ? (
            <form onSubmit={handleSaveEditedStory} className="space-y-4">
              <textarea
                value={editedStory}
                onChange={(e) => setEditedStory(e.target.value)}
                rows={6}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 font-mono resize-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs"
              >
                Save Story
              </button>
            </form>
          ) : (
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800/80 text-sm font-mono text-slate-200 leading-relaxed italic">
              "{state.originStory || 'No story recorded yet.'}"
            </div>
          )}
        </div>
      )}

      {/* 3. PERCEPTION LOG SUB-TAB */}
      {activeSubTab === 'PERCEPTION' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold font-mono text-purple-300 flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-400" />
              PERCEPTION LOG (PER XP)
            </h2>
            <p className="text-xs text-slate-400">
              Record private observations on social dynamics, non-verbal communication, or emotional cues. Earns +15 PER XP per entry.
            </p>
          </div>

          {/* New Entry Form */}
          <form onSubmit={handleAddPerception} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
            <textarea
              value={perceptionText}
              onChange={(e) => setPerceptionText(e.target.value)}
              required
              rows={3}
              placeholder="E.g., Observed body language shift during team meeting when discussing deadlines..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500 resize-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs shadow-lg shadow-purple-950"
              >
                Log Entry (+15 PER XP)
              </button>
            </div>
          </form>

          {/* Log Entries */}
          <div className="space-y-3">
            {state.perceptionLogs.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 font-mono text-xs">
                No perception logs recorded yet.
              </div>
            ) : (
              state.perceptionLogs.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono space-y-1 shadow-md"
                >
                  <div className="flex items-center justify-between text-slate-500 text-[10px]">
                    <span>{new Date(entry.timestamp).toLocaleString()}</span>
                    <span className="text-purple-400 font-bold">+{entry.xpAwarded} PER XP</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed">{entry.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl">
            <h3 className="text-lg font-bold font-mono text-cyan-300 mb-4">
              ADD VISION GOAL
            </h3>

            <form onSubmit={handleAddGoal} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">PILLAR CATEGORY</label>
                <select
                  value={goalCategory}
                  onChange={(e) => setGoalCategory(e.target.value as VisionGoal['category'])}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none"
                >
                  <option value="CAREER">Career & Mastery</option>
                  <option value="PHYSIQUE">Physique & Health</option>
                  <option value="FINANCIAL">Financial Freedom</option>
                  <option value="PERSONAL">Personal & Character</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">GOAL DESCRIPTION</label>
                <input
                  type="text"
                  required
                  value={goalText}
                  onChange={(e) => setGoalText(e.target.value)}
                  placeholder="E.g., Reach 12% body fat with clean muscular endurance"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">TARGET DATE (OPTIONAL)</label>
                <input
                  type="date"
                  value={goalDate}
                  onChange={(e) => setGoalDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowGoalModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Add Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
