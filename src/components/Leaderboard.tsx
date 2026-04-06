import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Medal, Star, Crown, Loader2 } from 'lucide-react';
import { SCHOOL_INFO } from '@/src/constants';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { LeaderboardEntry } from '@/src/types';
import { cn } from '@/src/lib/utils';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = React.useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const q = query(collection(db, 'leaderboard'), orderBy('points', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeaderboardEntry));
      setLeaderboard(data);
      setLoading(false);
    }, (error) => {
      console.error("Leaderboard fetch error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getHouseColor = (house: string) => {
    const colors: Record<string, string> = {
      'BARTELS SNEATH': 'bg-red-600',
      'PICKARD PACKARD': 'bg-blue-600',
      'LOCKHART SHWEITZER': 'bg-green-600',
      'SARBAH PICOT': 'bg-yellow-600',
      'FREEMAN AGGREY': 'bg-purple-600',
      'BALMER ACQUUAH': 'bg-orange-600',
      'BRANDFUL DONTWI': 'bg-pink-600',
      'ABRUQUAH MONNEY': 'bg-indigo-600'
    };
    return colors[house] || 'bg-gray-600';
  };

  if (loading) return (
    <div className="card-base p-12 flex flex-col items-center justify-center h-96">
      <Loader2 className="animate-spin text-red-600 mb-4" size={32} />
      <p className="text-[var(--muted-foreground)] font-bold uppercase tracking-widest text-[10px]">Syncing Data...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center">
            <Trophy className="text-red-600" size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-[var(--foreground)] leading-none mb-2">Leaderboard</h2>
            <p className="text-[var(--muted-foreground)] text-[10px] font-bold uppercase tracking-widest">House Competition</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center space-x-3 bg-[var(--muted)] px-4 py-2 rounded-full border border-[var(--border)]">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] text-[var(--muted-foreground)] font-bold uppercase tracking-widest">Live Updates</span>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {leaderboard.length > 0 ? leaderboard.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ 
                type: 'spring', 
                stiffness: 400, 
                damping: 40
              }}
              className={cn(
                "flex items-center justify-between p-5 rounded-2xl transition-all group relative border border-[var(--border)]",
                i === 0 
                  ? "bg-red-600/5 border-red-600/20 shadow-sm" 
                  : "bg-[var(--card)] hover:border-red-600/20"
              )}
            >
              <div className="flex items-center space-x-6">
                <div className="w-10 h-10 flex items-center justify-center">
                  <span className={cn(
                    "font-black text-2xl tracking-tighter",
                    i === 0 ? "text-red-600" : "text-[var(--muted-foreground)]"
                  )}>
                    {i + 1}
                  </span>
                </div>

                <div className={cn("w-1.5 h-10 rounded-full", getHouseColor(item.houseName))}></div>
                
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className={cn(
                      "font-bold uppercase tracking-tight transition-colors",
                      i === 0 ? "text-xl text-[var(--foreground)]" : "text-lg text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]"
                    )}>
                      {item.houseName}
                    </h3>
                    {i === 0 && <Crown size={18} className="text-red-600" />}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-[var(--muted-foreground)] font-bold uppercase tracking-widest">
                      {i === 0 ? 'Defending Champions' : i < 3 ? 'Elite Tier' : 'House Member'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-3xl font-black tracking-tighter text-[var(--foreground)] leading-none mb-1">
                  {item.points.toLocaleString()}
                </div>
                <div className="text-[10px] text-[var(--muted-foreground)] font-bold uppercase tracking-widest">Points</div>
              </div>
            </motion.div>
          )) : (
            <div className="text-center py-20 card-base border-dashed border-[var(--border)]">
              <Star size={40} className="text-[var(--muted-foreground)] mx-auto mb-4 opacity-20" />
              <p className="text-[var(--muted-foreground)] font-bold uppercase tracking-widest text-[10px]">
                Awaiting Data...
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
