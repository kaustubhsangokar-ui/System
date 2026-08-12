import React, { createContext, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { AppState, Quest, StatType, Difficulty, PathType, Course, PerceptionEntry, WeeklyReview, MonthlyBaseline, SkillItem, Reward, CosmeticItem, VisionGoal } from '../types';
import { DIFFICULTY_XP, getProgressionTitleFromLevel, getRankFromLevel, getXpForNextLevel, PATH_DESCRIPTIONS } from '../lib/constants';
import { loadAppState, saveAppState, getTodayDateString, checkStatNeglect } from '../lib/storage';

interface SystemContextType {
  state: AppState;
  
  // Auth & Setup
  loginAsGuest: () => void;
  signInGooglePlaceholder: () => void;
  signOutAndClearData: () => void;
  saveOriginStory: (story: string) => void;

  // Actions - Quests
  addQuest: (title: string, description: string, stat: StatType, difficulty: Difficulty, scheduledDay?: Quest['scheduledDay']) => void;
  completeQuest: (questId: string) => void;
  deleteQuest: (questId: string) => void;
  toggleBossRushMode: (examDate?: string) => void;
  triggerTemptationSkip: (questId: string) => void;
  triggerTemptationPush: (questId: string) => void;
  completeEmergencyQuest: () => void;
  manuallyEndDayCheck: () => void;

  // Actions - Perception Log
  addPerceptionEntry: (content: string) => void;

  // Actions - Courses
  addCourse: (title: string, description: string, lessonTitles: string[]) => void;
  toggleCourseLesson: (courseId: string, lessonId: string, practiceNotes?: string) => void;

  // Actions - Sleep & Baseline
  logSleepHours: (hours: number) => void;
  addMonthlyBaseline: (pushups: number, codingSpeed: number, meditationMinutes: number, benchPressKg?: number) => void;

  // Actions - Reviews & Vision
  addWeeklyReview: (whatWentWell: string, whatNeedsImprovement: string, nextWeekFocus: string) => void;
  addVisionGoal: (category: VisionGoal['category'], text: string, targetDate?: string) => void;
  toggleVisionGoal: (goalId: string) => void;
  deleteVisionGoal: (goalId: string) => void;

  // Actions - Path, Settings & Rival
  setSelectedPath: (path: PathType) => void;
  toggleHardcoreMode: (enabled: boolean) => void;
  updateRivalInfo: (name: string, startingLevel: number, currentLevel: number, currentXp: number) => void;

  // Actions - Rewards & Store
  addReward: (title: string, cost: number, description?: string) => void;
  redeemReward: (rewardId: string) => void;
  buyCosmetic: (cosmeticId: string) => void;
  setActiveTheme: (themeId: string) => void;

  // Actions - Skills
  addCustomSkill: (title: string, description: string, reqValue: number, badgeIcon: string) => void;

  // UI Modals
  levelUpModal: { show: boolean; newLevel: number; newTitle: string } | null;
  dismissLevelUpModal: () => void;
  bonusEventModal: { show: boolean; text: string; bonusXp: number } | null;
  dismissBonusEventModal: () => void;
  hiddenQuestModal: { show: boolean; questTitle: string; xp: number } | null;
  completeHiddenQuest: () => void;
  dismissHiddenQuestModal: () => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => loadAppState());
  const [levelUpModal, setLevelUpModal] = useState<{ show: boolean; newLevel: number; newTitle: string } | null>(null);
  const [bonusEventModal, setBonusEventModal] = useState<{ show: boolean; text: string; bonusXp: number } | null>(null);
  const [hiddenQuestModal, setHiddenQuestModal] = useState<{ show: boolean; questTitle: string; xp: number } | null>(null);

  // Auto-save whenever state updates
  useEffect(() => {
    saveAppState(state);
  }, [state]);

  // Auth / Setup Handlers
  const loginAsGuest = () => {
    const guestId = 'GUEST-' + Math.floor(100000 + Math.random() * 900000);
    setState((prev) => ({
      ...prev,
      isGuestMode: true,
      guestId,
      isSignedIn: false,
    }));
  };

  const signInGooglePlaceholder = () => {
    alert('Google Sign-In integration is currently running in Guest Sandbox Mode. Data is safely stored locally!');
  };

  const signOutAndClearData = () => {
    if (confirm('WARNING: Sign out will erase all guest data on this device. Proceed?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const saveOriginStory = (story: string) => {
    setState((prev) => ({
      ...prev,
      originStory: story,
      originStoryCompleted: true,
      achievementLogs: [
        {
          id: 'al-' + Date.now(),
          timestamp: new Date().toISOString(),
          type: 'TITLE',
          title: 'Origin Declared',
          description: `Awakening Purpose: "${story.substring(0, 60)}..."`,
        },
        ...prev.achievementLogs,
      ],
    }));
  };

  // Helper for applying XP gains with path, sleep, and fatigue multipliers
  const grantXpAndStat = (
    stat: StatType,
    baseXp: number,
    logReason: string,
    isWillpowerBonus = false
  ) => {
    setState((prev) => {
      let multiplier = 1.0;

      // Path Bonus
      if (prev.selectedPath === 'THE_BUILDER' && stat === 'STR') multiplier += 0.1;
      if (prev.selectedPath === 'THE_STRATEGIST' && stat === 'INT') multiplier += 0.1;
      if (prev.selectedPath === 'THE_READER' && stat === 'PER') multiplier += 0.1;

      // Sleep Multiplier (7+ hours = 1.1x)
      const today = getTodayDateString();
      const todaySleep = prev.dailySleepLogs[today] || 0;
      if (todaySleep >= 7.0) {
        multiplier *= 1.1;
      }

      // Fatigue Debuff (0.8x if fatigued)
      if (prev.isFatigued) {
        multiplier *= 0.8;
      }

      // Willpower bonus
      if (isWillpowerBonus) {
        multiplier *= 1.2;
      }

      const finalXp = Math.round(baseXp * multiplier);
      const goldEarned = Math.floor(finalXp / 10);

      const newTotalXp = prev.totalXp + finalXp;
      let newLevel = prev.level;
      let xpNeeded = getXpForNextLevel(newLevel);
      let didLevelUp = false;

      while (newTotalXp >= xpNeeded) {
        newLevel += 1;
        didLevelUp = true;
        xpNeeded += getXpForNextLevel(newLevel);
      }

      const newTitle = getProgressionTitleFromLevel(newLevel);
      if (didLevelUp) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        setLevelUpModal({ show: true, newLevel, newTitle });
      }

      // Update stat value
      const currentStat = prev.stats[stat];
      const updatedStat = {
        ...currentStat,
        value: currentStat.value + finalXp,
        lastXpDate: today,
        isNeglected: false,
      };

      // Random Bonus Event chance (~1 in 10)
      if (Math.random() < 0.12 && !bonusEventModal) {
        setBonusEventModal({
          show: true,
          text: '2x XP Surge Triggered! You tapped into peak focus.',
          bonusXp: 15,
        });
      }

      // Random Hidden Quest chance (~1 in 15)
      if (Math.random() < 0.08 && !hiddenQuestModal) {
        setHiddenQuestModal({
          show: true,
          questTitle: 'HIDDEN FEAT: Complete immediate 20 physical reps or solution review without notes!',
          xp: 30,
        });
      }

      // Add to achievement log
      const newLogItem = {
        id: 'al-' + Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        type: 'QUEST' as const,
        title: `${stat} +${finalXp} XP`,
        description: `${logReason} (${finalXp} XP earned)`,
        xpGained: finalXp,
      };

      // XP History tracking
      const updatedXpHistory = [...prev.xpHistory];
      const existingXpEntry = updatedXpHistory.find((e) => e.date === today);
      if (existingXpEntry) {
        existingXpEntry.xp += finalXp;
      } else {
        updatedXpHistory.push({ date: today, xp: finalXp });
      }

      return {
        ...prev,
        totalXp: newTotalXp,
        level: newLevel,
        gold: prev.gold + goldEarned,
        selectedTitle: newTitle,
        stats: {
          ...prev.stats,
          [stat]: updatedStat,
        },
        achievementLogs: [newLogItem, ...prev.achievementLogs],
        xpHistory: updatedXpHistory,
      };
    });
  };

  // Add Daily Quest
  const addQuest = (title: string, description: string, stat: StatType, difficulty: Difficulty, scheduledDay?: Quest['scheduledDay']) => {
    const newQ: Quest = {
      id: 'q-' + Date.now(),
      title,
      description,
      stat,
      difficulty,
      completed: false,
      consecutiveCompletions: 0,
      scheduledDay: scheduledDay || 'Mon',
    };
    setState((prev) => ({
      ...prev,
      quests: [newQ, ...prev.quests],
    }));
  };

  // Complete Quest
  const completeQuest = (questId: string) => {
    const targetQ = state.quests.find((q) => q.id === questId);
    if (!targetQ || targetQ.completed) return;

    const baseXp = DIFFICULTY_XP[targetQ.difficulty];
    const isHardOrVeryHard = targetQ.difficulty === 'HARD' || targetQ.difficulty === 'VERY_HARD';

    setState((prev) => {
      const updatedQuests = prev.quests.map((q) => {
        if (q.id === questId) {
          const newConsecutive = q.consecutiveCompletions + 1;
          return {
            ...q,
            completed: true,
            completedAt: new Date().toISOString(),
            consecutiveCompletions: newConsecutive,
          };
        }
        return q;
      });

      // Check if all quests completed today -> increment streak
      const allCompleted = updatedQuests.every((q) => q.completed);
      const newStreak = allCompleted ? prev.currentStreak + 1 : prev.currentStreak;
      const newLongest = Math.max(newStreak, prev.longestStreak);

      // Check for 21-day Locked-In Habit conversion
      let updatedHabits = [...prev.lockedInHabits];
      let finalQuests = updatedQuests;

      if (targetQ.consecutiveCompletions + 1 >= 21) {
        const habit = {
          id: 'h-' + Date.now(),
          title: targetQ.title,
          stat: targetQ.stat,
          totalCompletions: 21,
          lockedInDate: getTodayDateString(),
        };
        updatedHabits.push(habit);
        finalQuests = updatedQuests.filter((q) => q.id !== questId);
      }

      // Check Hard/Very Hard fatigue counter
      let hardConsecutive = prev.hardQuestConsecutiveDays;
      if (isHardOrVeryHard && (targetQ.stat === 'STR' || targetQ.stat === 'INT')) {
        hardConsecutive += 1;
      }
      const isFatigued = hardConsecutive >= 6;

      return {
        ...prev,
        quests: finalQuests,
        lockedInHabits: updatedHabits,
        currentStreak: newStreak,
        longestStreak: newLongest,
        hardQuestConsecutiveDays: hardConsecutive,
        isFatigued,
      };
    });

    grantXpAndStat(targetQ.stat, baseXp, `Completed Quest: ${targetQ.title}`);
  };

  const deleteQuest = (questId: string) => {
    setState((prev) => ({
      ...prev,
      quests: prev.quests.filter((q) => q.id !== questId),
    }));
  };

  const toggleBossRushMode = (examDate?: string) => {
    setState((prev) => ({
      ...prev,
      isBossRushMode: !prev.isBossRushMode,
      bossRushExamDate: examDate || prev.bossRushExamDate,
    }));
  };

  const triggerTemptationSkip = (questId: string) => {
    // Skip quest without penalty, but no XP
    setState((prev) => ({
      ...prev,
      quests: prev.quests.map((q) => (q.id === questId ? { ...q, completed: true, isMissed: false } : q)),
    }));
  };

  const triggerTemptationPush = (questId: string) => {
    const targetQ = state.quests.find((q) => q.id === questId);
    if (!targetQ) return;
    completeQuest(questId);
    // Extra Willpower XP
    grantXpAndStat('AGI', 15, 'Temptation Overcome (Willpower Bonus)', true);
  };

  const completeEmergencyQuest = () => {
    grantXpAndStat('AGI', 80, 'EMERGENCY QUEST CLEARED');
    grantXpAndStat('STR', 50, 'Emergency Physical Focus');
    setState((prev) => ({
      ...prev,
      emergencyQuestActive: false,
      consecutiveMissedDays: 0,
    }));
  };

  const manuallyEndDayCheck = () => {
    setState((prev) => {
      const missedCount = prev.quests.filter((q) => !q.completed).length;
      let newMissedDays = prev.consecutiveMissedDays;
      let isEmergency = prev.emergencyQuestActive;
      let newStreak = prev.currentStreak;
      let newTotalXp = prev.totalXp;

      if (missedCount > 0) {
        newMissedDays += 1;
        newStreak = 0; // Streak broken

        // Hardcore Mode check
        if (prev.isHardcoreMode && missedCount === prev.quests.length) {
          const penalty = Math.round(newTotalXp * 0.1);
          newTotalXp = Math.max(0, newTotalXp - penalty);
        }

        if (newMissedDays >= 3) {
          isEmergency = true;
        }
      } else {
        newMissedDays = 0;
      }

      // Reset daily quest completions for next cycle
      const resetQuests = prev.quests.map((q) => ({
        ...q,
        completed: false,
      }));

      return {
        ...prev,
        quests: resetQuests,
        consecutiveMissedDays: newMissedDays,
        emergencyQuestActive: isEmergency,
        currentStreak: newStreak,
        totalXp: newTotalXp,
      };
    });
  };

  // Perception Log
  const addPerceptionEntry = (content: string) => {
    const entry: PerceptionEntry = {
      id: 'p-' + Date.now(),
      timestamp: new Date().toISOString(),
      content,
      xpAwarded: 15,
    };
    setState((prev) => ({
      ...prev,
      perceptionLogs: [entry, ...prev.perceptionLogs],
    }));
    grantXpAndStat('PER', 15, 'Log Perception Insight');
  };

  // Courses
  const addCourse = (title: string, description: string, lessonTitles: string[]) => {
    const newCourse: Course = {
      id: 'c-' + Date.now(),
      title,
      description,
      completed: false,
      createdAt: getTodayDateString(),
      lessons: lessonTitles.map((lt, idx) => ({
        id: `l-${idx}-${Date.now()}`,
        title: lt,
        completed: false,
      })),
    };
    setState((prev) => ({
      ...prev,
      courses: [newCourse, ...prev.courses],
    }));
  };

  const toggleCourseLesson = (courseId: string, lessonId: string, practiceNotes?: string) => {
    let earnedLessonXp = false;

    setState((prev) => {
      const updatedCourses = prev.courses.map((c) => {
        if (c.id === courseId) {
          const updatedLessons = c.lessons.map((l) => {
            if (l.id === lessonId) {
              if (!l.completed) earnedLessonXp = true;
              return {
                ...l,
                completed: !l.completed,
                practiceNotes: practiceNotes || l.practiceNotes,
              };
            }
            return l;
          });
          const allCompleted = updatedLessons.every((l) => l.completed);
          return {
            ...c,
            lessons: updatedLessons,
            completed: allCompleted,
          };
        }
        return c;
      });

      return {
        ...prev,
        courses: updatedCourses,
      };
    });

    if (earnedLessonXp) {
      grantXpAndStat('INT', 20, 'Completed Learning Lesson');
    }
  };

  // Sleep & Baseline
  const logSleepHours = (hours: number) => {
    const today = getTodayDateString();
    setState((prev) => ({
      ...prev,
      dailySleepLogs: {
        ...prev.dailySleepLogs,
        [today]: hours,
      },
    }));
    grantXpAndStat('VIT', 10, `Logged Sleep: ${hours} hrs`);
  };

  const addMonthlyBaseline = (pushups: number, codingSpeed: number, meditationMinutes: number, benchPressKg?: number) => {
    const newBaseline: MonthlyBaseline = {
      id: 'mb-' + Date.now(),
      date: getTodayDateString().substring(0, 7),
      pushups,
      codingSpeed,
      meditationMinutes,
      benchPressKg,
    };
    setState((prev) => ({
      ...prev,
      monthlyBaselines: [newBaseline, ...prev.monthlyBaselines],
    }));
    grantXpAndStat('VIT', 25, 'Recorded Monthly Baseline Metrics');
  };

  // Weekly Reviews & Vision
  const addWeeklyReview = (whatWentWell: string, whatNeedsImprovement: string, nextWeekFocus: string) => {
    const review: WeeklyReview = {
      id: 'wr-' + Date.now(),
      weekStartDate: getTodayDateString(),
      whatWentWell,
      whatNeedsImprovement,
      nextWeekFocus,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      weeklyReviews: [review, ...prev.weeklyReviews],
    }));
    grantXpAndStat('AGI', 30, 'Completed Weekly Sunday Review');
  };

  const addVisionGoal = (category: VisionGoal['category'], text: string, targetDate?: string) => {
    const goal: VisionGoal = {
      id: 'vg-' + Date.now(),
      category,
      text,
      completed: false,
      targetDate,
    };
    setState((prev) => ({
      ...prev,
      visionGoals: [...prev.visionGoals, goal],
    }));
  };

  const toggleVisionGoal = (goalId: string) => {
    setState((prev) => ({
      ...prev,
      visionGoals: prev.visionGoals.map((g) => (g.id === goalId ? { ...g, completed: !g.completed } : g)),
    }));
  };

  const deleteVisionGoal = (goalId: string) => {
    setState((prev) => ({
      ...prev,
      visionGoals: prev.visionGoals.filter((g) => g.id !== goalId),
    }));
  };

  // Path & Settings
  const setSelectedPath = (path: PathType) => {
    setState((prev) => ({
      ...prev,
      selectedPath: path,
    }));
  };

  const toggleHardcoreMode = (enabled: boolean) => {
    setState((prev) => ({
      ...prev,
      isHardcoreMode: enabled,
    }));
  };

  const updateRivalInfo = (name: string, startingLevel: number, currentLevel: number, currentXp: number) => {
    setState((prev) => ({
      ...prev,
      rival: { name, startingLevel, currentLevel, currentXp },
    }));
  };

  // Rewards & Store
  const addReward = (title: string, cost: number, description?: string) => {
    const reward: Reward = {
      id: 'r-' + Date.now(),
      title,
      cost,
      description,
      timesRedeemed: 0,
    };
    setState((prev) => ({
      ...prev,
      rewards: [...prev.rewards, reward],
    }));
  };

  const redeemReward = (rewardId: string) => {
    const target = state.rewards.find((r) => r.id === rewardId);
    if (!target) return;
    if (state.gold < target.cost) {
      alert(`Insufficient Gold! You need ${target.cost} Gold, but currently have ${state.gold}.`);
      return;
    }

    setState((prev) => ({
      ...prev,
      gold: prev.gold - target.cost,
      rewards: prev.rewards.map((r) => (r.id === rewardId ? { ...r, timesRedeemed: r.timesRedeemed + 1 } : r)),
      achievementLogs: [
        {
          id: 'al-' + Date.now(),
          timestamp: new Date().toISOString(),
          type: 'TITLE',
          title: `Reward Claimed: ${target.title}`,
          description: `Spent ${target.cost} Gold.`,
        },
        ...prev.achievementLogs,
      ],
    }));
  };

  const buyCosmetic = (cosmeticId: string) => {
    const target = state.cosmetics.find((c) => c.id === cosmeticId);
    if (!target) return;
    if (target.unlocked) {
      if (target.type === 'THEME' && target.themeId) {
        setActiveTheme(target.themeId);
      }
      return;
    }
    if (state.gold < target.cost) {
      alert(`Insufficient Gold! Requires ${target.cost} Gold.`);
      return;
    }

    setState((prev) => ({
      ...prev,
      gold: prev.gold - target.cost,
      cosmetics: prev.cosmetics.map((c) => (c.id === cosmeticId ? { ...c, unlocked: true } : c)),
    }));

    if (target.type === 'THEME' && target.themeId) {
      setActiveTheme(target.themeId);
    }
  };

  const setActiveTheme = (themeId: string) => {
    setState((prev) => ({
      ...prev,
      activeTheme: themeId,
    }));
  };

  const addCustomSkill = (title: string, description: string, reqValue: number, badgeIcon: string) => {
    const skill: SkillItem = {
      id: 'sk-' + Date.now(),
      title,
      description,
      reqType: 'CUSTOM',
      reqValue,
      badgeIcon,
      unlocked: false,
      isCustom: true,
    };
    setState((prev) => ({
      ...prev,
      skills: [...prev.skills, skill],
    }));
  };

  // Modals
  const dismissLevelUpModal = () => setLevelUpModal(null);
  const dismissBonusEventModal = () => setBonusEventModal(null);
  const dismissHiddenQuestModal = () => setHiddenQuestModal(null);

  const completeHiddenQuest = () => {
    grantXpAndStat('LUK', 25, 'CLEARED HIDDEN FEAT');
    grantXpAndStat('INT', 35, 'Surprise Mental Challenge Cleared');
    dismissHiddenQuestModal();
  };

  return (
    <SystemContext.Provider
      value={{
        state,
        loginAsGuest,
        signInGooglePlaceholder,
        signOutAndClearData,
        saveOriginStory,
        addQuest,
        completeQuest,
        deleteQuest,
        toggleBossRushMode,
        triggerTemptationSkip,
        triggerTemptationPush,
        completeEmergencyQuest,
        manuallyEndDayCheck,
        addPerceptionEntry,
        addCourse,
        toggleCourseLesson,
        logSleepHours,
        addMonthlyBaseline,
        addWeeklyReview,
        addVisionGoal,
        toggleVisionGoal,
        deleteVisionGoal,
        setSelectedPath,
        toggleHardcoreMode,
        updateRivalInfo,
        addReward,
        redeemReward,
        buyCosmetic,
        setActiveTheme,
        addCustomSkill,
        levelUpModal,
        dismissLevelUpModal,
        bonusEventModal,
        dismissBonusEventModal,
        hiddenQuestModal,
        completeHiddenQuest,
        dismissHiddenQuestModal,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) throw new Error('useSystem must be used within a SystemProvider');
  return context;
};
