import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, LogIn, LayoutDashboard, Newspaper, Trophy, Users, Settings, LogOut, Loader2, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { auth, db } from '@/src/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { NewsItem, UserProfile } from '@/src/types';

export default function Admin() {
  const [user, setUser] = React.useState<FirebaseUser | null>(null);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState('dashboard');
  
  // News Form State
  const [newsTitle, setNewsTitle] = React.useState('');
  const [newsCategory, setNewsCategory] = React.useState('Academic');
  const [newsImage, setNewsImage] = React.useState('');
  const [newsContent, setNewsContent] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const docRef = doc(db, 'users', u.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          // Check if default admin
          const isAdmin = u.email === "seldogbey234@gmail.com";
          const newProfile: UserProfile = {
            uid: u.uid,
            email: u.email || '',
            displayName: u.displayName || '',
            role: isAdmin ? 'admin' : 'guest'
          };
          await setDoc(docRef, newProfile);
          setProfile(newProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      const provider = new GoogleAuthProvider();
      // Force select account to avoid some browser cache issues
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === 'auth/cancelled-popup-request') {
        return;
      }
      if (error.code === 'auth/popup-closed-by-user') {
        return;
      }
      if (error.code === 'auth/popup-blocked') {
        alert('Login popup was blocked by your browser. Please allow popups for this site.');
        return;
      }
      console.error("Login error:", error);
      alert("Login failed: " + error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => signOut(auth);

  const handlePostNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsContent || !profile || profile.role !== 'admin') return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'news'), {
        title: newsTitle,
        content: newsContent,
        category: newsCategory,
        imageUrl: newsImage,
        date: new Date().toISOString(),
        author: profile.displayName || 'Administrator',
        authorUid: profile.uid
      });
      setNewsTitle('');
      setNewsContent('');
      setNewsImage('');
      alert('News article published successfully!');
    } catch (error) {
      console.error("Post news error:", error);
      alert('Failed to publish news. Check permissions.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Loader2 className="animate-spin text-red-600" size={48} />
    </div>
  );

  if (!user || profile?.role !== 'admin') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-10 rounded-[40px] bg-zinc-950 border border-white/10 shadow-2xl text-center"
        >
          <div className="w-16 h-16 bg-red-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-red-600/20">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Admin Portal</h1>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-8">
            {user ? "You do not have admin privileges." : "Authorized Access Only"}
          </p>

          <button
            onClick={user ? handleLogout : handleLogin}
            disabled={isLoggingIn}
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
          >
            {isLoggingIn ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} />}
            <span>{user ? "Sign Out" : isLoggingIn ? "Signing In..." : "Sign In with Google"}</span>
          </button>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'news', name: 'Manage News', icon: Newspaper },
    { id: 'leaderboard', name: 'Leaderboard', icon: Trophy },
    { id: 'alumni', name: 'Alumni Directory', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-zinc-950 border-r border-white/5 p-6 space-y-8">
        <div className="flex items-center space-x-3 px-2">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <h2 className="text-white font-black uppercase tracking-tight">Admin Panel</h2>
        </div>

        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all",
                activeTab === tab.id
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                  : "text-gray-500 hover:bg-white/5 hover:text-white"
              )}
            >
              <tab.icon size={20} />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>

        <div className="pt-8 mt-8 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <header className="mb-12">
            <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-2">
              {tabs.find(t => t.id === activeTab)?.name}
            </h1>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">
              Welcome back, {profile.displayName}
            </p>
          </header>

          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'Total News', value: '...', icon: Newspaper, color: 'text-blue-500' },
                { label: 'Active Alumni', value: '...', icon: Users, color: 'text-green-500' },
                { label: 'Admin Status', value: 'Active', icon: ShieldCheck, color: 'text-red-500' },
              ].map((stat, i) => (
                <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10">
                  <stat.icon className={cn("mb-6", stat.color)} size={32} />
                  <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'news' && (
            <div className="space-y-8">
              <div className="p-10 rounded-3xl bg-white/5 border border-white/10">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-8 flex items-center">
                  <Plus className="mr-2 text-red-600" /> Post New Article
                </h2>
                <form className="space-y-6" onSubmit={handlePostNews}>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Article Title</label>
                    <input
                      type="text"
                      required
                      value={newsTitle}
                      onChange={(e) => setNewsTitle(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-red-600 transition-colors"
                      placeholder="Enter title..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Category</label>
                      <select 
                        value={newsCategory}
                        onChange={(e) => setNewsCategory(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-red-600 transition-colors appearance-none"
                      >
                        <option>Academic</option>
                        <option>Sports</option>
                        <option>Alumni</option>
                        <option>Innovation</option>
                        <option>General</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Image URL</label>
                      <input
                        type="text"
                        value={newsImage}
                        onChange={(e) => setNewsImage(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-red-600 transition-colors"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Content (Markdown)</label>
                    <textarea
                      required
                      rows={8}
                      value={newsContent}
                      onChange={(e) => setNewsContent(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-red-600 transition-colors resize-none"
                      placeholder="Write your article content here..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest rounded-2xl transition-all disabled:opacity-50 flex items-center"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
                    Publish Article
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
