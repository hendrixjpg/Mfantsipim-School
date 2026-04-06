import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, GraduationCap, Heart, Briefcase, Globe, ArrowRight, 
  Network, Award, Star, Search, Filter, ExternalLink, ShieldCheck,
  Linkedin
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const NOTABLE_ALUMNI = [
  { name: "Kofi Annan", desc: "Global diplomat and Nobel Peace Prize laureate", category: "Diplomacy" },
  { name: "John Atta Mills", desc: "Former President of Ghana", category: "Politics" },
  { name: "Kwegyir Aggrey", desc: "Pioneer of modern education in Ghana", category: "Education" },
  { name: "J. H. Kwabena Nketia", desc: "World-renowned academic in African music", category: "Arts & Culture" },
  { name: "Kobina Sekyi", desc: "Nationalist and intellectual leader", category: "Politics" },
  { name: "Carl Christian Reindorf", desc: "Historian and religious leader", category: "Religion & History" },
  { name: "Sam Jonah", desc: "Mining magnate and top businessman", category: "Business" },
  { name: "Kwasi Twum", desc: "Media empire owner", category: "Media" },
  { name: "Edward Annan", desc: "Aviation entrepreneur", category: "Business" },
  { name: "Kofi Amoa-Abban", desc: "Oil & gas billionaire-level entrepreneur", category: "Business" },
  { name: "Moses Kwesi Baiden Jr.", desc: "Fintech and security systems leader", category: "Technology" },
  { name: "Herman Chinery-Hesse", desc: "Pioneer of Ghana’s tech industry", category: "Technology" },
  { name: "Isaac Sesi", desc: "Young global tech innovator", category: "Technology" },
  { name: "Aaron Adatsi", desc: "Modern TV star", category: "Entertainment" },
  { name: "RJZ", desc: "Youth music influence", category: "Entertainment" },
];

const FEATURED_ALUMNI = [
  {
    name: "Kofi Annan",
    role: "Former UN Secretary-General",
    desc: "A global diplomat who dedicated his life to peace and international cooperation. Nobel Peace Prize laureate and Mfantsipim's most distinguished son.",
    image: "https://picsum.photos/seed/kofi/800/1000",
    linkedin: "https://linkedin.com"
  },
  {
    name: "Sir Sam Jonah",
    role: "Executive Chairman, Jonah Capital",
    desc: "One of Africa's most prominent businessmen and former CEO of Ashanti Goldfields Corporation. A titan of industry and philanthropy.",
    image: "https://picsum.photos/seed/sam/800/1000",
    linkedin: "https://linkedin.com"
  },
  {
    name: "Herman Chinery-Hesse",
    role: "Founder, SOFTtribe",
    desc: "Known as the 'Bill Gates of Africa', he pioneered the software industry in Ghana and West Africa, proving African excellence in tech.",
    image: "https://picsum.photos/seed/herman/800/1000",
    linkedin: "https://linkedin.com"
  },
  {
    name: "Isaac Sesi",
    role: "Founder, Sesi Technologies",
    desc: "Young global tech innovator developing solutions for African farmers. Recognized by MIT Technology Review as a top innovator under 35.",
    image: "https://picsum.photos/seed/isaac/800/1000",
    linkedin: "https://linkedin.com"
  },
  {
    name: "Kofi Amoa-Abban",
    role: "CEO, Rigworld Group",
    desc: "A leading entrepreneur in the oil and gas sector, demonstrating the power of Mfantsipim's entrepreneurial spirit in global energy.",
    image: "https://picsum.photos/seed/energy/800/1000",
    linkedin: "https://linkedin.com"
  },
  {
    name: "RJZ",
    role: "Artist & Cultural Influencer",
    desc: "Representing the modern creative wave, RJZ has become a significant voice in contemporary West African music and youth culture.",
    image: "https://picsum.photos/seed/music/800/1000",
    linkedin: "https://linkedin.com"
  }
];

export default function Alumni() {
  const [activeSection, setActiveSection] = React.useState<'network' | 'notable'>('network');

  return (
    <div className="bg-[var(--background)] min-h-screen selection:bg-red-600/20 selection:text-red-600">
      {/* Header Section */}
      <section className="bg-[var(--muted)] pt-40 pb-24 border-b border-[var(--border)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.05)_0%,transparent_50%)]" />
        <div className="container-custom text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 text-red-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-red-600/20"
          >
            <Network size={14} />
            Global_Network // MOBA_Legacy
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-black text-[var(--foreground)] uppercase tracking-tighter mb-8 leading-none">
            The Mfantsipim <br />
            <span className="text-red-600">Alumni Portal</span>
          </h1>
          <p className="text-xl text-[var(--muted-foreground)] max-w-3xl mx-auto leading-relaxed font-medium">
            Connecting generations of Mfantsipim graduates. Join the digital network of leaders shaping the world.
          </p>

          <div className="flex items-center justify-center space-x-4 mt-12">
            <button 
              onClick={() => setActiveSection('network')}
              className={cn(
                "px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border",
                activeSection === 'network' 
                  ? "bg-red-50 border-red-600/50 text-red-600 shadow-xl shadow-red-600/5" 
                  : "bg-white border-zinc-200 text-zinc-500 hover:text-red-600"
              )}
            >
              Network Overview
            </button>
            <button 
              onClick={() => setActiveSection('notable')}
              className={cn(
                "px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border",
                activeSection === 'notable' 
                  ? "bg-red-50 border-red-600/50 text-red-600 shadow-xl shadow-red-600/5" 
                  : "bg-white border-zinc-200 text-zinc-500 hover:text-red-600"
              )}
            >
              Notable Alumni
            </button>
          </div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {activeSection === 'network' ? (
          <motion.div
            key="network"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Alumni Stats */}
            <section className="container-custom py-24">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { label: 'Active Members', value: '15,000+', icon: Users },
                  { label: 'Global Chapters', value: '45', icon: Globe },
                  { label: 'Endowment Fund', value: '$2M+', icon: Heart },
                ].map((stat, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-12 rounded-[40px] bg-white border border-zinc-200/60 text-center hover:border-red-600/30 transition-all group"
                  >
                    <div className="w-20 h-20 bg-red-600/10 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                      <stat.icon className="text-red-600" size={40} />
                    </div>
                    <div className="text-5xl font-black text-[var(--foreground)] mb-2 tracking-tighter">{stat.value}</div>
                    <div className="text-[var(--muted-foreground)] text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Featured Alumni Section */}
            <section className="container-custom pb-24">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-4xl md:text-6xl font-black text-[var(--foreground)] uppercase tracking-tighter leading-none mb-4">
                    Featured <span className="text-red-600">Alumni</span>
                  </h2>
                  <p className="text-[var(--muted-foreground)] font-medium">Spotlighting the extraordinary impact of Mfantsipim graduates.</p>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                  <div className="w-12 h-1 bg-red-600/20 rounded-full" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600">Curated_Selection</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">{alumnus.name}</h3>
                          <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                            <Star size={14} className="text-yellow-400 fill-yellow-400" />
                          </div>
                        </div>
                        <p className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em]">{alumnus.role}</p>
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <p className="text-[var(--muted-foreground)] text-sm leading-relaxed font-medium mb-8 line-clamp-3">
                        {alumnus.desc}
                      </p>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
                        <a 
                          href={alumnus.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] transition-all group/link"
                        >
                          <Linkedin size={16} className="mr-2 group-hover/link:scale-110 transition-transform" /> LinkedIn_Profile
                        </a>
                        <button className="flex items-center space-x-2 text-[9px] font-black text-zinc-400 uppercase tracking-widest hover:text-red-600 transition-colors">
                          <span>Read_Legacy</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Login/Signup CTA */}
            <section className="container-custom pb-24">
              <div className="relative rounded-[48px] overflow-hidden bg-zinc-900 p-12 md:p-24 text-center border border-zinc-800 shadow-2xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.15)_0%,transparent_70%)]" />
                <div className="relative z-10 max-w-3xl mx-auto">
                  <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-none">
                    Join the <br /> <span className="text-red-600">MOBA Network</span>
                  </h2>
                  <p className="text-white/60 text-lg mb-12 leading-relaxed font-medium">
                    Access exclusive events, mentorship programs, and career opportunities within the Mfantsipim Old Boys Association.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link 
                      to="/alumni/directory"
                      className="w-full sm:w-auto px-12 py-5 bg-red-600 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-red-700 transition-all text-center shadow-xl shadow-red-600/20"
                    >
                      Browse Directory
                    </Link>
                    <Link 
                      to="/alumni/directory"
                      className="w-full sm:w-auto px-12 py-5 border border-white/10 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-white/5 transition-all text-center"
                    >
                      Register Profile
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Features */}
            <section className="container-custom pb-24">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  {[
                    { title: 'Mentorship', icon: Briefcase, desc: 'Connect with experienced alumni in your field for guidance and professional growth.' },
                    { title: 'Scholarships', icon: GraduationCap, desc: 'Contribute to or apply for alumni-funded scholarships for current students.' },
                    { title: 'Networking', icon: Network, desc: 'Expand your professional reach with the global Mfantsipim network.' },
                  ].map((feature, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="flex items-start space-x-8 p-10 rounded-[32px] bg-white border border-zinc-200/60 hover:border-red-600/30 transition-all group"
                    >
                      <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <feature.icon className="text-red-600" size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-[var(--foreground)] uppercase tracking-tight mb-2">{feature.title}</h3>
                        <p className="text-[var(--muted-foreground)] text-sm leading-relaxed font-medium">
                          {feature.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="p-12 rounded-[40px] bg-[var(--muted)] border border-[var(--border)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <Award size={200} className="text-red-600" />
                  </div>
                  <h3 className="text-3xl font-black text-[var(--foreground)] uppercase tracking-tighter mb-12 flex items-center">
                    <Award className="mr-4 text-red-600" size={32} /> Upcoming Events
                  </h3>
                  <div className="space-y-4">
                    {[
                      { date: 'Nov 12', title: 'Global MOBA Summit', location: 'Accra, Ghana' },
                      { date: 'Dec 05', title: 'London Chapter Dinner', location: 'London, UK' },
                      { date: 'Jan 20', title: 'Career Fair 2026', location: 'Cape Coast, Ghana' },
                    ].map((event, i) => (
                      <motion.div 
                        key={i} 
                        whileHover={{ x: 10 }}
                        className="flex items-center justify-between p-6 rounded-2xl bg-white border border-zinc-200/60 hover:border-red-600/30 transition-all group"
                      >
                        <div className="flex items-center space-x-6">
                          <div className="w-16 h-16 bg-red-600 text-white rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-red-600/20">
                            <span className="text-[10px] font-black uppercase tracking-widest">{event.date.split(' ')[0]}</span>
                            <span className="text-xl font-black">{event.date.split(' ')[1]}</span>
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-[var(--foreground)] uppercase tracking-tight group-hover:text-red-600 transition-colors">{event.title}</h4>
                            <p className="text-[10px] text-[var(--muted-foreground)] font-black uppercase tracking-[0.2em] mt-1">{event.location}</p>
                          </div>
                        </div>
                        <ArrowRight size={20} className="text-[var(--muted-foreground)] group-hover:text-red-600 transition-colors" />
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-12 pt-10 border-t border-[var(--border)] text-center">
                    <button className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] hover:underline">
                      View All Events
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div
            key="notable"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="container-custom py-24"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {NOTABLE_ALUMNI.map((alumnus, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="p-10 rounded-[40px] bg-white border border-zinc-200/60 hover:border-red-600/30 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-opacity">
                    <Star size={120} className="text-red-600" />
                  </div>
                  
                  <div className="flex items-center space-x-5 mb-8">
                    <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-600 font-black text-2xl group-hover:bg-red-600 group-hover:text-white transition-all duration-500">
                      {alumnus.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[var(--foreground)] uppercase tracking-tight leading-none mb-2 group-hover:text-red-600 transition-colors">
                        {alumnus.name}
                      </h3>
                      <span className="text-[9px] font-black text-red-600/60 uppercase tracking-[0.2em] px-2 py-1 bg-red-600/5 rounded-md border border-red-600/10">
                        {alumnus.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-[var(--muted-foreground)] text-sm leading-relaxed font-medium italic">
                    "{alumnus.desc}"
                  </p>

                  <div className="mt-8 pt-8 border-t border-zinc-100 flex items-center justify-between">
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Legacy_Profile</span>
                    <button className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:text-red-600 transition-colors">
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-24 p-12 rounded-[48px] bg-red-600 text-center relative overflow-hidden shadow-2xl shadow-red-600/20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,transparent_70%)]" />
              <div className="relative z-10">
                <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">Know a Notable Alumnus?</h3>
                <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto font-medium">
                  Help us celebrate the achievements of Mfantsipim graduates. Submit a nomination for our notable alumni directory.
                </p>
                <button className="px-12 py-5 bg-white text-red-600 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-zinc-100 transition-all shadow-xl">
                  Nominate Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

