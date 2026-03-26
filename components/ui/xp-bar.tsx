'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/lib/store';
import { Trophy, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

export function XpBar() {
  const { userXP, userLevel } = useGameStore();
  const xpPerLevel = 1000;
  const progressPercentage = Math.min((userXP / xpPerLevel) * 100, 100);
  
  // To avoid hydration mismatch if using persist
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-[76px] w-full" />;

  return (
    <div className="w-full max-w-2xl mx-auto bg-card border border-border/50 rounded-2xl p-4 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="bg-primary/20 p-2 rounded-full">
            <Trophy className="w-5 h-5 text-primary animate-pulse" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Level {userLevel}</p>
            <h2 className="text-xl font-bold tracking-tight">Tech Sorcerer</h2>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-bold text-lg">{userXP}</span>
            <span className="text-muted-foreground">/ {xpPerLevel} XP</span>
          </div>
        </div>
      </div>
      
      {/* Progress Bar Track */}
      <div className="h-4 w-full bg-secondary rounded-full overflow-hidden relative shadow-inner">
        {/* Progress Bar Fill */}
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ type: 'spring', stiffness: 50, damping: 15 }}
        />
        
        {/* Sparkle effect on the bar */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9yZWN0Pgo8L3N2Zz4=')] mix-blend-overlay opacity-30" />
      </div>
    </div>
  );
}
