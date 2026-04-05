import React from 'react';
import { motion } from 'motion/react';
import { Users } from 'lucide-react';
import SchoolLeadership from '@/src/components/SchoolLeadership';
import StudentLeadership from '@/src/components/StudentLeadership';

export default function Leadership() {
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
            <Users size={14} />
            Governance & Leadership
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-[var(--foreground)] uppercase tracking-tight mb-6">
            Our <span className="text-red-600">Leadership</span>
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
            Meet the dedicated individuals who guide Mfantsipim School towards excellence, 
            from our administrative pillars to our student prefectorial body.
          </p>
        </div>
      </section>

      <div className="py-12">
        <SchoolLeadership />
        <StudentLeadership />
      </div>
    </div>
  );
}
