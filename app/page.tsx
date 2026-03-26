'use client';

import { XpBar } from '@/components/ui/xp-bar';
import { UploadDropzone } from '@/components/upload-dropzone';
import { QuestCard } from '@/components/quest-card';
import { useGameStore } from '@/lib/store';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const { quests, completeQuest } = useGameStore();

  const activeQuests = quests.filter(q => !q.completed).sort((a, b) => b.createdAt - a.createdAt);
  const completedQuests = quests.filter(q => q.completed).length;

  return (
    <main className="min-h-screen bg-background relative overflow-hidden pb-20">
      {/* Background ambient lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/30 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 pt-12 max-w-4xl relative z-10">
        <header className="mb-12 text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent inline-block pb-2">
            Summarizr
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Turn your forgotten screenshots into epic quests.
          </p>
        </header>

        <section className="mb-12">
          <XpBar />
        </section>

        <section className="mb-12">
          <UploadDropzone />
        </section>

        <section className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Active Quests</h2>
            <div className="text-sm font-medium text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
              {activeQuests.length} Remaining
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence>
              {activeQuests.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 border-2 border-dashed border-border/50 rounded-2xl bg-card/30"
                >
                  <p className="text-muted-foreground font-medium text-lg">No active quests right now.</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">Upload a screenshot to acquire new tasks!</p>
                </motion.div>
              ) : (
                activeQuests.map((quest) => (
                  <QuestCard 
                    key={quest.id} 
                    quest={quest} 
                    onComplete={() => completeQuest(quest.id)} 
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </main>
  );
}