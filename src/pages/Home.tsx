import { motion } from 'motion/react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ChevronRight, FlaskConical, BookOpen, Terminal, Mail, Download, ArrowUpRight, Github, Linkedin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Research, Blog, Hobby, Profile } from '../types';
import { cn } from '../lib/utils';
import { useState } from 'react';

export default function Home() {
  const [researchSnap] = useCollection(query(collection(db, 'research'), orderBy('date', 'desc'), limit(3)));
  const [blogsSnap] = useCollection(query(collection(db, 'blogs'), orderBy('date', 'desc'), limit(3)));
  const [hobbiesSnap] = useCollection(collection(db, 'hobbies'));

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        timestamp: serverTimestamp()
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const researchItems = researchSnap?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Research)) || [];
  const blogItems = blogsSnap?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Blog)) || [];
  const hobbies = hobbiesSnap?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Hobby)) || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="min-h-[90vh] flex flex-col justify-center px-6 max-w-7xl mx-auto py-20">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-bold tracking-[0.5em] text-gray-400 block mb-6">UNIVERSITY STUDENT & RESEARCHER</span>
          <h1 className="font-display font-bold text-[clamp(3.5rem,10vw,8rem)] leading-[0.85] tracking-tighter mb-8">
            CRAFTING <br />
            <span className="text-gray-300">SYSTEMS</span> <br />
            OF WISDOM.
          </h1>
          <div className="flex flex-col md:flex-row md:items-end gap-10">
             <p className="text-xl max-w-md leading-relaxed text-gray-600 font-light">
              Explaining the complex through code and research. Focused on bridging the gap between theory and high-performance implementation.
            </p>
            <div className="flex gap-4">
              <a href="#contact" className="bg-black text-white px-8 py-4 font-bold text-sm tracking-widest hover:bg-gray-800 transition-colors uppercase">
                Get in touch
              </a>
              <a href="#" className="border border-black px-8 py-4 font-bold text-sm tracking-widest hover:bg-black hover:text-white transition-all uppercase flex items-center gap-2">
                Download CV <Download size={16} />
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats/Highlight Bar - Dark Mode Section */}
      <section className="bg-black text-white py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-20">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
            className="space-y-4"
          >
            <div className="w-12 h-1 bg-white" />
            <h3 className="font-display font-bold text-4xl tracking-tighter italic">RESEARCH-LED.</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Applying academic rigour to real-world problems. Focused on scalable architectures and data-driven insights.
            </p>
          </motion.div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
            className="space-y-4"
          >
            <div className="w-12 h-1 bg-white" />
            <h3 className="font-display font-bold text-4xl tracking-tighter italic">CODE-FIRST.</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Writing clean, efficient, and maintainable TypeScript and Rust. Building tools that empower others to do better work.
            </p>
          </motion.div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
            className="space-y-4"
          >
            <div className="w-12 h-1 bg-white" />
            <h3 className="font-display font-bold text-4xl tracking-tighter italic">FUTURE-READY.</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Constantly evolving. Staying ahead of the curve in AI, cloud systems, and human-computer interaction.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Research Highlights Section */}
      <section id="research" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
           <h2 className="font-display font-bold text-[clamp(2.5rem,6vw,5rem)] leading-none tracking-tighter">RESEARCH <br /> HIGHLIGHTS_</h2>
           <p className="text-gray-400 max-w-xs text-xs font-bold tracking-[0.2em] uppercase">SELECTED WORKS & ACADEMIC CONTRIBUTIONS</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {researchItems.length > 0 ? researchItems.map((item, idx) => (
            <motion.div 
              key={item.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={itemVariants}
              className={cn("group border border-black p-10 flex flex-col justify-between min-h-[400px] hover:bg-black hover:text-white transition-all cursor-pointer", idx % 3 === 0 && "md:col-span-2")}
            >
              <div>
                <div className="flex justify-between items-start mb-10">
                  <span className="font-mono text-xs opacity-40">0{idx + 1}</span>
                  <FlaskConical size={24} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-display font-bold text-4xl mb-6 tracking-tighter leading-tight">{item.title}</h3>
                <p className="text-gray-500 group-hover:text-gray-400 text-lg line-clamp-3 mb-10">{item.description}</p>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-xs font-bold tracking-widest">{item.date}</span>
                 <ArrowUpRight size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </motion.div>
          )) : (
             <div className="col-span-2 border border-black border-dashed p-20 text-center">
                <p className="text-gray-400 font-bold tracking-widest">NO RESEARCH HIGHLIGHTS FOUND. ADD SOME IN THE CMS.</p>
             </div>
          )}
        </div>
      </section>

      {/* Hobbies Section - Dark Background */}
      <section className="bg-neutral-900 text-white py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="font-display font-bold text-6xl tracking-tighter mb-4">BEYOND THE LAB_</h2>
            <p className="text-neutral-500 tracking-[0.3em] font-bold text-xs uppercase">WHAT KEEPS ME INSPIRED</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {hobbies.length > 0 ? hobbies.map((hobby, idx) => (
              <motion.div 
                key={hobby.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="aspect-square border border-neutral-800 flex flex-col items-center justify-center gap-4 hover:bg-white hover:text-black transition-all group"
              >
                 <div className="w-12 h-12 flex items-center justify-center opacity-40 group-hover:opacity-100">
                    <Terminal size={32} />
                 </div>
                 <span className="text-xs font-bold tracking-widest uppercase">{hobby.name}</span>
              </motion.div>
            )) : (
              [1,2,3,4].map(i => (
                <div key={i} className="aspect-square border border-neutral-800 flex flex-col items-center justify-center gap-4 opacity-10">
                   <Terminal size={32} />
                   <span className="text-xs font-bold tracking-widest uppercase">HOBBY {i}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-32 px-6 max-w-7xl mx-auto">
         <div className="flex justify-between items-end mb-20">
           <h2 className="font-display font-bold text-[clamp(2.5rem,6vw,5rem)] tracking-tighter">THE BLOG_</h2>
           <Link to="/#blog" className="text-xs font-bold tracking-widest border-b border-black pb-1 hover:opacity-50 transition-opacity">VIEW ALL POStS</Link>
        </div>

        <div className="space-y-0">
          {blogItems.length > 0 ? blogItems.map((blog, idx) => (
            <motion.div 
              key={blog.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={itemVariants}
              className="group border-t border-black last:border-b py-12 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:bg-neutral-50 transition-colors cursor-pointer px-4"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-20">
                <span className="text-xs font-bold text-gray-400 tracking-widest md:w-32 uppercase">{blog.date}</span>
                <h3 className="font-display font-bold text-3xl md:text-5xl tracking-tighter group-hover:translate-x-4 transition-transform">{blog.title}</h3>
              </div>
              <ChevronRight size={32} className="opacity-0 group-hover:opacity-100 transition-opacity hidden md:block" />
            </motion.div>
          )) : (
             <div className="border border-black border-dashed p-10 text-center">
                <p className="text-gray-400 font-bold tracking-widest uppercase">YOUR THOUGHTS GO HERE... START WRITING IN THE CMS.</p>
             </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 bg-black text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20">
          <div>
            <h2 className="font-display font-bold text-6xl tracking-tighter mb-8 leading-none">READY FOR <br /> COLLABORATION?</h2>
            <p className="text-neutral-400 text-lg mb-12 max-w-md">Currently looking for opportunities in computer science research and high-performance software engineering.</p>
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-white/20 flex items-center justify-center">
                     <Mail size={16} />
                  </div>
                  <span className="font-bold tracking-widest uppercase text-sm">designmingle.dm@gmail.com</span>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-white/20 flex items-center justify-center">
                     <Github size={16} />
                  </div>
                  <span className="font-bold tracking-widest uppercase text-sm">github.com/designmingle</span>
               </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {submitted ? (
              <div className="border border-white p-10 text-center">
                 <p className="font-display font-bold text-4xl tracking-tighter">MESSAGE SENT.</p>
                 <button type="button" onClick={() => setSubmitted(false)} className="mt-6 text-xs font-bold tracking-widest border-b border-white pb-1">SEND ANOTHER</button>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-[0.3em] text-neutral-500 uppercase">FULL NAME</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-transparent border-b border-white/20 py-4 focus:border-white transition-colors outline-none text-2xl" 
                    placeholder="JOHN DOE" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value.toUpperCase()})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-[0.3em] text-neutral-500 uppercase">EMAIL ADDRESS</label>
                  <input 
                    required
                    type="email" 
                    className="w-full bg-transparent border-b border-white/20 py-4 focus:border-white transition-colors outline-none text-2xl" 
                    placeholder="JOHN@DOE.COM" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-[0.3em] text-neutral-500 uppercase">MESSAGE</label>
                  <textarea 
                    required
                    rows={4} 
                    className="w-full bg-transparent border-b border-white/20 py-4 focus:border-white transition-colors outline-none text-2xl resize-none" 
                    placeholder="DESCRIBE YOUR PROJECT" 
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  />
                </div>
                <button 
                  disabled={submitting}
                  className="bg-white text-black px-12 py-6 font-bold tracking-[0.2em] hover:bg-neutral-200 transition-colors uppercase w-full disabled:opacity-50"
                >
                  {submitting ? 'SENDING...' : 'SEND MESSAGE'}
                </button>
              </>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
