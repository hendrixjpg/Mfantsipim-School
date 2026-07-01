import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Navbar, Footer, BottomNav } from '@/src/components/Layout';
import Home from '@/src/pages/Home';
import About from '@/src/pages/About';
import Academics from '@/src/pages/Academics';
import Gallery from '@/src/pages/Gallery';
import News from '@/src/pages/News';
import NewsDetail from '@/src/pages/NewsDetail';
import Alumni from '@/src/pages/Alumni';
import AlumniDirectory from '@/src/pages/AlumniDirectory';
import Contact from '@/src/pages/Contact';
import Leadership from '@/src/pages/Leadership';
import Login from '@/src/components/Login';
import { debugFirebase } from '@/src/services/firebaseDebug';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ 
          duration: 0.3, 
          ease: "easeInOut" 
        }}
        className="min-h-[calc(100vh-80px-300px)] relative"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  useEffect(() => {
    // Run debug in development/preview builds
    if ((import.meta as any).env?.DEV) {
      const debugInfo = debugFirebase();
      console.log('🔧 Firebase Debug Info:', debugInfo);
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-red-600 selection:text-white relative overflow-x-hidden transition-colors duration-300">
        <Navbar />
        <main className="relative z-10">
          <PageTransition>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/academics" element={<Academics />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/leadership" element={<Leadership />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/alumni" element={<Alumni />} />
              <Route path="/alumni/directory" element={<AlumniDirectory />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admissions" element={<Contact />} />
            </Routes>
          </PageTransition>
        </main>
        <Footer />
        <BottomNav />
        <Analytics />
        <SpeedInsights />
      </div>
    </Router>
  );
}
