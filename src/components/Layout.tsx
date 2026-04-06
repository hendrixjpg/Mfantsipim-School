import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, GraduationCap, Trophy, Newspaper, Users, Phone, Home, ShieldCheck, MoreHorizontal, MessageSquare } from 'lucide-react';
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
                src="data:image/jpeg;base64,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OZ/Zj6ikiY0vMbDa1y4A6kAkkquL2tO27Xk02nw05+SOikYcGNkTPEQIxYDFcgAmwy5+SbTvtu5NqRinJWkfD4vXVLbs8AwvaSTYXbm0D3XdZOWevUnNSJp7McsxvPwe1UXfQOaQLnEB5tJDfrCRPLeHctI1GltEx6/k+lt3K1s9JTzMaGtlhie1oyDQ5gOEDha9vct741kUBAQEBAQEBAQEBAQEBAQYTfLd5u0KV1OXmNxLXxyAA4JGHE0kcRwI5ErkxvGyVLzS0Wr3hxzaXZ3tGN2dMJ7XAfTTtFwebZHMI0HNZ/AmO0vb+9qX2nJWd/hKEd0K0Fv/AC+oGC+G3cWzy4SLng369V33npPZnln2eygbl11rNoKkWcXgg017m44v0sV3wr779Ff3jpojasWjrv5d1ms3XrGtcJKKs8VrubEHkEZAjur/AGLnhXieiU6/S5KzW026+ezHVrxYwm7HnCCyQOjfhuATheAdLquKWrbeYbbarDmxeHjt1naPSdvq8NMS54JcQYw1pdh1Jde1gOTVzmjp81ngWm14mZmOXaEXEXWcbjvxhN75BpF78su8+Kn07ejLzWtMWn/30+W39lfp7OlcYwJSSD8k2SR48IaRZjTbTmuclprs7OqwYc1rc1ev1n08k6opZHNLTBUi/wD41Vzv7CVxXid9k8vEtJkpNZt+UrX7seT/ANPUubiLgz9mqSLkEH1NMybc1Lw8nop+2aLfradt99tpSKXd6pcbMoaxws4AGnlY2zyCRd4aLZc+KeHklGNfo6T0mZjr029We2L2cbQkAYYm0zLn5Soex77EkkiOInEc9CQp+BvO9pZp4tFMfh4qz59Z+LtewdltpKaGmYS5sEbIw52pwi1z5rQ8RPQEBAQEBAQEBAQEBAQEBAQEBAQEEXaOzYahhjniZKw6tka1w+BCDm+83ZVYGTZzsB400znGM/8AqkN3Rnobt8lVfFWz0NLxLNg6b7x6Sn7tdlkEYElcRVy64DcU7DybH6/m+/kFKtIr2U6nWZdRO956enk3+np2xtDWNaxo0awAAeQCmyriAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIP/9k=" 
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
                  src="data:image/jpeg;base64,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OZ/Zj6ikiY0vMbDa1y4A6kAkkquL2tO27Xk02nw05+SOikYcGNkTPEQIxYDFcgAmwy5+SbTvtu5NqRinJWkfD4vXVLbs8AwvaSTYXbm0D3XdZOWevUnNSJp7McsxvPwe1UXfQOaQLnEB5tJDfrCRPLeHctI1GltEx6/k+lt3K1s9JTzMaGtlhie1oyDQ5gOEDha9vct741kUBAQEBAQEBAQEBAQEBAQYTfLd5u0KV1OXmNxLXxyAA4JGHE0kcRwI5ErkxvGyVLzS0Wr3hxzaXZ3tGN2dMJ7XAfTTtFwebZHMI0HNZ/AmO0vb+9qX2nJWd/hKEd0K0Fv/AC+oGC+G3cWzy4SLng369V33npPZnln2eygbl11rNoKkWcXgg017m44v0sV3wr779Ff3jpojasWjrv5d1ms3XrGtcJKKs8VrubEHkEZAjur/AGLnhXieiU6/S5KzW026+ezHVrxYwm7HnCCyQOjfhuATheAdLquKWrbeYbbarDmxeHjt1naPSdvq8NMS54JcQYw1pdh1Jde1gOTVzmjp81ngWm14mZmOXaEXEXWcbjvxhN75BpF78su8+Kn07ejLzWtMWn/30+W39lfp7OlcYwJSSD8k2SR48IaRZjTbTmuclprs7OqwYc1rc1ev1n08k6opZHNLTBUi/wD41Vzv7CVxXid9k8vEtJkpNZt+UrX7seT/ANPUubiLgz9mqSLkEH1NMybc1Lw8nop+2aLfradt99tpSKXd6pcbMoaxws4AGnlY2zyCRd4aLZc+KeHklGNfo6T0mZjr029We2L2cbQkAYYm0zLn5Soex77EkkiOInEc9CQp+BvO9pZp4tFMfh4qz59Z+LtewdltpKaGmYS5sEbIw52pwi1z5rQ8RPQEBAQEBAQEBAQEBAQEBAQEBAQEEXaOzYahhjniZKw6tka1w+BCDm+83ZVYGTZzsB400znGM/8AqkN3Rnobt8lVfFWz0NLxLNg6b7x6Sn7tdlkEYElcRVy64DcU7DybH6/m+/kFKtIr2U6nWZdRO956enk3+np2xtDWNaxo0awAAeQCmyriAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIP/9k=" 
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
