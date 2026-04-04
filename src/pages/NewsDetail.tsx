import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, User, ArrowLeft, Loader2, Newspaper, Share2 } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { NewsItem } from '@/src/types';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = React.useState<NewsItem | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
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
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-red-600 mb-4" size={48} />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Loading Article...</p>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <Newspaper size={64} className="text-gray-800 mb-6" />
        <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-4">Article Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-md">The news article you are looking for might have been removed or is temporarily unavailable.</p>
        <Link to="/news" className="px-8 py-4 bg-red-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-red-700 transition-all flex items-center">
          <ArrowLeft className="mr-2" size={20} /> Back to News
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-32">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link to="/news" className="inline-flex items-center text-red-500 font-bold uppercase tracking-widest text-xs mb-8 hover:translate-x-[-4px] transition-transform">
            <ArrowLeft className="mr-2" size={16} /> Back to News
          </Link>
          
          <div className="inline-block px-4 py-1.5 bg-red-600/10 border border-red-600/20 rounded-full text-red-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            {news.category}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight leading-[1.1] mb-8">
            {news.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-xs text-gray-500 font-bold uppercase tracking-widest border-y border-white/10 py-6">
            <div className="flex items-center">
              <Calendar size={16} className="mr-2 text-red-600" />
              {format(new Date(news.date), 'MMMM dd, yyyy')}
            </div>
            <div className="flex items-center">
              <User size={16} className="mr-2 text-red-600" />
              Published by {news.author}
            </div>
            <button className="ml-auto flex items-center hover:text-white transition-colors">
              <Share2 size={16} className="mr-2" /> Share
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-12"
        >
          {news.imageUrl && (
            <div className="aspect-video rounded-[40px] overflow-hidden border border-white/10 shadow-2xl">
              <img
                src={news.imageUrl}
                alt={news.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          
          <div className="prose prose-invert prose-red max-w-none">
            <div className="text-gray-300 text-lg leading-relaxed space-y-6">
              <ReactMarkdown>{news.content}</ReactMarkdown>
            </div>
          </div>
        </motion.div>
      </article>
    </div>
  );
}
