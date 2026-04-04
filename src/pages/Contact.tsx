import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare, Loader2, Lightbulb } from 'lucide-react';
import { SCHOOL_INFO } from '@/src/constants';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/src/firebase';
import FeedbackModal from '@/src/components/FeedbackModal';

export default function Contact() {
  const [formState, setFormState] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'contacts'), {
        ...formState,
        date: new Date().toISOString(),
        status: 'new'
      });
      alert('Thank you for your message. We will get back to you soon!');
      setFormState({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error("Contact form error:", error);
      alert('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-20 pb-24">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-red-600/10 border border-red-600/20 rounded-full text-red-500 text-xs font-black uppercase tracking-[0.2em] mb-6"
          >
            Get In Touch
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed mb-8">
            Have questions? We're here to help. Reach out to us through any of the channels below.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => setIsFeedbackOpen(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-white/5 border border-white/10 hover:border-red-600/50 rounded-full text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-all"
            >
              <Lightbulb size={18} className="text-red-600" />
              <span>Give Website Feedback</span>
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-red-600 rounded-xl">
                  <MapPin className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Location</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                {SCHOOL_INFO.contact.address}
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-red-600 rounded-xl">
                  <Phone className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Phone</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                {SCHOOL_INFO.contact.phone}
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-red-600 rounded-xl">
                  <Mail className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Email</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                {SCHOOL_INFO.contact.email}
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="p-10 rounded-3xl bg-white/5 border border-white/10">
              <div className="flex items-center space-x-4 mb-8">
                <MessageSquare className="text-red-600" size={32} />
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Send a Message</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-red-600 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-red-600 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Subject</label>
                  <input
                    type="text"
                    required
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-red-600 transition-colors"
                    placeholder="Admissions Inquiry"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Message</label>
                  <textarea
                    required
                    rows={6}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-red-600 transition-colors resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                  <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </div>
  );
}
