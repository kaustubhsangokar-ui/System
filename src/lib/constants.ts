import { Difficulty, PathType, Rank, SkillItem, CosmeticItem, Reward, StatType } from '../types';

export const DIFFICULTY_XP: Record<Difficulty, number> = {
  EASY: 10,
  MEDIUM: 25,
  HARD: 50,
  VERY_HARD: 100,
};

export function getXpForNextLevel(level: number): number {
  return level * 100;
}

export function getRankFromLevel(level: number): Rank {
  if (level <= 10) return 'E-Rank';
  if (level <= 25) return 'D-Rank';
  if (level <= 40) return 'C-Rank';
  if (level <= 60) return 'B-Rank';
  if (level <= 80) return 'A-Rank';
  return 'S-Rank';
}

export function getProgressionTitleFromLevel(level: number): string {
  if (level <= 10) return 'The Beginner';
  if (level <= 25) return 'The Builder';
  if (level <= 40) return 'The Disciplined';
  if (level <= 60) return 'The Relentless';
  if (level <= 80) return 'The Unshaken';
  return 'The Sovereign Self';
}

export const PATH_DESCRIPTIONS: Record<PathType, { name: string; bonus: string; desc: string }> = {
  THE_BUILDER: {
    name: 'The Builder',
    bonus: '+10% XP on STR Quests',
    desc: 'Focuses on physical strength, stamina, and health optimization.',
  },
  THE_STRATEGIST: {
    name: 'The Strategist',
    bonus: '+10% XP on INT Quests',
    desc: 'Focuses on cognitive growth, problem solving, learning, and technical mastery.',
  },
  THE_READER: {
    name: 'The Reader',
    bonus: '+10% XP on PER Quests',
    desc: 'Focuses on high perception, social dynamics, communication, and emotional intelligence.',
  },
  THE_COMPLETE_SELF: {
    name: 'The Complete Self',
    bonus: '+20% Weekly Balanced Growth Bonus',
    desc: 'Balanced growth path that rewards developing all 5 core attributes evenly.',
  },
};

export const DEFAULT_SKILLS: SkillItem[] = [
  {
    id: 's1',
    title: 'Iron Will',
    description: 'Maintain a 30-day streak of total quest completion.',
    badgeIcon: 'Flame',
    reqType: 'STREAK',
    reqValue: 30,
    unlocked: false,
  },
  {
    id: 's2',
    title: 'Deep Focus',
    description: 'Complete 50 Intelligence (INT) quests.',
    badgeIcon: 'BrainCircuit',
    reqType: 'STAT_QUESTS',
    reqValue: 50,
    statTarget: 'INT',
    unlocked: false,
  },
  {
    id: 's3',
    title: 'Foundation Built',
    description: 'Complete 30 Strength (STR) quests.',
    badgeIcon: 'Dumbbell',
    reqType: 'STAT_QUESTS',
    reqValue: 30,
    statTarget: 'STR',
    unlocked: false,
  },
  {
    id: 's4',
    title: 'Master Observer',
    description: 'Log 10 Perception log entries.',
    badgeIcon: 'Eye',
    reqType: 'PERCEPTION_LOGS',
    reqValue: 10,
    unlocked: false,
  },
  {
    id: 's5',
    title: 'Unstoppable Force',
    description: 'Complete 10 Very Hard (S-Rank) quests.',
    badgeIcon: 'ShieldAlert',
    reqType: 'CUSTOM',
    reqValue: 10,
    unlocked: false,
  },
];

export const DEFAULT_REWARDS: Reward[] = [
  { id: 'r1', title: 'Cheat Meal', cost: 50, description: 'Enjoy a guilt-free favorite meal.', timesRedeemed: 0 },
  { id: 'r2', title: 'Movie Night', cost: 80, description: 'Watch a movie or show without distraction.', timesRedeemed: 0 },
  { id: 'r3', title: 'Gaming Session (2 hrs)', cost: 60, description: '2 hours of immersive gaming guilt-free.', timesRedeemed: 0 },
  { id: 'r4', title: 'Buy a Favorite Book', cost: 150, description: 'Reward yourself with a new hardcopy book.', timesRedeemed: 0 },
];

export const DEFAULT_COSMETICS: CosmeticItem[] = [
  { id: 'c1', name: 'Shadow Navy (Default)', type: 'THEME', cost: 0, unlocked: true, previewColor: '#3b82f6', themeId: 'shadow-navy' },
  { id: 'c2', name: 'Violet Sovereign', type: 'THEME', cost: 100, unlocked: false, previewColor: '#a855f7', themeId: 'violet-sovereign' },
  { id: 'c3', name: 'Crimson Monarch', type: 'THEME', cost: 150, unlocked: false, previewColor: '#f43f5e', themeId: 'crimson-monarch' },
  { id: 'c4', name: 'Emerald Sovereign', type: 'THEME', cost: 150, unlocked: false, previewColor: '#10b981', themeId: 'emerald-sovereign' },
  { id: 'c5', name: 'Cyber Gold', type: 'THEME', cost: 250, unlocked: false, previewColor: '#eab308', themeId: 'cyber-gold' },
  { id: 'i1', name: 'Classic RPG Icons', type: 'ICON_SET', cost: 0, unlocked: true, iconSetId: 'classic' },
  { id: 'i2', name: 'Glowing Rune Icons', type: 'ICON_SET', cost: 80, unlocked: false, iconSetId: 'runes' },
];

export const STAT_METADATA: Record<StatType, { name: string; desc: string; color: string; iconName: string }> = {
  STR: { name: 'Strength', desc: 'Fitness, endurance & physical power', color: '#ef4444', iconName: 'Dumbbell' },
  INT: { name: 'Intelligence', desc: 'Study, coding & analytical skills', color: '#3b82f6', iconName: 'Brain' },
  VIT: { name: 'Vitality', desc: 'Nutrition, sleep & physical energy', color: '#10b981', iconName: 'HeartPulse' },
  AGI: { name: 'Agility', desc: 'Consistency, reflexes & speed', color: '#f59e0b', iconName: 'Zap' },
  PER: { name: 'Perception', desc: 'Social awareness, communication & focus', color: '#a855f7', iconName: 'Eye' },
  LUK: { name: 'Luck', desc: 'Random windfalls, bonus events & hidden feats', color: '#ec4899', iconName: 'Sparkles' },
};
