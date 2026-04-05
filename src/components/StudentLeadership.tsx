import React from 'react';
import { motion } from 'motion/react';
import { UserCheck, Shield, Star, Award } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const leaders = [
  {
    role: "Head Boy",
    name: "Master Papa Martey",
    house: "Balmer Acquaah House",
    image: "https://www.instagram.com/p/DNeAbwesU2a/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    quote: "Leadership is about service and setting the pace for others to follow."
  },
  {
    role: "Assistant Headboy Academics",
    name: "Master Mensah",
    house: "Pickard Packard House",
    image: "https://picsum.photos/seed/leader-2/400/400",
    quote: "Academic excellence is the bedrock of our future success."
  },
  {
    role: "Assistant Headboy Domestic",
    name: "Master lawrence",
    house: "Bartels Sneath House",
    image: "https://picsum.photos/seed/leader-3/400/400",
    quote: "A clean and orderly environment fosters a sound mind."
  },
  {
    role: "Assistant Headboy Technical",
    name: "Master Reginald",
    house: "Sarbah House",
    image: "https://picsum.photos/seed/leader-4/400/400",
    quote: "Innovation and technical skill drive our progress."
  },
  {
    role: "1st Protocol Prefect",
    name: "Master Percy",
    house: "Balmer Acquaah House",
    image: "https://www.instagram.com/p/DNeAbwesU2a/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    quote: "Discipline and order are the hallmarks of a Kwabotwe gentleman."
  },
  {
    role: "2nd Protocol Prefect",
    name: "Master Jayden",
    house: "Balmer Acquah House",
    image: "https://picsum.photos/seed/leader-6/400/400",
    quote: "Upholding the traditions of our noble institution."
  },
  {
    role: "3rd Protocol Prefect",
    name: "Master Mensah",
    house: "Balmer Acquaah House",
    image: "https://picsum.photos/seed/leader-7/400/400",
    quote: "Service with integrity and humility."
  }
];

export default function StudentLeadership() {
  const headBoy = leaders[0];
  const assistantHeadboys = leaders.slice(1, 4);
  const protocolPrefects = leaders.slice(4);

  const LeaderCard = ({ leader, i, size = "normal" }: { leader: typeof leaders[0], i: number, size?: "large" | "normal" }) => (
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
            <Shield size={14} className="text-red-600" />
            <span className="text-[10px] text-red-500 font-mono font-black uppercase tracking-[0.3em]">{leader.role}</span>
          </div>
          <h3 className={cn("font-black text-white uppercase tracking-tighter mb-1 leading-none", size === "large" ? "text-3xl" : "text-xl")}>{leader.name}</h3>
          <p className="text-[11px] text-gray-400 font-mono font-black uppercase tracking-[0.2em] mb-4">{leader.house}</p>
          
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
    <section className="py-32 bg-zinc-950/50 border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 glass border border-red-600/20 rounded-full text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8"
          >
            Student_Governance // Prefectorial_Hierarchy
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
            Leadership Hierarchy
          </h2>
          <p className="text-gray-500 text-[11px] font-mono font-black uppercase tracking-[0.4em]">The leadership structure of Kwabotwe Hill</p>
          <div className="w-24 h-[1px] bg-red-600 mx-auto mt-10"></div>
        </div>

        <div className="space-y-32">
          {/* Tier 1: Head Boy */}
          <div className="flex justify-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/5 blur-[120px] -z-10" />
            <div className="w-full max-w-sm">
              <div className="text-center mb-8">
                <span className="text-[10px] text-red-500 font-mono font-black uppercase tracking-[0.5em]">Tier_I // Executive</span>
              </div>
              <LeaderCard leader={headBoy} i={0} size="large" />
            </div>
          </div>

          {/* Tier 2: Assistant Headboys */}
          <div className="relative">
            <div className="text-center mb-16">
              <span className="text-[10px] text-red-500 font-mono font-black uppercase tracking-[0.5em]">Tier_II // Assistants</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
              {assistantHeadboys.map((leader, i) => (
                <LeaderCard key={i} leader={leader} i={i + 1} />
              ))}
            </div>
          </div>

          {/* Tier 3: Protocol Prefects */}
          <div className="relative">
            <div className="text-center mb-16">
              <span className="text-[10px] text-red-500 font-mono font-black uppercase tracking-[0.5em]">Tier_III // Protocol</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {protocolPrefects.map((leader, i) => (
                <LeaderCard key={i} leader={leader} i={i + 4} />
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-32 text-center"
        >
          <p className="text-gray-500 text-[10px] font-mono font-black uppercase tracking-[0.3em] mb-10">
            And the entire prefectorial body of Mfantsipim School
          </p>
          <button className="px-10 py-5 glass border border-white/10 hover:border-red-600 text-gray-400 hover:text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl transition-all neon-red-hover glitch-hover">
            View_Full_Leadership_Structure
          </button>
        </motion.div>
      </div>
    </section>
  );
}
