import React from 'react';
import { motion } from 'motion/react';
import { Shield, Award, Briefcase, Quote } from 'lucide-react';
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
    name: "Mr. Fiifi Hope",
    title: "Academics",
    image: "https://picsum.photos/seed/asst-acad/400/400",
    quote: "Academic rigor and intellectual curiosity are the foundations of our curriculum."
  },
  {
    role: "Assistant Headmaster",
    name: "Mrs. Domeh",
    title: "Domestic",
    image: "https://picsum.photos/seed/asst-dom/400/400",
    quote: "Character building happens in every corner of our campus life."
  },
  {
    role: "Assistant Headmaster",
    name: "Mr. Odoom",
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
            <Briefcase size={14} className="text-red-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{leader.role}</span>
          </div>
          <h3 className={cn("font-black uppercase tracking-tight leading-none mb-1", size === "large" ? "text-3xl" : "text-xl")}>{leader.name}</h3>
          <p className="text-xs font-bold text-white/70 uppercase tracking-widest">{leader.title}</p>
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
    <section className="py-24 bg-[var(--background)]">
      <div className="container-custom">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-black text-[var(--foreground)] uppercase tracking-tight mb-4">School Leadership</h2>
          <div className="w-24 h-1 bg-red-600 mx-auto rounded-full" />
        </div>

        <div className="space-y-24">
          {/* Tier 1: Headmaster */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <span className="text-xs font-bold text-red-600 uppercase tracking-[0.3em]">The Headmaster</span>
              </div>
              <LeaderCard leader={headmaster} i={0} size="large" />
            </div>
          </div>

          {/* Tier 2: Assistant Headmasters */}
          <div>
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-red-600 uppercase tracking-[0.3em]">Assistant Headmasters</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
