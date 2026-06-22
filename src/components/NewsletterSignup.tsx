import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Sparkles, Shield, Cpu, RefreshCw, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '@/src/firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function NewsletterSignup() {
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [subscriberId, setSubscriberId] = React.useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Strict client side regex validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      setStatus('error');
      setErrorMessage('MALFORMED_EMAIL_PROTOCOL // INVALID_SIGNATURE');
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const path = 'newsletter_subscribers';
      const docRef = await addDoc(collection(db, path), {
        email: email.trim().toLowerCase(),
        subscribedAt: new Date().toISOString(),
        source: 'home_newsletter_section',
        active: true
      }).catch(err => {
        handleFirestoreError(err, OperationType.WRITE, path);
        throw err;
      });

      setSubscriberId(docRef.id);
      setStatus('success');
      setEmail('');
    } catch (err: any) {
      console.error('Newsletter subscription error:', err);
      setStatus('error');
      try {
        const parsed = JSON.parse(err.message);
        setErrorMessage(parsed.error || 'TRANSMISSION_FAILED // SIGNAL_INTERRUPTED');
      } catch {
        setErrorMessage(err.message || 'TRANSMISSION_FAILED // SIGNAL_INTERRUPTED');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative py-24 overflow-hidden bg-zinc-950 text-white border-y border-zinc-900">
      {/* Dynamic Cyber Pattern Grid Underlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-zinc-800/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Main Futuristic Card Outer */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative p-8 md:p-14 rounded-[36px] bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md overflow-hidden shadow-2xl "
          >
            {/* Retro-futuristic Wireframe Corners */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-red-600/40 rounded-tl-[36px]" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-red-600/40 rounded-br-[36px]" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-zinc-700 rounded-tr-[36px]" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-zinc-700 rounded-bl-[36px]" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Column: Visual copy & status tags */}
              <div className="lg:col-span-6 text-left space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-600/20 rounded-full text-[10px] font-black uppercase tracking-[0.25em] text-red-500 mb-6">
                    <Cpu size={12} className="animate-pulse" />
                    SUB_LINK_ACTIVE // EST_1876
                  </div>
                  
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-none mb-4">
                    Think & <br />
                    <span className="text-red-500">Look Ahead</span>
                  </h2>
                  <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-medium">
                    Subscribe to the Kwabotwe Intelligence Brief. Receive cutting-edge school updates, alumni success dispatches, and achievements streams direct from Cape Coast.
                  </p>
                </div>

                {/* Cybernetic Telemetry stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800/60">
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">TRANSMISSION_BAND</span>
                    <span className="text-xs font-mono text-zinc-300">SECURE_SSL // 256B</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">DISPATCH_FREQ</span>
                    <span className="text-xs font-mono text-zinc-300">BI_WEEKLY // UPDATES</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interaction form or Success screen */}
              <div className="lg:col-span-6">
                <AnimatePresence mode="wait">
                  {status === 'success' ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center text-center space-y-4"
                    >
                      <div className="w-16 h-16 bg-red-600/10 border border-red-600/30 text-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-600/5">
                        <CheckCircle2 size={32} />
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-black uppercase tracking-wider text-white">ACCESS_GRANTED</h3>
                        <p className="text-zinc-400 text-xs mt-1">
                          Transmission successfully synced with the Kwabotwe stream.
                        </p>
                      </div>

                      <div className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-2 text-left">
                        <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                          <span>LINK_STATUS:</span>
                          <span className="text-emerald-500 font-bold">ESTABLISHED</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                          <span>SUBSCRIBER_ID:</span>
                          <span className="text-zinc-300 truncate max-w-[160px]">{subscriberId}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setStatus('idle')}
                        className="text-xs uppercase tracking-widest font-black text-zinc-400 hover:text-red-500 transition-colors flex items-center gap-1.5"
                      >
                        <RefreshCw size={12} /> Sync Another Terminal
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleSubscribe}
                      className="space-y-4 text-left"
                    >
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.25em] block ml-2">
                          ENTER_TERMINAL_EMAIL
                        </label>
                        <div className="relative group">
                          <input
                            type="email"
                            required
                            disabled={isSubmitting}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="recipient@domain.com"
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-zinc-950 border border-zinc-850 hover:border-zinc-700 focus:border-red-600 focus:outline-none text-zinc-100 font-medium transition-all shadow-inner focus:ring-1 focus:ring-red-600/30 text-sm"
                          />
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-500 transition-colors">
                            <Mail size={18} />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-[0.2em] text-[11px] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg shadow-red-600/10 group active:scale-98"
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="animate-spin" size={16} />
                            <span>TRANSMITTING_STREAMS...</span>
                          </>
                        ) : (
                          <>
                            <span>INITIATE_SUBSCRIPTION</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>

                      {status === 'error' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3.5 rounded-xl bg-red-950/30 border border-red-900/40 text-red-400 text-[11px] font-mono flex items-start gap-2.5"
                        >
                          <AlertTriangle size={15} className="flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">SYSTEM_ERROR:</span> {errorMessage}
                          </div>
                        </motion.div>
                      )}

                      <p className="text-[10px] text-zinc-500 leading-normal text-center mt-2">
                        By dispatching, you establish a real-time communications channel. Zero cookie-jacking. One-click opt-out available in every dispatch.
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>

            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
