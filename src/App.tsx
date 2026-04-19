import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, signInWithGoogle, logout } from './lib/firebase';
import { Terminal, User, BookOpen, FlaskConical, Mail, Layout as LayoutIcon, LogOut, LogIn, Github, Linkedin, ExternalLink, Menu, X, ChevronRight, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from './lib/utils';

// Pages
import Home from './pages/Home';
import Admin from './pages/Admin';
import BlogDetail from './pages/BlogDetail';

export default function App() {
  const [user, loading] = useAuthState(auth);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'RESEARCH', path: '/#research' },
    { name: 'BLOG', path: '/#blog' },
    { name: 'CONTACT', path: '/#contact' },
  ];

  if (loading) return null;

  const isAdmin = user?.email === 'designmingle.dm@gmail.com';

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="font-display font-bold text-2xl tracking-tighter hover:opacity-70 transition-opacity">
            STUDENT.PORTFOLIO
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-12">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className="text-xs font-bold tracking-[0.2em] hover:text-gray-500 transition-colors"
              >
                {link.name}
              </a>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-xs font-bold tracking-[0.2em] border border-black px-4 py-2 hover:bg-black hover:text-white transition-all flex items-center gap-2"
              >
                <LayoutIcon size={14} /> CMS
              </Link>
            )}
            {!user ? (
               <button 
                onClick={signInWithGoogle}
                className="text-[10px] font-bold tracking-[0.1em] opacity-40 hover:opacity-100 transition-opacity flex items-center gap-1"
               >
                 <LogIn size={12} /> AUTH
               </button>
            ) : (
                <button 
                onClick={logout}
                className="text-[10px] font-bold tracking-[0.1em] opacity-40 hover:opacity-100 transition-opacity flex items-center gap-1"
               >
                 <LogOut size={12} /> EXIT
               </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 left-0 right-0 bg-white border-b border-black md:hidden p-6 space-y-6"
            >
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  className="block text-xl font-display font-bold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              {isAdmin && (
                <Link to="/admin" className="block text-xl font-display font-bold text-gray-500">
                  CMS
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow pt-20">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          <div>
            <h2 className="font-display font-bold text-4xl mb-2 tracking-tighter">LET'S CONNECT.</h2>
            <p className="text-gray-400 max-w-md">Driven by curiosity, research, and technical precision. Ready for the next big challenge.</p>
          </div>
          <div className="flex flex-col gap-4 text-xs font-bold tracking-[0.2em]">
            <a href="#" className="hover:text-gray-400 transition-colors flex items-center gap-2">
              <Linkedin size={16} /> LINKEDIN
            </a>
            <a href="#" className="hover:text-gray-400 transition-colors flex items-center gap-2">
              <Github size={16} /> GITHUB
            </a>
            <a href="mailto:designmingle.dm@gmail.com" className="hover:text-gray-400 transition-colors flex items-center gap-2">
              <Mail size={16} /> EMAIL
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-20 mt-20 border-t border-white/10 flex flex-col md:flex-row justify-between text-[10px] tracking-[0.3em] font-bold text-gray-600">
          <p>© 2026 UNIVERSITY STUDENT PORTFOLIO</p>
          <p>BUILT WITH PRECISION & SHARP EDGES</p>
        </div>
      </footer>
    </div>
  );
}
