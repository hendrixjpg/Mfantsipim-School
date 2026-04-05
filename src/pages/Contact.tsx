import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare, Loader2, Lightbulb, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
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
    <div className="bg-[var(--background)] min-h-screen">
      {/* Header Section */}
      <section className="bg-[var(--muted)] pt-32 pb-20 border-b border-[var(--border)]">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 text-red-600 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Send size={14} />
            Contact Us
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-[var(--foreground)] uppercase tracking-tight mb-6">
            Get in <span className="text-red-600">Touch</span>
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed mb-10">
            Have questions? Our team is ready to assist. Reach out through any of the channels below.
          </p>
          
          <div className="flex justify-center">
            <button
              onClick={() => setIsFeedbackOpen(true)}
              className="flex items-center space-x-3 px-8 py-4 bg-[var(--card)] border border-[var(--border)] hover:border-red-600/50 rounded-2xl text-xs font-bold uppercase tracking-widest text-[var(--foreground)] transition-all shadow-sm group"
            >
              <Lightbulb size={18} className="text-red-600" />
              <span>Send Feedback</span>
            </button>
          </div>
        </div>
      </section>

      <section className="container-custom py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            {[
              { icon: MapPin, title: 'Location', value: SCHOOL_INFO.contact.address },
              { icon: Phone, title: 'Phone', value: SCHOOL_INFO.contact.phone },
              { icon: Mail, title: 'Email', value: SCHOOL_INFO.contact.email },
            ].map((info, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 card-base card-hover"
              >
                <div className="flex items-center space-x-5 mb-6">
                  <div className="w-14 h-14 bg-red-600/10 rounded-2xl flex items-center justify-center">
                    <info.icon className="text-red-600" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--foreground)] uppercase tracking-tight">{info.title}</h3>
                </div>
                <p className="text-[var(--muted-foreground)] leading-relaxed font-medium">
                  {info.value}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-10 md:p-12 card-base bg-[var(--card)]"
            >
              <div className="flex items-center space-x-5 mb-12">
                <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center">
                  <MessageSquare className="text-red-600" size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-[var(--foreground)] uppercase tracking-tight mb-2">Send Message</h2>
                  <p className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest">We'll get back to you soon</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest ml-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl px-6 py-4 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600/50 transition-all"
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest ml-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl px-6 py-4 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600/50 transition-all"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest ml-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl px-6 py-4 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600/50 transition-all"
                    placeholder="What is this about?"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest ml-1">Message</label>
                  <textarea
                    required
                    rows={6}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl px-6 py-4 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600/50 transition-all resize-none"
                    placeholder="Your message here..."
                  ></textarea>
                </div>

                <div className="flex flex-col gap-4">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center space-x-4 disabled:opacity-50 shadow-lg shadow-red-600/20"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                    <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                  </motion.button>

                  {submitStatus === 'success' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-center space-x-2 text-green-600 font-bold text-xs uppercase tracking-widest"
                    >
                      <CheckCircle2 size={16} />
                      <span>Message Sent Successfully</span>
                    </motion.div>
                  )}

                  {submitStatus === 'error' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-center space-x-2 text-red-600 font-bold text-xs uppercase tracking-widest"
                    >
                      <AlertCircle size={16} />
                      <span>Failed to send message. Please try again.</span>
                    </motion.div>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </div>
  );
}
