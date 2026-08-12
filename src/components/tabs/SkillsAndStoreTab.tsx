import React, { useState } from 'react';
import { Award, Lock, Unlock, Plus, Coins, Palette, ShoppingBag, Flame, Brain, Dumbbell, Eye, ShieldAlert, Sparkles, Check } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

export const SkillsAndStoreTab: React.FC = () => {
  const {
    state,
    addCustomSkill,
    addReward,
    redeemReward,
    buyCosmetic,
    setActiveTheme,
  } = useSystem();

  const [activeSubTab, setActiveSubTab] = useState<'SKILLS' | 'REWARDS' | 'STORE'>('SKILLS');

  // Custom skill modal
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [skillTitle, setSkillTitle] = useState('');
  const [skillDesc, setSkillDesc] = useState('');
  const [skillReq, setSkillReq] = useState<number>(20);

  // Custom reward modal
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardTitle, setRewardTitle] = useState('');
  const [rewardCost, setRewardCost] = useState<number>(50);
  const [rewardDesc, setRewardDesc] = useState('');

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillTitle.trim()) return;
    addCustomSkill(skillTitle, skillDesc, skillReq, 'Sparkles');
    setSkillTitle('');
    setSkillDesc('');
    setShowSkillModal(false);
  };

  const handleAddReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rewardTitle.trim()) return;
    addReward(rewardTitle, rewardCost, rewardDesc);
    setRewardTitle('');
    setRewardDesc('');
    setShowRewardModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Sub-tab switcher */}
      <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl max-w-md mx-auto font-mono text-xs">
        <button
          onClick={() => setActiveSubTab('SKILLS')}
          className={`flex-1 py-2 rounded-lg text-center font-bold transition-all ${
            activeSubTab === 'SKILLS'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Skill Tree
        </button>
        <button
          onClick={() => setActiveSubTab('REWARDS')}
          className={`flex-1 py-2 rounded-lg text-center font-bold transition-all ${
            activeSubTab === 'REWARDS'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Rewards Inventory
        </button>
        <button
          onClick={() => setActiveSubTab('STORE')}
          className={`flex-1 py-2 rounded-lg text-center font-bold transition-all ${
            activeSubTab === 'STORE'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Cosmetic Store
        </button>
      </div>

      {/* 1. SKILL TREE SUB-TAB */}
      {activeSubTab === 'SKILLS' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-mono text-cyan-300 flex items-center gap-2">
                <Award className="w-5 h-5 text-cyan-400" />
                SKILL TREE & BADGES
              </h2>
              <p className="text-xs text-slate-400">
                Unlock milestone skills through streak consistency, quest volumes, and custom feats.
              </p>
            </div>

            <button
              onClick={() => setShowSkillModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs tracking-wider shadow-lg shadow-blue-900/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              ADD CUSTOM SKILL
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.skills.map((skill) => {
              // Dynamic check if skill meets requirement
              let isUnlocked = skill.unlocked;
              if (!isUnlocked) {
                if (skill.reqType === 'STREAK' && state.longestStreak >= skill.reqValue) {
                  isUnlocked = true;
                } else if (skill.reqType === 'PERCEPTION_LOGS' && state.perceptionLogs.length >= skill.reqValue) {
                  isUnlocked = true;
                }
              }

              return (
                <div
                  key={skill.id}
                  className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                    isUnlocked
                      ? 'bg-slate-900 border-cyan-500/50 shadow-lg shadow-cyan-950/30'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-500 opacity-70'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isUnlocked
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-500'
                          : 'bg-slate-900 text-slate-600 border border-slate-800'
                      }`}
                    >
                      {isUnlocked ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3
                          className={`text-sm font-bold font-mono ${
                            isUnlocked ? 'text-cyan-300' : 'text-slate-400'
                          }`}
                        >
                          {skill.title}
                        </h3>
                        {isUnlocked && (
                          <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-mono">
                            UNLOCKED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{skill.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. REWARDS INVENTORY SUB-TAB */}
      {activeSubTab === 'REWARDS' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-mono text-yellow-300 flex items-center gap-2">
                <Coins className="w-5 h-5 text-yellow-400" />
                REAL-LIFE REWARDS SHOP
              </h2>
              <p className="text-xs text-slate-400">
                Spend earned Gold currency on real-life custom rewards. Current Gold:{' '}
                <strong className="text-yellow-400 font-mono">{state.gold} G</strong>
              </p>
            </div>

            <button
              onClick={() => setShowRewardModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-slate-950 font-mono font-bold text-xs tracking-wider shadow-lg shadow-yellow-950/40 transition-all"
            >
              <Plus className="w-4 h-4" />
              ADD REWARD
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.rewards.map((reward) => (
              <div
                key={reward.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4 shadow-xl"
              >
                <div>
                  <h3 className="text-sm font-bold font-mono text-slate-100">{reward.title}</h3>
                  {reward.description && (
                    <p className="text-xs text-slate-400 mt-0.5">{reward.description}</p>
                  )}
                  <div className="mt-2 text-[11px] text-yellow-400 font-mono">
                    Cost: {reward.cost} Gold • Claimed: {reward.timesRedeemed} times
                  </div>
                </div>

                <button
                  onClick={() => redeemReward(reward.id)}
                  className="px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-mono font-bold text-xs shadow-md shadow-yellow-950 flex-shrink-0"
                >
                  Redeem
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. COSMETIC STORE SUB-TAB */}
      {activeSubTab === 'STORE' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold font-mono text-purple-300 flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-400" />
              COSMETIC THEME UNLOCKS
            </h2>
            <p className="text-xs text-slate-400">
              Customize your System visual atmosphere with unlocked accent color themes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.cosmetics.map((item) => {
              const isCurrentTheme = state.activeTheme === item.themeId;

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl border border-slate-700 flex items-center justify-center font-bold font-mono text-xs text-white"
                      style={{ backgroundColor: item.previewColor || '#3b82f6' }}
                    >
                      ★
                    </div>
                    <div>
                      <h3 className="text-sm font-bold font-mono text-slate-100">{item.name}</h3>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        {item.unlocked ? (
                          <span className="text-emerald-400">Unlocked</span>
                        ) : (
                          <span className="text-yellow-400">{item.cost} Gold</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => buyCosmetic(item.id)}
                    className={`px-4 py-2 rounded-xl font-mono font-bold text-xs transition-all ${
                      isCurrentTheme
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                        : item.unlocked
                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                        : 'bg-yellow-500 hover:bg-yellow-400 text-slate-950'
                    }`}
                  >
                    {isCurrentTheme ? 'ACTIVE' : item.unlocked ? 'EQUIP' : `BUY (${item.cost}G)`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Custom Skill Modal */}
      {showSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl">
            <h3 className="text-lg font-bold font-mono text-cyan-300 mb-4">
              CREATE CUSTOM SKILL
            </h3>

            <form onSubmit={handleAddSkill} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">SKILL TITLE</label>
                <input
                  type="text"
                  required
                  value={skillTitle}
                  onChange={(e) => setSkillTitle(e.target.value)}
                  placeholder="E.g., Master Problem Solver"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">UNLOCK DESCRIPTION</label>
                <input
                  type="text"
                  value={skillDesc}
                  onChange={(e) => setSkillDesc(e.target.value)}
                  placeholder="E.g., Complete 20 Hard difficulty quests"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSkillModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Add Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Reward Modal */}
      {showRewardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl">
            <h3 className="text-lg font-bold font-mono text-yellow-300 mb-4">
              CREATE REWARD
            </h3>

            <form onSubmit={handleAddReward} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">REWARD TITLE</label>
                <input
                  type="text"
                  required
                  value={rewardTitle}
                  onChange={(e) => setRewardTitle(e.target.value)}
                  placeholder="E.g., Weekend Getaway / Favorite Dinner"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">COST IN GOLD</label>
                <input
                  type="number"
                  required
                  value={rewardCost}
                  onChange={(e) => setRewardCost(parseInt(e.target.value) || 10)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">DESCRIPTION (OPTIONAL)</label>
                <input
                  type="text"
                  value={rewardDesc}
                  onChange={(e) => setRewardDesc(e.target.value)}
                  placeholder="Details or rules"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRewardModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold"
                >
                  Create Reward
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
