import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Trophy, Users, GraduationCap, Loader2, CheckCircle2, Star, Shield, Home as HomeIcon, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SCHOOL_INFO } from '@/src/constants';
import Leaderboard from '@/src/components/Leaderboard';
import Achievements from '@/src/components/Achievements';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { NewsItem } from '@/src/types';
import { format } from 'date-fns';

const SCHOOL_HOUSES = [
  { name: 'Abruquah', color: '#FACC15', desc: 'Named after the first African Headmaster, representing excellence and pioneering spirit.', icon: 'A' },
  { name: 'Balmer', color: '#3B82F6', desc: 'Named after Rev. W. T. Balmer, focusing on academic brilliance and spiritual growth.', icon: 'B' },
  { name: 'Bartels', color: '#22C55E', desc: 'Named after F. L. Bartels, emphasizing leadership and global citizenship.', icon: 'B' },
  { name: 'Freeman', color: '#EF4444', desc: 'Named after Rev. Thomas Birch Freeman, the founder of the Methodist Church in Ghana.', icon: 'F' },
  { name: 'Lockhart', color: '#A855F7', desc: 'Named after Rev. R. A. Lockhart, known for discipline and athletic prowess.', icon: 'L' },
  { name: 'Sarbah', color: '#71717A', desc: 'Named after John Mensah Sarbah, focusing on law, intellectualism, and heritage.', icon: 'S' },
  { name: 'Schweitzer', color: '#F97316', desc: 'Named after Albert Schweitzer, emphasizing humanitarian service and compassion.', icon: 'S' },
  { name: 'Pickard', color: '#78350F', desc: 'Named after Rev. Pickard, representing resilience and steadfast character.', icon: 'P' },
];

const FEATURED_ALUMNI = [
  {
    name: "Kofi Annan",
    role: "Former UN Secretary-General",
    desc: "Nobel Peace Prize laureate and Mfantsipim's most distinguished son.",
    image: "https://picsum.photos/seed/kofi/800/1000",
    linkedin: "https://linkedin.com"
  },
  {
    name: "Sir Sam Jonah",
    role: "Executive Chairman, Jonah Capital",
    desc: "One of Africa's most prominent businessmen and former CEO of Ashanti Goldfields.",
    image: "https://picsum.photos/seed/sam/800/1000",
    linkedin: "https://linkedin.com"
  },
  {
    name: "Herman Chinery-Hesse",
    role: "Founder, SOFTtribe",
    desc: "Known as the 'Bill Gates of Africa', he pioneered the software industry in Ghana.",
    image: "https://picsum.photos/seed/herman/800/1000",
    linkedin: "https://linkedin.com"
  }
];

export default function Home() {
  const [news, setNews] = React.useState<NewsItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('date', 'desc'), limit(3));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem));
      setNews(data);
      setLoading(false);
    }, (error) => {
      console.error("Home news fetch error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [db]);

  return (
    <div className="bg-[var(--background)]">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Mfantsipim-school-main-entrance-front-view.jpg"
            alt="Mfantsipim School Campus"
            className="w-full h-full object-cover opacity-10"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/50 via-transparent to-[var(--background)]"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 text-red-600 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
                <Star size={14} fill="currentColor" />
                Est. 1876 • First in Ghana
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-[var(--foreground)] uppercase tracking-tight mb-6 leading-[1.1]">
                Dwen Hwe Kan: <br />
                <span className="text-red-600">Think and Look Ahead</span>
              </h1>
              
              <p className="text-lg md:text-xl text-[var(--muted-foreground)] font-medium mb-10 leading-relaxed max-w-2xl">
                Mfantsipim School is more than an institution; it is a legacy of excellence, character, and leadership that has shaped the nation for over a century.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/about" className="btn-primary flex items-center group">
                  Our Heritage <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/admissions" className="btn-secondary">
                  Admissions
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-[var(--muted)]">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Founded', value: SCHOOL_INFO.founded, icon: GraduationCap },
              { label: 'Alumni', value: '10,000+', icon: Users },
              { label: 'Awards', value: '500+', icon: Trophy },
              { label: 'Students', value: '2,500+', icon: GraduationCap },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-base p-8 text-center group"
              >
                <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-red-600 group-hover:text-white transition-all">
                  <stat.icon size={24} className="text-red-600 group-hover:text-white transition-colors" />
                </div>
                <div className="text-4xl font-black text-[var(--foreground)] mb-1">{stat.value}</div>
                <div className="text-[var(--muted-foreground)] text-xs font-bold uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6">Built on Excellence</h2>
            <p className="text-[var(--muted-foreground)] text-lg">Our mission is to foster an environment where students excel academically and grow into responsible, visionary leaders.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Academic Rigor', desc: 'Consistently ranking among the top schools in West Africa with a focus on holistic education.' },
              { title: 'Character Building', desc: 'Instilling values of integrity, service, and discipline in every student.' },
              { title: 'Global Network', desc: 'A vast network of Old Boys (MOBA) leading in every sector across the globe.' },
            ].map((item, i) => (
              <div key={i} className="card-base p-10 card-hover">
                <CheckCircle2 className="text-red-600 mb-6" size={32} />
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-[var(--muted-foreground)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* School Houses */}
      <section className="section-padding bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(220,38,38,0.02)_0%,transparent_50%)] pointer-events-none" />
        <div className="container-custom relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-500 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-zinc-200">
                <HomeIcon size={12} />
                The_Fraternity // School_Houses
              </div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
                Our <span className="text-red-600">Houses</span>
              </h2>
              <p className="text-[var(--muted-foreground)] text-lg font-medium leading-relaxed">
                The house system is the heartbeat of Mfantsipim, fostering healthy competition, lifelong brotherhood, and leadership skills.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-1 bg-red-600/20 rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {SCHOOL_HOUSES.map((house, i) => (
              <motion.div
                key={house.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -10 }}
                className="p-10 rounded-[40px] bg-white border border-zinc-200 hover:border-red-600/30 transition-all group shadow-sm hover:shadow-xl relative overflow-hidden"
              >
                <div 
                  className="absolute top-0 left-0 w-full h-1.5 opacity-80"
                  style={{ backgroundColor: house.color }}
                />
                
                <div className="flex items-center justify-between mb-8">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg transition-transform group-hover:scale-110"
                    style={{ backgroundColor: house.color }}
                  >
                    {house.icon}
                  </div>
                  <Shield className="text-zinc-100 group-hover:text-red-600/10 transition-colors" size={48} />
                </div>

                <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-tighter mb-4 group-hover:text-red-600 transition-colors">
                  {house.name} <span className="text-zinc-300">House</span>
                </h3>
                
                <p className="text-zinc-500 text-sm leading-relaxed font-medium mb-8">
                  {house.desc}
                </p>

                <div className="flex items-center text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] pt-6 border-t border-zinc-50">
                  <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: house.color }} />
                  House_Identity // Active
                </div>

                {/* HUD corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-zinc-100 rounded-tl-[40px] group-hover:border-red-600/20 transition-colors" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-zinc-100 rounded-br-[40px] group-hover:border-red-600/20 transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Alumni */}
      <section className="section-padding bg-[var(--muted)]">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 text-red-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-red-600/20">
                <Star size={12} fill="currentColor" />
                The_Legacy // Featured_Alumni
              </div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
                Global <span className="text-red-600">Impact</span>
              </h2>
              <p className="text-[var(--muted-foreground)] text-lg font-medium leading-relaxed">
                Mfantsipim graduates are leading in every sector, across every continent. Meet some of our distinguished Old Boys.
              </p>
            </div>
            <Link 
              to="/alumni" 
              className="btn-secondary flex items-center group"
            >
              All Notable Alumni <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURED_ALUMNI.map((alumnus, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative rounded-[40px] overflow-hidden bg-white border border-zinc-200 hover:border-red-600/30 transition-all shadow-sm hover:shadow-xl"
              >
                <div className="aspect-[16/10] relative overflow-hidden">
                  <img 
                    src={alumnus.image} 
                    alt={alumnus.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h3 className="text-2xl font-black uppercase tracking-tighter leading-none mb-2">{alumnus.name}</h3>
                    <p className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em]">{alumnus.role}</p>
                  </div>
                </div>
                
                <div className="p-8">
                  <p className="text-[var(--muted-foreground)] text-sm leading-relaxed font-medium mb-8 line-clamp-2">
                    {alumnus.desc}
                  </p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
                    <a 
                      href={alumnus.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] transition-all group/link"
                    >
                      <Linkedin size={16} className="mr-2 group-hover/link:scale-110 transition-transform" /> LinkedIn
                    </a>
                    <Link 
                      to="/alumni"
                      className="flex items-center space-x-2 text-[9px] font-black text-zinc-400 uppercase tracking-widest hover:text-red-600 transition-colors"
                    >
                      <span>View_Profile</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard & Achievements */}
      <section className="section-padding bg-[var(--muted)]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="card-base p-8 shadow-xl bg-[var(--card)]">
              <Leaderboard />
            </div>
            <div className="card-base p-8 shadow-xl bg-[var(--card)]">
              <Achievements />
            </div>
          </div>
        </div>
      </section>

      {/* News Preview */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">Latest Updates</h2>
              <p className="text-[var(--muted-foreground)] max-w-xl">Stay informed with the latest news, events, and achievements from the Mfantsipim community.</p>
            </div>
            <Link 
              to="/news" 
              className="btn-secondary flex items-center group"
            >
              View All News <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-red-600 mb-4" size={40} />
                <p className="text-[var(--muted-foreground)] font-bold uppercase tracking-widest text-xs">Syncing Feed...</p>
              </div>
            ) : news.length > 0 ? news.slice(0, 3).map((item, i) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-base overflow-hidden group flex flex-col h-full card-hover"
              >
                <Link to={`/news/${item.id}`} className="flex flex-col h-full">
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={item.imageUrl || `https://picsum.photos/seed/school-${i}/800/450`} 
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="text-xs font-bold text-red-600 uppercase tracking-widest mb-3">
                      {format(new Date(item.date), 'MMMM dd, yyyy')}
                    </div>
                    <h3 className="text-xl font-bold text-[var(--foreground)] mb-4 leading-tight group-hover:text-red-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[var(--muted-foreground)] text-sm line-clamp-3 mb-6 leading-relaxed">
                      {item.content}
                    </p>
                    <div className="mt-auto flex items-center text-xs font-bold text-red-600 uppercase tracking-widest group/link">
                      Read More <ArrowRight size={14} className="ml-2 group-hover/link:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            )) : (
              <div className="col-span-full text-center py-20 card-base text-[var(--muted-foreground)] font-bold uppercase tracking-widest text-xs">
                No recent updates available.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
