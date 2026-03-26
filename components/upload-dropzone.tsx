'use client';

import { useState, useCallback } from 'react';
import { analyzeImageAction } from '@/app/actions/analyzeImage';
import { useGameStore } from '@/lib/store';
import { UploadCloud, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function UploadDropzone() {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addQuests = useGameStore((state) => state.addQuests);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (e.g. screenshot, photo).');
      return;
    }
    
    setError(null);
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await analyzeImageAction(formData);
      
      if (response.success && response.tasks) {
        addQuests(response.tasks);
      } else {
        setError(response.error || 'Failed to analyze the image.');
      }
    } catch (e) {
      console.error(e);
      setError('An error occurred during upload.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <AnimatePresence mode="wait">
        {isAnalyzing ? (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center p-12 bg-card rounded-2xl border-2 border-primary border-dashed shadow-xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-primary/10 animate-pulse" />
            <Sparkles className="w-12 h-12 text-primary animate-bounce mb-4 relative z-10" />
            <h3 className="text-xl text-primary font-bold relative z-10">AI is Deciphering Runes...</h3>
            <p className="text-sm text-muted-foreground mt-2 relative z-10">Extracting tasks from your screenshot</p>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <label
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`
                flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 group
                ${isDragging ? 'border-primary bg-primary/20 scale-105' : 'border-border/60 hover:border-primary/50 hover:bg-secondary/40'}
              `}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className={`w-12 h-12 mb-4 transition-colors ${isDragging ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`} />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground/80">
                  Screenshots, flyers, notes (PNG, JPG, WEBP)
                </p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={onFileInput}
                disabled={isAnalyzing}
              />
            </label>
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-destructive text-sm mt-3 text-center"
              >
                {error}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
