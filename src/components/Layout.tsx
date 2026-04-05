import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, GraduationCap, Trophy, Newspaper, Users, Phone, Home, ShieldCheck, MoreHorizontal, MessageSquare, ExternalLink } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { SCHOOL_INFO } from '@/src/constants';
import FeedbackModal from '@/src/components/FeedbackModal';

const navLinks = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'About', path: '/about', icon: GraduationCap },
  { name: 'Academics', path: '/academics', icon: ShieldCheck },
  { name: 'Leadership', path: '/leadership', icon: Users },
  { name: 'News', path: '/news', icon: Newspaper },
  { name: 'Alumni', path: '/alumni', icon: Users },
  { name: 'Contact', path: '/contact', icon: Phone },
];

const bottomNavLinks = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Academics', path: '/academics', icon: ShieldCheck },
  { name: 'Leadership', path: '/leadership', icon: Users },
  { name: 'News', path: '/news', icon: Newspaper },
];

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-110">
              <img 
                src="https://upload.wikimedia.org/wikipedia/en/3/3d/Mfantsipim_School_Crest.png" 
                alt="Mfantsipim School Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-[var(--foreground)] font-black text-lg leading-none uppercase tracking-tight">
                {SCHOOL_INFO.name}
              </h1>
              <p className="text-red-600 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                {SCHOOL_INFO.motto}
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                  location.pathname === link.path 
                    ? "bg-red-600 text-white shadow-md shadow-red-600/10" 
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="w-[1px] h-6 bg-[var(--border)] mx-4" />
            <Link
              to="/admin"
              className="flex items-center gap-2 px-5 py-2.5 bg-[var(--muted)] text-[var(--foreground)] rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[var(--border)] transition-all"
            >
              <ShieldCheck size={14} className="text-red-600" />
              Portal
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function BottomNav() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = React.useState(false);
  const location = useLocation();

  const moreLinks = navLinks.filter(link => !bottomNavLinks.find(b => b.path === link.path));

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--background)]/95 backdrop-blur-md border-t border-[var(--border)] px-2 pb-safe">
        <div className="flex items-center justify-around h-16">
          {bottomNavLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 w-full h-full transition-colors",
                location.pathname === link.path ? "text-red-600" : "text-[var(--muted-foreground)]"
              )}
            >
              <link.icon size={20} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">{link.name}</span>
            </Link>
          ))}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn(
              "flex flex-col items-center justify-center space-y-1 w-full h-full transition-colors",
              isMenuOpen ? "text-red-600" : "text-[var(--muted-foreground)]"
            )}
          >
            <MoreHorizontal size={20} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Menu</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[48] md:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-16 left-0 right-0 z-[49] bg-[var(--background)] border-t border-[var(--border)] rounded-t-3xl p-6 pb-12 md:hidden shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[var(--foreground)] font-bold uppercase tracking-widest text-sm">Navigation</h3>
                <button onClick={() => setIsMenuOpen(false)} className="text-[var(--muted-foreground)] p-2">
                  <X size={24} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {moreLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 p-4 rounded-xl transition-all",
                      location.pathname === link.path ? "bg-red-600 text-white" : "bg-[var(--muted)] text-[var(--foreground)]"
                    )}
                  >
                    <link.icon size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">{link.name}</span>
                  </Link>
                ))}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsFeedbackOpen(true);
                  }}
                  className="flex items-center space-x-3 p-4 rounded-xl bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--border)] transition-all"
                >
                  <MessageSquare size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">Feedback</span>
                </button>
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 p-4 rounded-xl bg-red-600/10 text-red-600 border border-red-600/20 col-span-2"
                >
                  <ShieldCheck size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">Admin Portal</span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </>
  );
}

export function Footer() {
  const [isFeedbackOpen, setIsFeedbackOpen] = React.useState(false);

  return (
    <footer className="bg-[var(--muted)] text-[var(--foreground)] py-20 relative overflow-hidden border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/en/3/3d/Mfantsipim_School_Crest.png" 
                  alt="Mfantsipim School Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h2 className="font-black text-xl uppercase tracking-tight">{SCHOOL_INFO.name}</h2>
            </div>
            <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
              Founded in {SCHOOL_INFO.founded}, Mfantsipim remains the gold standard of education and character development in Ghana.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-red-600 uppercase tracking-widest text-xs mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm text-[var(--muted-foreground)] font-semibold uppercase tracking-wider">
              <li><Link to="/about" className="hover:text-red-600 transition-colors">Heritage</Link></li>
              <li><Link to="/academics" className="hover:text-red-600 transition-colors">Excellence</Link></li>
              <li><Link to="/news" className="hover:text-red-600 transition-colors">Updates</Link></li>
              <li><Link to="/alumni" className="hover:text-red-600 transition-colors">Network</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-red-600 uppercase tracking-widest text-xs mb-6">Contact</h3>
            <ul className="space-y-3 text-sm text-[var(--muted-foreground)]">
              <li>{SCHOOL_INFO.contact.address}</li>
              <li>{SCHOOL_INFO.contact.phone}</li>
              <li>{SCHOOL_INFO.contact.email}</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-red-600 uppercase tracking-widest text-xs mb-6">Support</h3>
            <ul className="space-y-3 text-sm text-[var(--muted-foreground)] font-semibold uppercase tracking-wider">
              <li>
                <button 
                  onClick={() => setIsFeedbackOpen(true)}
                  className="hover:text-red-600 transition-colors flex items-center"
                >
                  Portal Feedback
                </button>
              </li>
              <li><Link to="/contact" className="hover:text-red-600 transition-colors">Help Center</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-20 pt-10 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-6 text-[var(--muted-foreground)] text-[10px] font-bold uppercase tracking-widest pb-24 md:pb-0">
          <p>&copy; {new Date().getFullYear()} {SCHOOL_INFO.name}. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <span className="hover:text-red-600 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-red-600 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </footer>
  );
}
