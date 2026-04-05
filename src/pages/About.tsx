import React from 'react';
import { motion } from 'motion/react';
import { History, Target, Eye, ShieldCheck, Users, GraduationCap } from 'lucide-react';
import { SCHOOL_INFO } from '@/src/constants';
import { cn } from '@/src/lib/utils';

export default function About() {
  return (
    <div className="pt-20 pb-24">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-600/5 blur-[100px] -z-10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 glass border border-red-600/20 rounded-full text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8"
        >
          System_Archive // Our_Heritage
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-none">
          The Oldest Secondary <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">School in Ghana</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium">
          Founded in <span className="font-mono text-red-500">{SCHOOL_INFO.founded}</span> by the Methodist Church, Mfantsipim has been at the forefront of quality education for over a century.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{ rotateX: 5, rotateY: -5, scale: 1.02 }}
              viewport={{ once: true }}
              className="p-12 rounded-[40px] glass glass-hover border border-white/10 relative group perspective-1000"
            >
              <div className="absolute top-0 right-0 p-6 text-[10px] font-mono text-gray-600 uppercase tracking-widest">OBJ_01</div>
              <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center mb-10 shadow-lg shadow-red-600/10 neon-red">
                <Target className="text-red-600" size={32} />
              </div>
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-6 group-hover:text-red-500 transition-colors">Our Mission</h2>
              <p className="text-gray-400 text-lg leading-relaxed font-medium">
                To provide a holistic education that develops the intellectual, spiritual, and social potential of our students, preparing them to be leaders of integrity in a global society.
              </p>
              <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Status: ACTIVE</span>
                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{ rotateX: 5, rotateY: 5, scale: 1.02 }}
              viewport={{ once: true }}
              className="p-12 rounded-[40px] glass glass-hover border border-white/10 relative group perspective-1000"
            >
              <div className="absolute top-0 right-0 p-6 text-[10px] font-mono text-gray-600 uppercase tracking-widest">OBJ_02</div>
              <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center mb-10 shadow-lg shadow-red-600/10 neon-red">
                <Eye className="text-red-600" size={32} />
              </div>
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-6 group-hover:text-red-500 transition-colors">Our Vision</h2>
              <p className="text-gray-400 text-lg leading-relaxed font-medium">
                To be the premier secondary institution in Africa, recognized for academic excellence, character building, and the production of visionary leaders.
              </p>
              <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Status: ACTIVE</span>
                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-32 bg-black relative">
        <div className="absolute inset-0 noise-bg opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center mb-24">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-[1px] bg-red-600" />
              <span className="text-red-600 font-mono font-black text-[10px] uppercase tracking-[0.4em]">Historical_Timeline</span>
              <div className="w-12 h-[1px] bg-red-600" />
            </div>
            <h2 className="text-5xl font-black text-white uppercase tracking-tighter">Our Journey</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12 relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-red-600/20 to-transparent hidden md:block" />
            
            {[
              { year: '1876', title: 'The Beginning', desc: 'Founded by the Methodist Church in Cape Coast.' },
              { year: '1905', title: 'The Name Change', desc: 'Officially named Mfantsipim School.' },
              { year: '1931', title: 'Current Site', desc: 'Moved to the current site at Kwabotwe Hill.' },
              { year: '2026', title: 'Today', desc: 'Celebrating 150 Years and Continuing the legacy of excellence and leadership.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "relative p-8 rounded-3xl glass border border-white/5 group hover:border-red-600/30 transition-all",
                  i % 2 === 0 ? "md:text-right" : "md:mt-12"
                )}
              >
                <div className={cn(
                  "absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)] hidden md:block",
                  i % 2 === 0 ? "-right-[42px]" : "-left-[42px]"
                )} />
                <div className="text-3xl font-mono font-black text-red-600 mb-2 tracking-tighter">{item.year}</div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3 group-hover:text-red-500 transition-colors">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-600/[0.02] to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Integrity', icon: ShieldCheck, desc: 'Honesty and strong moral principles in all actions.', code: 'CORE_01' },
              { title: 'Excellence', icon: GraduationCap, desc: 'Striving for the highest standards in academics and life.', code: 'CORE_02' },
              { title: 'Service', icon: Users, desc: 'Giving back to the community and the nation.', code: 'CORE_03' },
            ].map((value, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10 }}
                className="text-center p-10 rounded-[40px] glass border border-white/10 relative group"
              >
                <div className="absolute top-6 right-6 text-[9px] font-mono text-gray-600 uppercase tracking-widest">{value.code}</div>
                <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:neon-red transition-all">
                  <value.icon className="text-red-600" size={40} />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">{value.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">{value.desc}</p>
                <div className="mt-8 flex justify-center gap-1">
                  {[1, 2, 3].map(dot => (
                    <div key={dot} className="w-1 h-1 rounded-full bg-red-600/30 group-hover:bg-red-600 transition-colors" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
