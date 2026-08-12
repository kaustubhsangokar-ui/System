import React, { useState } from 'react';
import { SystemProvider, useSystem } from './context/SystemContext';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { HomeTab } from './components/tabs/HomeTab';
import { QuestsTab } from './components/tabs/QuestsTab';
import { CoursesTab } from './components/tabs/CoursesTab';
import { WeeklyPlanTab } from './components/tabs/WeeklyPlanTab';
import { ProgressTab } from './components/tabs/ProgressTab';
import { SkillsAndStoreTab } from './components/tabs/SkillsAndStoreTab';
import { VisionAndStoryTab } from './components/tabs/VisionAndStoryTab';
import { JournalTab } from './components/tabs/JournalTab';
import { ProfileTab } from './components/tabs/ProfileTab';
import { OnboardingModal } from './components/modals/OnboardingModal';
import { LevelUpModal, BonusEventModal, HiddenQuestModal } from './components/modals/LevelUpModal';

const AppContent: React.FC = () => {
  const { state } = useSystem();
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Theme map
  const getThemeClass = (themeId: string) => {
    switch (themeId) {
      case 'violet-sovereign':
        return 'bg-slate-950 text-slate-100 selection:bg-purple-500 selection:text-white';
      case 'crimson-monarch':
        return 'bg-slate-950 text-slate-100 selection:bg-rose-500 selection:text-white';
      case 'emerald-sovereign':
        return 'bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white';
      case 'cyber-gold':
        return 'bg-slate-950 text-slate-100 selection:bg-yellow-500 selection:text-white';
      default:
        return 'bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white';
    }
  };

  return (
    <div className={`min-h-screen ${getThemeClass(state.activeTheme)} font-sans antialiased`}>
      <Header onOpenSettings={() => setActiveTab('profile')} />
      <Navigation activeTab={activeTab} onSelectTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'home' && <HomeTab />}
        {activeTab === 'quests' && <QuestsTab />}
        {activeTab === 'courses' && <CoursesTab />}
        {activeTab === 'plan' && <WeeklyPlanTab />}
        {activeTab === 'progress' && <ProgressTab />}
        {activeTab === 'store' && <SkillsAndStoreTab />}
        {activeTab === 'vision' && <VisionAndStoryTab />}
        {activeTab === 'journal' && <JournalTab />}
        {activeTab === 'profile' && <ProfileTab />}
      </main>

      {/* Overlays & Modals */}
      <OnboardingModal />
      <LevelUpModal />
      <BonusEventModal />
      <HiddenQuestModal />
    </div>
  );
};

export default function App() {
  return (
    <SystemProvider>
      <AppContent />
    </SystemProvider>
  );
}
