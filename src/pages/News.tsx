import React from 'react';
import { motion } from 'motion/react';
import { Newspaper, Calendar, User, ArrowRight, Search, Filter, Loader2, Trash2, Zap, Globe, ShieldCheck, Network, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/src/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { NewsItem, UserProfile } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { format } from 'date-fns';
import ShareModal from '@/src/components/ShareModal';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

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
        handleFirestoreError(error, OperationType.DELETE, `news/${id}`);
      }
    }
  };

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-20 pb-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.05)_0%,transparent_70%)] -z-10" />
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 glass border border-red-600/20 rounded-full text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8"
        >
          Information_Stream // News_Feed
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-none">
          Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">Updates</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
          Stay synchronized with the latest developments, achievements, and events from the <span className="text-white">Mfantsipim ecosystem</span>.
        </p>
      </section>

      {/* Search and Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 p-8 rounded-[40px] glass border border-white/10">
          <div className="relative w-full lg:w-[450px] group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-red-600 group-focus-within:animate-pulse" size={20} />
            <input
              type="text"
              placeholder="SEARCH_DATA_FEEDS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full glass border border-white/10 rounded-2xl px-16 py-4 text-[11px] font-mono font-black text-white focus:outline-none focus:border-red-600/50 transition-all placeholder:text-gray-700"
            />
          </div>
          
          <div className="flex items-center space-x-3 overflow-x-auto w-full lg:w-auto pb-4 lg:pb-0 scrollbar-hide">
            <div className="flex items-center gap-3 px-4 py-2 glass border border-white/5 rounded-xl mr-4">
              <Filter className="text-red-600" size={16} />
              <span className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-widest">Category_Filter</span>
            </div>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border",
                  activeCategory === cat
                    ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20"
                    : "glass border-white/5 text-gray-500 hover:text-white hover:border-red-600/30"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-24 h-24 glass rounded-3xl flex items-center justify-center mb-8 neon-red">
              <Loader2 className="animate-spin text-red-600" size={48} />
            </div>
            <p className="text-gray-500 font-mono font-black uppercase tracking-[0.4em] text-xs">Syncing_Data_Stream...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredNews.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10, rotateX: 2, rotateY: 2 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group relative perspective-1000"
              >
                <Link to={`/news/${item.id}`} className="block h-full">
                  <div className="h-full p-8 rounded-[40px] glass glass-hover border border-white/10 relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                      <Newspaper size={120} className="text-red-600" />
                    </div>

                    {item.imageUrl && (
                      <div className="aspect-video rounded-[32px] overflow-hidden mb-8 relative">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                        <div className="absolute bottom-4 left-4 px-3 py-1 glass border border-white/10 rounded-lg text-[8px] font-mono font-black text-white uppercase tracking-widest">
                          IMG_REF_{item.id?.slice(0, 4)}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-6">
                      <div className="px-4 py-1.5 glass border border-red-600/20 rounded-full text-red-500 text-[9px] font-black uppercase tracking-[0.2em]">
                        {item.category}
                      </div>
                      <div className="flex items-center text-gray-500 text-[9px] font-mono font-black uppercase tracking-widest">
                        <Calendar size={12} className="mr-2 text-red-600" />
                        {format(new Date(item.date), 'dd_MMM_yyyy')}
                      </div>
                    </div>

                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-6 group-hover:text-red-500 transition-colors leading-tight line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-8 font-medium">
                      {item.content}
                    </p>

                    <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center text-gray-500 text-[10px] font-mono font-black uppercase tracking-widest">
                        <User size={14} className="mr-2 text-red-600" />
                        {item.author.split(' ')[0]}
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSharingArticle(item);
                          }}
                          className="w-10 h-10 glass rounded-xl flex items-center justify-center text-gray-500 hover:text-red-500 transition-all group/share"
                          title="Share Article"
                        >
                          <Share2 size={18} className="group-hover/share:neon-red transition-all" />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={(e) => handleDelete(e, item.id!)}
                            className="w-10 h-10 glass rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all neon-red-hover"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                        <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-gray-500 group-hover:text-red-600 group-hover:neon-red transition-all">
                          <ArrowRight size={18} />
                        </div>
                      </div>
                    </div>

                    {/* HUD corners */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/10 rounded-tl-[40px] group-hover:border-red-600/50 transition-colors" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/10 rounded-br-[40px] group-hover:border-red-600/50 transition-colors" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredNews.length === 0 && (
          <div className="text-center py-32">
            <div className="w-24 h-24 glass rounded-3xl flex items-center justify-center mx-auto mb-8 opacity-20">
              <Newspaper size={48} className="text-gray-500" />
            </div>
            <h3 className="text-2xl font-black text-gray-500 uppercase tracking-tighter mb-2">No_Data_Found</h3>
            <p className="text-gray-600 font-mono text-[10px] uppercase tracking-[0.2em]">Adjust_Search_Parameters</p>
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
