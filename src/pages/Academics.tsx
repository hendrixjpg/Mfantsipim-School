import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, FlaskConical, Laptop, Music, Palette, Trophy } from 'lucide-react';

const departments = [
  {
    name: 'Science',
    icon: FlaskConical,
    courses: ['Physics', 'Chemistry', 'Biology', 'Elective Mathematics'],
    desc: 'Our flagship department, producing top scientists and medical professionals.'
  },
  {
    name: 'Business',
    icon: BookOpen,
    courses: ['Accounting', 'Business Management', 'Economics', 'Costing'],
    desc: 'Training the next generation of business leaders and entrepreneurs.'
  },
  {
    name: 'Arts',
    icon: Palette,
    courses: ['Literature', 'History', 'Government', 'Christian Religious Studies'],
    desc: 'Developing critical thinkers and creative minds.'
  },
  {
    name: 'Visual Arts',
    icon: Palette,
    courses: ['Graphic Design', 'Picture Making', 'General Knowledge in Art'],
    desc: 'Nurturing artistic talent and design thinking.'
  }
];

export default function Academics() {
  return (
    <div className="pt-20 pb-24">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-red-600/10 border border-red-600/20 rounded-full text-red-500 text-xs font-black uppercase tracking-[0.2em] mb-6"
          >
            Academic Excellence
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-6">
            Shaping Minds for the Future
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            We offer a rigorous curriculum designed to challenge students and prepare them for success in higher education and beyond.
          </p>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {departments.map((dept, i) => (
            <motion.div
              key={dept.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-red-600/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="p-4 bg-red-600 rounded-2xl shadow-lg shadow-red-600/20">
                  <dept.icon className="text-white" size={32} />
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Department</span>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">{dept.name}</h2>
                </div>
              </div>
              
              <p className="text-gray-400 mb-8 leading-relaxed">
                {dept.desc}
              </p>

              <div className="space-y-3">
                <h3 className="text-xs font-black text-red-600 uppercase tracking-widest">Core Courses</h3>
                <div className="flex flex-wrap gap-2">
                  {dept.courses.map(course => (
                    <span key={course} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300">
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
      <section className="mt-24 bg-zinc-950 py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">World-Class Facilities</h2>
            <div className="w-20 h-1 bg-red-600 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Science Labs', icon: FlaskConical, desc: 'Modern laboratories equipped for advanced research.' },
              { name: 'ICT Centers', icon: Laptop, desc: 'High-speed internet and latest computing resources.' },
              { name: 'Library', icon: BookOpen, desc: 'A vast collection of academic resources and quiet study areas.' },
            ].map((facility, i) => (
              <div key={i} className="p-8 rounded-3xl bg-black/40 border border-white/5 text-center">
                <facility.icon className="mx-auto text-red-600 mb-6" size={40} />
                <h3 className="text-xl font-bold text-white mb-4">{facility.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{facility.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
