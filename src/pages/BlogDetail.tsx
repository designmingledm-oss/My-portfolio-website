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

  if (loading) return <div className="p-20 text-center font-bold tracking-[0.5em] uppercase border-y border-black">SYNCING DATA...</div>;
  if (!blog) return <div className="p-20 text-center font-bold tracking-[0.5em] uppercase border-y border-black">POST_NOT_FOUND.</div>;

  const post = blog as Blog;

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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        <div className="lg:col-span-8">
            <header className="mb-20">
                <div className="flex gap-4 mb-8">
                    <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-gray-400 border border-black/10 px-4 py-2 uppercase">
                        <Calendar size={12} /> {post.date}
                    </div>
                </div>
                <h1 className="font-display font-bold text-6xl md:text-8xl tracking-tighter leading-[0.9] mb-12 uppercase">{post.title}</h1>
                <div className="w-20 h-2 bg-black" />
            </header>

            {post.coverImage && (
                <div className="mb-20 border border-black p-2 bg-neutral-50 shadow-xl grayscale hover:grayscale-0 transition-all duration-1000">
                    <img src={post.coverImage} alt={post.title} className="w-full object-cover aspect-video" referrerPolicy="no-referrer" />
                </div>
            )}

            <div className="prose prose-xl max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tighter prose-headings:text-black prose-p:text-gray-600 prose-p:leading-relaxed prose-strong:text-black prose-img:border prose-img:border-black prose-img:p-1 prose-a:text-black prose-a:underline prose-a:underline-offset-4">
                <div className="markdown-body">
                   <Markdown>{post.content}</Markdown>
                </div>
            </div>
        </div>

        <aside className="lg:col-span-4 space-y-20">
            {post.gallery && post.gallery.length > 0 && (
                <div>
                    <h3 className="text-xs font-bold tracking-[0.4em] uppercase text-gray-400 mb-8 border-b border-black/10 pb-4">FIELD_LOGS_</h3>
                    <div className="grid grid-cols-1 gap-6">
                        {post.gallery.map((img, idx) => (
                            <div key={idx} className="border border-black p-1 hover:scale-[1.02] transition-transform duration-300 shadow-lg">
                                <img src={img} alt={`Gallery ${idx}`} className="w-full grayscale hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="border border-black p-10 bg-neutral-900 text-white">
                <h4 className="font-display font-bold text-xl mb-4 tracking-tighter uppercase">SHARE_INSIGHT</h4>
                <p className="text-neutral-400 text-xs mb-8 uppercase tracking-widest leading-loose">Help spread the knowledge of econometric analysis and research.</p>
                <button className="w-full border border-white/20 px-6 py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2">
                    <Share2 size={14} /> COPY LINK
                </button>
            </div>
        </aside>
      </div>

      <footer className="mt-40 pt-20 border-t border-black flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
         <div>
            <p className="text-[10px] font-bold tracking-[0.5em] text-gray-400 uppercase mb-2">AUTHORED_BY</p>
            <p className="font-display font-bold text-3xl tracking-tight uppercase">SABBIR_</p>
         </div>
      </footer>
    </motion.div>
  );
}
