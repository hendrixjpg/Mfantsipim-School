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
    <div className="bg-white/5 rounded-3xl p-8 border border-white/10 flex flex-col items-center justify-center h-96">
      <Loader2 className="animate-spin text-red-600 mb-4" size={32} />
      <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Achievements...</p>
    </div>
  );

  return (
    <div>
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-red-600/20 rounded-2xl">
          <Star className="text-red-600" size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">Recent Achievements</h2>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Excellence in all fields</p>
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
              className="flex items-start space-x-6 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className={`p-4 rounded-2xl bg-black/50 ${color}`}>
                <Icon size={32} />
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-red-600 font-black text-sm">{achievement.year}</span>
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  <h3 className="text-lg font-bold text-white">{achievement.title}</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {achievement.description}
                </p>
              </div>
            </motion.div>
          );
        }) : (
          <div className="text-center py-10 text-gray-500 font-bold uppercase tracking-widest text-xs">
            No achievements data yet
          </div>
        )}
      </div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-8 py-4 border-2 border-white/10 hover:border-red-600/50 rounded-2xl text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-all"
      >
        View Hall of Fame
      </motion.button>
    </div>
  );
}
