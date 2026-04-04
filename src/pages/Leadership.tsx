import React from 'react';
import { motion } from 'motion/react';
import SchoolLeadership from '@/src/components/SchoolLeadership';
import StudentLeadership from '@/src/components/StudentLeadership';

export default function Leadership() {
  return (
    <div className="pt-20">
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-red-600/10 border border-red-600/20 rounded-full text-red-500 text-xs font-black uppercase tracking-[0.2em] mb-6"
          >
            Governance & Leadership
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-6">
            Our Leadership
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Meet the dedicated individuals who guide Mfantsipim School towards excellence, 
            from our administrative pillars to our student prefectorial body.
          </p>
          <div className="w-24 h-1 bg-red-600 mx-auto mt-10"></div>
        </div>
      </section>

      <SchoolLeadership />
      <StudentLeadership />
    </div>
  );
}
