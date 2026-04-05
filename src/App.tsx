import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Navbar, Footer, BottomNav } from '@/src/components/Layout';
import Home from '@/src/pages/Home';
import About from '@/src/pages/About';
import Academics from '@/src/pages/Academics';
import News from '@/src/pages/News';
import NewsDetail from '@/src/pages/NewsDetail';
import Alumni from '@/src/pages/Alumni';
import AlumniDirectory from '@/src/pages/AlumniDirectory';
import Contact from '@/src/pages/Contact';
import Admin from '@/src/pages/Admin';
import Leadership from '@/src/pages/Leadership';
import ChatBot from '@/src/components/ChatBot';

function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
        transition={{ 
          duration: 0.4, 
          ease: [0.22, 1, 0.36, 1] 
        }}
        className="min-h-[calc(100vh-80px-300px)] relative"
      >
        {/* Transition Overlay */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 1 }}
          transition={{ duration: 0.3, ease: "circIn" }}
          className="fixed inset-0 bg-red-600 z-[60] origin-top pointer-events-none opacity-20"
        />
        <motion.div
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.5, ease: "circOut", delay: 0.1 }}
          className="fixed inset-0 bg-red-600 z-[60] origin-bottom pointer-events-none opacity-20"
        />
        
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [isBooting, setIsBooting] = React.useState(true);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 2000);
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <Router>
      {/* Custom Cursor */}
      <motion.div 
        animate={{ x: mousePos.x - 16, y: mousePos.y - 16 }}
        transition={{ type: "spring", damping: 30, stiffness: 200, mass: 0.5 }}
        className="fixed top-0 left-0 w-8 h-8 border border-red-600/30 rounded-full pointer-events-none z-[9999] hidden lg:flex items-center justify-center"
      >
        <div className="w-1 h-1 bg-red-600 rounded-full" />
      </motion.div>

      <AnimatePresence>
        {isBooting && (
          <motion.div 
            key="boot"
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8"
          >
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "200px" }}
              className="h-[1px] bg-red-600 mb-4"
            />
            <div className="text-[10px] font-mono text-red-600 uppercase tracking-[0.5em] animate-pulse">
              Initializing Mfantsipim OS...
            </div>
            <div className="mt-8 grid grid-cols-1 gap-1 text-[6px] font-mono text-gray-700 uppercase tracking-widest text-center">
              <div>Loading Core Modules... OK</div>
              <div>Establishing Secure Link... OK</div>
              <div>Syncing Alumni Network... OK</div>
              <div>Calibrating HUD... OK</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-[#050505] min-h-screen text-white selection:bg-red-600 selection:text-white relative overflow-x-hidden">
        {/* Global Futuristic Background */}
        <div className="fixed inset-0 z-0 grid-bg pointer-events-none" />
        <div className="fixed inset-0 z-0 noise-bg pointer-events-none" />
        <div className="fixed inset-0 z-0 bg-gradient-to-tr from-red-900/10 via-transparent to-blue-900/10 pointer-events-none" />
        <div className="fixed inset-0 z-0 scanline pointer-events-none" />
        
        {/* Decorative HUD Elements */}
        <div className="fixed top-4 left-4 z-50 pointer-events-none opacity-20 hidden lg:block">
          <div className="flex items-center gap-2 text-[8px] font-mono tracking-widest text-red-500 uppercase">
            <span className="w-1 h-1 bg-red-600 rounded-full animate-pulse" />
            System Status: Optimal
          </div>
          <div className="text-[6px] font-mono text-gray-500 mt-1">
            LAT: 5.1053° N | LONG: 1.2464° W
          </div>
        </div>

        <div className="fixed top-4 right-4 z-50 pointer-events-none opacity-20 hidden lg:block text-right">
          <div className="text-[8px] font-mono tracking-widest text-red-500 uppercase mb-1">
            Neural_Link: Active
          </div>
          <div className="flex items-center justify-end gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <motion.div 
                key={i}
                animate={{ height: [4, 12, 4] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                className="w-[2px] bg-red-600/50"
              />
            ))}
          </div>
        </div>

        <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-10 hidden xl:block">
          <div className="flex flex-col gap-4 text-[6px] font-mono text-gray-500 uppercase vertical-text tracking-[0.5em]">
            <span>Data_Stream_v4.0</span>
            <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-red-600 to-transparent mx-auto" />
            <span>Secure_Protocol</span>
          </div>
        </div>

        <div className="fixed bottom-4 right-4 z-50 pointer-events-none opacity-20 hidden lg:block">
          <div className="text-[6px] font-mono text-gray-500 text-right">
            MFANTSIPIM_OS_V2.5.0
          </div>
          <div className="flex items-center gap-2 text-[8px] font-mono tracking-widest text-red-500 uppercase mt-1">
            <span className="w-1 h-1 bg-red-600 rounded-full animate-pulse" />
            ENCRYPTED_LINK_ESTABLISHED
          </div>
        </div>

        <div className="relative z-10">
          <Navbar />
          <PageTransition>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/academics" element={<Academics />} />
              <Route path="/leadership" element={<Leadership />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/alumni" element={<Alumni />} />
              <Route path="/alumni/directory" element={<AlumniDirectory />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admissions" element={<Contact />} />
            </Routes>
          </PageTransition>
          <Footer />
          <BottomNav />
          <ChatBot />
        </div>
      </div>
    </Router>
  );
}
