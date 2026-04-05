import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, FlaskConical, Palette, Microscope, Library, Cpu } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const departments = [
  {
    name: 'Science',
    icon: FlaskConical,
    courses: ['Physics', 'Chemistry', 'Biology', 'Elective Mathematics'],
    desc: 'Our flagship department, producing top scientists and medical professionals.',
  },
  {
    name: 'Business',
    icon: BookOpen,
    courses: ['Accounting', 'Business Management', 'Economics', 'Costing'],
    desc: 'Training the next generation of business leaders and entrepreneurs.',
  },
  {
    name: 'Arts',
    icon: Palette,
    courses: ['Literature', 'History', 'Government', 'Christian Religious Studies'],
    desc: 'Developing critical thinkers and creative minds.',
  },
  {
    name: 'Visual Arts',
    icon: Palette,
    courses: ['Graphic Design', 'Picture Making', 'General Knowledge in Art'],
    desc: 'Nurturing artistic talent and design thinking.',
  }
];

export default function Academics() {
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
            <BookOpen size={14} />
            Academic Excellence
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-[var(--foreground)] uppercase tracking-tight mb-6">
            Shaping Minds <br />
            <span className="text-red-600">for the Future</span>
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] max-w-3xl mx-auto leading-relaxed">
            We offer a rigorous curriculum designed to challenge students and prepare them for success in higher education and beyond.
          </p>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="container-custom py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {departments.map((dept, i) => (
            <motion.div
              key={dept.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-base p-10 md:p-12 card-hover"
            >
              <div className="flex items-start justify-between mb-10">
                <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center">
                  <dept.icon className="text-red-600" size={32} />
                </div>
                <div className="text-right">
                  <h2 className="text-3xl font-black text-[var(--foreground)] uppercase tracking-tight">{dept.name}</h2>
                </div>
              </div>
              
              <p className="text-[var(--muted-foreground)] mb-10 leading-relaxed">
                {dept.desc}
              </p>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-red-600 uppercase tracking-widest">Core Curriculum</h3>
                <div className="flex flex-wrap gap-2">
                  {dept.courses.map(course => (
                    <span key={course} className="px-4 py-2 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-xs font-bold text-[var(--muted-foreground)]">
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
      <section className="py-24 bg-[var(--muted)] border-y border-[var(--border)]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-[var(--foreground)] uppercase tracking-tight mb-4">World-Class Facilities</h2>
            <div className="w-24 h-1 bg-red-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Science Labs', icon: Microscope, desc: 'Modern laboratories equipped for advanced research.' },
              { name: 'ICT Centers', icon: Cpu, desc: 'High-speed internet and latest computing resources.' },
              { name: 'Library', icon: Library, desc: 'A vast collection of academic resources and quiet study areas.' },
            ].map((facility, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-base p-10 text-center card-hover bg-[var(--card)]"
              >
                <div className="w-20 h-20 bg-red-600/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <facility.icon className="text-red-600" size={40} />
                </div>
                <h3 className="text-2xl font-black text-[var(--foreground)] uppercase tracking-tight mb-4">{facility.name}</h3>
                <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">{facility.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
 }
