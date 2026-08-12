import React, { useState } from 'react';
import { BookOpen, Plus, CheckCircle, Circle, Award, ChevronDown, ChevronUp, FileCode } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

export const CoursesTab: React.FC = () => {
  const { state, addCourse, toggleCourseLesson } = useSystem();

  const [showAddModal, setShowAddModal] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [lessonsInput, setLessonsInput] = useState('');

  const [practiceNotesMap, setPracticeNotesMap] = useState<Record<string, string>>({});

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim() || !lessonsInput.trim()) return;

    const lessons = lessonsInput
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lessons.length === 0) return;

    addCourse(courseTitle, courseDesc, lessons);
    setCourseTitle('');
    setCourseDesc('');
    setLessonsInput('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-cyan-300 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            COURSE & SKILL TRACKER
          </h2>
          <p className="text-xs text-slate-400">
            Structure complex learning paths, complete lessons to earn INT XP, and record practice logs.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs tracking-wider shadow-lg shadow-blue-900/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          NEW COURSE
        </button>
      </div>

      <div className="space-y-6">
        {state.courses.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 font-mono text-sm">
            No active courses. Click "NEW COURSE" to create a structured curriculum!
          </div>
        ) : (
          state.courses.map((course) => {
            const completedCount = course.lessons.filter((l) => l.completed).length;
            const totalCount = course.lessons.length;
            const pct = Math.round((completedCount / totalCount) * 100);

            return (
              <div
                key={course.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold font-mono text-slate-100">
                        {course.title}
                      </h3>
                      {course.completed && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold flex items-center gap-1">
                          <Award className="w-3.5 h-3.5" />
                          FINISHED (+100 XP)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{course.description}</p>
                  </div>

                  <div className="font-mono text-xs text-right">
                    <span className="text-cyan-400 font-bold">
                      {completedCount} / {totalCount} Lessons ({pct}%)
                    </span>
                    <div className="w-36 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800 mt-1">
                      <div
                        className="h-full bg-cyan-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Lessons list */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  {course.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <button
                          onClick={() =>
                            toggleCourseLesson(
                              course.id,
                              lesson.id,
                              practiceNotesMap[lesson.id]
                            )
                          }
                          className="flex items-center gap-3 text-left hover:text-cyan-300 transition-colors"
                        >
                          {lesson.completed ? (
                            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-600 flex-shrink-0" />
                          )}
                          <span
                            className={`text-xs font-mono font-semibold ${
                              lesson.completed
                                ? 'line-through text-slate-500'
                                : 'text-slate-200'
                            }`}
                          >
                            {lesson.title}
                          </span>
                        </button>
                        <span className="text-[10px] font-mono text-cyan-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-900">
                          +20 INT XP
                        </span>
                      </div>

                      {/* Linked Practice Task Note Field */}
                      {lesson.completed && (
                        <div className="pl-8 pt-1">
                          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mb-1">
                            <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Practice Task Log / Notes Solved:</span>
                          </div>
                          <input
                            type="text"
                            defaultValue={lesson.practiceNotes || ''}
                            onBlur={(e) => {
                              setPracticeNotesMap((prev) => ({
                                ...prev,
                                [lesson.id]: e.target.value,
                              }));
                              toggleCourseLesson(course.id, lesson.id, e.target.value);
                            }}
                            placeholder="E.g., Solved 3 array indexing problems in Python..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl">
            <h3 className="text-lg font-bold font-mono text-cyan-300 mb-4">
              CREATE LEARNING COURSE
            </h3>

            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">COURSE TITLE</label>
                <input
                  type="text"
                  required
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="E.g., Python Data Structures & Algorithmic Design"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">DESCRIPTION</label>
                <input
                  type="text"
                  value={courseDesc}
                  onChange={(e) => setCourseDesc(e.target.value)}
                  placeholder="Course goals and outcome targets"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  LESSONS (ONE LESSON PER LINE)
                </label>
                <textarea
                  required
                  rows={5}
                  value={lessonsInput}
                  onChange={(e) => setLessonsInput(e.target.value)}
                  placeholder={`1. Introduction & Setup\n2. Array Operations\n3. Binary Trees\n4. Dynamic Programming`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 resize-none"
                />
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
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
