import React from 'react';
import { motion } from 'motion/react';
import { Medal, Award, Star, Globe, Loader2 } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/src/firebase';

interface Achievement {
  id: string;
  title: string;
  year: string;
  description: string;
  category: string;
}

export default function Achievements() {
  const [achievements, setAchievements] = React.useState<Achievement[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const q = query(collection(db, 'achievements'), orderBy('year', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Achievement));
      setAchievements(data);
      setLoading(false);
    }, (error) => {
      console.error("Achievements fetch error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'academic': return Award;
      case 'sports': return Medal;
      case 'innovation': return Globe;
      default: return Star;
    }
  };

  const getColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'academic': return 'text-red-500';
      case 'sports': return 'text-yellow-500';
      case 'innovation': return 'text-blue-500';
      default: return 'text-green-500';
    }
  };

  if (loading) return (
    <div className="glass rounded-[32px] p-8 flex flex-col items-center justify-center h-96">
      <Loader2 className="animate-spin text-red-600 mb-4" size={32} />
      <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Loading Records...</p>
    </div>
  );

  return (
    <div className="relative">
      <div className="absolute inset-0 scanline opacity-[0.02] pointer-events-none" />
      <div className="flex items-center space-x-6 mb-12">
        <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center neon-red relative">
          <div className="hud-corner hud-corner-tr -top-1 -right-1" />
          <div className="hud-corner hud-corner-bl -bottom-1 -left-1" />
          <Star className="text-red-600" size={32} />
        </div>
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-white leading-none mb-2">Achievements</h2>
          <p className="text-gray-500 text-[9px] font-mono font-black uppercase tracking-[0.3em]">LEGACY_ARCHIVE_v1.0.4</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {achievements.length > 0 ? achievements.map((achievement, i) => {
          const Icon = getIcon(achievement.category);
          const color = getColor(achievement.category);
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start space-x-6 p-8 rounded-[32px] glass glass-hover relative group overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className={`p-5 rounded-2xl glass ${color} group-hover:scale-110 transition-transform duration-500 relative`}>
                <div className="hud-corner hud-corner-tl w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Icon size={32} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-red-600 font-mono font-black text-sm tracking-tighter">[{achievement.year}]</span>
                    <div className="w-1 h-1 bg-gray-800 rounded-full" />
                    <span className="text-[9px] font-mono text-gray-500 font-black uppercase tracking-[0.2em]">{achievement.category}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white mb-3 tracking-tight leading-tight group-hover:text-red-500 transition-colors">
                  {achievement.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">
                  {achievement.description}
                </p>
              </div>
            </motion.div>
          );
        }) : (
          <div className="text-center py-20 glass rounded-[32px] border-dashed border-white/10">
            <Award size={40} className="text-gray-800 mx-auto mb-4" />
            <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">
              No records found
            </p>
          </div>
        )}
      </div>
      
      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-10 py-5 glass glass-hover rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-white transition-all shadow-xl neon-red-hover glitch-hover"
      >
        View Hall of Fame
      </motion.button>
    </div>
  );
}
