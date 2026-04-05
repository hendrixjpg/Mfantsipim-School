import React from 'react';
import { motion } from 'motion/react';
import { History, Target, Eye, ShieldCheck, Users, GraduationCap } from 'lucide-react';
import { SCHOOL_INFO } from '@/src/constants';
import { cn } from '@/src/lib/utils';

export default function About() {
  return (
    <div className="bg-[var(--background)] min-h-screen">
      {/* Header Section */}
      <section className="bg-[var(--muted)] pt-32 pb-20 border-b border-[var(--border)]">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 text-red-600 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
          >
            <History size={14} />
            Our Heritage
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-[var(--foreground)] uppercase tracking-tight mb-6">
            The Oldest Secondary <br />
            <span className="text-red-600">School in Ghana</span>
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] max-w-3xl mx-auto leading-relaxed">
            Founded in <span className="font-bold text-red-600">{SCHOOL_INFO.founded}</span> by the Methodist Church, Mfantsipim has been at the forefront of quality education for over a century.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card-base p-10 md:p-12 card-hover"
            >
              <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center mb-8">
                <Target className="text-red-600" size={32} />
              </div>
              <h2 className="text-3xl font-black text-[var(--foreground)] uppercase tracking-tight mb-6">Our Mission</h2>
              <p className="text-[var(--muted-foreground)] text-lg leading-relaxed">
                To provide a holistic education that develops the intellectual, spiritual, and social potential of our students, preparing them to be leaders of integrity in a global society.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card-base p-10 md:p-12 card-hover"
            >
              <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center mb-8">
                <Eye className="text-red-600" size={32} />
              </div>
              <h2 className="text-3xl font-black text-[var(--foreground)] uppercase tracking-tight mb-6">Our Vision</h2>
              <p className="text-[var(--muted-foreground)] text-lg leading-relaxed">
                To be the premier secondary institution in Africa, recognized for academic excellence, character building, and the production of visionary leaders.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-24 bg-[var(--muted)] border-y border-[var(--border)]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-[var(--foreground)] uppercase tracking-tight mb-4">Our Journey</h2>
            <div className="w-24 h-1 bg-red-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[var(--border)] hidden md:block" />
            
            {[
              { year: '1876', title: 'The Beginning', desc: 'Founded by the Methodist Church in Cape Coast.' },
              { year: '1905', title: 'The Name Change', desc: 'Officially named Mfantsipim School.' },
              { year: '1931', title: 'Current Site', desc: 'Moved to the current site at Kwabotwe Hill.' },
              { year: '1999-2025', title: 'NSMQ', desc: 'Won NSMQ 1999, 2014, 2024 and 2025' },
              { year: '2025', title: 'NSMQ', desc: "Mfantsipim School in Cape Coast, popularly known as Kwabotwe or simply Botwe, gallantly defended its title when it beat St. Augustine's College, Cape Coast, and Opoku Ware School, Kumasi, at the grand finale of National Science and Mathematics Quiz (NSMQ) 2025 held in Cape Coast. At the end of the fiercely contested final, Mfantsipim School lifted the trophy for the second consecutive time with 56 points, while St. Augustine's College followed in second place with 42 points and Opoku Ware School had 29 points to place third." },
              { year: '2026', title: 'Legacy of Excellence', desc: 'Celebrating 150 years and Continuing the legacy of producing visionary leaders for Ghana and the world.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "relative p-8 card-base bg-[var(--card)] card-hover",
                  i % 2 === 0 ? "md:text-right" : "md:mt-12"
                )}
              >
                <div className={cn(
                  "absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-red-600 border-4 border-[var(--card)] shadow-lg hidden md:block",
                  i % 2 === 0 ? "-right-[40px]" : "-left-[40px]"
                )} />
                <div className="text-3xl font-black text-red-600 mb-2 tracking-tighter">{item.year}</div>
                <h3 className="text-xl font-bold text-[var(--foreground)] uppercase tracking-tight mb-3">{item.title}</h3>
                <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Integrity', icon: ShieldCheck, desc: 'Honesty and strong moral principles in all actions.' },
              { title: 'Excellence', icon: GraduationCap, desc: 'Striving for the highest standards in academics and life.' },
              { title: 'Service', icon: Users, desc: 'Giving back to the community and the nation.' },
            ].map((value, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-10 card-base card-hover"
              >
                <div className="w-20 h-20 bg-red-600/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <value.icon className="text-red-600" size={40} />
                </div>
                <h3 className="text-2xl font-black text-[var(--foreground)] uppercase tracking-tight mb-4">{value.title}</h3>
                <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
