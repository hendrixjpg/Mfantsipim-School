import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare, Loader2, Lightbulb, Globe, ShieldCheck, Zap } from 'lucide-react';
import { SCHOOL_INFO } from '@/src/constants';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/src/firebase';
import FeedbackModal from '@/src/components/FeedbackModal';
import { cn } from '@/src/lib/utils';

export default function Contact() {
  const [formState, setFormState] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      await addDoc(collection(db, 'contacts'), {
        ...formState,
        date: new Date().toISOString(),
        status: 'new'
      });
      setSubmitStatus('success');
      setFormState({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error("Contact form error:", error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-20 pb-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.05)_0%,transparent_70%)] -z-10" />
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 glass border border-red-600/20 rounded-full text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8"
        >
          Communication_Channel // Uplink_Established
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-none">
          Establish <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">Contact</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium mb-12">
          Have questions? Our neural network is ready to assist. Reach out through any of the <span className="text-white">secure protocols</span> below.
        </p>
        
        <div className="flex justify-center">
          <button
            onClick={() => setIsFeedbackOpen(true)}
            className="flex items-center space-x-3 px-8 py-4 glass border border-white/10 hover:border-red-600/50 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-all neon-red-hover group"
          >
            <Lightbulb size={18} className="text-red-600 group-hover:animate-pulse" />
            <span>Transmit_Feedback</span>
          </button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            {[
              { icon: MapPin, title: 'Location', value: SCHOOL_INFO.contact.address, code: 'LOC_COORD' },
              { icon: Phone, title: 'Phone', value: SCHOOL_INFO.contact.phone, code: 'VOICE_COM' },
              { icon: Mail, title: 'Email', value: SCHOOL_INFO.contact.email, code: 'DATA_LINK' },
            ].map((info, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ x: 10 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-[32px] glass glass-hover border border-white/10 relative group"
              >
                <div className="absolute top-6 right-6 text-[9px] font-mono text-gray-600 uppercase tracking-widest">{info.code}</div>
                <div className="flex items-center space-x-5 mb-6">
                  <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/10 group-hover:neon-red transition-all">
                    <info.icon className="text-red-600" size={24} />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">{info.title}</h3>
                </div>
                <p className="text-gray-400 leading-relaxed font-medium font-mono text-sm">
                  {info.value}
                </p>
                <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">Active_Protocol</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-12 rounded-[40px] glass border border-white/10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                <Globe size={200} className="text-red-600" />
              </div>
              
              <div className="flex items-center space-x-5 mb-12">
                <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center neon-red">
                  <MessageSquare className="text-red-600" size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-2">Send_Message</h2>
                  <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em]">Encrypted_Transmission_Mode</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Subject_Identity</label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full glass border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-red-600/50 transition-all font-medium placeholder:text-gray-700"
                      placeholder="ENTER_NAME"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Return_Address</label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full glass border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-red-600/50 transition-all font-medium placeholder:text-gray-700"
                      placeholder="EMAIL@DOMAIN.COM"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Transmission_Header</label>
                  <input
                    type="text"
                    required
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    className="w-full glass border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-red-600/50 transition-all font-medium placeholder:text-gray-700"
                    placeholder="SUBJECT_TOPIC"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Data_Payload</label>
                  <textarea
                    required
                    rows={6}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full glass border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-red-600/50 transition-all font-medium placeholder:text-gray-700 resize-none"
                    placeholder="MESSAGE_CONTENT..."
                  ></textarea>
                </div>

                <div className="flex flex-col gap-4">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-[0.3em] rounded-2xl transition-all flex items-center justify-center space-x-4 disabled:opacity-50 neon-red-hover glitch-hover text-[11px]"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                    <span>{isSubmitting ? "TRANSMITTING..." : "INITIATE_UPLINK"}</span>
                  </motion.button>

                  {submitStatus === 'success' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-center space-x-2 text-green-500 font-mono text-[10px] uppercase tracking-widest"
                    >
                      <ShieldCheck size={16} />
                      <span>Transmission_Successful // Data_Logged</span>
                    </motion.div>
                  )}

                  {submitStatus === 'error' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-center space-x-2 text-red-500 font-mono text-[10px] uppercase tracking-widest"
                    >
                      <span>Transmission_Failed // Retry_Protocol</span>
                    </motion.div>
                  )}
                </div>
              </form>

              {/* HUD corners */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-red-600/20 rounded-tl-[40px]" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-red-600/20 rounded-br-[40px]" />
            </motion.div>
          </div>
        </div>
      </section>
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </div>
  );
}
