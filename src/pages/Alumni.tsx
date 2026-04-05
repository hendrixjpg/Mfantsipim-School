import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Users, GraduationCap, Heart, Briefcase, Globe, ArrowRight, Network, Award } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function Alumni() {
  return (
    <div className="pt-20 pb-24">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-600/5 blur-[100px] -z-10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 glass border border-red-600/20 rounded-full text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8"
        >
          Global_Network // MOBA_Portal
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-none">
          The Mfantsipim <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">Alumni Portal</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium">
          Connecting generations of Mfantsipim graduates. Join the <span className="text-white">digital network</span> of leaders shaping the world.
        </p>
      </section>

      {/* Alumni Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Active Members', value: '15,000+', icon: Users, code: 'NET_01' },
            { label: 'Global Chapters', value: '45', icon: Globe, code: 'NET_02' },
            { label: 'Endowment Fund', value: '$2M+', icon: Heart, code: 'NET_03' },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -5, scale: 1.02 }}
              className="p-10 rounded-[40px] glass glass-hover border border-white/10 text-center relative group"
            >
              <div className="absolute top-6 right-6 text-[9px] font-mono text-gray-600 uppercase tracking-widest">{stat.code}</div>
              <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:neon-red transition-all">
                <stat.icon className="text-red-600" size={40} />
              </div>
              <div className="text-4xl font-mono font-black text-white mb-2 tracking-tighter">{stat.value}</div>
              <div className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Login/Signup CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="relative rounded-[60px] overflow-hidden glass border border-white/10 p-12 md:p-24 text-center group">
          <div className="absolute inset-0 grid-bg opacity-10 group-hover:opacity-20 transition-opacity" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-red-600/[0.05] to-transparent pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-red-600" />
              <span className="text-red-600 font-mono font-black text-[10px] uppercase tracking-[0.4em]">Join_The_Legacy</span>
              <div className="w-12 h-[1px] bg-red-600" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8 leading-tight">
              Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">MOBA Network</span>
            </h2>
            <p className="text-gray-400 text-lg mb-12 leading-relaxed font-medium">
              Access exclusive events, mentorship programs, and career opportunities within the Mfantsipim Old Boys Association.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                to="/alumni/directory"
                className="w-full sm:w-auto px-12 py-5 bg-red-600 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-red-700 transition-all text-center neon-red neon-red-hover glitch-hover"
              >
                Browse Directory
              </Link>
              <Link 
                to="/alumni/directory"
                className="w-full sm:w-auto px-12 py-5 glass border border-white/10 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-white/10 transition-all text-center glitch-hover"
              >
                Register Profile
              </Link>
            </div>
          </div>
          
          {/* Decorative HUD corners */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-red-600/20 rounded-tl-[60px]" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-red-600/20 rounded-tr-[60px]" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-red-600/20 rounded-bl-[60px]" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-red-600/20 rounded-br-[60px]" />
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            {[
              { title: 'Mentorship', icon: Briefcase, desc: 'Connect with experienced alumni in your field for guidance and professional growth.', code: 'SVC_01' },
              { title: 'Scholarships', icon: GraduationCap, desc: 'Contribute to or apply for alumni-funded scholarships for current students.', code: 'SVC_02' },
              { title: 'Networking', icon: Network, desc: 'Expand your professional reach with the global Mfantsipim network.', code: 'SVC_03' },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ x: 10 }}
                className="flex items-start space-x-8 p-8 rounded-3xl glass border border-white/5 group hover:border-red-600/30 transition-all"
              >
                <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:neon-red transition-all">
                  <feature.icon className="text-red-600" size={28} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">{feature.title}</h3>
                    <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">{feature.code}</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="p-12 rounded-[40px] glass border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-[10px] font-mono text-gray-600 uppercase tracking-widest">EVT_FEED</div>
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-10 flex items-center">
              <Award className="mr-4 text-red-600" size={28} /> Upcoming Events
            </h3>
            <div className="space-y-6">
              {[
                { date: 'Nov 12', title: 'Global MOBA Summit', location: 'Accra, Ghana' },
                { date: 'Dec 05', title: 'London Chapter Dinner', location: 'London, UK' },
                { date: 'Jan 20', title: 'Career Fair 2026', location: 'Cape Coast, Ghana' },
              ].map((event, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between p-6 rounded-2xl glass border border-white/5 hover:border-red-600/30 transition-all group"
                >
                  <div className="flex items-center space-x-6">
                    <div className="w-14 h-14 glass border border-red-600/20 rounded-xl flex flex-col items-center justify-center neon-red">
                      <span className="text-red-600 font-mono font-black text-[10px] uppercase">{event.date.split(' ')[0]}</span>
                      <span className="text-white font-mono font-black text-lg">{event.date.split(' ')[1]}</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-red-500 transition-colors">{event.title}</h4>
                      <p className="text-[10px] text-gray-500 font-mono font-black uppercase tracking-[0.2em]">{event.location}</p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-gray-600 group-hover:text-red-600 transition-colors" />
                </motion.div>
              ))}
            </div>
            <div className="mt-10 pt-10 border-t border-white/5 text-center">
              <button className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-[0.3em] hover:text-red-500 transition-colors">
                View_All_Events_Archive
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
