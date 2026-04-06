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

  const getColorClass = (category: string) => {
    switch (category.toLowerCase()) {
      case 'academic': return 'bg-red-600/10 text-red-600';
      case 'sports': return 'bg-yellow-600/10 text-yellow-600';
      case 'innovation': return 'bg-blue-600/10 text-blue-600';
      default: return 'bg-green-600/10 text-green-600';
    }
  };

  if (loading) return (
    <div className="card-base p-12 flex flex-col items-center justify-center h-96">
      <Loader2 className="animate-spin text-red-600 mb-4" size={32} />
      <p className="text-[var(--muted-foreground)] font-bold uppercase tracking-widest text-[10px]">Loading Records...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-6 mb-10">
        <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center">
          <Star className="text-red-600" size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-[var(--foreground)] leading-none mb-2">Achievements</h2>
          <p className="text-[var(--muted-foreground)] text-[10px] font-bold uppercase tracking-widest">Legacy of Excellence</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {achievements.length > 0 ? achievements.map((achievement, i) => {
          const Icon = getIcon(achievement.category);
          const colorClass = getColorClass(achievement.category);
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start space-x-6 p-6 rounded-2xl border border-[var(--border)] hover:border-red-600/30 transition-all group bg-[var(--card)]"
            >
              <div className={`p-4 rounded-xl ${colorClass} group-hover:scale-105 transition-transform duration-300`}>
                <Icon size={28} />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-red-600 font-bold text-sm tracking-tight">{achievement.year}</span>
                  <div className="w-1 h-1 bg-[var(--border)] rounded-full" />
                  <span className="text-[10px] text-[var(--muted-foreground)] font-bold uppercase tracking-widest">{achievement.category}</span>
                </div>
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-2 tracking-tight leading-tight group-hover:text-red-600 transition-colors">
                  {achievement.title}
                </h3>
                <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                  {achievement.description}
                </p>
              </div>
            </motion.div>
          );
        }) : (
          <div className="text-center py-20 card-base border-dashed border-[var(--border)]">
            <Award size={40} className="text-[var(--muted-foreground)] mx-auto mb-4 opacity-20" />
            <p className="text-[var(--muted-foreground)] font-bold uppercase tracking-widest text-[10px]">
              No records found
            </p>
          </div>
        )}
      </div>
      
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full py-4 bg-[var(--muted)] hover:bg-[var(--border)] rounded-xl text-[10px] font-bold uppercase tracking-widest text-[var(--foreground)] transition-all"
      >
        View Hall of Fame
      </motion.button>
    </div>
  );
}
