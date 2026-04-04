import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, GraduationCap, Trophy, Newspaper, Users, Phone, Home, ShieldCheck, MoreHorizontal, MessageSquare } from 'lucide-react';
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
    <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight uppercase tracking-wider">
                {SCHOOL_INFO.name}
              </h1>
              <p className="text-red-500 text-[10px] sm:text-xs font-medium italic">
                {SCHOOL_INFO.motto}
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-red-500",
                  location.pathname === link.path ? "text-red-600" : "text-gray-300"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/admin"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-bold transition-all"
            >
              Admin
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-md border-t border-white/10 px-2 pb-safe">
        <div className="flex items-center justify-around h-16">
          {bottomNavLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 w-full h-full transition-colors",
                location.pathname === link.path ? "text-red-500" : "text-gray-500"
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
              isMenuOpen ? "text-red-500" : "text-gray-500"
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[48] md:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-16 left-0 right-0 z-[49] bg-zinc-900 border-t border-white/10 rounded-t-[32px] p-6 pb-12 md:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-black uppercase tracking-widest text-sm">More Options</h3>
                <button onClick={() => setIsMenuOpen(false)} className="text-gray-500">
                  <X size={24} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {moreLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 p-4 rounded-2xl transition-all",
                      location.pathname === link.path ? "bg-red-600 text-white" : "bg-white/5 text-gray-300"
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
                  className="flex items-center space-x-3 p-4 rounded-2xl bg-white/5 text-gray-300 hover:bg-white/10 transition-all"
                >
                  <MessageSquare size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">Feedback</span>
                </button>
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 p-4 rounded-2xl bg-red-600/20 text-red-500 border border-red-600/20 col-span-2"
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
    <footer className="bg-black text-white py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <h2 className="font-bold text-lg uppercase tracking-wider">{SCHOOL_INFO.name}</h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Founded in {SCHOOL_INFO.founded}, we are dedicated to excellence in education and leadership.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-red-600 uppercase tracking-widest text-sm mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/academics" className="hover:text-white transition-colors">Academics</Link></li>
              <li><Link to="/news" className="hover:text-white transition-colors">Latest News</Link></li>
              <li><Link to="/alumni" className="hover:text-white transition-colors">Alumni Portal</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-red-600 uppercase tracking-widest text-sm mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>{SCHOOL_INFO.contact.address}</li>
              <li>{SCHOOL_INFO.contact.phone}</li>
              <li>{SCHOOL_INFO.contact.email}</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-red-600 uppercase tracking-widest text-sm mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <button 
                  onClick={() => setIsFeedbackOpen(true)}
                  className="hover:text-white transition-colors flex items-center"
                >
                  Give Feedback
                </button>
              </li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Help Center</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/5 text-center text-gray-500 text-xs pb-20 md:pb-0">
          <p>&copy; {new Date().getFullYear()} {SCHOOL_INFO.name}. All rights reserved.</p>
        </div>
      </div>
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </footer>
  );
}
