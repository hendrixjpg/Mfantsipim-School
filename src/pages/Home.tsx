import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Trophy, Users, GraduationCap, Newspaper, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SCHOOL_INFO } from '@/src/constants';
import Leaderboard from '@/src/components/Leaderboard';
import Achievements from '@/src/components/Achievements';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { NewsItem } from '@/src/types';
import { format } from 'date-fns';

export default function Home() {
  const [news, setNews] = React.useState<NewsItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('date', 'desc'), limit(3));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem));
      setNews(data);
      setLoading(false);
    }, (error) => {
      console.error("Home news fetch error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Mfantsipim-school-main-entrance-front-view.jpg"
            alt="Mfantsipim School Campus"
            className="w-full h-full object-cover opacity-20 scale-110 blur-[2px]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/80 to-[#050505]"></div>
          
          {/* Floating Glows */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, 100, 0],
              y: [0, -50, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-[120px]" 
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
              x: [0, -100, 0],
              y: [0, 50, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" 
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
              className="w-24 h-24 glass rounded-3xl mx-auto flex items-center justify-center mb-8 neon-red relative group glitch-hover"
            >
              <div className="absolute inset-0 bg-red-600/20 rounded-3xl blur-xl group-hover:bg-red-600/40 transition-all" />
              <div className="hud-corner hud-corner-tl -top-2 -left-2" />
              <div className="hud-corner hud-corner-tr -top-2 -right-2" />
              <div className="hud-corner hud-corner-bl -bottom-2 -left-2" />
              <div className="hud-corner hud-corner-br -bottom-2 -right-2" />
              <span className="text-white font-black text-5xl relative z-10 text-glow">M</span>
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter mb-6 leading-none relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
                {SCHOOL_INFO.name}
              </span>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-mono text-red-600/50 tracking-[0.5em] uppercase pointer-events-none">
                ESTABLISHED_1876
              </div>
            </h1>
            
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-red-600" />
              <p className="text-sm md:text-base text-red-500 font-black tracking-[0.3em] uppercase">
                {SCHOOL_INFO.motto}
              </p>
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-red-600" />
            </div>

            <p className="max-w-2xl mx-auto text-gray-400 text-lg font-medium mb-12">
              The first secondary school in Ghana, established in 1876. 
              Pioneering excellence for over a century and a half.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link
              to="/about"
              className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl transition-all flex items-center group neon-red neon-red-hover glitch-hover"
            >
              EXPLORE HERITAGE <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/admissions"
              className="px-10 py-4 glass glass-hover text-white font-black rounded-2xl transition-all neon-red-hover glitch-hover"
            >
              ADMISSIONS
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-red-600 to-transparent" />
          <span className="text-[10px] font-black tracking-[0.2em] uppercase">Scroll</span>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-600/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { label: 'FOUNDED_DATE', value: SCHOOL_INFO.founded, icon: GraduationCap },
              { label: 'ALUMNI_NETWORK', value: '10,000+', icon: Users },
              { label: 'AWARDS_EARNED', value: '500+', icon: Trophy },
              { label: 'ACTIVE_STUDENTS', value: '2,500+', icon: GraduationCap },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ 
                  rotateX: 5, 
                  rotateY: 5, 
                  scale: 1.02,
                  z: 50
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20,
                  delay: i * 0.1 
                }}
                className="glass glass-hover p-8 rounded-[32px] text-center group relative overflow-hidden perspective-1000"
              >
                <div className="hud-corner hud-corner-tl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="hud-corner hud-corner-br opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 neon-red">
                  <stat.icon className="text-red-600" size={28} />
                </div>
                <div className="text-5xl font-black text-white mb-2 tracking-tighter text-glow">{stat.value}</div>
                <div className="text-gray-500 text-[8px] font-mono font-black uppercase tracking-[0.3em]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard & Achievements */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <Leaderboard />
            <Achievements />
          </div>
        </div>
      </section>

      {/* News Preview */}
      <section className="py-32 bg-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-[1px] bg-red-600" />
                <span className="text-red-600 font-mono font-black text-[10px] uppercase tracking-[0.4em]">Updates_Feed</span>
              </div>
              <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">Latest News</h2>
            </div>
            <Link 
              to="/news" 
              className="group flex items-center space-x-4 glass px-8 py-4 rounded-2xl hover:bg-red-600/10 transition-all neon-red-hover glitch-hover"
            >
              <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em]">View_All_Updates</span>
              <ArrowRight className="text-red-600 group-hover:translate-x-2 transition-transform" size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 glass rounded-[32px]">
                <Loader2 className="animate-spin text-red-600 mb-6" size={40} />
                <p className="text-gray-500 font-mono font-black uppercase tracking-[0.3em] text-[10px]">Syncing_Data_Stream...</p>
              </div>
            ) : news.length > 0 ? news.slice(0, 3).map((item, i) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  rotateX: 2, 
                  rotateY: 2, 
                  scale: 1.01,
                  z: 20
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20,
                  delay: i * 0.1 
                }}
                className="glass glass-hover rounded-[32px] overflow-hidden group flex flex-col h-full relative perspective-1000"
              >
                <div className="hud-corner hud-corner-tr opacity-0 group-hover:opacity-100 transition-opacity" />
                <Link to={`/news/${item.id}`} className="flex flex-col h-full">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={item.imageUrl || `https://picsum.photos/seed/school-${i}/800/450`} 
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                    <div className="absolute top-4 left-4 glass px-4 py-2 rounded-xl">
                      <span className="text-[8px] font-mono font-black text-white uppercase tracking-widest">{item.category}</span>
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="text-[9px] font-mono text-red-600 font-black uppercase tracking-[0.2em] mb-4">
                      {format(new Date(item.date), 'dd_MMM_yyyy').toUpperCase()}
                    </div>
                    <h3 className="text-xl font-black text-white mb-4 tracking-tight leading-tight group-hover:text-red-500 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-6 font-medium leading-relaxed">
                      {item.content}
                    </p>
                    <div className="mt-auto pt-6 border-t border-white/5">
                      <div className="flex items-center text-[9px] font-mono font-black text-gray-500 group-hover:text-white uppercase tracking-[0.3em] transition-colors group/link">
                        Read_Full_Article <ArrowRight size={12} className="ml-2 group-hover/link:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            )) : (
              <div className="col-span-full text-center py-20 glass rounded-[32px] text-gray-500 font-mono font-black uppercase tracking-[0.3em] text-[10px]">
                NO_ACTIVE_DATA_FEEDS
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
