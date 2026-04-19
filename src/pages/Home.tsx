import { motion } from 'motion/react';
import { useCollection, useDocumentData } from 'react-firebase-hooks/firestore';
import { collection, query, orderBy, limit, addDoc, serverTimestamp, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ChevronRight, FlaskConical, BookOpen, Terminal, Mail, Download, ArrowUpRight, Github, Linkedin, ExternalLink, GraduationCap, Cpu, Rocket, ChevronDown, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Research, Blog, Hobby, Profile, TickerImage } from '../types';
import { cn, formatImageUrl, formatDownloadUrl } from '../lib/utils';
import { useState } from 'react';

export default function Home() {
  const [researchSnap] = useCollection(query(collection(db, 'research'), orderBy('date', 'desc'), limit(3)));
  const [blogsSnap] = useCollection(query(collection(db, 'blogs'), orderBy('date', 'desc'), limit(3)));
  const [hobbiesSnap] = useCollection(collection(db, 'hobbies'));
  const [tickerSnap] = useCollection(collection(db, 'ticker'));
  
  const [profile] = useDocumentData(doc(db, 'profiles', 'default'));

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
  const tickerItems = tickerSnap?.docs.map(doc => ({ id: doc.id, ...doc.data() } as TickerImage)) || [];

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center px-6 max-w-7xl mx-auto py-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
               className="lg:col-span-7"
            >
              <h1 className="font-display font-bold text-[clamp(4rem,10vw,10rem)] leading-[0.85] tracking-tighter mb-4 text-black uppercase">
                HEY, I AM <br />
                <span className="text-gray-300">SABBIR_</span>
              </h1>
              <h2 className="text-3xl md:text-5xl font-display font-light tracking-tight text-gray-500 mb-12 italic uppercase leading-tight">
                I love Econometric analysis.
              </h2>
              
              <div className="flex flex-wrap gap-4 mt-6">
                <a href="#contact" className="bg-black text-white px-10 py-5 font-bold text-xs tracking-[0.3em] hover:bg-neutral-800 transition-all uppercase flex items-center gap-2">
                  Get in touch <ChevronRight size={16} />
                </a>
                <a 
                  href={formatDownloadUrl(profile?.cvUrl) || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="border border-black px-10 py-5 font-bold text-xs tracking-[0.3em] hover:bg-black hover:text-white transition-all uppercase flex items-center gap-2"
                >
                  Download CV <Download size={16} />
                </a>
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 1, delay: 0.2 }}
               className="lg:col-span-5 relative"
            >
               <div className="border border-black p-3 bg-white grayscale hover:grayscale-0 transition-all duration-1000 shadow-2xl">
                    <img 
                        src={formatImageUrl(profile?.heroImage) || "https://picsum.photos/seed/sabbir/800/1000"} 
                        alt="Sabbir" 
                        className="w-full object-cover aspect-[4/5] bg-neutral-100"
                        referrerPolicy="no-referrer"
                    />
               </div>
               {/* Accent elements */}
               <div className="absolute -bottom-6 -left-6 w-24 h-24 border-l-4 border-b-4 border-black hidden xl:block" />
               <div className="absolute -top-6 -right-6 w-24 h-24 border-r-4 border-t-4 border-black hidden xl:block" />
            </motion.div>
        </div>

        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400"
        >
            <span className="text-[10px] font-bold tracking-[0.5em] uppercase">Scroll</span>
            <ChevronDown size={16} className="animate-bounce" />
        </motion.div>
      </section>

      {/* Image Ticker Section */}
      <section className="bg-black overflow-hidden py-24 border-y border-white/10">
        <div className="flex whitespace-nowrap overflow-hidden">
          <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
            className="flex gap-4 px-2"
          >
            {tickerItems.length > 0 ? [...tickerItems, ...tickerItems].map((item, idx) => (
               <div key={`${item.id}-${idx}`} className="w-[300px] md:w-[450px] aspect-video border border-white/20 p-1 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-500 hover:scale-105">
                 <img src={formatImageUrl(item.url)} alt={item.alt || "Ticker"} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
               </div>
            )) : (
                [1,2,3,4,5,6].map(i => (
                    <div key={i} className="w-[450px] aspect-video border border-white/20 p-1 flex-shrink-0 flex items-center justify-center opacity-20">
                         <span className="text-white text-[10px] font-bold tracking-widest uppercase">IMAGE_PLACEHOLDER_{i}</span>
                    </div>
                ))
            )}
          </motion.div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="bg-white text-black py-40 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-black/10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={itemVariants}
            className="space-y-8 pt-16 md:pt-0 md:pl-0"
          >
            <div className="w-16 h-16 border border-black flex items-center justify-center">
                 <GraduationCap size={28} />
            </div>
            <h3 className="font-display font-bold text-5xl tracking-tighter italic leading-none uppercase">RESEARCH <br /> LED.</h3>
            <p className="text-gray-500 text-base leading-relaxed max-w-xs">
              Applying academic rigour to complex econometric models and data-driven insights. Delivering empirical excellence.
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={itemVariants}
            className="space-y-8 pt-16 md:pt-0 md:pl-12"
          >
            <div className="w-16 h-16 border border-black flex items-center justify-center">
                 <Cpu size={28} />
            </div>
            <h3 className="font-display font-bold text-5xl tracking-tighter italic leading-none uppercase">CODE <br /> FIRST.</h3>
            <p className="text-gray-500 text-base leading-relaxed max-w-xs">
              Translating math into performant software. Building scalable solutions with technical precision and architectural integrity.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={itemVariants}
            className="space-y-8 pt-16 md:pt-0 md:pl-12"
          >
            <div className="w-16 h-16 border border-black flex items-center justify-center">
                 <Rocket size={28} />
            </div>
            <h3 className="font-display font-bold text-5xl tracking-tighter italic leading-none uppercase">FUTURE <br /> READY.</h3>
            <p className="text-gray-500 text-base leading-relaxed max-w-xs">
              Constantly evolving. Staying ahead of the curve in econometrics, AI, and next-generation technical stacks.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Research Highlights Section */}
      <section id="research" className="py-40 px-6 max-w-7xl mx-auto border-t border-black">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
           <h2 className="font-display font-bold text-[clamp(2.5rem,7vw,6rem)] leading-[0.85] tracking-tighter uppercase">RESEARCH <br /> HIGHLIGHTS_</h2>
           <p className="text-gray-400 max-w-xs text-[10px] font-bold tracking-[0.4em] uppercase">SELECTED WORKS & ACADEMIC CONTRIBUTIONS</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {researchItems.length > 0 ? researchItems.map((item, idx) => (
            <motion.div 
              key={item.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={itemVariants}
              className={cn("group border border-black p-12 flex flex-col justify-between min-h-[500px] hover:bg-black hover:text-white transition-all cursor-pointer relative overflow-hidden", idx % 3 === 0 && "md:col-span-2")}
            >
              <Link to={`/research/${item.id}`} className="absolute inset-0 z-10" />
              <div>
                <div className="flex justify-between items-start mb-12">
                  <span className="font-mono text-[10px] opacity-40 uppercase">Case: Project_0{idx + 1}</span>
                  <FlaskConical size={28} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-display font-bold text-5xl mb-8 tracking-tighter leading-tight uppercase underline underline-offset-8 decoration-1 decoration-transparent group-hover:decoration-white transition-all">{item.title}</h3>
                <p className="text-gray-500 group-hover:text-gray-400 text-xl line-clamp-4 mb-12 max-w-2xl italic">"{item.description}"</p>
              </div>
              <div className="flex justify-between items-center border-t border-gray-100 group-hover:border-white/20 pt-8">
                 <span className="text-[10px] font-bold tracking-[0.3em] uppercase">{item.date}</span>
                 <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">CASE STUDY</span>
                    <ArrowUpRight size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                 </div>
              </div>
            </motion.div>
          )) : (
             <div className="col-span-2 border border-black border-dashed p-40 text-center">
                <p className="text-gray-400 font-bold tracking-[0.5em] uppercase">REPOSITORY EMPTY. INITIALIZE VIA CMS.</p>
             </div>
          )}
        </div>
      </section>

      {/* Hobbies Section - Dark Background */}
      <section className="bg-neutral-900 text-white py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div>
                <h2 className="font-display font-bold text-7xl tracking-tighter mb-4 leading-none uppercase">BEYOND <br /> THE LAB_</h2>
                <p className="text-neutral-500 tracking-[0.5em] font-bold text-[10px] uppercase">WHAT KEEPS ME DRIVEN</p>
            </div>
            <div className="w-24 h-24 border border-white/10 flex items-center justify-center p-4">
                 <Terminal size={40} className="text-white/20" />
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {hobbies.length > 0 ? hobbies.map((hobby, idx) => (
              <motion.div 
                key={hobby.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="aspect-square border border-neutral-800 flex flex-col items-center justify-center gap-6 hover:bg-white hover:text-black transition-all group p-10 text-center"
              >
                 <div className="w-12 h-12 flex items-center justify-center text-neutral-600 group-hover:text-black transition-colors">
                    <Rocket size={40} strokeWidth={1.5} />
                 </div>
                 <span className="text-xs font-bold tracking-[0.3em] uppercase leading-relaxed">{hobby.name}</span>
              </motion.div>
            )) : (
              [1,2,3,4].map(i => (
                <div key={i} className="aspect-square border border-neutral-800 flex flex-col items-center justify-center gap-4 opacity-10">
                   <Terminal size={32} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-40 px-6 max-w-7xl mx-auto">
         <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
           <h2 className="font-display font-bold text-[clamp(2.5rem,7vw,6rem)] tracking-tighter uppercase leading-[0.85]">THE <br /> INSIGHTS_</h2>
           <Link to="/#blog" className="text-[10px] font-bold tracking-[0.4em] border-b border-black pb-2 hover:opacity-50 transition-opacity uppercase">EXPLORE ALL POStS</Link>
        </div>

        <div className="divide-y divide-black">
          {blogItems.length > 0 ? blogItems.map((blog, idx) => (
            <Link 
              key={blog.id}
              to={`/blog/${blog.id}`}
              className="group py-16 flex flex-col md:flex-row md:items-center justify-between gap-12 transition-colors cursor-pointer px-4 relative overflow-hidden"
            >
              {/* Hover highlight line */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-black -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              
              <div className="flex flex-col md:flex-row md:items-center gap-12 md:gap-32">
                <span className="text-[10px] font-bold text-gray-300 tracking-[0.4em] md:w-32 uppercase shrink-0">{blog.date}</span>
                <div className="space-y-4">
                    <h3 className="font-display font-bold text-4xl md:text-7xl tracking-tighter uppercase leading-none group-hover:translate-x-4 transition-transform duration-500">{blog.title}</h3>
                    <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                        <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">ECONOMETRICS</span>
                        <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">—</span>
                        <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">ANALYSIS</span>
                    </div>
                </div>
              </div>
              <ChevronRight size={48} className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:block" strokeWidth={1} />
            </Link>
          )) : (
             <div className="border border-black border-dashed p-40 text-center">
                <p className="text-gray-400 font-bold tracking-[0.5em] uppercase">THOUGHTS PENDING. INITIALIZE VIA CMS.</p>
             </div>
          )}
        </div>
      </section>

      {/* CV Section after blog */}
      <section className="bg-neutral-100 py-32 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 border border-black p-12 md:p-20 bg-white shadow-[-20px_20px_0px_0px_rgba(0,0,0,1)]">
              <div className="space-y-6">
                <h2 className="font-display font-bold text-5xl md:text-6xl tracking-tighter uppercase leading-none">PROFESSIONAL <br /> BACKBONE.</h2>
                <p className="text-gray-500 max-w-md font-light text-lg">Download my comprehensive CV covering research, technical skills, and academic history.</p>
              </div>
              <a 
                href={formatDownloadUrl(profile?.cvUrl) || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-black text-white px-16 py-8 font-bold tracking-[0.3em] hover:bg-neutral-800 transition-all uppercase flex items-center gap-4 text-sm shrink-0"
              >
                Download CV <FileText size={20} />
              </a>
          </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-40 px-6 bg-black text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32">
          <div>
            <h2 className="font-display font-bold text-7xl lg:text-8xl tracking-tighter mb-12 leading-[0.85] uppercase">LET'S <br /> DISCUSS <br /> DATA_</h2>
            <p className="text-neutral-500 text-xl font-light mb-20 max-w-md leading-relaxed">Available for collaborative research projects, quantitative analysis, and high-performance software engineering challenges.</p>
            <div className="space-y-10">
               <div className="flex items-center gap-8 group cursor-pointer">
                  <div className="w-16 h-16 border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                     <Mail size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.5em] text-neutral-600 block mb-1 uppercase">EMAIL_PRIMARY</span>
                    <span className="font-bold tracking-[0.1em] uppercase text-xl">{profile?.email || 'DESIGNMINGLE.DM@GMAIL.COM'}</span>
                  </div>
               </div>
               <div className="flex items-center gap-8 group cursor-pointer">
                  <div className="w-16 h-16 border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                     <Github size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.5em] text-neutral-600 block mb-1 uppercase">CODE_REPOS</span>
                    <span className="font-bold tracking-[0.1em] uppercase text-xl">GITHUB.COM/{profile?.github?.toUpperCase() || 'SABBIR'}</span>
                  </div>
               </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-12">
            {submitted ? (
              <div className="border border-white p-20 text-center bg-white/5">
                 <p className="font-display font-bold text-6xl tracking-tighter uppercase leading-none mb-8">QUEUED.</p>
                 <p className="text-neutral-400 font-bold tracking-widest uppercase mb-12">THANK YOU FOR REACHING OUT.</p>
                 <button type="button" onClick={() => setSubmitted(false)} className="px-12 py-6 border border-white font-bold tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all">SEND ANOTHER</button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold tracking-[0.5em] text-neutral-500 uppercase">IDENTITY_NAME</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-transparent border-b border-white/20 py-6 focus:border-white transition-all outline-none text-2xl uppercase font-display font-bold tracking-tight" 
                    placeholder="ENTER FULL NAME" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold tracking-[0.5em] text-neutral-500 uppercase">CONTACT_EMAIL</label>
                  <input 
                    required
                    type="email" 
                    className="w-full bg-transparent border-b border-white/20 py-6 focus:border-white transition-all outline-none text-2xl uppercase font-display font-bold tracking-tight" 
                    placeholder="ENTER EMAIL ADDRESS" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold tracking-[0.5em] text-neutral-500 uppercase">INTENT_MESSAGE</label>
                  <textarea 
                    required
                    rows={4} 
                    className="w-full bg-transparent border-b border-white/20 py-6 focus:border-white transition-all outline-none text-2xl resize-none uppercase font-display font-bold tracking-tight leading-none" 
                    placeholder="WHAT IS THE PROJECT?" 
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  />
                </div>
                <button 
                  disabled={submitting}
                  className="bg-white text-black px-12 py-8 font-bold tracking-[0.4em] hover:bg-neutral-200 transition-all uppercase w-full disabled:opacity-50 text-sm mt-12"
                >
                  {submitting ? 'TRANSMITTING...' : 'SEND MESSAGE'}
                </button>
              </>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
