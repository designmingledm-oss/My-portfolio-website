import { useParams, Link } from 'react-router-dom';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { db } from '../lib/firebase';
import { doc } from 'firebase/firestore';
import { Research } from '../types';
import Markdown from 'react-markdown';
import { ArrowLeft, Calendar, FlaskConical, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { formatImageUrl } from '../lib/utils';

export default function ResearchDetail() {
  const { id } = useParams();
  const [research, loading] = useDocumentData(doc(db, 'research', id || 'none'));

  if (loading) return <div className="p-20 text-center font-bold tracking-[0.5em]">LOADING RESEARCH...</div>;
  if (!research) return <div className="p-20 text-center font-bold tracking-[0.5em]">RESEARCH NOT FOUND.</div>;

  const project = research as Research;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-6 py-20"
    >
      <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-gray-400 hover:text-black transition-colors mb-20 group">
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> BACK TO PORTFOLIO
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start mb-20">
        <header>
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-gray-400 mb-8">
            <Calendar size={12} /> {project.date}
          </div>
          <h1 className="font-display font-bold text-6xl md:text-8xl tracking-tighter leading-[0.9] mb-12 uppercase">{project.title}</h1>
          <div className="w-20 h-2 bg-black mb-12" />
          <p className="text-xl text-gray-600 leading-relaxed font-light mb-8 italic">
              {project.description}
          </p>
          {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold tracking-[0.2em] border border-black px-6 py-3 hover:bg-black hover:text-white transition-all uppercase">
                  View Project <ExternalLink size={14} />
              </a>
          )}
        </header>

        {project.coverImage ? (
          <div className="border border-black p-2">
            <img 
              src={formatImageUrl(project.coverImage)} 
              alt={project.title} 
              className="w-full grayscale hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <div className="aspect-square bg-neutral-100 border border-black border-dashed flex items-center justify-center text-gray-300">
             <FlaskConical size={80} strokeWidth={1} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
          <div className="md:col-span-2 prose prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tighter prose-headings:text-black prose-p:text-gray-600 prose-p:leading-relaxed prose-strong:text-black prose-img:border prose-img:border-black prose-img:p-1">
            <div className="markdown-body">
               <Markdown>{project.content || 'Detailed documentation coming soon.'}</Markdown>
            </div>
          </div>

          <aside className="space-y-12">
             {project.gallery && project.gallery.length > 0 && (
                 <div>
                    <h3 className="text-xs font-bold tracking-[0.3em] uppercase text-gray-400 mb-6">Gallery_</h3>
                    <div className="grid grid-cols-1 gap-4">
                       {project.gallery.map((img, idx) => (
                           <div key={idx} className="border border-black p-1 hover:scale-[1.02] transition-transform">
                              <img src={formatImageUrl(img)} alt={`Gallery ${idx}`} className="w-full grayscale hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
                           </div>
                       ))}
                    </div>
                 </div>
             )}
          </aside>
      </div>
    </motion.div>
  );
}
