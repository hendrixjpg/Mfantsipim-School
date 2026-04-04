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
      'Bartlett': 'bg-red-600',
      'Pickard': 'bg-blue-600',
      'Lockhart': 'bg-green-600',
      'Sarbah': 'bg-yellow-600',
      'Freeman': 'bg-purple-600',
      'Balmer': 'bg-orange-600',
      'Acquaah': 'bg-pink-600',
      'Abruquah': 'bg-indigo-600'
    };
    return colors[house] || 'bg-gray-600';
  };

  if (loading) return (
    <div className="bg-white/5 rounded-3xl p-8 border border-white/10 flex flex-col items-center justify-center h-96">
      <Loader2 className="animate-spin text-red-600 mb-4" size={32} />
      <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Syncing Leaderboard...</p>
    </div>
  );

  return (
    <div className="bg-white/5 rounded-[32px] p-8 border border-white/10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[100px] -z-10" />
      
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center space-x-5">
          <div className="p-4 bg-red-600/20 rounded-2xl border border-red-600/20">
            <Trophy className="text-red-600" size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-white leading-none mb-1">Leaderboard</h2>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">{SCHOOL_INFO.name} Houses</p>
          </div>
        </div>
        <div className="hidden sm:block text-right">
          <div className="text-xs font-black text-red-600 uppercase tracking-widest mb-1">Live Updates</div>
          <div className="flex items-center justify-end space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Active Session</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {leaderboard.length > 0 ? leaderboard.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 30,
                opacity: { duration: 0.2 }
              }}
              className={cn(
                "flex items-center justify-between p-5 rounded-2xl transition-all group relative overflow-hidden",
                i === 0 
                  ? "bg-gradient-to-r from-red-600/20 to-transparent border border-red-600/30" 
                  : "bg-black/40 border border-white/5 hover:border-white/10"
              )}
            >
              {i === 0 && (
                <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Crown size={120} className="text-red-600 rotate-12" />
                </div>
              )}

              <div className="flex items-center space-x-5 relative z-10">
                <div className="w-12 h-12 flex items-center justify-center relative">
                  {i === 0 ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 bg-red-600/20 rounded-full blur-md"
                    />
                  ) : null}
                  <span className={cn(
                    "font-black text-2xl relative z-10",
                    i === 0 ? "text-red-600" : "text-gray-600"
                  )}>
                    {i + 1}
                  </span>
                </div>

                <div className={cn("w-1.5 h-12 rounded-full", getHouseColor(item.houseName))}></div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className={cn(
                      "font-black uppercase tracking-tight transition-colors",
                      i === 0 ? "text-2xl text-white" : "text-lg text-gray-300 group-hover:text-white"
                    )}>
                      {item.houseName}
                    </h3>
                    {i === 0 && <Crown size={18} className="text-red-600" />}
                  </div>
                  <div className="flex items-center space-x-2">
                    {i < 3 ? (
                      <Star size={12} className={cn(
                        i === 0 ? "text-red-600 fill-red-600" : "text-yellow-500 fill-yellow-500"
                      )} />
                    ) : (
                      <div className="w-1 h-1 bg-gray-700 rounded-full" />
                    )}
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                      {i === 0 ? 'Current Champions' : i < 3 ? 'Elite Tier' : 'House Member'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right relative z-10">
                <motion.div 
                  key={item.points}
                  initial={{ scale: 1.2, color: '#dc2626' }}
                  animate={{ scale: 1, color: '#ffffff' }}
                  className="text-3xl font-black tracking-tighter"
                >
                  {item.points.toLocaleString()}
                </motion.div>
                <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Points</div>
              </div>
            </motion.div>
          )) : (
            <div className="text-center py-20 bg-black/20 rounded-3xl border border-dashed border-white/10">
              <Star size={40} className="text-gray-800 mx-auto mb-4" />
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                Waiting for house scores...
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
