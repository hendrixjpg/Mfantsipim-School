import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, MessageSquare, Bug, Lightbulb, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/src/firebase';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [type, setType] = React.useState<'suggestion' | 'bug'>('suggestion');
  const [message, setMessage] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'feedback'), {
        type,
        message,
        email: email || 'anonymous',
        date: new Date().toISOString(),
        status: 'new'
      });
      alert('Thank you for your feedback! We appreciate your input.');
      setMessage('');
      setEmail('');
      onClose();
    } catch (error) {
      console.error('Feedback error:', error);
      alert('Failed to send feedback. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg bg-zinc-950 border border-white/10 rounded-[32px] shadow-2xl z-[111] overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-600 rounded-xl">
                    <MessageSquare size={20} className="text-white" />
                  </div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">User Feedback</h2>
                </div>
                <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setType('suggestion')}
                    className={cn(
                      "flex items-center justify-center space-x-2 p-4 rounded-2xl border transition-all",
                      type === 'suggestion'
                        ? "bg-red-600 border-red-600 text-white"
                        : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                    )}
                  >
                    <Lightbulb size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Suggestion</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('bug')}
                    className={cn(
                      "flex items-center justify-center space-x-2 p-4 rounded-2xl border transition-all",
                      type === 'bug'
                        ? "bg-red-600 border-red-600 text-white"
                        : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                    )}
                  >
                    <Bug size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Bug Report</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Your Email (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Your Message</label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={type === 'suggestion' ? "Tell us how we can improve..." : "Describe the bug you found..."}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 text-sm text-white focus:outline-none focus:border-red-600 transition-colors resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                  <span>{isSubmitting ? "Sending..." : "Submit Feedback"}</span>
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
