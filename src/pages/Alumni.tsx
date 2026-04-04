import React from 'react';
import { motion } from 'motion/react';
import { Users, GraduationCap, Heart, Briefcase, Globe, ArrowRight } from 'lucide-react';

export default function Alumni() {
  return (
    <div className="pt-20 pb-24">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 bg-red-600/10 border border-red-600/20 rounded-full text-red-500 text-xs font-black uppercase tracking-[0.2em] mb-6"
        >
          Old Boys Network
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-6">
          The Mfantsipim Alumni Portal
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Connecting generations of Mfantsipim graduates. Join the network of leaders shaping the world.
        </p>
      </section>

      {/* Alumni Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Active Members', value: '15,000+', icon: Users },
            { label: 'Global Chapters', value: '45', icon: Globe },
            { label: 'Endowment Fund', value: '$2M+', icon: Heart },
          ].map((stat, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center">
              <stat.icon className="mx-auto text-red-600 mb-6" size={40} />
              <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Login/Signup CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="relative rounded-[40px] overflow-hidden bg-red-600 p-12 md:p-20 text-center">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1920"
              alt="Alumni"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6">
              Join the MOBA Network
            </h2>
            <p className="text-white/80 text-lg mb-10 leading-relaxed">
              Access exclusive events, mentorship programs, and career opportunities within the Mfantsipim Old Boys Association.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-10 py-4 bg-white text-red-600 font-black uppercase tracking-widest rounded-full hover:bg-gray-100 transition-all">
                Sign In
              </button>
              <button className="w-full sm:w-auto px-10 py-4 border-2 border-white/30 text-white font-black uppercase tracking-widest rounded-full hover:bg-white/10 transition-all">
                Register
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex items-start space-x-6">
              <div className="p-4 bg-white/5 rounded-2xl">
                <Briefcase className="text-red-600" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Mentorship</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Connect with experienced alumni in your field for guidance and professional growth.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-6">
              <div className="p-4 bg-white/5 rounded-2xl">
                <GraduationCap className="text-red-600" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Scholarships</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Contribute to or apply for alumni-funded scholarships for current students.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-10 rounded-3xl bg-zinc-950 border border-white/5">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-6">Upcoming Events</h3>
            <div className="space-y-6">
              {[
                { date: 'Nov 12', title: 'Global MOBA Summit', location: 'Accra, Ghana' },
                { date: 'Dec 05', title: 'London Chapter Dinner', location: 'London, UK' },
                { date: 'Jan 20', title: 'Career Fair 2026', location: 'Cape Coast, Ghana' },
              ].map((event, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-red-600/30 transition-all group">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-600/10 rounded-xl flex flex-col items-center justify-center">
                      <span className="text-red-600 font-black text-xs">{event.date.split(' ')[0]}</span>
                      <span className="text-red-600 font-bold text-sm">{event.date.split(' ')[1]}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white group-hover:text-red-500 transition-colors">{event.title}</h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{event.location}</p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-gray-600 group-hover:text-red-600 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
