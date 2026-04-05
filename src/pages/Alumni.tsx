import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Users, GraduationCap, Heart, Briefcase, Globe, ArrowRight, Network, Award } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function Alumni() {
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
            <Network size={14} />
            Global Network
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-[var(--foreground)] uppercase tracking-tight mb-6">
            The Mfantsipim <br />
            <span className="text-red-600">Alumni Portal</span>
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] max-w-3xl mx-auto leading-relaxed">
            Connecting generations of Mfantsipim graduates. Join the digital network of leaders shaping the world.
          </p>
        </div>
      </section>

      {/* Alumni Stats */}
      <section className="container-custom py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Active Members', value: '15,000+', icon: Users },
            { label: 'Global Chapters', value: '45', icon: Globe },
            { label: 'Endowment Fund', value: '$2M+', icon: Heart },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-base p-10 text-center card-hover"
            >
              <div className="w-20 h-20 bg-red-600/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <stat.icon className="text-red-600" size={40} />
              </div>
              <div className="text-4xl font-black text-[var(--foreground)] mb-2 tracking-tighter">{stat.value}</div>
              <div className="text-[var(--muted-foreground)] text-xs font-bold uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Login/Signup CTA */}
      <section className="container-custom pb-24">
        <div className="relative rounded-3xl overflow-hidden bg-red-600 p-12 md:p-24 text-center">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-8 leading-tight">
              Join the MOBA Network
            </h2>
            <p className="text-white/80 text-lg mb-12 leading-relaxed">
              Access exclusive events, mentorship programs, and career opportunities within the Mfantsipim Old Boys Association.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                to="/alumni/directory"
                className="w-full sm:w-auto px-12 py-5 bg-white text-red-600 font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-gray-100 transition-all text-center shadow-xl"
              >
                Browse Directory
              </Link>
              <Link 
                to="/alumni/directory"
                className="w-full sm:w-auto px-12 py-5 border-2 border-white text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white/10 transition-all text-center"
              >
                Register Profile
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container-custom pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            {[
              { title: 'Mentorship', icon: Briefcase, desc: 'Connect with experienced alumni in your field for guidance and professional growth.' },
              { title: 'Scholarships', icon: GraduationCap, desc: 'Contribute to or apply for alumni-funded scholarships for current students.' },
              { title: 'Networking', icon: Network, desc: 'Expand your professional reach with the global Mfantsipim network.' },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-start space-x-6 p-8 card-base card-hover"
              >
                <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <feature.icon className="text-red-600" size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--foreground)] uppercase tracking-tight mb-2">{feature.title}</h3>
                  <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="p-10 md:p-12 card-base bg-[var(--muted)] border-[var(--border)]">
            <h3 className="text-3xl font-black text-[var(--foreground)] uppercase tracking-tight mb-10 flex items-center">
              <Award className="mr-4 text-red-600" size={28} /> Upcoming Events
            </h3>
            <div className="space-y-4">
              {[
                { date: 'Nov 12', title: 'Global MOBA Summit', location: 'Accra, Ghana' },
                { date: 'Dec 05', title: 'London Chapter Dinner', location: 'London, UK' },
                { date: 'Jan 20', title: 'Career Fair 2026', location: 'Cape Coast, Ghana' },
              ].map((event, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between p-6 card-base bg-[var(--card)] card-hover group"
                >
                  <div className="flex items-center space-x-6">
                    <div className="w-14 h-14 bg-red-600 text-white rounded-xl flex flex-col items-center justify-center">
                      <span className="text-[10px] font-bold uppercase">{event.date.split(' ')[0]}</span>
                      <span className="text-lg font-black">{event.date.split(' ')[1]}</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[var(--foreground)] uppercase tracking-tight group-hover:text-red-600 transition-colors">{event.title}</h4>
                      <p className="text-xs text-[var(--muted-foreground)] font-bold uppercase tracking-widest">{event.location}</p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-[var(--muted-foreground)] group-hover:text-red-600 transition-colors" />
                </motion.div>
              ))}
            </div>
            <div className="mt-10 pt-10 border-t border-[var(--border)] text-center">
              <button className="text-xs font-bold text-red-600 uppercase tracking-widest hover:underline">
                View All Events
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
