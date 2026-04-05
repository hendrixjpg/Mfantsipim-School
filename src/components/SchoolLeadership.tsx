import React from 'react';
import { motion } from 'motion/react';
import { Shield, Award, Briefcase } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const schoolLeaders = [
  {
    role: "Headmaster",
    name: "Rev. Ebenezer Aidoo",
    title: "Chief Executive",
    image: "https://picsum.photos/seed/headmaster/400/400",
    quote: "Excellence is not an act, but a habit. We strive to mold the leaders of tomorrow."
  },
  {
    role: "Assistant Headmaster",
    name: "mr.fiifi hope",
    title: "Academics",
    image: "https://picsum.photos/seed/asst-acad/400/400",
    quote: "Academic rigor and intellectual curiosity are the foundations of our curriculum."
  },
  {
    role: "Assistant Headmaster",
    name: "Mrs.domeh",
    title: "Domestic",
    image: "https://picsum.photos/seed/asst-dom/400/400",
    quote: "Character building happens in every corner of our campus life."
  },
  {
    role: "Assistant Headmaster",
    name: "Mr. odoom",
    title: "Administration",
    image: "https://picsum.photos/seed/asst-admin/400/400",
    quote: "Efficiency and transparency drive our administrative excellence."
  }
];

export default function SchoolLeadership() {
  const headmaster = schoolLeaders[0];
  const assistants = schoolLeaders.slice(1);

  const LeaderCard = ({ leader, i, size = "normal" }: { leader: typeof schoolLeaders[0], i: number, size?: "large" | "normal" }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ rotateX: 5, rotateY: 5, scale: 1.02 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.05 }}
      className={cn("group relative perspective-1000", size === "large" ? "w-full max-w-sm mx-auto" : "w-full")}
    >
      <div className={cn(
        "relative overflow-hidden rounded-[32px] glass glass-hover border border-white/10 group-hover:border-red-600/50 transition-all duration-500",
        "aspect-[4/5]"
      )}>
        <img
          src={leader.image}
          alt={leader.name}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <div className="flex items-center space-x-3 mb-2">
            <Briefcase size={14} className="text-red-600" />
            <span className="text-[10px] text-red-500 font-mono font-black uppercase tracking-[0.3em]">{leader.role}</span>
          </div>
          <h3 className={cn("font-black text-white uppercase tracking-tighter mb-1 leading-none", size === "large" ? "text-3xl" : "text-xl")}>{leader.name}</h3>
          <p className="text-[11px] text-gray-400 font-mono font-black uppercase tracking-[0.2em] mb-4">{leader.title}</p>
          
          <div className="overflow-hidden h-0 group-hover:h-auto transition-all duration-500">
            <p className="text-xs text-gray-300 italic border-l-2 border-red-600 pl-4 py-1 font-medium leading-relaxed">
              "{leader.quote}"
            </p>
          </div>
        </div>

        {/* HUD corners */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/10 rounded-tl-[32px] group-hover:border-red-600/50 transition-colors" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/10 rounded-tr-[32px] group-hover:border-red-600/50 transition-colors" />
      </div>
      
      <div className="absolute -top-3 -right-3 w-12 h-12 glass rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 rotate-12 group-hover:rotate-0 shadow-xl shadow-red-600/20 neon-red">
        <Award className="text-red-600" size={24} />
      </div>
    </motion.div>
  );

  return (
    <section className="py-32 bg-black relative overflow-hidden">
      <div className="absolute inset-0 noise-bg opacity-10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 glass border border-red-600/20 rounded-full text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8"
          >
            System_Governance // Administration
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
            School Leadership
          </h2>
          <p className="text-gray-500 text-[11px] font-mono font-black uppercase tracking-[0.4em]">The administrative pillars of Mfantsipim</p>
          <div className="w-24 h-[1px] bg-red-600 mx-auto mt-10"></div>
        </div>

        <div className="space-y-32">
          {/* Tier 1: Headmaster */}
          <div className="flex justify-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/5 blur-[120px] -z-10" />
            <div className="w-full max-w-sm">
              <div className="text-center mb-8">
                <span className="text-[10px] text-red-500 font-mono font-black uppercase tracking-[0.5em]">The_Headmaster</span>
              </div>
              <LeaderCard leader={headmaster} i={0} size="large" />
            </div>
          </div>

          {/* Tier 2: Assistant Headmasters */}
          <div className="relative">
            <div className="text-center mb-16">
              <span className="text-[10px] text-red-500 font-mono font-black uppercase tracking-[0.5em]">Assistant_Headmasters</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
              {assistants.map((leader, i) => (
                <LeaderCard key={i} leader={leader} i={i + 1} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
