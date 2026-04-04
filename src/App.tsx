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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="min-h-[calc(100vh-80px-300px)]"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <div className="bg-black min-h-screen text-white selection:bg-red-600 selection:text-white">
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
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admissions" element={<Contact />} />
          </Routes>
        </PageTransition>
        <Footer />
        <BottomNav />
        <ChatBot />
      </div>
    </Router>
  );
}
