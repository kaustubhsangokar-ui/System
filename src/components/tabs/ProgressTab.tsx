import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calendar, Activity, Plus } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { useSystem } from '../../context/SystemContext';

export const ProgressTab: React.FC = () => {
  const { state, addMonthlyBaseline } = useSystem();
  const [xpToggle, setXpToggle] = useState<'DAILY' | 'WEEKLY'>('DAILY');

  // Baseline modal state
  const [showBaselineModal, setShowBaselineModal] = useState(false);
  const [pushups, setPushups] = useState<number>(40);
  const [codingSpeed, setCodingSpeed] = useState<number>(4);
  const [meditation, setMeditation] = useState<number>(20);
  const [benchPress, setBenchPress] = useState<number>(85);

  const handleRecordBaseline = (e: React.FormEvent) => {
    e.preventDefault();
    addMonthlyBaseline(pushups, codingSpeed, meditation, benchPress);
    setShowBaselineModal(false);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-cyan-300 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            PROGRESS ANALYTICS & BASELINES
          </h2>
          <p className="text-xs text-slate-400">
            Data visualizations of XP momentum, stat attribute growth, and monthly baseline performance benchmarks.
          </p>
        </div>

        <button
          onClick={() => setShowBaselineModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs tracking-wider shadow-lg shadow-blue-900/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          LOG MONTHLY BASELINE
        </button>
      </div>

      {/* Graph 1: XP Earned Over Time */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold font-mono text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            XP GAIN OVER TIME
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setXpToggle('DAILY')}
              className={`px-3 py-1 rounded-lg transition-all ${
                xpToggle === 'DAILY'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setXpToggle('WEEKLY')}
              className={`px-3 py-1 rounded-lg transition-all ${
                xpToggle === 'WEEKLY'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Weekly
            </button>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={state.xpHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                itemStyle={{ color: '#38bdf8' }}
              />
              <Line
                type="monotone"
                dataKey="xp"
                stroke="#38bdf8"
                strokeWidth={3}
                dot={{ fill: '#38bdf8', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Graph 2: Stat Growth Over Time */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="text-sm font-bold font-mono text-slate-100 flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-400" />
          STAT ATTRIBUTE GROWTH
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={state.statHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="STR" stroke="#ef4444" strokeWidth={2} name="STR (Strength)" />
              <Line type="monotone" dataKey="INT" stroke="#3b82f6" strokeWidth={2} name="INT (Intelligence)" />
              <Line type="monotone" dataKey="VIT" stroke="#10b981" strokeWidth={2} name="VIT (Vitality)" />
              <Line type="monotone" dataKey="AGI" stroke="#f59e0b" strokeWidth={2} name="AGI (Agility)" />
              <Line type="monotone" dataKey="PER" stroke="#a855f7" strokeWidth={2} name="PER (Perception)" />
              <Line type="monotone" dataKey="LUK" stroke="#ec4899" strokeWidth={2} name="LUK (Luck)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Graph 3: Quest Completion Rate */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="text-sm font-bold font-mono text-slate-100 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-400" />
          QUEST COMPLETION VS MISSED (WEEKLY)
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={state.questCompletionHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="week" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Completed Quests" />
              <Bar dataKey="missed" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Missed Quests" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Baseline Test Comparison Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div>
          <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider">
            MONTHLY BASELINE TEST COMPARISON
          </h3>
          <p className="text-xs text-slate-400">
            Compare key physical and cognitive baseline scores month-over-month.
          </p>
        </div>

        {state.monthlyBaselines.length === 0 ? (
          <div className="p-6 rounded-xl bg-slate-950 text-center text-xs text-slate-500 font-mono">
            No baseline tests recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2 px-3">Month</th>
                  <th className="py-2 px-3">Max Push-ups</th>
                  <th className="py-2 px-3">Coding Speed (30m)</th>
                  <th className="py-2 px-3">Meditation (mins)</th>
                  <th className="py-2 px-3">Bench Press (kg)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {state.monthlyBaselines.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-950/50">
                    <td className="py-2.5 px-3 font-bold text-cyan-400">{b.date}</td>
                    <td className="py-2.5 px-3">{b.pushups} reps</td>
                    <td className="py-2.5 px-3">{b.codingSpeed} problems</td>
                    <td className="py-2.5 px-3">{b.meditationMinutes} mins</td>
                    <td className="py-2.5 px-3">{b.benchPressKg || '-'} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Baseline Modal */}
      {showBaselineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl">
            <h3 className="text-lg font-bold font-mono text-cyan-300 mb-4">
              RECORD MONTHLY BASELINE METRICS
            </h3>

            <form onSubmit={handleRecordBaseline} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">MAX PUSH-UPS IN 1 SET</label>
                <input
                  type="number"
                  required
                  value={pushups}
                  onChange={(e) => setPushups(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">CODING PROBLEMS SOLVED IN 30 MINS</label>
                <input
                  type="number"
                  required
                  value={codingSpeed}
                  onChange={(e) => setCodingSpeed(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">DAILY MEDITATION MINUTES</label>
                <input
                  type="number"
                  required
                  value={meditation}
                  onChange={(e) => setMeditation(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">BENCH PRESS MAX (KG)</label>
                <input
                  type="number"
                  value={benchPress}
                  onChange={(e) => setBenchPress(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBaselineModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-900/30"
                >
                  Save Baseline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
