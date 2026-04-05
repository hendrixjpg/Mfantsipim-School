import React from 'react';
import { motion } from 'motion/react';
import { Newspaper, Calendar, User, ArrowRight, Search, Filter, Loader2, Trash2, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/src/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { NewsItem, UserProfile } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { format } from 'date-fns';
import ShareModal from '@/src/components/ShareModal';

export default function News() {
  const [news, setNews] = React.useState<NewsItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [sharingArticle, setSharingArticle] = React.useState<NewsItem | null>(null);

  const categories = ['All', 'Academic', 'Sports', 'Alumni', 'Innovation', 'General'];

  React.useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const profile = docSnap.data() as UserProfile;
          setIsAdmin(profile.role === 'admin');
        } else if (user.email === "seldogbey234@gmail.com") {
          setIsAdmin(true);
        }
      } else {
        setIsAdmin(false);
      }
    });

    const q = query(collection(db, 'news'), orderBy('date', 'desc'));
    const unsubscribeNews = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem));
      setNews(data);
      setLoading(false);
    }, (error) => {
      console.error("News fetch error:", error);
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeNews();
    };
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        await deleteDoc(doc(db, 'news', id));
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-[var(--background)] min-h-screen">
      {/* Header Section */}
      <section className="bg-[var(--muted)] pt-32 pb-20 border-b border-[var(--border)]">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 text-red-600 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Newspaper size={14} />
            School Updates
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-[var(--foreground)] uppercase tracking-tight mb-6">
            Latest <span className="text-red-600">News</span>
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
            Stay informed with the latest developments, achievements, and events from the Mfantsipim community.
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="container-custom -mt-10 relative z-10">
        <div className="card-base p-6 md:p-8 shadow-xl bg-[var(--card)] flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="relative w-full lg:w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none"
            />
          </div>
          
          <div className="flex items-center space-x-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                  activeCategory === cat
                    ? "bg-red-600 text-white shadow-md shadow-red-600/10"
                    : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--border)]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="container-custom py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-red-600 mb-4" size={40} />
            <p className="text-[var(--muted-foreground)] font-bold uppercase tracking-widest text-xs">Loading updates...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((item, i) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="card-base overflow-hidden group flex flex-col h-full card-hover"
              >
                <Link to={`/news/${item.id}`} className="flex flex-col h-full">
                  {item.imageUrl && (
                    <div className="aspect-video overflow-hidden relative">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                        {item.category}
                      </div>
                    </div>
                  )}

                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-[var(--muted-foreground)] text-[10px] font-bold uppercase tracking-widest">
                        <Calendar size={14} className="mr-2 text-red-600" />
                        {format(new Date(item.date), 'MMM dd, yyyy')}
                      </div>
                      <div className="flex items-center text-[var(--muted-foreground)] text-[10px] font-bold uppercase tracking-widest">
                        <User size={14} className="mr-2 text-red-600" />
                        {item.author.split(' ')[0]}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-[var(--foreground)] mb-4 leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-[var(--muted-foreground)] text-sm leading-relaxed line-clamp-3 mb-8">
                      {item.content}
                    </p>

                    <div className="mt-auto pt-6 border-t border-[var(--border)] flex items-center justify-between">
                      <div className="flex items-center text-xs font-bold text-red-600 uppercase tracking-widest group/link">
                        Read More <ArrowRight size={14} className="ml-2 group-hover/link:translate-x-1 transition-transform" />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSharingArticle(item);
                          }}
                          className="p-2 text-[var(--muted-foreground)] hover:text-red-600 transition-colors"
                          title="Share Article"
                        >
                          <Share2 size={18} />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={(e) => handleDelete(e, item.id!)}
                            className="p-2 text-[var(--muted-foreground)] hover:text-red-600 transition-colors"
                            title="Delete Article"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}

        {!loading && filteredNews.length === 0 && (
          <div className="text-center py-32 card-base bg-[var(--muted)]">
            <Newspaper size={48} className="text-[var(--muted-foreground)] mx-auto mb-6 opacity-20" />
            <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">No articles found</h3>
            <p className="text-[var(--muted-foreground)]">Try adjusting your search or category filter.</p>
          </div>
        )}
      </section>

      <ShareModal
        isOpen={!!sharingArticle}
        onClose={() => setSharingArticle(null)}
        title={sharingArticle?.title || ''}
        url={sharingArticle ? `${window.location.origin}/news/${sharingArticle.id}` : ''}
      />
    </div>
  );
}
