import React, { useState } from 'react';
import { Calendar, Plus, Trash2, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { Difficulty, Quest, StatType } from '../../types';

export const WeeklyPlanTab: React.FC = () => {
  const { state, addQuest, deleteQuest } = useSystem();

  const daysOfWeek: Quest['scheduledDay'][] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Quest['scheduledDay']>('Mon');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskStat, setTaskStat] = useState<StatType>('STR');
  const [taskDiff, setTaskDiff] = useState<Difficulty>('MEDIUM');

  const handleAddPlanTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addQuest(taskTitle, taskDesc, taskStat, taskDiff, selectedDay);
    setTaskTitle('');
    setTaskDesc('');
    setShowAddModal(false);
  };

  // Planned vs Completed summary
  const totalPlanned = state.quests.length;
  const totalCompleted = state.quests.filter((q) => q.completed).length;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-cyan-300 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            WEEKLY TASK PLANNER
          </h2>
          <p className="text-xs text-slate-400">
            Pre-plan quests for Mon–Sun. Scheduled tasks auto-sync with your Daily Quest Checklist.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs flex items-center gap-4">
          <div>
            <span className="text-slate-400">Week Overview:</span>{' '}
            <strong className="text-cyan-400">{totalCompleted}</strong> / {totalPlanned} Completed
          </div>
        </div>
      </div>

      {/* Days Grid (Mon-Sun) */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {daysOfWeek.map((day) => {
          const dayQuests = state.quests.filter((q) => q.scheduledDay === day);

          return (
            <div
              key={day}
              className="p-3 rounded-2xl bg-slate-900 border border-slate-800/80 flex flex-col justify-between space-y-3 min-h-[220px]"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2">
                  <span className="font-mono font-bold text-sm text-cyan-300">{day}</span>
                  <button
                    onClick={() => {
                      setSelectedDay(day);
                      setShowAddModal(true);
                    }}
                    className="p-1 rounded bg-slate-950 hover:bg-blue-950 text-slate-400 hover:text-cyan-300 transition-colors"
                    title={`Add task for ${day}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {dayQuests.length === 0 ? (
                    <div className="text-[11px] text-slate-600 font-mono text-center py-4">
                      No tasks
                    </div>
                  ) : (
                    dayQuests.map((quest) => (
                      <div
                        key={quest.id}
                        className={`p-2 rounded-lg border text-xs font-mono transition-all ${
                          quest.completed
                            ? 'bg-slate-950/60 border-slate-800 text-slate-500 line-through'
                            : 'bg-slate-950 border-slate-800/80 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold truncate">{quest.title}</span>
                          <span className="text-[9px] px-1 py-0.5 rounded bg-blue-950 text-cyan-400 border border-blue-900">
                            {quest.stat}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                          <span>{quest.difficulty}</span>
                          <button
                            onClick={() => deleteQuest(quest.id)}
                            className="text-slate-600 hover:text-rose-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedDay(day);
                  setShowAddModal(true);
                }}
                className="w-full py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 text-[11px] font-mono border border-slate-800 flex items-center justify-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Task
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl">
            <h3 className="text-lg font-bold font-mono text-cyan-300 mb-4">
              SCHEDULE TASK FOR {selectedDay.toUpperCase()}
            </h3>

            <form onSubmit={handleAddPlanTask} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">TASK TITLE</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="E.g., Complete 2 LeetCode questions"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">DESCRIPTION (OPTIONAL)</label>
                <input
                  type="text"
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Subtasks or criteria"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">STAT</label>
                  <select
                    value={taskStat}
                    onChange={(e) => setTaskStat(e.target.value as StatType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none"
                  >
                    <option value="STR">STR (Fitness)</option>
                    <option value="INT">INT (Study/Code)</option>
                    <option value="VIT">VIT (Health/Sleep)</option>
                    <option value="AGI">AGI (Consistency)</option>
                    <option value="PER">PER (Social)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">DIFFICULTY</label>
                  <select
                    value={taskDiff}
                    onChange={(e) => setTaskDiff(e.target.value as Difficulty)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none"
                  >
                    <option value="EASY">Easy (E)</option>
                    <option value="MEDIUM">Medium (C)</option>
                    <option value="HARD">Hard (A)</option>
                    <option value="VERY_HARD">Very Hard (S)</option>
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
                  Schedule Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
