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
    <div className="glass rounded-[32px] p-8 flex flex-col items-center justify-center h-96">
      <Loader2 className="animate-spin text-red-600 mb-4" size={32} />
      <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Syncing Data...</p>
    </div>
  );

  return (
    <div className="glass rounded-[40px] p-8 shadow-2xl relative overflow-hidden group/board">
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[100px] -z-10 group-hover/board:bg-red-600/10 transition-colors duration-700" />
      <div className="absolute inset-0 scanline opacity-[0.03] pointer-events-none" />
      
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center neon-red relative">
            <div className="hud-corner hud-corner-tl -top-1 -left-1" />
            <div className="hud-corner hud-corner-br -bottom-1 -right-1" />
            <Trophy className="text-red-600" size={32} />
          </div>
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white leading-none mb-2">Leaderboard</h2>
            <p className="text-gray-500 text-[9px] font-mono font-black uppercase tracking-[0.3em]">HOUSE_METRICS_SYNC_v4.2</p>
          </div>
        </div>
        <div className="hidden sm:block text-right">
          <div className="text-[9px] font-mono font-black text-red-600 uppercase tracking-widest mb-2">LIVE_DATA_STREAM</div>
          <div className="flex items-center justify-end space-x-3 glass px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            <span className="text-[9px] text-gray-400 font-mono font-black uppercase tracking-widest">CONNECTED</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
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
                "flex items-center justify-between p-6 rounded-3xl transition-all group relative overflow-hidden",
                i === 0 
                  ? "bg-gradient-to-r from-red-600/10 to-transparent border border-red-600/20 shadow-[0_0_30px_rgba(220,38,38,0.05)]" 
                  : "glass glass-hover"
              )}
            >
              {i === 0 && (
                <div className="absolute -right-8 -top-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                  <Crown size={160} className="text-red-600 rotate-12" />
                </div>
              )}

              <div className="flex items-center space-x-6 relative z-10">
                <div className="w-12 h-12 flex items-center justify-center relative">
                  {i === 0 ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1.5 }}
                      className="absolute inset-0 bg-red-600/10 rounded-full blur-xl"
                    />
                  ) : null}
                  <span className={cn(
                    "font-black text-3xl relative z-10 tracking-tighter",
                    i === 0 ? "text-red-600" : "text-gray-700"
                  )}>
                    {i + 1}
                  </span>
                </div>

                <div className={cn("w-2 h-12 rounded-full shadow-sm", getHouseColor(item.houseName))}></div>
                
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className={cn(
                      "font-black uppercase tracking-tight transition-colors",
                      i === 0 ? "text-3xl text-white" : "text-xl text-gray-400 group-hover:text-white"
                    )}>
                      {item.houseName}
                    </h3>
                    {i === 0 && <Crown size={20} className="text-red-600 neon-red" />}
                  </div>
                  <div className="flex items-center space-x-2">
                    {i < 3 ? (
                      <Star size={10} className={cn(
                        i === 0 ? "text-red-600 fill-red-600" : "text-yellow-500 fill-yellow-500"
                      )} />
                    ) : (
                      <div className="w-1 h-1 bg-gray-800 rounded-full" />
                    )}
                    <span className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em]">
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
                  className="text-4xl font-black tracking-tighter leading-none mb-1"
                >
                  {item.points.toLocaleString()}
                </motion.div>
                <div className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em]">Points</div>
              </div>
            </motion.div>
          )) : (
            <div className="text-center py-20 glass rounded-[32px] border-dashed border-white/10">
              <Star size={40} className="text-gray-800 mx-auto mb-4" />
              <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">
                Awaiting Data Stream...
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
