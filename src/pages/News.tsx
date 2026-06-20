import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Newspaper, Calendar, User, ArrowRight, Search, Loader2, Trash2, Share2, Pencil, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
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
  
  // States for news editing
  const [editingArticle, setEditingArticle] = React.useState<NewsItem | null>(null);
  const [editTitle, setEditTitle] = React.useState('');
  const [editContent, setEditContent] = React.useState('');
  const [editCategory, setEditCategory] = React.useState<NewsItem['category']>('General');
  const [editImageUrl, setEditImageUrl] = React.useState('');
  const [isUpdating, setIsUpdating] = React.useState(false);

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
  }, [auth, db]);

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

  const startEdit = (e: React.MouseEvent, item: NewsItem) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingArticle(item);
    setEditTitle(item.title);
    setEditContent(item.content);
    setEditCategory(item.category);
    setEditImageUrl(item.imageUrl || '');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    setIsUpdating(true);
    try {
      const docRef = doc(db, 'news', editingArticle.id);
      await updateDoc(docRef, {
        title: editTitle,
        content: editContent,
        category: editCategory,
        imageUrl: editImageUrl,
      });
      setEditingArticle(null);
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setIsUpdating(false);
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
                className="card-base overflow-hidden group flex flex-col h-full card-hover relative"
              >
                {/* Discreet Admin Controls in top-right corner on hover */}
                {isAdmin && (
                  <div className="absolute top-4 right-4 z-30 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-4px] group-hover:translate-y-0">
                    <button
                      onClick={(e) => startEdit(e, item)}
                      className="p-2.5 bg-white/95 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-xl shadow-lg border border-amber-100 backdrop-blur transition-all flex items-center justify-center cursor-pointer"
                      title="Edit Article"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, item.id!)}
                      className="p-2.5 bg-white/95 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl shadow-lg border border-red-100 backdrop-blur transition-all flex items-center justify-center cursor-pointer"
                      title="Delete Article"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}

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

      {/* Edit Article Modal */}
      <AnimatePresence>
        {editingArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingArticle(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-xl bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl p-8 z-10 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)]">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-[var(--foreground)]">Edit Article</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">Modify school update details below</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] rounded-lg transition-colors bg-[var(--muted)]"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none"
                    placeholder="Enter article title"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-2">
                    Category
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as any)}
                    className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none"
                  >
                    {['Academic', 'Sports', 'Alumni', 'Innovation', 'General'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none"
                    placeholder="https://images.unsplash.com/... (optional)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-2">
                    Content
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none resize-none"
                    placeholder="Write article body content here..."
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
                  <button
                    type="button"
                    onClick={() => setEditingArticle(null)}
                    className="px-5 py-2.5 bg-[var(--muted)] hover:bg-[var(--border)] text-[var(--foreground)] rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="animate-spin" size={14} />
                        Updating...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
