export type StatType = 'STR' | 'INT' | 'VIT' | 'AGI' | 'PER' | 'LUK';

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'VERY_HARD'; // E(10), C(25), A(50), S(100)

export type Rank = 'E-Rank' | 'D-Rank' | 'C-Rank' | 'B-Rank' | 'A-Rank' | 'S-Rank';

export type ProgressionTitle =
  | 'The Beginner'
  | 'The Builder'
  | 'The Disciplined'
  | 'The Relentless'
  | 'The Unshaken'
  | 'The Sovereign Self';

export type PathType = 'THE_BUILDER' | 'THE_STRATEGIST' | 'THE_READER' | 'THE_COMPLETE_SELF';

export interface StatInfo {
  code: StatType;
  name: string;
  description: string;
  value: number;
  lastXpDate: string; // ISO date string (YYYY-MM-DD)
  isNeglected: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description?: string;
  stat: StatType;
  difficulty: Difficulty;
  completed: boolean;
  completedAt?: string; // ISO string timestamp
  isMissed?: boolean;
  isEmergency?: boolean;
  isBossBattle?: boolean;
  consecutiveCompletions: number; // For 21-day habit conversion
  scheduledDay?: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
}

export interface LockedInHabit {
  id: string;
  title: string;
  stat: StatType;
  totalCompletions: number;
  lockedInDate: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  completed: boolean;
  practiceNotes?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  lessons: CourseLesson[];
  completed: boolean;
  createdAt: string;
}

export interface SkillItem {
  id: string;
  title: string;
  description: string;
  badgeIcon: string;
  reqType: 'STREAK' | 'STAT_QUESTS' | 'PERCEPTION_LOGS' | 'CUSTOM';
  reqValue: number;
  statTarget?: StatType;
  unlocked: boolean;
  isCustom?: boolean;
}

export interface Reward {
  id: string;
  title: string;
  cost: number; // Gold
  description?: string;
  timesRedeemed: number;
}

export interface CosmeticItem {
  id: string;
  name: string;
  type: 'THEME' | 'ICON_SET';
  cost: number;
  unlocked: boolean;
  previewColor?: string;
  themeId?: string;
  iconSetId?: string;
}

export interface PerceptionEntry {
  id: string;
  timestamp: string;
  content: string;
  xpAwarded: number;
}

export interface VisionGoal {
  id: string;
  category: 'CAREER' | 'PHYSIQUE' | 'FINANCIAL' | 'PERSONAL';
  text: string;
  completed: boolean;
  targetDate?: string;
}

export interface WeeklyReview {
  id: string;
  weekStartDate: string;
  whatWentWell: string;
  whatNeedsImprovement: string;
  nextWeekFocus: string;
  createdAt: string;
}

export interface MonthlyBaseline {
  id: string;
  date: string; // YYYY-MM
  pushups: number;
  codingSpeed: number; // problems in 30m
  meditationMinutes: number;
  benchPressKg?: number;
  customMetricName?: string;
  customMetricValue?: number;
}

export interface AchievementLogItem {
  id: string;
  timestamp: string;
  type: 'QUEST' | 'LEVEL_UP' | 'TITLE' | 'HABIT' | 'COURSE' | 'EMERGENCY' | 'PERCEPTION';
  title: string;
  description: string;
  xpGained?: number;
}

export interface RivalInfo {
  name: string;
  startingLevel: number;
  currentLevel: number;
  currentXp: number;
}

export interface DailySleep {
  date: string; // YYYY-MM-DD
  hours: number;
}

export interface AppState {
  // Auth & Mode
  isGuestMode: boolean;
  guestId: string;
  isSignedIn: boolean;
  originStory: string;
  originStoryCompleted: boolean;

  // Progression
  totalXp: number;
  level: number;
  gold: number;
  currentStreak: number;
  longestStreak: number;
  selectedPath: PathType;
  selectedTitle: string;
  unlockedTitles: string[];

  // Settings
  isHardcoreMode: boolean;
  isBossRushMode: boolean;
  bossRushExamDate?: string;
  activeTheme: string; // 'shadow-navy', 'violet-sovereign', 'crimson-monarch', 'emerald-sovereign', 'cyber-gold'
  activeIconSet: string;

  // Stats
  stats: Record<StatType, StatInfo>;

  // Rest & Debuffs
  hardQuestConsecutiveDays: number; // STR or INT hard/very_hard
  isFatigued: boolean;
  consecutiveMissedDays: number;
  emergencyQuestActive: boolean;

  // Collections
  quests: Quest[];
  lockedInHabits: LockedInHabit[];
  courses: Course[];
  skills: SkillItem[];
  rewards: Reward[];
  cosmetics: CosmeticItem[];
  perceptionLogs: PerceptionEntry[];
  visionGoals: VisionGoal[];
  weeklyReviews: WeeklyReview[];
  monthlyBaselines: MonthlyBaseline[];
  achievementLogs: AchievementLogItem[];
  dailySleepLogs: Record<string, number>; // date -> hours

  // Rival
  rival: RivalInfo;

  // History for graphs
  xpHistory: { date: string; xp: number }[];
  statHistory: { date: string; STR: number; INT: number; VIT: number; AGI: number; PER: number; LUK: number }[];
  questCompletionHistory: { week: string; completed: number; missed: number }[];
}
