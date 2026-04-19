import { useParams, Link } from 'react-router-dom';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { db } from '../lib/firebase';
import { doc } from 'firebase/firestore';
import { Blog } from '../types';
import Markdown from 'react-markdown';
import { ArrowLeft, Calendar, Share2, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, loading] = useDocumentData(doc(db, 'blogs', id || 'none'));

  if (loading) return <div className="p-20 text-center font-bold tracking-[0.5em]">LOADING ARTICLE...</div>;
  if (!blog) return <div className="p-20 text-center font-bold tracking-[0.5em]">POST NOT FOUND.</div>;

  const post = blog as Blog;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto px-6 py-20"
    >
      <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-gray-400 hover:text-black transition-colors mb-20 group">
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> BACK TO PORTFOLIO
      </Link>

      <header className="mb-20">
        <div className="flex gap-4 mb-8">
           <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-gray-400 border border-gray-100 px-3 py-1">
              <Calendar size={12} /> {post.date}
           </div>
           <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-gray-400 border border-gray-100 px-3 py-1">
              <Clock size={12} /> 5 MIN READ
           </div>
        </div>
        <h1 className="font-display font-bold text-6xl md:text-8xl tracking-tighter leading-[0.9] mb-12">{post.title}</h1>
        <div className="w-20 h-2 bg-black" />
      </header>

      <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tighter prose-headings:text-black prose-p:text-gray-600 prose-p:leading-relaxed prose-strong:text-black prose-code:bg-neutral-100 prose-code:p-1 prose-code:rounded-none prose-code:text-black">
        <div className="markdown-body">
          <Markdown>{post.content}</Markdown>
        </div>
      </div>

      <footer className="mt-32 pt-20 border-t border-black flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
         <div>
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-2">WRITTEN BY</p>
            <p className="font-display font-bold text-2xl tracking-tight uppercase">UNIVERSITY STUDENT</p>
         </div>
         <button className="flex items-center gap-4 border border-black px-10 py-5 text-xs font-bold tracking-widest hover:bg-black hover:text-white transition-all uppercase">
            <Share2 size={16} /> Share Article
         </button>
      </footer>
    </motion.div>
  );
}
