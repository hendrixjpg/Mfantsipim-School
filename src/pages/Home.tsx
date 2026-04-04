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
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Mfantsipim-school-main-entrance-front-view.jpg"
            alt="Mfantsipim School Campus"
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="w-24 h-24 bg-red-600 rounded-full mx-auto flex items-center justify-center mb-6 shadow-2xl shadow-red-600/20">
              <span className="text-white font-bold text-4xl">M</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4">
              {SCHOOL_INFO.name}
            </h1>
            <p className="text-xl md:text-2xl text-red-500 font-bold italic tracking-widest uppercase">
              {SCHOOL_INFO.motto} – {SCHOOL_INFO.mottoTranslation}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/about"
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-all flex items-center group"
            >
              Learn More <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/admissions"
              className="px-8 py-4 border-2 border-white/20 hover:border-red-600 text-white font-bold rounded-full transition-all"
            >
              Apply Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Founded', value: SCHOOL_INFO.founded, icon: GraduationCap },
              { label: 'Alumni', value: '10,000+', icon: Users },
              { label: 'Awards', value: '500+', icon: Trophy },
              { label: 'Students', value: '2,500+', icon: GraduationCap },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-red-600/50 transition-colors"
              >
                <stat.icon className="mx-auto text-red-600 mb-4" size={32} />
                <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-gray-500 text-sm font-bold uppercase tracking-widest">{stat.label}</div>
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
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white">Latest Updates</h2>
              <div className="w-20 h-1 bg-red-600 mt-2"></div>
            </div>
            <Link to="/news" className="text-red-500 font-bold hover:text-red-400 flex items-center">
              View All <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-10">
                <Loader2 className="animate-spin text-red-600 mb-4" size={32} />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Updates...</p>
              </div>
            ) : news.length > 0 ? news.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <Link to={`/news/${item.id}`}>
                  <div className="relative aspect-video overflow-hidden rounded-xl mb-4">
                    <img
                      src={item.imageUrl || `https://picsum.photos/seed/school-${i}/800/450`}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em]">
                      {item.category}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                    {item.content}
                  </p>
                  <div className="flex items-center text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    <Newspaper size={14} className="mr-2" />
                    {format(new Date(item.date), 'MMM dd, yyyy')}
                  </div>
                </Link>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-10 text-gray-500 font-bold uppercase tracking-widest text-xs">
                No news updates yet
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
