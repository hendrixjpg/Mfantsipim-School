import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, LogIn, LayoutDashboard, Newspaper, Trophy, Users, 
  Settings, LogOut, Loader2, Plus, Trash2, Search, Filter, 
  CheckCircle2, AlertCircle, Save, RefreshCw, Database, X,
  TrendingUp, BarChart3, Activity
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, Cell
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

const StatCard = ({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color: string }) => (
  <motion.div 
    whileHover={{ 
      rotateX: 5, 
      rotateY: 5, 
      scale: 1.02,
      z: 50
    }}
    transition={{ 
      type: "spring", 
      stiffness: 300, 
      damping: 20
    }}
    className="p-8 rounded-[32px] glass glass-hover group perspective-1000"
  >
    <div className={cn("w-14 h-14 glass rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 neon-red", color.replace('text-', 'bg-').concat('/10'))}>
      <Icon className={color} size={28} />
    </div>
    <div className="text-4xl font-black text-white mb-2 tracking-tighter">{value}</div>
    <div className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">{label}</div>
  </motion.div>
);

const engagementData = [
  { name: 'Jan', active: 400, new: 240 },
  { name: 'Feb', active: 300, new: 139 },
  { name: 'Mar', active: 200, new: 980 },
  { name: 'Apr', active: 278, new: 390 },
  { name: 'May', active: 189, new: 480 },
  { name: 'Jun', active: 239, new: 380 },
];

const DashboardTab = ({ newsCount, alumniCount, isSubmitting, seedMOBANews, deleteAllNews, seedLeaderboard, leaderboard }: any) => {
  const houseData = leaderboard.map((h: any) => ({ name: h.houseName, points: h.points }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard label="Total News" value={newsCount.toString()} icon={Newspaper} color="text-blue-500" />
        <StatCard label="Active Alumni" value={alumniCount.toString()} icon={Users} color="text-green-500" />
        <StatCard label="Admin Status" value="Active" icon={ShieldCheck} color="text-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Alumni Engagement Chart */}
        <div className="p-8 rounded-[32px] glass relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center">
              <Activity className="mr-3 text-red-600" size={20} /> Alumni Engagement
            </h3>
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Live_Metrics</div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementData}>
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#4b5563" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: '#4b5563', fontWeight: 'bold' }}
                />
                <YAxis 
                  stroke="#4b5563" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: '#4b5563', fontWeight: 'bold' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#09090b', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="active" 
                  stroke="#dc2626" 
                  fillOpacity={1} 
                  fill="url(#colorActive)" 
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* House Points Distribution */}
        <div className="p-8 rounded-[32px] glass relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center">
              <BarChart3 className="mr-3 text-blue-600" size={20} /> House Points
            </h3>
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Realtime_Stats</div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={houseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#4b5563" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: '#4b5563', fontWeight: 'bold' }}
                />
                <YAxis 
                  stroke="#4b5563" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: '#4b5563', fontWeight: 'bold' }}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ 
                    backgroundColor: '#09090b', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}
                />
                <Bar dataKey="points" radius={[4, 4, 0, 0]}>
                  {houseData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#dc2626' : '#2563eb'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 rounded-[32px] glass border-red-600/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-[60px] -z-10" />
          <h3 className="text-2xl font-black text-white mb-6 flex items-center tracking-tight">
            <Database className="mr-3 text-red-600" size={24} /> Data Management
          </h3>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed font-medium">
            Quickly populate the news section with the latest updates from the Mfantsipim Old Boys Association (MOBA) website or reset the leaderboard.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={seedMOBANews}
              disabled={isSubmitting}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl transition-all disabled:opacity-50 flex items-center neon-red neon-red-hover glitch-hover"
            >
              {isSubmitting ? <Loader2 className="animate-spin mr-2" size={14} /> : <RefreshCw className="mr-2" size={14} />}
              Seed MOBA News
            </button>
            <button
              onClick={seedLeaderboard}
              disabled={isSubmitting}
              className="px-6 py-3 bg-white/5 border border-white/10 hover:border-red-600/50 text-gray-400 hover:text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all disabled:opacity-50 flex items-center hover:neon-red-hover glitch-hover"
            >
              {isSubmitting ? <Loader2 className="animate-spin mr-2" size={16} /> : <Trophy className="mr-2" size={16} />}
              Reset Leaderboard
            </button>
            <button
              onClick={deleteAllNews}
              disabled={isSubmitting}
              className="px-6 py-3 bg-white/5 border border-white/10 hover:border-red-600/50 text-gray-400 hover:text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all disabled:opacity-50 flex items-center hover:neon-red-hover glitch-hover"
            >
              {isSubmitting ? <Loader2 className="animate-spin mr-2" size={16} /> : <Trash2 className="mr-2" size={16} />}
              Delete All News
            </button>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">System Health</h3>
          <div className="space-y-4">
            {[
              { name: 'Firestore Database', status: 'Healthy', color: 'bg-green-500' },
              { name: 'Authentication', status: 'Healthy', color: 'bg-green-500' },
              { name: 'Storage', status: 'Healthy', color: 'bg-green-500' },
            ].map((sys, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5">
                <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">{sys.name}</span>
                <div className="flex items-center space-x-2">
                  <span className={cn("w-2 h-2 rounded-full", sys.color)} />
                  <span className="text-white text-xs font-black uppercase tracking-widest">{sys.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const NewsTab = ({ newsList, handlePostNews, isSubmitting, newsTitle, setNewsTitle, newsCategory, setNewsCategory, newsImage, setNewsImage, newsContent, setNewsContent }: any) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
              <option value="General">General</option>
              <option value="Academic">Academic</option>
              <option value="Sports">Sports</option>
              <option value="Alumni">Alumni</option>
              <option value="Innovation">Innovation</option>
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
          className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest rounded-2xl transition-all disabled:opacity-50 flex items-center neon-red-hover glitch-hover"
        >
          {isSubmitting ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
          Publish Article
        </button>
      </form>
    </div>

    <div className="p-10 rounded-3xl bg-white/5 border border-white/10">
      <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-8 flex items-center">
        <Newspaper className="mr-2 text-red-600" /> Recent Articles
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {newsList.map((item: NewsItem) => (
          <div key={item.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-12 rounded-lg overflow-hidden bg-zinc-800">
                <img 
                  src={item.imageUrl || 'https://picsum.photos/seed/news/200/150'} 
                  alt="" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h4 className="text-white font-bold line-clamp-1">{item.title}</h4>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
                  {item.category} • {new Date(item.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={async () => {
                if (confirm('Delete this article?')) {
                  try {
                    await deleteDoc(doc(db, 'news', item.id));
                  } catch (error) {
                    handleFirestoreError(error, OperationType.DELETE, `news/${item.id}`);
                  }
                }
              }}
              className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all glitch-hover"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        {newsList.length === 0 && (
          <div className="text-center py-10 text-gray-500 font-bold uppercase tracking-widest text-xs">
            No articles published yet
          </div>
        )}
      </div>
    </div>
  </div>
);

const LeaderboardTab = ({ leaderboard, isSubmitting }: any) => {
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
      <div className="p-10 rounded-3xl bg-white/5 border border-white/10">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-8 flex items-center">
          <Trophy className="mr-2 text-red-600" /> House Leaderboard Management
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {leaderboard.map((house: LeaderboardEntry) => (
            <div key={house.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center text-red-600 font-black text-xl">
                  {house.rank || '-'}
                </div>
                <div>
                  <h4 className="text-white font-bold">{house.houseName}</h4>
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
                    Current Points: {house.points.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {editingId === house.id ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={editPoints}
                      onChange={(e) => setEditPoints(parseInt(e.target.value) || 0)}
                      className="w-24 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-red-600"
                    />
                    <button
                      onClick={() => handleUpdatePoints(house.id)}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all glitch-hover"
                    >
                      <Save size={18} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-2 bg-white/5 text-gray-500 rounded-lg hover:text-white transition-all glitch-hover"
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
                    className="px-4 py-2 bg-white/5 border border-white/10 hover:border-red-600/50 text-gray-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all glitch-hover"
                  >
                    Edit Score
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AlumniTab = ({ alumniList }: any) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="p-10 rounded-3xl bg-white/5 border border-white/10">
      <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-8 flex items-center">
        <Users className="mr-2 text-red-600" /> Alumni Directory Management
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {alumniList.map((person: AlumniProfile) => (
          <div key={person.uid} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center text-red-600 font-black">
                {person.displayName?.charAt(0) || 'U'}
              </div>
              <div>
                <h4 className="text-white font-bold">{person.displayName}</h4>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
                  Class of {person.graduationYear || 'N/A'} • {person.occupation || 'No Occupation'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
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
                  "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all glitch-hover",
                  person.notable 
                    ? "bg-red-600 text-white" 
                    : "bg-white/5 text-gray-500 hover:text-white"
                )}
              >
                {person.notable ? 'Notable' : 'Mark Notable'}
              </button>
              <button
                onClick={async () => {
                  if (confirm('Remove this user from alumni directory?')) {
                    try {
                      await updateDoc(doc(db, 'users', person.uid), {
                        role: 'guest'
                      });
                    } catch (error) {
                      handleFirestoreError(error, OperationType.UPDATE, `users/${person.uid}`);
                    }
                  }
                }}
                className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all glitch-hover"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
        {alumniList.length === 0 && (
          <div className="text-center py-10 text-gray-500 font-bold uppercase tracking-widest text-xs">
            No alumni registered yet
          </div>
        )}
      </div>
    </div>
  </div>
);

const SettingsTab = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="p-10 rounded-3xl bg-white/5 border border-white/10">
      <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-8 flex items-center">
        <Settings className="mr-2 text-red-600" /> Portal Settings
      </h2>
      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-black/20 border border-white/5">
          <h4 className="text-white font-bold mb-2">Maintenance Mode</h4>
          <p className="text-gray-500 text-xs mb-4 uppercase tracking-widest font-black">Disable public access to the portal</p>
          <button className="px-6 py-2 bg-white/5 border border-white/10 text-gray-400 font-black uppercase tracking-widest text-[10px] rounded-lg glitch-hover">
            Enable Maintenance Mode
          </button>
        </div>
        <div className="p-6 rounded-2xl bg-black/20 border border-white/5">
          <h4 className="text-white font-bold mb-2">Admin Notifications</h4>
          <p className="text-gray-500 text-xs mb-4 uppercase tracking-widest font-black">Receive alerts for new alumni registrations</p>
          <button className="px-6 py-2 bg-red-600 text-white font-black uppercase tracking-widest text-[10px] rounded-lg glitch-hover">
            Notifications Active
          </button>
        </div>
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
  }, [profile]);

  React.useEffect(() => {
    if (!profile || profile.role !== 'admin') return;

    const q = query(collection(db, 'users'), where('role', '==', 'alumni'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as AlumniProfile));
      setAlumniList(data);
    });
    return () => unsubscribe();
  }, [profile]);

  React.useEffect(() => {
    if (!profile || profile.role !== 'admin') return;

    const q = query(collection(db, 'leaderboard'), orderBy('points', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeaderboardEntry));
      setLeaderboard(data);
    });
    return () => unsubscribe();
  }, [profile]);

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
  }, []);

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
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center space-x-3 disabled:opacity-50 neon-red neon-red-hover glitch-hover"
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
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-80 glass border-r border-white/5 p-8 flex flex-col h-screen sticky top-0 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-red-600/[0.02] to-transparent pointer-events-none" />
        
        <div className="flex items-center space-x-4 px-2 mb-12 relative z-10">
          <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center neon-red">
            <ShieldCheck className="text-red-600" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white leading-none mb-1">Admin</h2>
            <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.3em]">Control Center</p>
          </div>
        </div>

        <nav className="flex-1 space-y-3 relative z-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden glitch-hover",
                activeTab === tab.id 
                  ? "bg-red-600 text-white neon-red" 
                  : "text-gray-500 hover:text-white hover:bg-white/5 hover:neon-red-hover"
              )}
            >
              <div className="absolute inset-0 bg-red-600/10 -translate-x-full group-hover:translate-x-full transition-transform duration-500 pointer-events-none" />
              <tab.icon size={20} className={cn(
                "transition-transform group-hover:scale-110 relative z-10",
                activeTab === tab.id ? "text-white" : "text-gray-500 group-hover:text-red-500"
              )} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] relative z-10">{tab.name}</span>
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute left-0 w-1 h-6 bg-white rounded-full z-20"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="pt-8 mt-8 border-t border-white/5 relative z-10">
          <div className="flex items-center space-x-4 px-4 mb-8 glass p-4 rounded-2xl">
            <div className="w-10 h-10 rounded-xl overflow-hidden glass border-white/10">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.uid}`} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-white truncate uppercase tracking-tight">{profile?.displayName || 'Administrator'}</p>
              <p className="text-[9px] text-red-500 font-black uppercase tracking-widest">Master Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-gray-500 hover:text-red-500 hover:bg-red-600/10 transition-all group glitch-hover"
          >
            <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto relative">
        <div className="absolute inset-0 scanline opacity-[0.01] pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <header className="mb-16">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-[1px] bg-red-600" />
              <span className="text-red-600 font-mono font-black text-[10px] uppercase tracking-[0.4em]">System_Interface</span>
            </div>
            <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-2">
              {tabs.find(t => t.id === activeTab)?.name}
            </h1>
            <p className="text-gray-500 text-[10px] font-mono font-black uppercase tracking-[0.3em]">
              PORTAL_MANAGEMENT_&_CONTROL_v2.5.0
            </p>
          </header>

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
                <SettingsTab />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
