import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  createdAt: number;
}

interface GameState {
  quests: Quest[];
  userLevel: number;
  userXP: number;
  addQuests: (newQuests: Omit<Quest, 'id' | 'completed' | 'createdAt'>[]) => void;
  completeQuest: (questId: string) => void;
  resetAll: () => void;
}

const XP_PER_LEVEL = 1000;

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      quests: [],
      userLevel: 1,
      userXP: 0,
      addQuests: (newQuests) =>
        set((state) => ({
          quests: [
            ...state.quests,
            ...newQuests.map((q) => ({
              ...q,
              id: crypto.randomUUID(),
              completed: false,
              createdAt: Date.now(),
            })),
          ],
        })),
      completeQuest: (questId) =>
        set((state) => {
          const quest = state.quests.find((q) => q.id === questId);
          if (!quest || quest.completed) return state;

          const updatedQuests = state.quests.map((q) =>
            q.id === questId ? { ...q, completed: true } : q
          );

          let newXP = state.userXP + quest.xpReward;
          let newLevel = state.userLevel;

          while (newXP >= XP_PER_LEVEL) {
            newLevel += 1;
            newXP -= XP_PER_LEVEL;
          }

          return {
            quests: updatedQuests,
            userXP: newXP,
            userLevel: newLevel,
          };
        }),
      resetAll: () => set({ quests: [], userLevel: 1, userXP: 0 }),
    }),
    {
      name: 'summarizr-gamestate',
    }
  )
);
