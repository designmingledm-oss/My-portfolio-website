import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection, useDocumentData } from 'react-firebase-hooks/firestore';
import { auth, db } from '../lib/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Trash2, Edit2, Plus, Save, X, ExternalLink, MessageSquare, BookOpen, FlaskConical, User as UserIcon, Heart } from 'lucide-react';
import { Research, Blog, Hobby, Profile, Message } from '../types';
import { Navigate, Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Admin() {
  const [user, loading] = useAuthState(auth);
  const [activeTab, setActiveTab] = useState<'profile' | 'research' | 'blogs' | 'hobbies' | 'messages'>('profile');

  // Firestore Hooks
  const [researchSnap] = useCollection(query(collection(db, 'research'), orderBy('date', 'desc')));
  const [blogsSnap] = useCollection(query(collection(db, 'blogs'), orderBy('date', 'desc')));
  const [hobbiesSnap] = useCollection(collection(db, 'hobbies'));
  const [messagesSnap] = useCollection(query(collection(db, 'messages'), orderBy('timestamp', 'desc')));
  const profileDocRef = doc(db, 'profiles', user?.uid || 'none');
  const [profileData] = useDocumentData(profileDocRef);

  if (loading) return <div className="p-20 text-center font-bold tracking-widest">LOADING CMS...</div>;
  
  const isAdmin = user?.email === 'designmingle.dm@gmail.com';
  if (!user || !isAdmin) {
    return <Navigate to="/" />;
  }

  const tabs = [
    { id: 'profile', label: 'PROFILE', icon: UserIcon },
    { id: 'research', label: 'RESEARCH', icon: FlaskConical },
    { id: 'blogs', label: 'BLOGS', icon: BookOpen },
    { id: 'hobbies', label: 'HOBBIES', icon: Heart },
    { id: 'messages', label: 'MESSAGES', icon: MessageSquare },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <span className="text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase">CONTENT MANAGEMENT SYSTEM</span>
          <h1 className="font-display font-bold text-6xl tracking-tighter mt-2">DASHBOARD_</h1>
        </div>
        <div className="flex bg-neutral-100 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-6 py-3 text-[10px] font-bold tracking-[0.2em] transition-all flex items-center gap-2",
                activeTab === tab.id ? "bg-black text-white" : "hover:bg-neutral-200"
              )}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-black p-10 bg-white">
        {activeTab === 'profile' && <ProfileManager profile={profileData as Profile} docRef={profileDocRef} />}
        {activeTab === 'research' && <ResearchManager items={researchSnap?.docs.map(d => ({id: d.id, ...d.data()}) as Research) || []} />}
        {activeTab === 'blogs' && <BlogManager items={blogsSnap?.docs.map(d => ({id: d.id, ...d.data()}) as Blog) || []} />}
        {activeTab === 'hobbies' && <HobbyManager items={hobbiesSnap?.docs.map(d => ({id: d.id, ...d.data()}) as Hobby) || []} />}
        {activeTab === 'messages' && <MessageManager items={messagesSnap?.docs.map(d => ({id: d.id, ...d.data()}) as Message) || []} />}
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS FOR CMS ---

function ProfileManager({ profile, docRef }: { profile?: Profile, docRef: any }) {
  const [formData, setFormData] = useState<Profile>(profile || { name: '', bio: '', email: '', github: '', linkedin: '', cvUrl: '' });

  const save = async () => {
    await updateDoc(docRef, { ...formData });
    alert('Profile updated');
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <h2 className="font-display font-bold text-3xl tracking-tight mb-8">EDIT PROFILE_</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-widest text-gray-400">FULL NAME</label>
          <input className="w-full border border-black p-4 text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-widest text-gray-400">EMAIL</label>
          <input className="w-full border border-black p-4 text-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-bold tracking-widest text-gray-400">BIO</label>
          <textarea rows={4} className="w-full border border-black p-4 text-sm resize-none" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-widest text-gray-400">CV URL</label>
          <input className="w-full border border-black p-4 text-sm" value={formData.cvUrl} onChange={e => setFormData({...formData, cvUrl: e.target.value})} />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-widest text-gray-400">GITHUB</label>
          <input className="w-full border border-black p-4 text-sm" value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} />
        </div>
      </div>
      <button onClick={save} className="bg-black text-white px-10 py-5 font-bold tracking-[0.2em] text-xs hover:bg-neutral-800 flex items-center gap-2">
        <Save size={16} /> SAVE CHANGES
      </button>
    </div>
  );
}

function ResearchManager({ items }: { items: Research[] }) {
  const [newItem, setNewItem] = useState({ title: '', description: '', date: '', link: '' });

  const add = async () => {
    if (!newItem.title) return;
    await addDoc(collection(db, 'research'), newItem);
    setNewItem({ title: '', description: '', date: '', link: '' });
  };

  const remove = async (id: string) => {
    if (confirm('Delete research?')) await deleteDoc(doc(db, 'research', id));
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-neutral-50 p-8 border-l-4 border-black">
         <div className="md:col-span-2 flex justify-between items-center">
            <h3 className="font-display font-bold text-2xl uppercase">ADD PROJECT</h3>
            <FlaskConical size={20} />
         </div>
         <input className="w-full border border-black p-4 text-sm" placeholder="PROJECT TITLE" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} />
         <input className="w-full border border-black p-4 text-sm" placeholder="DATE/TERM" value={newItem.date} onChange={e => setNewItem({...newItem, date: e.target.value})} />
         <textarea className="md:col-span-2 w-full border border-black p-4 text-sm" rows={3} placeholder="DESCRIPTION" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} />
         <input className="md:col-span-2 w-full border border-black p-4 text-sm" placeholder="LINK (OPTIONAL)" value={newItem.link} onChange={e => setNewItem({...newItem, link: e.target.value})} />
         <button onClick={add} className="bg-black text-white px-8 py-4 font-bold tracking-widest text-xs">ADD TO PORTFOLIO</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map(item => (
          <div key={item.id} className="border border-black p-6 flex flex-col justify-between group">
            <div>
               <h4 className="font-display font-bold text-xl mb-4 tracking-tight">{item.title}</h4>
               <p className="text-gray-500 text-sm line-clamp-2">{item.description}</p>
            </div>
            <div className="flex justify-between items-center mt-6">
               <span className="text-[10px] font-bold tracking-widest text-gray-400">{item.date}</span>
               <button onClick={() => remove(item.id)} className="text-gray-300 hover:text-red-600 transition-colors">
                  <Trash2 size={16} />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlogManager({ items }: { items: Blog[] }) {
  const [newItem, setNewItem] = useState({ title: '', content: '', slug: '', date: new Date().toISOString().split('T')[0] });

  const add = async () => {
    if (!newItem.title) return;
    await addDoc(collection(db, 'blogs'), newItem);
    setNewItem({ title: '', content: '', slug: '', date: new Date().toISOString().split('T')[0] });
  };

  const remove = async (id: string) => {
    if (confirm('Delete post?')) await deleteDoc(doc(db, 'blogs', id));
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-neutral-50 p-8 border-l-4 border-black">
         <div className="md:col-span-2 flex justify-between items-center">
            <h3 className="font-display font-bold text-2xl uppercase">NEW BLOG POST</h3>
            <BookOpen size={20} />
         </div>
         <input className="w-full border border-black p-4 text-sm font-bold" placeholder="POST TITLE" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} />
         <input className="w-full border border-black p-4 text-sm" placeholder="SLUG (e.g. my-first-post)" value={newItem.slug} onChange={e => setNewItem({...newItem, slug: e.target.value})} />
         <textarea className="md:col-span-2 w-full border border-black p-4 text-sm font-mono" rows={10} placeholder="CONTENT (MARKDOWN SUPPORTED)" value={newItem.content} onChange={e => setNewItem({...newItem, content: e.target.value})} />
         <button onClick={add} className="bg-black text-white px-8 py-4 font-bold tracking-widest text-xs">PUBLISH POST</button>
      </div>

      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="border border-black p-6 flex justify-between items-center hover:bg-neutral-50 transition-colors">
             <div className="flex gap-10 items-center">
                <span className="text-[10px] font-bold text-gray-400 tracking-widest w-24">{item.date}</span>
                <span className="font-display font-bold text-lg">{item.title}</span>
             </div>
             <div className="flex gap-4">
                <Link to={`/blog/${item.id}`} className="text-gray-400 hover:text-black"><ExternalLink size={16} /></Link>
                <button onClick={() => remove(item.id)} className="text-gray-300 hover:text-red-600"><Trash2 size={16} /></button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HobbyManager({ items }: { items: Hobby[] }) {
  const [newName, setNewName] = useState('');

  const add = async () => {
    if (!newName) return;
    await addDoc(collection(db, 'hobbies'), { name: newName });
    setNewName('');
  };

  const remove = async (id: string) => {
    await deleteDoc(doc(db, 'hobbies', id));
  };

  return (
    <div className="max-w-xl space-y-12">
      <div className="flex gap-4">
         <input className="flex-grow border border-black p-4 text-sm" placeholder="ADD HOBBY..." value={newName} onChange={e => setNewName(e.target.value)} />
         <button onClick={add} className="bg-black text-white px-6 py-4 font-bold tracking-widest text-xs"><Plus size={18} /></button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {items.map(item => (
          <div key={item.id} className="border border-black p-4 flex justify-between items-center group">
             <span className="text-xs font-bold tracking-[0.2em]">{item.name}</span>
             <button onClick={() => remove(item.id)} className="text-gray-300 hover:text-red-600"><X size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessageManager({ items }: { items: Message[] }) {
  const remove = async (id: string) => {
    if (confirm('Delete message?')) await deleteDoc(doc(db, 'messages', id));
  };

  return (
    <div className="space-y-6">
      {items.length === 0 && <p className="text-gray-400 font-bold tracking-widest">INBOX EMPTY.</p>}
      {items.map(item => (
        <div key={item.id} className="border border-black p-8 group relative">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="font-display font-bold text-xl">{item.name}</p>
              <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">{item.email}</p>
            </div>
            <span className="text-[10px] font-bold text-gray-300 tracking-widest">{new Date(item.timestamp?.toDate()).toLocaleString()}</span>
          </div>
          <p className="text-gray-600 italic leading-relaxed">"{item.message}"</p>
          <button onClick={() => remove(item.id)} className="absolute bottom-8 right-8 text-gray-200 hover:text-red-600">
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
