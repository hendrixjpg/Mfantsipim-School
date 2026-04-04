import React from 'react';
import { motion } from 'motion/react';
import { History, Target, Eye, ShieldCheck, Users, GraduationCap } from 'lucide-react';
import { SCHOOL_INFO } from '@/src/constants';

export default function About() {
  return (
    <div className="pt-20 pb-24">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 bg-red-600/10 border border-red-600/20 rounded-full text-red-500 text-xs font-black uppercase tracking-[0.2em] mb-6"
        >
          Our Heritage
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-6">
          The Oldest Secondary School in Ghana
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Founded in {SCHOOL_INFO.founded} by the Methodist Church, Mfantsipim has been at the forefront of quality education for over a century.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="bg-zinc-950 py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-10 rounded-3xl bg-white/5 border border-white/10 hover:border-red-600/30 transition-all group"
            >
              <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-red-600/20">
                <Target className="text-white" size={28} />
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4 group-hover:text-red-500 transition-colors">Our Mission</h2>
              <p className="text-gray-400 leading-relaxed">
                To provide a holistic education that develops the intellectual, spiritual, and social potential of our students, preparing them to be leaders of integrity in a global society.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-10 rounded-3xl bg-white/5 border border-white/10 hover:border-red-600/30 transition-all group"
            >
              <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-red-600/20">
                <Eye className="text-white" size={28} />
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4 group-hover:text-red-500 transition-colors">Our Vision</h2>
              <p className="text-gray-400 leading-relaxed">
                To be the premier secondary institution in Africa, recognized for academic excellence, character building, and the production of visionary leaders.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Our Journey</h2>
            <div className="w-20 h-1 bg-red-600 mx-auto mt-4"></div>
          </div>

          <div className="space-y-12">
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
                className="flex items-start space-x-8"
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center font-black text-white shadow-lg shadow-red-600/20">
                    {item.year}
                  </div>
                  {i < 3 && <div className="w-0.5 h-20 bg-white/10 mt-4"></div>}
                </div>
                <div className="pt-4">
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-zinc-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Integrity', icon: ShieldCheck, desc: 'Honesty and strong moral principles in all actions.' },
              { title: 'Excellence', icon: GraduationCap, desc: 'Striving for the highest standards in academics and life.' },
              { title: 'Service', icon: Users, desc: 'Giving back to the community and the nation.' },
            ].map((value, i) => (
              <div key={i} className="text-center p-8 rounded-3xl bg-white/5 border border-white/10">
                <value.icon className="mx-auto text-red-600 mb-6" size={40} />
                <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-4">{value.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
