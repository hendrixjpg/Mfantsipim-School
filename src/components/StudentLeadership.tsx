import React from 'react';
import { motion } from 'motion/react';
import { Shield, Award, Quote } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const leaders = [
  {
    role: "Head Boy",
    name: "Master Papa Martey",
    house: "Balmer Acquaah House",
    image: "https://picsum.photos/seed/headboy/400/400",
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
    name: "Master Lawrence",
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
    image: "https://picsum.photos/seed/leader-5/400/400",
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
      viewport={{ once: true }}
      transition={{ delay: i * 0.1 }}
      className={cn("card-base overflow-hidden card-hover group", size === "large" ? "max-w-md mx-auto" : "w-full")}
    >
      <div className="aspect-[4/5] relative overflow-hidden">
        <img
          src={leader.image}
          alt={leader.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={14} className="text-red-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{leader.role}</span>
          </div>
          <h3 className={cn("font-black uppercase tracking-tight leading-none mb-1", size === "large" ? "text-3xl" : "text-xl")}>{leader.name}</h3>
          <p className="text-xs font-bold text-white/70 uppercase tracking-widest">{leader.house}</p>
        </div>
      </div>
      <div className="p-6 bg-[var(--card)]">
        <div className="flex gap-3">
          <Quote size={16} className="text-red-600 shrink-0" />
          <p className="text-sm text-[var(--muted-foreground)] italic leading-relaxed">
            {leader.quote}
          </p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <section className="py-24 bg-[var(--muted)] border-t border-[var(--border)]">
      <div className="container-custom">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-black text-[var(--foreground)] uppercase tracking-tight mb-4">Leadership Hierarchy</h2>
          <div className="w-24 h-1 bg-red-600 mx-auto rounded-full" />
        </div>

        <div className="space-y-24">
          {/* Tier 1: Head Boy */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <span className="text-xs font-bold text-red-600 uppercase tracking-[0.3em]">Tier I // Executive</span>
              </div>
              <LeaderCard leader={headBoy} i={0} size="large" />
            </div>
          </div>

          {/* Tier 2: Assistant Headboys */}
          <div>
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-red-600 uppercase tracking-[0.3em]">Tier II // Assistants</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {assistantHeadboys.map((leader, i) => (
                <LeaderCard key={i} leader={leader} i={i + 1} />
              ))}
            </div>
          </div>

          {/* Tier 3: Protocol Prefects */}
          <div>
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-red-600 uppercase tracking-[0.3em]">Tier III // Protocol</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
          className="mt-24 text-center"
        >
          <p className="text-[var(--muted-foreground)] text-xs font-bold uppercase tracking-widest mb-8">
            And the entire prefectorial body of Mfantsipim School
          </p>
          <button className="px-10 py-4 bg-[var(--card)] border border-[var(--border)] hover:border-red-600 text-[var(--foreground)] font-bold uppercase tracking-widest text-xs rounded-xl transition-all shadow-sm">
            View Full Leadership Structure
          </button>
        </motion.div>
      </div>
    </section>
  );
}
