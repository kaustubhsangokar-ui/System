import { AppState, Quest, StatType } from '../types';
import { DEFAULT_COSMETICS, DEFAULT_REWARDS, DEFAULT_SKILLS } from './constants';

const STORAGE_KEY = 'THE_SYSTEM_APP_STATE_V1';

export function getTodayDateString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export function getDaysBetween(dateStr1: string, dateStr2: string): number {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export const INITIAL_APP_STATE: AppState = {
  isGuestMode: false,
  guestId: '',
  isSignedIn: false,
  originStory: '',
  originStoryCompleted: false,

  totalXp: 0,
  level: 1,
  gold: 0,
  currentStreak: 0,
  longestStreak: 0,
  selectedPath: 'THE_STRATEGIST',
  selectedTitle: 'The Beginner',
  unlockedTitles: [
    'The Beginner',
    'The Solver',
    'The Unbreakable',
    'The Comeback',
    'The Early Mover',
    'The Observer',
  ],

  isHardcoreMode: false,
  isBossRushMode: false,
  bossRushExamDate: '',
  activeTheme: 'shadow-navy',
  activeIconSet: 'classic',

  stats: {
    STR: { code: 'STR', name: 'Strength', description: 'Gym & physical conditioning', value: 0, lastXpDate: getTodayDateString(), isNeglected: false },
    INT: { code: 'INT', name: 'Intelligence', description: 'Study, coding & logic', value: 0, lastXpDate: getTodayDateString(), isNeglected: false },
    VIT: { code: 'VIT', name: 'Vitality', description: 'Diet, sleep & recovery', value: 0, lastXpDate: getTodayDateString(), isNeglected: false },
    AGI: { code: 'AGI', name: 'Agility', description: 'Consistency & streak velocity', value: 0, lastXpDate: getTodayDateString(), isNeglected: false },
    PER: { code: 'PER', name: 'Perception', description: 'Social & soft skills', value: 0, lastXpDate: getTodayDateString(), isNeglected: false },
    LUK: { code: 'LUK', name: 'Luck', description: 'Random opportunities & events', value: 0, lastXpDate: getTodayDateString(), isNeglected: false },
  },

  hardQuestConsecutiveDays: 0,
  isFatigued: false,
  consecutiveMissedDays: 0,
  emergencyQuestActive: false,

  quests: [
    {
      id: 'q1',
      title: 'Workout & Core Training (45 mins)',
      description: 'Push-ups, squats, or gym session',
      stat: 'STR',
      difficulty: 'HARD',
      completed: false,
      consecutiveCompletions: 0,
      scheduledDay: 'Mon',
    },
    {
      id: 'q2',
      title: 'Solve 2 Complex LeetCode / Coding Tasks',
      description: 'Focus on data structures or algorithms',
      stat: 'INT',
      difficulty: 'HARD',
      completed: false,
      consecutiveCompletions: 0,
      scheduledDay: 'Mon',
    },
    {
      id: 'q3',
      title: 'Sleep 7+ Hours & Clean Hydration',
      description: 'Prioritize physical recovery',
      stat: 'VIT',
      difficulty: 'MEDIUM',
      completed: false,
      consecutiveCompletions: 0,
      scheduledDay: 'Mon',
    },
    {
      id: 'q4',
      title: 'Log Perception Note or Active Listening Practice',
      description: 'Note social cues or emotional body language',
      stat: 'PER',
      difficulty: 'EASY',
      completed: false,
      consecutiveCompletions: 0,
      scheduledDay: 'Mon',
    },
  ],

  lockedInHabits: [
    {
      id: 'h1',
      title: 'Drink 3L Water Daily',
      stat: 'VIT',
      totalCompletions: 28,
      lockedInDate: getTodayDateString(),
    },
  ],

  courses: [
    {
      id: 'c1',
      title: 'Mastering Full-Stack System Architecture',
      description: 'Learn modern distributed web applications, database design, and scalability patterns.',
      completed: false,
      createdAt: getTodayDateString(),
      lessons: [
        { id: 'l1', title: '1. Modular Monolith vs Microservices', completed: true, practiceNotes: 'Solved 3 system design diagrams.' },
        { id: 'l2', title: '2. Database Indexing & Query Optimization', completed: true, practiceNotes: 'Ran EXPLAIN ANALYZE on Postgres table.' },
        { id: 'l3', title: '3. Caching Strategies with Redis', completed: false },
        { id: 'l4', title: '4. REST vs GraphQL vs gRPC', completed: false },
        { id: 'l5', title: '5. Event Driven Architecture with Kafka', completed: false },
      ],
    },
  ],

  skills: DEFAULT_SKILLS,
  rewards: DEFAULT_REWARDS,
  cosmetics: DEFAULT_COSMETICS,
  perceptionLogs: [],
  visionGoals: [
    { id: 'v1', category: 'CAREER', text: 'Achieve Senior Engineer / Lead Technical position', completed: false },
    { id: 'v2', category: 'PHYSIQUE', text: 'Reach 12% body fat with robust functional strength', completed: false },
    { id: 'v3', category: 'FINANCIAL', text: 'Build 6 months emergency cushion & invest 25% income', completed: false },
    { id: 'v4', category: 'PERSONAL', text: 'Develop calm focus under high-pressure challenges', completed: false },
  ],
  weeklyReviews: [],
  monthlyBaselines: [
    { id: 'mb1', date: '2026-07', pushups: 35, codingSpeed: 3, meditationMinutes: 15, benchPressKg: 75 },
    { id: 'mb2', date: '2026-08', pushups: 42, codingSpeed: 4, meditationMinutes: 20, benchPressKg: 80 },
  ],
  achievementLogs: [
    {
      id: 'al1',
      timestamp: new Date().toISOString(),
      type: 'TITLE',
      title: 'System Awakened',
      description: 'Initiated System protocol as a new Player.',
    },
  ],
  dailySleepLogs: {
    [getTodayDateString()]: 7.5,
  },

  rival: {
    name: 'Shadow Self (Benchmark)',
    startingLevel: 5,
    currentLevel: 8,
    currentXp: 850,
  },

  xpHistory: [
    { date: '2026-08-05', xp: 50 },
    { date: '2026-08-06', xp: 85 },
    { date: '2026-08-07', xp: 110 },
    { date: '2026-08-08', xp: 95 },
    { date: '2026-08-09', xp: 120 },
    { date: '2026-08-10', xp: 140 },
    { date: '2026-08-11', xp: 75 },
  ],
  statHistory: [
    { date: '2026-08-05', STR: 10, INT: 15, VIT: 10, AGI: 5, PER: 5, LUK: 2 },
    { date: '2026-08-08', STR: 25, INT: 35, VIT: 20, AGI: 15, PER: 10, LUK: 4 },
    { date: '2026-08-11', STR: 40, INT: 50, VIT: 30, AGI: 25, PER: 20, LUK: 6 },
  ],
  questCompletionHistory: [
    { week: 'Week 29', completed: 18, missed: 2 },
    { week: 'Week 30', completed: 22, missed: 1 },
    { week: 'Week 31', completed: 25, missed: 0 },
    { week: 'Week 32', completed: 21, missed: 3 },
  ],
};

export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return checkStatNeglect(INITIAL_APP_STATE);
    const parsed: AppState = JSON.parse(raw);
    return checkStatNeglect(parsed);
  } catch (err) {
    console.error('Failed to parse state from localStorage', err);
    return checkStatNeglect(INITIAL_APP_STATE);
  }
}

export function saveAppState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state to localStorage', err);
  }
}

export function checkStatNeglect(state: AppState): AppState {
  const today = getTodayDateString();
  const updatedStats = { ...state.stats };

  (Object.keys(updatedStats) as StatType[]).forEach((statKey) => {
    if (statKey === 'LUK') return; // LUK doesn't get neglected
    const stat = updatedStats[statKey];
    if (stat.lastXpDate) {
      const days = getDaysBetween(stat.lastXpDate, today);
      if (days >= 5) {
        updatedStats[statKey] = { ...stat, isNeglected: true };
      } else {
        updatedStats[statKey] = { ...stat, isNeglected: false };
      }
    }
  });

  return { ...state, stats: updatedStats };
}
