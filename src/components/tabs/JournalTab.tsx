import React, { useState } from 'react';
import { BookMarked, Calendar, CheckCircle2, Trophy, Clock, FileText } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

export const JournalTab: React.FC = () => {
  const { state, addWeeklyReview } = useSystem();

  const [activeSubTab, setActiveSubTab] = useState<'REVIEW' | 'ACHIEVEMENTS'>('REVIEW');

  // Reflection form state
  const [wentWell, setWentWell] = useState('');
  const [needsImprovement, setNeedsImprovement] = useState('');
  const [nextFocus, setNextFocus] = useState('');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wentWell.trim()) return;
    addWeeklyReview(wentWell, needsImprovement, nextFocus);
    setWentWell('');
    setNeedsImprovement('');
    setNextFocus('');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Sub-tab switcher */}
      <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl max-w-md mx-auto font-mono text-xs">
        <button
          onClick={() => setActiveSubTab('REVIEW')}
          className={`flex-1 py-2 rounded-lg text-center font-bold transition-all ${
            activeSubTab === 'REVIEW'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Weekly Sunday Review
        </button>
        <button
          onClick={() => setActiveSubTab('ACHIEVEMENTS')}
          className={`flex-1 py-2 rounded-lg text-center font-bold transition-all ${
            activeSubTab === 'ACHIEVEMENTS'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Achievement Log Feed
        </button>
      </div>

      {/* 1. WEEKLY REVIEW SUB-TAB */}
      {activeSubTab === 'REVIEW' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold font-mono text-cyan-300 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              WEEKLY REFLECTION JOURNAL
            </h2>
            <p className="text-xs text-slate-400">
              Reflect on weekly momentum, isolate friction points, and establish next week's core focus.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmitReview} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl text-xs font-mono">
            <div>
              <label className="block text-slate-300 font-bold mb-1">WHAT WENT WELL THIS WEEK?</label>
              <textarea
                required
                rows={2}
                value={wentWell}
                onChange={(e) => setWentWell(e.target.value)}
                placeholder="E.g., Hit 5 workouts, completed 3 Python system design modules..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">WHAT NEEDS IMPROVEMENT?</label>
              <textarea
                rows={2}
                value={needsImprovement}
                onChange={(e) => setNeedsImprovement(e.target.value)}
                placeholder="E.g., Sleep was under 6 hours on Thursday; reduced focus during evening tasks..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">NEXT WEEK'S CORE FOCUS</label>
              <textarea
                rows={2}
                value={nextFocus}
                onChange={(e) => setNextFocus(e.target.value)}
                placeholder="E.g., Prioritize sleep discipline & complete 2 INT hard quests..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-900/30"
            >
              Save Weekly Reflection (+30 AGI XP)
            </button>
          </form>

          {/* Past Reviews */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold font-mono text-slate-300 uppercase">PAST REFLECTION LOGS</h3>
            {state.weeklyReviews.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 font-mono text-xs">
                No reflection logs recorded yet.
              </div>
            ) : (
              state.weeklyReviews.map((rev) => (
                <div key={rev.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs shadow-lg">
                  <div className="text-cyan-400 font-bold border-b border-slate-800 pb-2">
                    Reflection Date: {rev.weekStartDate}
                  </div>
                  <div>
                    <strong className="text-slate-400">Went Well:</strong>
                    <p className="text-slate-200 mt-0.5">{rev.whatWentWell}</p>
                  </div>
                  {rev.whatNeedsImprovement && (
                    <div>
                      <strong className="text-slate-400">Needs Improvement:</strong>
                      <p className="text-slate-300 mt-0.5">{rev.whatNeedsImprovement}</p>
                    </div>
                  )}
                  {rev.nextWeekFocus && (
                    <div>
                      <strong className="text-slate-400">Next Week Focus:</strong>
                      <p className="text-cyan-300 mt-0.5">{rev.nextWeekFocus}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 2. ACHIEVEMENT LOG FEED SUB-TAB */}
      {activeSubTab === 'ACHIEVEMENTS' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold font-mono text-amber-300 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              SYSTEM ACHIEVEMENT LOG FEED
            </h2>
            <p className="text-xs text-slate-400">
              Timestamped feed of every completed quest, level-up, title unlock, and milestone feat.
            </p>
          </div>

          <div className="space-y-3">
            {state.achievementLogs.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 font-mono text-xs">
                No achievements recorded yet.
              </div>
            ) : (
              state.achievementLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 flex items-start gap-3 font-mono text-xs shadow-md"
                >
                  <div className="p-2 rounded-lg bg-blue-950 text-cyan-400 border border-blue-800">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100">{log.title}</span>
                      <span className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-0.5">{log.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
