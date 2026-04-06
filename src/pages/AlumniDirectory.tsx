import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, User, GraduationCap, Briefcase, MapPin, Linkedin, ExternalLink, Loader2, X, CheckCircle2, AlertCircle, LogIn, Network, ShieldCheck } from 'lucide-react';
import { collection, onSnapshot, query, where, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/src/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User as FirebaseUser } from 'firebase/auth';
import { AlumniProfile } from '@/src/types';
import { cn } from '@/src/lib/utils';

export default function AlumniDirectory() {
  const [alumni, setAlumni] = React.useState<AlumniProfile[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeYear, setActiveYear] = React.useState('All');
  const [user, setUser] = React.useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = React.useState<AlumniProfile | null>(null);
  const [showProfileModal, setShowProfileModal] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  // Form state
  const [formData, setFormData] = React.useState({
    displayName: '',
    graduationYear: '',
    occupation: '',
    location: '',
    bio: '',
    linkedin: '',
    isPublic: true
  });

  const years = ['All', '2020s', '2010s', '2000s', '1990s', '1980s', 'Earlier'];

  React.useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const docRef = doc(db, 'users', u.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const profile = docSnap.data() as AlumniProfile;
          setUserProfile(profile);
          setFormData({
            displayName: profile.displayName || '',
            graduationYear: profile.graduationYear || '',
            occupation: profile.occupation || '',
            location: profile.location || '',
            bio: profile.bio || '',
            linkedin: profile.linkedin || '',
            isPublic: profile.isPublic ?? true
          });
        }
      }
    });

    const q = query(
      collection(db, 'users'), 
      where('role', '==', 'alumni'),
      where('isPublic', '==', true)
    );
    
    const unsubscribeAlumni = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as AlumniProfile));
      setAlumni(data);
      setLoading(false);
    }, (error) => {
      console.error("Alumni fetch error:", error);
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeAlumni();
    };
  }, [auth, db]);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Login error:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    try {
      const docRef = doc(db, 'users', user.uid);
      const updatedProfile = {
        ...formData,
        uid: user.uid,
        email: user.email,
        role: 'alumni'
      };
      await setDoc(docRef, updatedProfile, { merge: true });
      setUserProfile(updatedProfile as AlumniProfile);
      setShowProfileModal(false);
    } catch (error) {
      console.error("Update profile error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAlumni = alumni.filter(person => {
    const matchesSearch = 
      person.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.occupation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.graduationYear?.includes(searchTerm);
    
    if (activeYear === 'All') return matchesSearch;
    
    const year = parseInt(person.graduationYear || '0');
    if (activeYear === '2020s') return matchesSearch && year >= 2020;
    if (activeYear === '2010s') return matchesSearch && year >= 2010 && year < 2020;
    if (activeYear === '2000s') return matchesSearch && year >= 2000 && year < 2010;
    if (activeYear === '1990s') return matchesSearch && year >= 1990 && year < 2000;
    if (activeYear === '1980s') return matchesSearch && year >= 1980 && year < 1990;
    if (activeYear === 'Earlier') return matchesSearch && year < 1980;
    
    return matchesSearch;
  });

  return (
    <div className="pt-20 pb-24 relative overflow-hidden bg-zinc-50">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.05)_0%,transparent_70%)] -z-10" />
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1.5 bg-white border border-red-600/20 rounded-full text-red-600 text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-sm"
            >
              Network_Node // Alumni_Directory
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black text-zinc-900 uppercase tracking-tighter mb-8 leading-none">
              Connect with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">Old Boys</span>
            </h1>
            <p className="text-xl text-zinc-500 leading-relaxed font-medium">
              Browse our global network of Mfantsipim graduates. Search by <span className="text-zinc-900">year</span>, <span className="text-zinc-900">profession</span>, or <span className="text-zinc-900">location</span> to find your fellow alumni.
            </p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center p-10 rounded-[40px] bg-white border border-zinc-200 text-center w-full md:w-96 relative group overflow-hidden shadow-xl"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50" />
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-red-600/5">
              <User className="text-red-600" size={36} />
            </div>
            <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-tighter mb-2">Your_Profile</h3>
            <p className="text-zinc-400 text-[10px] font-mono font-black uppercase tracking-[0.2em] mb-8">
              {user ? "IDENTITY_VERIFIED // STATUS_ACTIVE" : "IDENTITY_REQUIRED // STATUS_LOCKED"}
            </p>
            {user ? (
              <button
                onClick={() => setShowProfileModal(true)}
                className="w-full py-4 bg-zinc-50 border border-zinc-200 text-zinc-900 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:border-red-600/50 transition-all shadow-sm"
              >
                {userProfile ? 'Update_Profile' : 'Register_Profile'}
              </button>
            ) : (
              <button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="w-full py-4 bg-red-600 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-red-700 transition-all flex items-center justify-center space-x-3 disabled:opacity-50 shadow-lg shadow-red-600/20"
              >
                {isLoggingIn ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />}
                <span>{isLoggingIn ? "AUTHENTICATING..." : "INITIATE_LOGIN"}</span>
              </button>
            )}
            {/* HUD corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-zinc-100 rounded-tl-[40px]" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-zinc-100 rounded-br-[40px]" />
          </motion.div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 p-8 rounded-[40px] bg-white border border-zinc-200 shadow-lg">
          <div className="relative w-full lg:w-[450px] group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-red-600 group-focus-within:animate-pulse" size={20} />
            <input
              type="text"
              placeholder="SEARCH_BY_NAME_YEAR_OR_JOB..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-16 py-4 text-[11px] font-mono font-black text-zinc-900 focus:outline-none focus:border-red-600/50 transition-all placeholder:text-zinc-400"
            />
          </div>
          
          <div className="flex items-center space-x-3 overflow-x-auto w-full lg:w-auto pb-4 lg:pb-0 scrollbar-hide">
            <div className="flex items-center gap-3 px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl mr-4">
              <Filter className="text-red-600" size={16} />
              <span className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest">Filter_By_Era</span>
            </div>
            {years.map(year => (
              <button
                key={year}
                onClick={() => setActiveYear(year)}
                className={cn(
                  "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border",
                  activeYear === year
                    ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20"
                    : "bg-white border-zinc-200 text-zinc-500 hover:text-red-600 hover:border-red-600/30"
                )}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Directory Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-24 h-24 bg-white border border-zinc-200 rounded-3xl flex items-center justify-center mb-8 shadow-xl">
              <Loader2 className="animate-spin text-red-600" size={48} />
            </div>
            <p className="text-zinc-400 font-mono font-black uppercase tracking-[0.4em] text-xs">Syncing_Directory_Stream...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredAlumni.map((person, i) => (
              <motion.div
                key={person.uid}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-10 rounded-[40px] bg-white border border-zinc-200 relative group overflow-hidden shadow-sm hover:shadow-xl transition-all"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                  <Network size={120} className="text-red-600" />
                </div>
                
                {person.notable && (
                  <div className="absolute top-8 right-8 text-red-600" title="Notable Alumni">
                    <CheckCircle2 size={24} />
                  </div>
                )}
                
                <div className="flex items-center space-x-5 mb-10">
                  <div className="w-20 h-20 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center justify-center text-red-600 font-black text-3xl shadow-sm group-hover:bg-red-50 transition-all">
                    {person.displayName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-tighter group-hover:text-red-600 transition-colors leading-none mb-2">
                      {person.displayName}
                    </h3>
                    <div className="flex items-center text-zinc-400 text-[10px] font-mono font-black uppercase tracking-[0.2em]">
                      <GraduationCap size={14} className="mr-2 text-red-600" />
                      Class_of {person.graduationYear || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="space-y-5 mb-10">
                  {person.occupation && (
                    <div className="flex items-center text-zinc-500 text-sm font-medium">
                      <div className="w-8 h-8 bg-zinc-50 rounded-lg flex items-center justify-center mr-4">
                        <Briefcase size={16} className="text-red-600" />
                      </div>
                      {person.occupation}
                    </div>
                  )}
                  {person.location && (
                    <div className="flex items-center text-zinc-500 text-sm font-medium">
                      <div className="w-8 h-8 bg-zinc-50 rounded-lg flex items-center justify-center mr-4">
                        <MapPin size={16} className="text-red-600" />
                      </div>
                      {person.location}
                    </div>
                  )}
                </div>

                {person.bio && (
                  <div className="relative mb-10">
                    <div className="absolute -left-4 top-0 w-1 h-full bg-red-600/20" />
                    <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3 italic font-medium pl-2">
                      "{person.bio}"
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-8 border-t border-zinc-100">
                  {person.linkedin ? (
                    <a 
                      href={person.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] transition-all group/link"
                    >
                      <Linkedin size={16} className="mr-2 group-hover/link:scale-110 transition-transform" /> LinkedIn_Profile
                    </a>
                  ) : (
                    <div className="text-zinc-300 text-[9px] font-mono font-black uppercase tracking-widest">Social_Link_Offline</div>
                  )}
                  
                  <button className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400 hover:text-red-600 transition-all">
                    <ExternalLink size={18} />
                  </button>
                </div>

                {/* HUD corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-zinc-100 rounded-tl-[40px] group-hover:border-red-600/20 transition-colors" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-zinc-100 rounded-br-[40px] group-hover:border-red-600/20 transition-colors" />
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredAlumni.length === 0 && (
          <div className="text-center py-32">
            <div className="w-24 h-24 bg-zinc-50 rounded-3xl flex items-center justify-center mx-auto mb-8 opacity-50">
              <User size={48} className="text-zinc-300" />
            </div>
            <h3 className="text-2xl font-black text-zinc-400 uppercase tracking-tighter mb-2">No_Results_Found</h3>
            <p className="text-zinc-300 font-mono text-[10px] uppercase tracking-[0.2em]">Adjust_Search_Parameters</p>
          </div>
        )}
      </section>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-2xl bg-white border border-zinc-200 rounded-[48px] overflow-hidden shadow-2xl relative"
            >
              <div className="p-10 border-b border-zinc-100 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
                    <Network className="text-red-600" size={28} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-zinc-900 uppercase tracking-tighter leading-none mb-2">Alumni_Registration</h2>
                    <p className="text-zinc-400 text-[10px] font-mono font-black uppercase tracking-[0.3em]">Identity_Management_System</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowProfileModal(false)}
                  className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto scrollbar-hide relative z-10">
                {!user ? (
                  <div className="p-12 rounded-[32px] bg-red-50 border border-red-100 text-center">
                    <AlertCircle className="text-red-600 mx-auto mb-6" size={48} />
                    <p className="text-red-600 text-xs font-mono font-black uppercase tracking-[0.3em] mb-10">
                      AUTHENTICATION_REQUIRED // STATUS_LOCKED
                    </p>
                    <button
                      type="button"
                      onClick={handleLogin}
                      className="px-10 py-5 bg-red-600 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
                    >
                      Sign_In_with_Google
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-2">Display_Name</label>
                    <input
                      type="text"
                      required
                      value={formData.displayName}
                      onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-5 text-zinc-900 focus:outline-none focus:border-red-600/50 transition-all font-medium placeholder:text-zinc-300"
                      placeholder="ENTER_NAME"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-2">Graduation_Year</label>
                    <input
                      type="text"
                      required
                      value={formData.graduationYear}
                      onChange={(e) => setFormData({...formData, graduationYear: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-5 text-zinc-900 focus:outline-none focus:border-red-600/50 transition-all font-medium placeholder:text-zinc-300"
                      placeholder="YYYY"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-2">Current_Occupation</label>
                    <input
                      type="text"
                      value={formData.occupation}
                      onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-5 text-zinc-900 focus:outline-none focus:border-red-600/50 transition-all font-medium placeholder:text-zinc-300"
                      placeholder="ENTER_ROLE"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-2">Current_Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-5 text-zinc-900 focus:outline-none focus:border-red-600/50 transition-all font-medium placeholder:text-zinc-300"
                      placeholder="CITY, COUNTRY"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-2">LinkedIn_Uplink_URL</label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-5 text-zinc-900 focus:outline-none focus:border-red-600/50 transition-all font-medium placeholder:text-zinc-300"
                    placeholder="HTTPS://LINKEDIN.COM/IN/USER"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-2">Personal_Bio_Data</label>
                  <textarea
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-5 text-zinc-900 focus:outline-none focus:border-red-600/50 transition-all font-medium placeholder:text-zinc-300 resize-none"
                    placeholder="TELL_US_YOUR_JOURNEY..."
                  ></textarea>
                </div>

                <div className="flex items-center space-x-4 p-6 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({...formData, isPublic: e.target.checked})}
                    className="w-6 h-6 rounded-lg border-zinc-300 bg-white text-red-600 focus:ring-red-600 cursor-pointer"
                  />
                  <label htmlFor="isPublic" className="text-[10px] text-zinc-500 font-mono font-black uppercase tracking-[0.2em] cursor-pointer">
                    Broadcast_Profile_To_Public_Directory
                  </label>
                </div>

                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-6 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-[0.3em] text-[11px] rounded-[24px] transition-all disabled:opacity-50 flex items-center justify-center space-x-4 shadow-lg shadow-red-600/20"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
                      <span>{isSubmitting ? "SYNCING_DATA..." : "COMMIT_PROFILE_CHANGES"}</span>
                    </button>
                  </div>
                </>
                )}
              </form>
              {/* HUD corners */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-zinc-100 rounded-tl-[48px]" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-zinc-100 rounded-br-[48px]" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
