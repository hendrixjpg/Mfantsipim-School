import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, LogIn, LayoutDashboard, Newspaper, Trophy, Users, 
  Settings, LogOut, Loader2, Plus, Trash2, Save, RefreshCw, Database, X,
  BarChart3, Activity, Star, Eye, EyeOff
} from 'lucide-react';
import Markdown from 'react-markdown';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Cell
} from 'recharts';
import { cn } from '@/src/lib/utils';
import { auth, db } from '@/src/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { 
  collection, addDoc, onSnapshot, query, orderBy, deleteDoc, 
  doc, setDoc, getDoc, getDocs, where, updateDoc, writeBatch 
} from 'firebase/firestore';
import { NewsItem, UserProfile, AlumniProfile, LeaderboardEntry } from '@/src/types';

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

// --- Sub-components ---

const StatCard = ({ label, value, icon: Icon, color, trend }: { label: string, value: string, icon: React.ElementType, color: string, trend?: string }) => (
  <div className="p-6 rounded-[24px] bg-white border border-zinc-200/60 shadow-sm hover:shadow-xl hover:shadow-red-600/5 transition-all duration-300 group">
    <div className="flex items-center justify-between mb-4">
      <div className={cn("p-3 rounded-2xl transition-colors duration-300", color.replace('text-', 'bg-').concat('/10'), "group-hover:".concat(color.replace('text-', 'bg-').concat('/20')))}>
        <Icon className={color} size={24} />
      </div>
      {trend && (
        <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold">
          <span>{trend}</span>
        </div>
      )}
    </div>
    <div className="text-4xl font-black text-zinc-900 mb-1 tracking-tight">{value}</div>
    <div className="text-xs font-bold text-zinc-400 uppercase tracking-[0.1em]">{label}</div>
  </div>
);

const QuickAction = ({ label, icon: Icon, onClick, description, variant = 'default' }: { label: string, icon: React.ElementType, onClick: () => void, description: string, variant?: 'default' | 'danger' }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex flex-col items-start p-5 rounded-[24px] border transition-all duration-300 text-left group",
      variant === 'danger' 
        ? "bg-white border-zinc-200 hover:border-red-200 hover:bg-red-50/30"
        : "bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-200/20"
    )}
  >
    <div className={cn(
      "p-3 rounded-2xl mb-4 transition-all duration-300",
      variant === 'danger' ? "bg-red-50 text-red-600" : "bg-zinc-50 text-zinc-600 group-hover:bg-zinc-100"
    )}>
      <Icon size={20} />
    </div>
    <h4 className="text-sm font-bold text-zinc-900 mb-1">{label}</h4>
    <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">{description}</p>
  </button>
);

const engagementData = [
  { name: 'Jan', active: 400, new: 240 },
  { name: 'Feb', active: 300, new: 139 },
  { name: 'Mar', active: 200, new: 980 },
  { name: 'Apr', active: 278, new: 390 },
  { name: 'May', active: 189, new: 480 },
  { name: 'Jun', active: 239, new: 380 },
];

const DashboardTab = ({ 
  newsCount, 
  alumniCount, 
  isSubmitting, 
  seedMOBANews, 
  deleteAllNews, 
  seedLeaderboard, 
  seedNotableAlumni,
  leaderboard 
}: { 
  newsCount: number, 
  alumniCount: number, 
  isSubmitting: boolean, 
  seedMOBANews: () => void, 
  deleteAllNews: () => void, 
  seedLeaderboard: () => void, 
  seedNotableAlumni: () => void,
  leaderboard: LeaderboardEntry[] 
}) => {
  const houseData = leaderboard.map((h: any) => ({ name: h.houseName, points: h.points }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total News" value={newsCount.toString()} icon={Newspaper} color="text-red-600" trend="+4 this week" />
        <StatCard label="Verified Alumni" value={alumniCount.toString()} icon={Users} color="text-blue-600" trend="+12 today" />
        <StatCard label="House Points" value={leaderboard.reduce((acc, h) => acc + h.points, 0).toLocaleString()} icon={Trophy} color="text-amber-500" />
        <StatCard label="System Status" value="Online" icon={ShieldCheck} color="text-emerald-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Analytics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-[32px] bg-white border border-zinc-200/60 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-zinc-900 tracking-tight">Alumni Engagement</h3>
                <p className="text-xs text-zinc-500 font-medium mt-1 uppercase tracking-wider">Platform activity over time</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-zinc-50 border border-zinc-100">
                  <div className="w-2 h-2 rounded-full bg-red-600" />
                  <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">Active Users</span>
                </div>
              </div>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={engagementData}>
                  <defs>
                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} strokeOpacity={0.5} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#94a3b8" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false}
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: 'none',
                      borderRadius: '16px',
                      fontSize: '12px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="active" 
                    stroke="#dc2626" 
                    fillOpacity={1} 
                    fill="url(#colorActive)" 
                    strokeWidth={3}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions Bento */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickAction 
              label="Seed News" 
              description="Import latest MOBA articles from official sources."
              icon={RefreshCw}
              onClick={seedMOBANews}
            />
            <QuickAction 
              label="Seed Notable" 
              description="Populate the directory with historical Mfantsipim icons."
              icon={Star}
              onClick={seedNotableAlumni}
            />
            <QuickAction 
              label="Reset Leaderboard" 
              description="Clear all house points and reset to default standings."
              icon={Trophy}
              onClick={seedLeaderboard}
            />
            <QuickAction 
              label="Clear Database" 
              description="Permanently delete all news articles from the system."
              icon={Trash2}
              variant="danger"
              onClick={deleteAllNews}
            />
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-6">
          <div className="p-8 rounded-[32px] bg-white border border-zinc-200/60 shadow-sm">
            <h3 className="text-lg font-black text-zinc-900 mb-6 tracking-tight">House Standings</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={houseData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} strokeOpacity={0.5} />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    width={60}
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '11px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Bar dataKey="points" radius={[0, 4, 4, 0]} barSize={12}>
                    {houseData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#dc2626' : '#2563eb'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 space-y-3">
              {leaderboard.slice(0, 3).map((house, i) => (
                <div key={house.id} className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] font-black text-zinc-400 w-4">{i + 1}</span>
                    <span className="text-xs font-bold text-zinc-900">{house.houseName}</span>
                  </div>
                  <span className="text-xs font-black text-red-600">{house.points}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-[32px] bg-white border border-zinc-200 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-zinc-900 tracking-tight">System Health</h3>
              <Activity className="text-red-500" size={20} />
            </div>
            <div className="space-y-4">
              {[
                { name: 'Database', status: 'Healthy', color: 'bg-emerald-500' },
                { name: 'Auth Service', status: 'Healthy', color: 'bg-emerald-500' },
                { name: 'File Storage', status: 'Healthy', color: 'bg-emerald-500' },
              ].map((sys, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-zinc-400 text-[11px] font-bold uppercase tracking-wider">{sys.name}</span>
                  <div className="flex items-center space-x-2">
                    <div className={cn("w-1.5 h-1.5 rounded-full", sys.color)} />
                    <span className="text-zinc-900 text-xs font-black">{sys.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-zinc-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Storage Usage</span>
                <span className="text-zinc-900 text-[10px] font-black">12%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                <div className="w-[12%] h-full bg-red-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NewsTab = ({ 
  newsList, 
  handlePostNews, 
  isSubmitting, 
  newsTitle, 
  setNewsTitle, 
  newsCategory, 
  setNewsCategory, 
  newsImage, 
  setNewsImage, 
  newsContent, 
  setNewsContent,
  showPreview,
  setShowPreview
}: { 
  newsList: NewsItem[], 
  handlePostNews: (e: React.FormEvent) => void, 
  isSubmitting: boolean, 
  newsTitle: string, 
  setNewsTitle: (val: string) => void, 
  newsCategory: string, 
  setNewsCategory: (val: string) => void, 
  newsImage: string, 
  setNewsImage: (val: string) => void, 
  newsContent: string, 
  setNewsContent: (val: string) => void,
  showPreview: boolean,
  setShowPreview: (val: boolean) => void
}) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Create Form */}
      <div className="lg:col-span-2 space-y-8">
        <div className="p-8 rounded-[32px] bg-white border border-zinc-200/60 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Compose Article</h2>
              <p className="text-xs text-zinc-500 font-medium mt-1 uppercase tracking-wider">Publish news to the alumni portal</p>
            </div>
            <div className="p-3 rounded-2xl bg-red-50 text-red-600">
              <Plus size={24} />
            </div>
          </div>
          
          <form className="space-y-6" onSubmit={handlePostNews}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1">Article Title</label>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest",
                  newsTitle.length > 100 ? "text-red-500" : "text-zinc-400"
                )}>
                  {newsTitle.length} / 100
                </span>
              </div>
              <input
                type="text"
                required
                maxLength={100}
                value={newsTitle}
                onChange={(e) => setNewsTitle(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 text-zinc-900 focus:outline-none focus:ring-4 focus:ring-red-600/5 focus:border-red-600 transition-all placeholder:text-zinc-400 font-medium"
                placeholder="e.g. Annual MOBA Conference 2026"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1">Category</label>
                <div className="relative group">
                  <select 
                    value={newsCategory}
                    onChange={(e) => setNewsCategory(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 text-zinc-900 focus:outline-none focus:ring-4 focus:ring-red-600/5 focus:border-red-600 transition-all appearance-none font-medium cursor-pointer"
                  >
                    <option value="General">General</option>
                    <option value="Academic">Academic</option>
                    <option value="Sports">Sports</option>
                    <option value="Alumni">Alumni</option>
                    <option value="Innovation">Innovation</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 group-hover:text-red-600 transition-colors">
                    <Settings size={16} />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1">Cover Image URL</label>
                <input
                  type="text"
                  value={newsImage}
                  onChange={(e) => setNewsImage(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 text-zinc-900 focus:outline-none focus:ring-4 focus:ring-red-600/5 focus:border-red-600 transition-all placeholder:text-zinc-400 font-medium"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1">Content (Markdown)</label>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest",
                  newsContent.length > 5000 ? "text-red-500" : "text-zinc-400"
                )}>
                  {newsContent.length} / 5000
                </span>
              </div>
              <textarea
                required
                rows={10}
                maxLength={5000}
                value={newsContent}
                onChange={(e) => setNewsContent(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-3xl px-5 py-4 text-zinc-900 focus:outline-none focus:ring-4 focus:ring-red-600/5 focus:border-red-600 transition-all resize-none placeholder:text-zinc-400 font-medium leading-relaxed"
                placeholder="Write the article body here..."
              ></textarea>
            </div>
            
            <div className="flex items-center justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className={cn(
                  "px-8 py-4 font-black uppercase tracking-[0.2em] text-xs rounded-2xl transition-all flex items-center border",
                  showPreview 
                    ? "bg-zinc-900 text-white border-zinc-900" 
                    : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300"
                )}
              >
                {showPreview ? <EyeOff className="mr-3" size={18} /> : <Eye className="mr-3" size={18} />}
                {showPreview ? "Hide Preview" : "Preview Article"}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl transition-all disabled:opacity-50 flex items-center shadow-xl shadow-red-600/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? <Loader2 className="animate-spin mr-3" size={18} /> : <Save className="mr-3" size={18} />}
                Publish Article
              </button>
            </div>
          </form>
        </div>

        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="p-8 rounded-[32px] bg-white border border-zinc-200/60 shadow-sm overflow-hidden"
            >
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-1.5 h-6 bg-red-600 rounded-full" />
                <h3 className="text-xl font-black text-zinc-900 tracking-tight uppercase">Live Preview</h3>
              </div>

              <div className="max-w-none">
                {newsImage && (
                  <div className="aspect-video rounded-3xl overflow-hidden mb-8 border border-zinc-100">
                    <img src={newsImage} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
                <div className="flex items-center space-x-3 mb-4">
                  <span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-red-100">
                    {newsCategory}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-zinc-900 mb-8 tracking-tight leading-tight">
                  {newsTitle || "Article Title Placeholder"}
                </h1>
                <div className="prose prose-zinc prose-sm max-w-none text-zinc-600 font-medium leading-relaxed">
                  <div className="markdown-body">
                    <Markdown>{newsContent || "Article content will appear here..."}</Markdown>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recent List */}
      <div className="p-8 rounded-[32px] bg-white border border-zinc-200/60 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black text-zinc-900 tracking-tight">Recent Posts</h2>
          <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-zinc-100 text-zinc-500 uppercase tracking-widest">
            {newsList.length} Total
          </span>
        </div>
        
        <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 scrollbar-thin">
          {newsList.map((item: NewsItem) => (
            <div key={item.id} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 group hover:border-red-200 transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-200 flex-shrink-0 border border-zinc-200">
                  <img 
                    src={item.imageUrl || 'https://picsum.photos/seed/news/200/150'} 
                    alt="" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-zinc-900 line-clamp-1 mb-1">{item.title}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-white text-red-600 border border-red-100 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    if (confirm('Are you sure you want to delete this article?')) {
                      try {
                        await deleteDoc(doc(db, 'news', item.id));
                      } catch (error) {
                        handleFirestoreError(error, OperationType.DELETE, `news/${item.id}`);
                      }
                    }
                  }}
                  className="p-2 text-zinc-400 hover:text-red-600 hover:bg-white rounded-xl transition-all shadow-sm opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {newsList.length === 0 && (
            <div className="text-center py-20">
              <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-zinc-400">
                <Newspaper size={24} />
              </div>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">No articles found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

const LeaderboardTab = ({ 
  leaderboard, 
  isSubmitting 
}: { 
  leaderboard: LeaderboardEntry[], 
  isSubmitting: boolean 
}) => {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editPoints, setEditPoints] = React.useState<number>(0);

  const handleUpdatePoints = async (id: string) => {
    try {
      await updateDoc(doc(db, 'leaderboard', id), {
        points: editPoints
      });
      setEditingId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `leaderboard/${id}`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-8 rounded-[32px] bg-white border border-zinc-200/60 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">House Standings</h2>
            <p className="text-xs text-zinc-500 font-medium mt-1 uppercase tracking-wider">Manage points and rankings for school houses</p>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-500">
            <Trophy size={24} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {leaderboard.map((house: LeaderboardEntry, index: number) => (
            <div key={house.id} className="p-6 rounded-[24px] bg-zinc-50 border border-zinc-100 group hover:border-red-200 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black shadow-sm",
                    index === 0 ? "bg-amber-500 text-white" : 
                    index === 1 ? "bg-zinc-300 text-zinc-700" :
                    index === 2 ? "bg-amber-700/80 text-white" : "bg-white text-zinc-400"
                  )}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-base font-black text-zinc-900 tracking-tight">{house.houseName}</h4>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">{house.points.toLocaleString()} PTS</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  {editingId === house.id ? (
                    <div className="flex items-center space-x-2 animate-in fade-in zoom-in-95 duration-200">
                      <input
                        type="number"
                        value={editPoints}
                        onChange={(e) => setEditPoints(parseInt(e.target.value) || 0)}
                        className="w-24 bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-red-600/5 focus:border-red-600"
                      />
                      <button
                        onClick={() => handleUpdatePoints(house.id)}
                        className="p-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
                      >
                        <Save size={18} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-2.5 bg-zinc-100 text-zinc-500 rounded-xl hover:text-zinc-900 transition-all"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(house.id);
                        setEditPoints(house.points);
                      }}
                      className="px-4 py-2 bg-white border border-zinc-200 text-zinc-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-zinc-50 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100"
                    >
                      Update
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AlumniTab = ({ alumniList }: { alumniList: AlumniProfile[] }) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="p-8 rounded-[32px] bg-white border border-zinc-200/60 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Alumni Management</h2>
          <p className="text-xs text-zinc-500 font-medium mt-1 uppercase tracking-wider">Review and manage registered alumni profiles</p>
        </div>
        <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
          <Users size={24} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {alumniList.map((person: AlumniProfile) => (
          <div key={person.uid} className="p-5 rounded-[24px] bg-zinc-50 border border-zinc-100 group hover:border-red-200 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-900 font-black overflow-hidden shadow-sm">
                  {person.photoURL ? (
                    <img src={person.photoURL} alt="" className="w-full h-full object-cover" />
                  ) : (
                    person.displayName?.charAt(0) || 'U'
                  )}
                </div>
                <div>
                  <h4 className="text-base font-black text-zinc-900 tracking-tight">{person.displayName}</h4>
                  <div className="flex items-center space-x-3 mt-0.5">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Class of {person.graduationYear || 'N/A'}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-300" />
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{person.occupation || 'No Occupation'}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={async () => {
                    try {
                      await updateDoc(doc(db, 'users', person.uid), {
                        notable: !person.notable
                      });
                    } catch (error) {
                      handleFirestoreError(error, OperationType.UPDATE, `users/${person.uid}`);
                    }
                  }}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm",
                    person.notable 
                      ? "bg-red-600 text-white shadow-red-600/20" 
                      : "bg-white text-zinc-500 border border-zinc-200 hover:bg-zinc-50"
                  )}
                >
                  {person.notable ? 'Notable' : 'Mark Notable'}
                </button>
                <button
                  onClick={async () => {
                    if (confirm('Are you sure you want to remove this user from the alumni directory?')) {
                      try {
                        await updateDoc(doc(db, 'users', person.uid), {
                          role: 'guest'
                        });
                      } catch (error) {
                        handleFirestoreError(error, OperationType.UPDATE, `users/${person.uid}`);
                      }
                    }
                  }}
                  className="p-3 text-zinc-400 hover:text-red-600 hover:bg-white rounded-xl transition-all shadow-sm opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {alumniList.length === 0 && (
          <div className="text-center py-20 bg-zinc-50 rounded-[32px] border border-dashed border-zinc-200">
            <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-zinc-400">
              <Users size={24} />
            </div>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">No alumni profiles found</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

const SettingsTab = ({ onSeedNotable }: { onSeedNotable: () => void }) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="p-8 rounded-[32px] bg-white border border-zinc-200/60 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight">System Settings</h2>
          <p className="text-xs text-zinc-500 font-medium mt-1 uppercase tracking-wider">Configure platform parameters and data</p>
        </div>
        <div className="p-3 rounded-2xl bg-zinc-100 text-zinc-900">
          <Settings size={24} />
        </div>
      </div>

      <div className="space-y-10">
        <section>
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-6 ml-1">Data Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={onSeedNotable}
              className="flex items-center space-x-4 p-6 rounded-[24px] bg-zinc-50 border border-zinc-100 hover:border-red-200 hover:bg-white transition-all group text-left"
            >
              <div className="p-3 rounded-2xl bg-white border border-zinc-100 text-red-600 group-hover:scale-110 transition-transform">
                <Database size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900">Seed Notable Alumni</h4>
                <p className="text-[10px] text-zinc-500 font-medium mt-0.5">Populate the notable alumni list with predefined data</p>
              </div>
            </button>
            
            <button className="flex items-center space-x-4 p-6 rounded-[24px] bg-zinc-50 border border-zinc-100 hover:border-zinc-200 hover:bg-white transition-all group text-left opacity-50 cursor-not-allowed">
              <div className="p-3 rounded-2xl bg-white border border-zinc-100 text-zinc-400">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900">Backup Database</h4>
                <p className="text-[10px] text-zinc-500 font-medium mt-0.5">Create a snapshot of current Firestore data</p>
              </div>
            </button>
          </div>
        </section>

        <section>
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-6 ml-1">Platform Configuration</h3>
          <div className="space-y-4">
            {[
              { label: 'Public Registration', desc: 'Allow new users to sign up as guests', enabled: true },
              { label: 'Email Notifications', desc: 'Send automated alerts for new news posts', enabled: false },
              { label: 'Maintenance Mode', desc: 'Restrict access to admin users only', enabled: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-zinc-50 border border-zinc-100">
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">{item.label}</h4>
                  <p className="text-[10px] text-zinc-500 font-medium">{item.desc}</p>
                </div>
                <div className={cn(
                  "w-12 h-6 rounded-full p-1 transition-colors duration-300 cursor-pointer",
                  item.enabled ? "bg-red-600" : "bg-zinc-200"
                )}>
                  <div className={cn(
                    "w-4 h-4 rounded-full bg-white transition-transform duration-300",
                    item.enabled ? "translate-x-6" : "translate-x-0"
                  )} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  </div>
);

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
  const [newsList, setNewsList] = React.useState<NewsItem[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);
  const [newsCount, setNewsCount] = React.useState(0);
  const [alumniList, setAlumniList] = React.useState<AlumniProfile[]>([]);
  const [leaderboard, setLeaderboard] = React.useState<LeaderboardEntry[]>([]);

  React.useEffect(() => {
    if (!profile || profile.role !== 'admin') return;

    const q = query(collection(db, 'news'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem));
      setNewsList(data);
      setNewsCount(snapshot.size);
    });
    return () => unsubscribe();
  }, [profile, db]);

  React.useEffect(() => {
    if (!profile || profile.role !== 'admin') return;

    const q = query(collection(db, 'users'), where('role', '==', 'alumni'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as AlumniProfile));
      setAlumniList(data);
    });
    return () => unsubscribe();
  }, [profile, db]);

  React.useEffect(() => {
    if (!profile || profile.role !== 'admin') return;

    const q = query(collection(db, 'leaderboard'), orderBy('points', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeaderboardEntry));
      setLeaderboard(data);
    });
    return () => unsubscribe();
  }, [profile, db]);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const docRef = doc(db, 'users', u.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const existingProfile = docSnap.data() as UserProfile;
          // Auto-upgrade if master admin email
          if (u.email === "seldogbey234@gmail.com" && existingProfile.role !== 'admin') {
            const updatedProfile = { ...existingProfile, role: 'admin' as const };
            await updateDoc(docRef, { role: 'admin' });
            setProfile(updatedProfile);
          } else {
            setProfile(existingProfile);
          }
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
  }, [auth, db]);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
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

  const seedMOBANews = async () => {
    if (!profile || profile.role !== 'admin') return;
    setIsSubmitting(true);
    const mobaNews = [
      {
        title: "MOBA Heads to Accra Ridge for 11th National Conference on Feb 21",
        content: "The 11th National Conference of the Mfantsipim Old Boys Association (MOBA) is scheduled for February 21, 2026, at Accra Ridge. This event brings together old boys for networking, insights, and engagement as we continue to support our alma mater. Join us for a day of brotherhood and strategic planning for the school's future.",
        category: "Alumni",
        imageUrl: "https://picsum.photos/seed/moba1/800/450",
        date: "2026-02-21T09:00:00Z",
        author: "MOBA Secretariat",
        authorUid: profile.uid
      },
      {
        title: "Mfantsipim School Marks 150 Years as Pioneer of Secondary Education in Ghana",
        content: "Mfantsipim School, the first secondary school in Ghana, is celebrating 150 years of excellence. Founded in 1876, the school has been a pioneer in education, producing leaders who have shaped the nation and the world. The sesquicentennial celebrations will include various events throughout the year, highlighting our rich heritage and vision for the next century.",
        category: "Academic",
        imageUrl: "https://picsum.photos/seed/moba2/800/450",
        date: "2026-04-03T10:00:00Z",
        author: "School Administration",
        authorUid: profile.uid
      },
      {
        title: "Mfantsipim Wins NSMQ 2025: Fourth National Title and Back to Back Championship Victory",
        content: "Mfantsipim School has claimed the NSMQ 2025 crown, winning their fourth national title and securing a back-to-back championship victory. This historic win solidifies Mfantsipim's position as a powerhouse in science and mathematics education in Ghana. The team's dedication and the support from the old boys were instrumental in this triumph.",
        category: "Academic",
        imageUrl: "https://picsum.photos/seed/moba3/800/450",
        date: "2025-10-30T14:00:00Z",
        author: "Sports & Quiz Dept",
        authorUid: profile.uid
      },
      {
        title: "Ebusuapanyin Meets MOBA Presidents at Margins Group Headquarters",
        content: "On Friday, September 27, 2024, Ebusuapanyin Moses K. Baiden Jr. hosted MOBA Presidents at the Margins Group headquarters in Accra. The meeting focused on strengthening the association and discussing future initiatives to support Mfantsipim School. Key topics included the 150th-anniversary projects and alumni welfare.",
        category: "Alumni",
        imageUrl: "https://picsum.photos/seed/moba4/800/450",
        date: "2024-09-27T16:00:00Z",
        author: "MOBA Media",
        authorUid: profile.uid
      },
      {
        title: "MOBA Annual Fundraising Dinner Dance 2024",
        content: "On Saturday, 2nd November, 2024, the Mfantsipim Old Boys Association (MOBA) hosted its Annual Fundraising Dinner Dance at the StoneView. The event was a grand success, bringing together alumni from across generations to raise funds for critical school infrastructure projects and celebrate the enduring Mfantsipim spirit.",
        category: "Alumni",
        imageUrl: "https://picsum.photos/seed/moba5/800/450",
        date: "2024-11-02T19:00:00Z",
        author: "MOBA Events",
        authorUid: profile.uid
      },
      {
        title: "Mfantsipim 150th Anniversary Planning Committee Inauguration",
        content: "On Friday, 30th August 2024, the Mfantsipim community marked a pivotal moment in its history with the inauguration of the 150th Anniversary Planning Committee. The committee is tasked with organizing a year-long celebration in 2026 that will honor the school's legacy and set the stage for its future growth.",
        category: "General",
        imageUrl: "https://picsum.photos/seed/moba6/800/450",
        date: "2024-08-30T11:00:00Z",
        author: "Anniversary Committee",
        authorUid: profile.uid
      },
      {
        title: "9th MOBA Annual Engagement Series: Shaping the Future of Education",
        content: "The 9th MOBA Annual Engagement Series (MAES) held on 25th September 2024 at Ecobank Ghana HQ explored the future of education in Ghana. Experts and old boys discussed pedagogy, access, infrastructure, and workforce readiness, emphasizing the need for innovative approaches to secondary education.",
        category: "Innovation",
        imageUrl: "https://picsum.photos/seed/moba7/800/450",
        date: "2024-09-25T09:00:00Z",
        author: "MAES Team",
        authorUid: profile.uid
      },
      {
        title: "Mfantsipim School Wins 2024 NSMQ | Ghana’s Science Champions",
        content: "Mfantsipim School triumphed in the 2024 National Science & Mathematics Quiz (NSMQ), defeating St. Augustine’s College in a thrilling final. The victory was a testament to the hard work of the students and their teachers, marking another milestone in Mfantsipim's academic excellence.",
        category: "Academic",
        imageUrl: "https://picsum.photos/seed/moba8/800/450",
        date: "2024-10-15T15:00:00Z",
        author: "School Media",
        authorUid: profile.uid
      }
    ];

    try {
      const batch = writeBatch(db);
      for (const item of mobaNews) {
        const ref = doc(collection(db, 'news'));
        batch.set(ref, item);
      }
      await batch.commit();
      alert('MOBA News seeded successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'news');
    } finally {
      setIsSubmitting(false);
    }
  };

  const seedNotableAlumni = async () => {
    if (!profile || profile.role !== 'admin') return;
    setIsSubmitting(true);
    const notableAlumni = [
      { displayName: "Kofi Annan", bio: "Global diplomat and Nobel Peace Prize laureate", role: 'alumni', notable: true, graduationYear: "1957", isPublic: true },
      { displayName: "John Atta Mills", bio: "Former President of Ghana", role: 'alumni', notable: true, graduationYear: "1963", isPublic: true },
      { displayName: "Kwegyir Aggrey", bio: "Pioneer of modern education in Ghana", role: 'alumni', notable: true, graduationYear: "1890", isPublic: true },
      { displayName: "J. H. Kwabena Nketia", bio: "World-renowned academic in African music", role: 'alumni', notable: true, graduationYear: "1940", isPublic: true },
      { displayName: "Kobina Sekyi", bio: "Nationalist and intellectual leader", role: 'alumni', notable: true, graduationYear: "1910", isPublic: true },
      { displayName: "Carl Christian Reindorf", bio: "Historian and religious leader", role: 'alumni', notable: true, graduationYear: "1850", isPublic: true },
      { displayName: "Sam Jonah", bio: "Mining magnate and top businessman", role: 'alumni', notable: true, graduationYear: "1968", isPublic: true },
      { displayName: "Kwasi Twum", bio: "Media empire owner", role: 'alumni', notable: true, graduationYear: "1978", isPublic: true },
      { displayName: "Edward Annan", bio: "Aviation entrepreneur", role: 'alumni', notable: true, graduationYear: "1970", isPublic: true },
      { displayName: "Kofi Amoa-Abban", bio: "Oil & gas billionaire-level entrepreneur", role: 'alumni', notable: true, graduationYear: "2001", isPublic: true },
      { displayName: "Moses Kwesi Baiden Jr.", bio: "Fintech and security systems leader", role: 'alumni', notable: true, graduationYear: "1983", isPublic: true },
      { displayName: "Herman Chinery-Hesse", bio: "Pioneer of Ghana’s tech industry", role: 'alumni', notable: true, graduationYear: "1981", isPublic: true },
      { displayName: "Isaac Sesi", bio: "Young global tech innovator", role: 'alumni', notable: true, graduationYear: "2010", isPublic: true },
      { displayName: "Aaron Adatsi", bio: "Modern TV star", role: 'alumni', notable: true, graduationYear: "2012", isPublic: true },
      { displayName: "RJZ", bio: "Youth music influence", role: 'alumni', notable: true, graduationYear: "2013", isPublic: true },
    ];

    try {
      const batch = writeBatch(db);
      for (const item of notableAlumni) {
        // Use a deterministic ID based on name to avoid duplicates if seeded multiple times
        const id = item.displayName.toLowerCase().replace(/\s+/g, '_');
        const ref = doc(db, 'users', id);
        batch.set(ref, { ...item, uid: id, email: `${id}@moba.com` }, { merge: true });
      }
      await batch.commit();
      alert('Notable Alumni seeded successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'users');
    } finally {
      setIsSubmitting(false);
    }
  };

  const seedLeaderboard = async () => {
    if (!confirm('This will reset the leaderboard to default values. Continue?')) return;
    setIsSubmitting(true);
    try {
      const houses = [
        { houseName: 'Bartlett', points: 1250, rank: 1 },
        { houseName: 'Pickard', points: 1180, rank: 2 },
        { houseName: 'Lockhart', points: 1150, rank: 3 },
        { houseName: 'Sarbah', points: 1050, rank: 4 },
        { houseName: 'Freeman', points: 980, rank: 5 },
        { houseName: 'Balmer', points: 920, rank: 6 },
        { houseName: 'Acquaah', points: 850, rank: 7 },
        { houseName: 'Abruquah', points: 780, rank: 8 }
      ];

      const batch = writeBatch(db);
      const existing = await getDocs(collection(db, 'leaderboard'));
      existing.forEach(d => batch.delete(d.ref));
      houses.forEach(h => {
        const ref = doc(collection(db, 'leaderboard'));
        batch.set(ref, h);
      });
      await batch.commit();
      alert('Leaderboard reset successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'leaderboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteAllNews = async () => {
    if (!profile || profile.role !== 'admin') return;
    if (!confirm('Are you sure you want to delete all news articles? This action cannot be undone.')) return;
    
    setIsSubmitting(true);
    try {
      const snapshot = await getDocs(collection(db, 'news'));
      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      alert('All news articles deleted successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'news');
    } finally {
      setIsSubmitting(false);
    }
  };

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
      handleFirestoreError(error, OperationType.WRITE, 'news');
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
      <div className="min-h-screen flex items-center justify-center px-4 bg-zinc-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-10 rounded-3xl bg-white border border-zinc-200 shadow-xl text-center"
        >
          <div className="w-16 h-16 bg-red-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-red-600/20">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Admin Portal</h1>
          <p className="text-zinc-500 text-sm font-medium mb-8">
            {user ? "Access denied. You do not have administrative privileges." : "Please sign in to access the management suite."}
          </p>

          <button
            onClick={user ? handleLogout : handleLogin}
            disabled={isLoggingIn}
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center space-x-3 disabled:opacity-50 shadow-lg shadow-red-600/20"
          >
            {isLoggingIn ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} />}
            <span>{user ? "Sign Out" : isLoggingIn ? "Authenticating..." : "Sign In with Google"}</span>
          </button>
          
          {!user && (
            <p className="mt-6 text-xs text-zinc-400">
              Only authorized personnel can access this area.
            </p>
          )}
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'news', name: 'News & Updates', icon: Newspaper },
    { id: 'leaderboard', name: 'Leaderboard', icon: Trophy },
    { id: 'alumni', name: 'Alumni Directory', icon: Users },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex font-sans selection:bg-red-600/20 selection:text-red-600">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-zinc-200/60 flex flex-col fixed h-full z-50">
        <div className="p-10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-600 rounded-[18px] flex items-center justify-center shadow-2xl shadow-red-600/40 rotate-3 group hover:rotate-0 transition-transform duration-500">
              <ShieldCheck className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black text-zinc-900 tracking-tighter leading-none">MOBA</h1>
              <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mt-1">Admin Suite</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-2 overflow-y-auto scrollbar-none">
          <div className="mb-6 px-4">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Main Navigation</p>
          </div>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center space-x-4 px-5 py-4 rounded-[20px] transition-all duration-300 group relative overflow-hidden",
                activeTab === tab.id 
                  ? "bg-red-50 text-red-600 shadow-sm border border-red-100" 
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
              )}
            >
              <tab.icon size={20} className={cn("transition-transform duration-300 group-hover:scale-110", activeTab === tab.id ? "text-red-600" : "text-zinc-400")} />
              <span className="text-xs font-black uppercase tracking-widest">{tab.name}</span>
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute left-0 w-1 h-6 bg-red-600 rounded-r-full"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="p-8">
          <div className="p-5 rounded-[28px] bg-zinc-50 border border-zinc-100 mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-900 font-black overflow-hidden shadow-sm">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                ) : (
                  user?.displayName?.charAt(0)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-zinc-900 truncate tracking-tight">{user?.displayName}</p>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Administrator</p>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-[20px] text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-all font-black text-[10px] uppercase tracking-[0.2em] border border-transparent hover:border-red-100"
          >
            <LogOut size={18} />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-80 min-h-screen relative">
        <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-zinc-200/60 flex items-center justify-between px-12 sticky top-0 z-40">
          <div>
            <h2 className="text-2xl font-black text-zinc-900 tracking-tighter uppercase">
              {tabs.find(t => t.id === activeTab)?.name}
            </h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Terminal</span>
              <span className="text-[10px] text-zinc-300 font-bold">/</span>
              <span className="text-[10px] text-red-600 font-black uppercase tracking-widest">{activeTab}</span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-zinc-50 rounded-2xl border border-zinc-100">
              <Activity className="text-red-600" size={14} />
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Latency: 24ms</span>
            </div>
            <div className="flex items-center space-x-3 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.15em]">System Online</span>
            </div>
          </div>
        </header>

        <div className="p-12 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && (
                <DashboardTab 
                  newsCount={newsCount} 
                  alumniCount={alumniList.length}
                  isSubmitting={isSubmitting}
                  seedMOBANews={seedMOBANews}
                  deleteAllNews={deleteAllNews}
                  seedLeaderboard={seedLeaderboard}
                  seedNotableAlumni={seedNotableAlumni}
                  leaderboard={leaderboard}
                />
              )}
              {activeTab === 'news' && (
                <NewsTab 
                  newsList={newsList}
                  handlePostNews={handlePostNews}
                  isSubmitting={isSubmitting}
                  newsTitle={newsTitle}
                  setNewsTitle={setNewsTitle}
                  newsCategory={newsCategory}
                  setNewsCategory={setNewsCategory}
                  newsImage={newsImage}
                  setNewsImage={setNewsImage}
                  newsContent={newsContent}
                  setNewsContent={setNewsContent}
                  showPreview={showPreview}
                  setShowPreview={setShowPreview}
                />
              )}
              {activeTab === 'leaderboard' && (
                <LeaderboardTab 
                  leaderboard={leaderboard}
                  isSubmitting={isSubmitting}
                />
              )}
              {activeTab === 'alumni' && (
                <AlumniTab 
                  alumniList={alumniList}
                />
              )}
              {activeTab === 'settings' && (
                <SettingsTab onSeedNotable={seedNotableAlumni} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
