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
      viewport={{ once: true }}
      transition={{ delay: i * 0.05 }}
      className={cn("group relative", size === "large" ? "w-full max-w-sm mx-auto" : "w-full")}
    >
      <div className={cn(
        "relative overflow-hidden rounded-[24px] border border-white/10 group-hover:border-red-600/50 transition-all duration-500",
        "aspect-[4/5]"
      )}>
        <img
          src={leader.image}
          alt={leader.name}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <div className="flex items-center space-x-2 mb-1">
            <Briefcase size={12} className="text-red-600" />
            <span className="text-[9px] text-red-500 font-black uppercase tracking-[0.2em]">{leader.role}</span>
          </div>
          <h3 className={cn("font-black text-white uppercase tracking-tight mb-0.5", size === "large" ? "text-2xl" : "text-lg")}>{leader.name}</h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">{leader.title}</p>
          
          <div className="overflow-hidden h-0 group-hover:h-auto transition-all duration-500">
            <p className="text-xs text-gray-300 italic border-l-2 border-red-600 pl-3 py-0.5">
              "{leader.quote}"
            </p>
          </div>
        </div>
      </div>
      
      <div className="absolute -top-2 -right-2 w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 rotate-12 group-hover:rotate-0 shadow-xl shadow-red-600/20">
        <Award className="text-white" size={20} />
      </div>
    </motion.div>
  );

  return (
    <section className="py-24 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-red-600/10 border border-red-600/20 rounded-full text-red-500 text-xs font-black uppercase tracking-[0.2em] mb-6"
          >
            Administration
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
            School Leadership
          </h2>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">The administrative pillars of Mfantsipim</p>
          <div className="w-20 h-1 bg-red-600 mx-auto mt-6"></div>
        </div>

        <div className="space-y-20">
          {/* Tier 1: Headmaster */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm">
              <div className="text-center mb-6">
                <span className="text-[10px] text-red-500 font-black uppercase tracking-[0.3em]">The Headmaster</span>
              </div>
              <LeaderCard leader={headmaster} i={0} size="large" />
            </div>
          </div>

          {/* Tier 2: Assistant Headmasters */}
          <div>
            <div className="text-center mb-10">
              <span className="text-[10px] text-red-500 font-black uppercase tracking-[0.3em]">Assistant Headmasters</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
