import React from 'react';
import { motion } from 'motion/react';
import { Newspaper, Calendar, User, ArrowRight, Search, Filter, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { NewsItem } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { format } from 'date-fns';

export default function News() {
  const [news, setNews] = React.useState<NewsItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState('All');

  const categories = ['All', 'Academic', 'Sports', 'Alumni', 'Innovation', 'General'];

  React.useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem));
      setNews(data);
      setLoading(false);
    }, (error) => {
      console.error("News fetch error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-20 pb-24">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-red-600/10 border border-red-600/20 rounded-full text-red-500 text-xs font-black uppercase tracking-[0.2em] mb-6"
          >
            Latest Updates
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-6">
            School News
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Stay informed about the latest happenings, achievements, and events at Mfantsipim School.
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-white/5 border border-white/10">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-12 py-3 text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
            />
          </div>
          
          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            <Filter className="text-gray-500 mr-2 hidden md:block" size={18} />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                  activeCategory === cat
                    ? "bg-red-600 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-red-600 mb-4" size={48} />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Loading News...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-red-600/30 transition-all"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={item.imageUrl || `https://picsum.photos/seed/${item.id}/800/450`}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em]">
                    {item.category}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">
                    <div className="flex items-center">
                      <Calendar size={12} className="mr-1" />
                      {format(new Date(item.date), 'MMM dd, yyyy')}
                    </div>
                    <div className="flex items-center">
                      <User size={12} className="mr-1" />
                      {item.author}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors mb-4 line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-6">
                    {item.content}
                  </p>
                  
                  <Link
                    to={`/news/${item.id}`}
                    className="inline-flex items-center text-red-600 font-black text-xs uppercase tracking-widest group-hover:translate-x-2 transition-transform"
                  >
                    Read More <ArrowRight className="ml-2" size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {!loading && filteredNews.length === 0 && (
          <div className="text-center py-20">
            <Newspaper className="mx-auto text-gray-700 mb-4" size={64} />
            <h3 className="text-xl font-bold text-gray-500">No news articles found</h3>
            <p className="text-gray-600 mt-2">Try adjusting your search or filter</p>
          </div>
        )}
      </section>
    </div>
  );
}
