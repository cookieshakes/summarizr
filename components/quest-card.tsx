'use client';

import { motion } from 'framer-motion';
import { useGameStore, Quest } from '@/lib/store';
import { CheckCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface QuestCardProps {
  quest: Quest;
  onComplete: () => void;
}

export function QuestCard({ quest, onComplete }: QuestCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className="bg-card border border-border hover:border-primary/50 transition-colors rounded-xl p-5 shadow-sm group relative overflow-hidden"
    >
      {/* Decorative background gradient that shifts on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              +{quest.xpReward} XP
            </span>
            <span className="flex items-center text-xs text-muted-foreground">
              <Clock className="w-3 h-3 mr-1" />
              {typeof window !== 'undefined' ? new Date(quest.createdAt).toLocaleDateString() : 'Just now'}
            </span>
          </div>
          <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
            {quest.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {quest.description}
          </p>
        </div>
        
        <button
          onClick={onComplete}
          className="shrink-0 flex items-center justify-center gap-2 bg-secondary hover:bg-primary hover:text-primary-foreground text-secondary-foreground font-medium py-2.5 px-5 rounded-lg transition-all active:scale-95 group/btn"
        >
          <CheckCircle className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
          <span>Complete</span>
        </button>
      </div>
    </motion.div>
  );
}
