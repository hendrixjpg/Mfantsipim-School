import React from 'react';
import { motion } from 'motion/react';

export function NewsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.1,
          }}
          className="card-base bg-[var(--card)] border border-[var(--border)] overflow-hidden h-full flex flex-col relative rounded-2xl shadow-sm"
        >
          {/* Cover image area */}
          <div className="aspect-video w-full bg-zinc-200 dark:bg-zinc-800 relative">
            <div className="absolute top-4 left-4 w-16 h-5 bg-zinc-300 dark:bg-zinc-700 rounded-lg animate-pulse" />
          </div>

          {/* Core metadata and title section */}
          <div className="p-8 flex-1 flex flex-col justify-between">
            <div>
              {/* Date & Author */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-24 h-3 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                <div className="w-16 h-3 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
              </div>

              {/* Title rows */}
              <div className="space-y-2 mb-5">
                <div className="w-full h-5 bg-zinc-300 dark:bg-zinc-700 rounded-md animate-pulse" />
                <div className="w-4/5 h-5 bg-zinc-300 dark:bg-zinc-700 rounded-md animate-pulse" />
              </div>

              {/* Snippet text */}
              <div className="space-y-2 mb-8">
                <div className="w-full h-3 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                <div className="w-11/12 h-3 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                <div className="w-3/4 h-3 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
              </div>
            </div>

            {/* Read action is separate with a distinct divider */}
            <div className="pt-6 border-t border-[var(--border)] flex items-center justify-between mt-auto">
              <div className="w-24 h-3.5 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function AlumniSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.1,
          }}
          className="p-10 rounded-[40px] bg-white border border-zinc-200 relative h-full flex flex-col overflow-hidden shadow-sm"
        >
          {/* Header layout: Square avatar and name container */}
          <div className="flex items-center space-x-5 mb-10">
            <div className="w-20 h-20 bg-zinc-100 border border-zinc-200 rounded-2xl flex-shrink-0 animate-pulse" />
            <div className="flex-1 space-y-2.5">
              <div className="w-4/5 h-6 bg-zinc-300 rounded-md animate-pulse" />
              <div className="w-2/3 h-3 bg-zinc-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Details list (Occupation and Location) */}
          <div className="space-y-4 mb-10">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-zinc-100 rounded-lg animate-pulse" />
              <div className="w-32 h-4 bg-zinc-200 rounded animate-pulse" />
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-zinc-100 rounded-lg animate-pulse" />
              <div className="w-40 h-4 bg-zinc-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Quote / Biography box in the center */}
          <div className="relative mb-10 pl-4">
            <div className="absolute left-0 top-0 w-1 h-full bg-zinc-200/60 rounded" />
            <div className="space-y-2.5">
              <div className="w-full h-3 bg-zinc-100 rounded animate-pulse" />
              <div className="w-5/6 h-3 bg-zinc-100 rounded animate-pulse" />
            </div>
          </div>

          {/* Card action footer segment complete with standard divider */}
          <div className="flex items-center justify-between pt-8 border-t border-zinc-100 mt-auto">
            <div className="w-28 h-3 bg-zinc-200 rounded animate-pulse" />
            <div className="w-10 h-10 bg-zinc-100 rounded-xl animate-pulse" />
          </div>

          {/* Retro-futuristic HUD corner wireframes */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-zinc-100 rounded-tl-[40px]" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-zinc-100 rounded-br-[40px]" />
        </motion.div>
      ))}
    </div>
  );
}
