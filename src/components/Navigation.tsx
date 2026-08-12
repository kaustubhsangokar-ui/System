import React from 'react';
import {
  Activity,
  CheckSquare,
  BookOpen,
  Calendar,
  BarChart3,
  Award,
  Compass,
  BookMarked,
  User,
} from 'lucide-react';

export type TabType =
  | 'home'
  | 'quests'
  | 'courses'
  | 'plan'
  | 'progress'
  | 'store'
  | 'vision'
  | 'journal'
  | 'profile';

interface NavigationProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onSelectTab }) => {
  const navItems: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Stats', icon: Activity },
    { id: 'quests', label: 'Quests', icon: CheckSquare },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'plan', label: 'Plan', icon: Calendar },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'store', label: 'Skills & Shop', icon: Award },
    { id: 'vision', label: 'Vision', icon: Compass },
    { id: 'journal', label: 'Journal', icon: BookMarked },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="bg-slate-950 border-b border-slate-800/80 px-2 sticky top-[65px] z-30 shadow-md overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto flex items-center justify-start sm:justify-center gap-1 py-1.5 min-w-max">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold font-mono transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600/20 text-cyan-300 border border-blue-500/40 shadow-sm shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
