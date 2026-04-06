import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, User, ArrowLeft, Loader2, Newspaper, Share2, Trash2 } from 'lucide-react';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '@/src/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { NewsItem, UserProfile } from '@/src/types';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import ShareModal from '@/src/components/ShareModal';

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [news, setNews] = React.useState<NewsItem | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);

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

    const fetchNews = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'news', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setNews({ id: docSnap.id, ...docSnap.data() } as NewsItem);
        }
      } catch (error) {
        console.error("Fetch news detail error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();

    return () => unsubscribeAuth();
  }, [id, auth, db]);

  const handleDelete = async () => {
    if (!id) return;
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        await deleteDoc(doc(db, 'news', id));
        navigate('/news');
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)]">
        <Loader2 className="animate-spin text-red-600 mb-4" size={48} />
        <p className="text-[var(--muted-foreground)] font-bold uppercase tracking-widest text-sm">Loading Article...</p>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-[var(--background)]">
        <Newspaper size={64} className="text-[var(--muted-foreground)] mb-6 opacity-20" />
        <h1 className="text-3xl font-black text-[var(--foreground)] uppercase tracking-tight mb-4">Article Not Found</h1>
        <p className="text-[var(--muted-foreground)] mb-8 max-w-md">The news article you are looking for might have been removed or is temporarily unavailable.</p>
        <Link to="/news" className="btn-primary flex items-center">
          <ArrowLeft className="mr-2" size={20} /> Back to News
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[var(--background)] min-h-screen pt-32 pb-32">
      <article className="container-custom max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link to="/news" className="inline-flex items-center text-red-600 font-bold uppercase tracking-widest text-xs mb-8 hover:translate-x-[-4px] transition-transform group">
            <ArrowLeft className="mr-2" size={16} /> Back to News
          </Link>
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-600/10 text-red-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
            {news.category}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-[var(--foreground)] uppercase tracking-tight leading-[1.1] mb-8">
            {news.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-xs text-[var(--muted-foreground)] font-bold uppercase tracking-widest border-y border-[var(--border)] py-6">
            <div className="flex items-center">
              <Calendar size={16} className="mr-2 text-red-600" />
              {format(new Date(news.date), 'MMMM dd, yyyy')}
            </div>
            <div className="flex items-center">
              <User size={16} className="mr-2 text-red-600" />
              Published by {news.author}
            </div>
            <button 
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center hover:text-red-600 transition-colors"
            >
              <Share2 size={16} className="mr-2" /> Share
            </button>
            {isAdmin && (
              <button
                onClick={handleDelete}
                className="flex items-center text-red-600 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} className="mr-2" /> Delete
              </button>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-12"
        >
          {news.imageUrl && (
            <div className="aspect-video rounded-3xl overflow-hidden border border-[var(--border)] shadow-2xl">
              <img
                src={news.imageUrl}
                alt={news.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          
          <div className="markdown-body">
            <ReactMarkdown>{news.content}</ReactMarkdown>
          </div>
        </motion.div>
      </article>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={news.title}
        url={window.location.href}
      />
    </div>
  );
}
