import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, FlaskConical, Laptop, Music, Palette, Trophy, Cpu, Microscope, Library } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const departments = [
  {
    name: 'Science',
    icon: FlaskConical,
    courses: ['Physics', 'Chemistry', 'Biology', 'Elective Mathematics'],
    desc: 'Our flagship department, producing top scientists and medical professionals.',
    code: 'DEPT_SCI'
  },
  {
    name: 'Business',
    icon: BookOpen,
    courses: ['Accounting', 'Business Management', 'Economics', 'Costing'],
    desc: 'Training the next generation of business leaders and entrepreneurs.',
    code: 'DEPT_BUS'
  },
  {
    name: 'Arts',
    icon: Palette,
    courses: ['Literature', 'History', 'Government', 'Christian Religious Studies'],
    desc: 'Developing critical thinkers and creative minds.',
    code: 'DEPT_ART'
  },
  {
    name: 'Visual Arts',
    icon: Palette,
    courses: ['Graphic Design', 'Picture Making', 'General Knowledge in Art'],
    desc: 'Nurturing artistic talent and design thinking.',
    code: 'DEPT_VIS'
  }
];

export default function Academics() {
  return (
    <div className="pt-20 pb-24">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-600/5 blur-[100px] -z-10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 glass border border-red-600/20 rounded-full text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8"
        >
          Academic_Excellence // Knowledge_Matrix
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-none">
          Shaping Minds <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">for the Future</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium">
          We offer a rigorous curriculum designed to challenge students and prepare them for success in <span className="text-white">higher education</span> and beyond.
        </p>
      </section>

      {/* Departments Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {departments.map((dept, i) => (
            <motion.div
              key={dept.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ rotateX: 5, rotateY: 5, scale: 1.02 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-[40px] glass glass-hover border border-white/10 relative group perspective-1000"
            >
              <div className="absolute top-0 right-0 p-8 text-[10px] font-mono text-gray-600 uppercase tracking-widest">{dept.code}</div>
              <div className="flex items-start justify-between mb-10">
                <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/10 neon-red">
                  <dept.icon className="text-red-600" size={32} />
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Department_ID</span>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{dept.name}</h2>
                </div>
              </div>
              
              <p className="text-gray-400 mb-10 leading-relaxed font-medium">
                {dept.desc}
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-[1px] bg-red-600" />
                  <h3 className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em]">Core_Curriculum</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {dept.courses.map(course => (
                    <span key={course} className="px-4 py-2 glass border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:border-red-600/30 transition-all">
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Facilities */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 noise-bg opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center mb-24">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-[1px] bg-red-600" />
              <span className="text-red-600 font-mono font-black text-[10px] uppercase tracking-[0.4em]">Infrastructure_Report</span>
              <div className="w-12 h-[1px] bg-red-600" />
            </div>
            <h2 className="text-5xl font-black text-white uppercase tracking-tighter">World-Class Facilities</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Science Labs', icon: Microscope, desc: 'Modern laboratories equipped for advanced research.', code: 'FAC_01' },
              { name: 'ICT Centers', icon: Cpu, desc: 'High-speed internet and latest computing resources.', code: 'FAC_02' },
              { name: 'Library', icon: Library, desc: 'A vast collection of academic resources and quiet study areas.', code: 'FAC_03' },
            ].map((facility, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10 }}
                className="p-10 rounded-[40px] glass border border-white/10 text-center relative group"
              >
                <div className="absolute top-6 right-6 text-[9px] font-mono text-gray-600 uppercase tracking-widest">{facility.code}</div>
                <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:neon-red transition-all">
                  <facility.icon className="text-red-600" size={40} />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">{facility.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">{facility.desc}</p>
                <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-center gap-2">
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Status: OPTIMAL</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
