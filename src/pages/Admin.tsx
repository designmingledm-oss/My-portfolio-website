import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection, useDocumentData } from 'react-firebase-hooks/firestore';
import { auth, db } from '../lib/firebase';
import { collection, addDoc, deleteDoc, doc, setDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Trash2, Edit2, Plus, Save, X, ExternalLink, MessageSquare, BookOpen, FlaskConical, User as UserIcon, Heart, Layout as LayoutIcon, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { Research, Blog, Hobby, Profile, Message, TickerImage } from '../types';
import { Navigate, Link } from 'react-router-dom';
import { cn, formatImageUrl } from '../lib/utils';
import { ImageUpload } from '../components/FileUpload';

export default function Admin() {
  const [user, loading] = useAuthState(auth);
  const [activeTab, setActiveTab] = useState<'profile' | 'research' | 'blogs' | 'hobbies' | 'ticker' | 'messages'>('profile');

  // Firestore Hooks
  const [researchSnap] = useCollection(query(collection(db, 'research'), orderBy('date', 'desc')));
  const [blogsSnap] = useCollection(query(collection(db, 'blogs'), orderBy('date', 'desc')));
  const [hobbiesSnap] = useCollection(collection(db, 'hobbies'));
  const [tickerSnap] = useCollection(collection(db, 'ticker'));
  const [messagesSnap] = useCollection(query(collection(db, 'messages'), orderBy('timestamp', 'desc')));
  
  const profileDocRef = doc(db, 'profiles', 'default');
  const [profileData] = useDocumentData(profileDocRef);

  if (loading) return <div className="p-20 text-center font-bold tracking-widest uppercase">LOADING CMS DASHBOARD...</div>;
  
  const isAdmin = user?.email === 'designmingle.dm@gmail.com';
  if (!user || !isAdmin) {
    return <Navigate to="/" />;
  }

  const tabs = [
    { id: 'profile', label: 'PROFILE', icon: UserIcon },
    { id: 'research', label: 'RESEARCH', icon: FlaskConical },
    { id: 'blogs', label: 'BLOGS', icon: BookOpen },
    { id: 'ticker', label: 'TICKER', icon: ImageIcon },
    { id: 'hobbies', label: 'HOBBIES', icon: Heart },
    { id: 'messages', label: 'MESSAGES', icon: MessageSquare },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 min-h-screen">
      <div className="flex flex-col xl:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <span className="text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase">CONTENT MANAGEMENT SYSTEM</span>
          <h1 className="font-display font-bold text-6xl tracking-tighter mt-2">DASHBOARD_</h1>
        </div>
        <div className="flex bg-neutral-100 p-1 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-5 py-3 text-[10px] font-bold tracking-[0.2em] transition-all flex items-center gap-2",
                activeTab === tab.id ? "bg-black text-white" : "hover:bg-neutral-200"
              )}
            >
              <tab.icon size={12} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-black p-10 bg-white">
        {activeTab === 'profile' && <ProfileManager profile={profileData as Profile} docRef={profileDocRef} />}
        {activeTab === 'research' && <ResearchManager items={researchSnap?.docs.map(d => ({id: d.id, ...d.data()}) as Research) || []} />}
        {activeTab === 'blogs' && <BlogManager items={blogsSnap?.docs.map(d => ({id: d.id, ...d.data()}) as Blog) || []} />}
        {activeTab === 'ticker' && <TickerManager items={tickerSnap?.docs.map(d => ({id: d.id, ...d.data()}) as TickerImage) || []} />}
        {activeTab === 'hobbies' && <HobbyManager items={hobbiesSnap?.docs.map(d => ({id: d.id, ...d.data()}) as Hobby) || []} />}
        {activeTab === 'messages' && <MessageManager items={messagesSnap?.docs.map(d => ({id: d.id, ...d.data()}) as Message) || []} />}
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS FOR CMS ---

function ProfileManager({ profile, docRef }: { profile?: Profile, docRef: any }) {
  const [formData, setFormData] = useState<Profile>({ name: 'Sabbir', bio: 'I love Econometric analysis', email: 'designmingle.dm@gmail.com', github: '', linkedin: '', cvUrl: '', heroImage: '' });
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Sync with Firestore data when it loads
  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const save = async () => {
    setSaving(true);
    setSaveStatus('idle');
    try {
        await setDoc(docRef, { ...formData }, { merge: true });
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
    } catch(e) {
        console.error(e);
        setSaveStatus('error');
    } finally {
        setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <h2 className="font-display font-bold text-3xl tracking-tight mb-8 uppercase">EDIT PROFILE_</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-widest text-gray-400">FULL NAME</label>
          <input className="w-full border border-black p-4 text-sm outline-none focus:ring-1 focus:ring-black" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-widest text-gray-400">EMAIL</label>
          <input className="w-full border border-black p-4 text-sm outline-none focus:ring-1 focus:ring-black" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">HERO Headline/Bio</label>
          <textarea rows={2} className="w-full border border-black p-4 text-sm resize-none outline-none focus:ring-1 focus:ring-black" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
        </div>
        <div className="md:col-span-2">
          <ImageUpload 
            label="Hero Image Upload / URL"
            currentValue={formData.heroImage}
            onUpload={(url) => setFormData(prev => ({...prev, heroImage: url}))}
          />
          <div className="mt-2">
            <label className="text-[8px] font-bold tracking-widest text-gray-300 uppercase">OR PASTE EXTERNAL URL</label>
            <input className="w-full border border-black p-2 text-xs outline-none focus:ring-1 focus:ring-black mt-1" placeholder="https://..." value={formData.heroImage.startsWith('data:') ? 'Local Upload' : formData.heroImage} onChange={e => setFormData(prev => ({...prev, heroImage: e.target.value}))} />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">CV DOWNLOAD URL</label>
          <input className="w-full border border-black p-4 text-sm outline-none focus:ring-1 focus:ring-black" value={formData.cvUrl} onChange={e => setFormData({...formData, cvUrl: e.target.value})} />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">GITHUB</label>
          <input className="w-full border border-black p-4 text-sm outline-none focus:ring-1 focus:ring-black" value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">LINKEDIN</label>
          <input className="w-full border border-black p-4 text-sm outline-none focus:ring-1 focus:ring-black" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} />
        </div>
      </div>
      <button 
        disabled={saving}
        onClick={save} 
        className={cn(
          "px-10 py-5 font-bold tracking-[0.2em] text-xs flex items-center gap-2 transition-all",
          saveStatus === 'success' ? "bg-green-600 text-white" : "bg-black text-white hover:bg-neutral-800",
          saving && "opacity-50 cursor-not-allowed"
        )}
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : saveStatus === 'success' ? <CheckCircle2 size={16} /> : <Save size={16} />}
        {saving ? 'SAVING...' : saveStatus === 'success' ? 'PROFILE SAVED' : 'SAVE PROFILE'}
      </button>
    </div>
  );
}

function ResearchManager({ items }: { items: Research[] }) {
  const [newItem, setNewItem] = useState<Partial<Research>>({ title: '', description: '', date: '', link: '', content: '', coverImage: '', gallery: [] });
  const [editingId, setEditingId] = useState<string | null>(null);

  const add = async () => {
    if (!newItem.title) return;
    await addDoc(collection(db, 'research'), { ...newItem, gallery: newItem.gallery || [] });
    setNewItem({ title: '', description: '', date: '', link: '', content: '', coverImage: '', gallery: [] });
  };

  const remove = async (id: string) => {
    if (confirm('Permanently delete this research highlight?')) await deleteDoc(doc(db, 'research', id));
  };

  const handleGalleryChange = (val: string) => {
      setNewItem({...newItem, gallery: val.split(',').map(s => s.trim()).filter(s => s !== '')});
  };

  return (
    <div className="space-y-12">
      <div className="bg-neutral-50 p-10 border-l-8 border-black space-y-8">
         <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-3xl uppercase tracking-tighter">ADD RESEARCH HIGHLIGHT_</h3>
            <FlaskConical size={24} />
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input className="w-full border border-black p-4 text-sm" placeholder="PROJECT TITLE" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} />
            <input className="w-full border border-black p-4 text-sm" placeholder="TERM/DATE (e.g. Fall 2025)" value={newItem.date} onChange={e => setNewItem({...newItem, date: e.target.value})} />
            
            <div className="md:col-span-2">
              <ImageUpload 
                label="RESEARCH COVER IMAGE"
                currentValue={newItem.coverImage}
                onUpload={(url) => setNewItem(prev => ({...prev, coverImage: url}))}
              />
              <input className="w-full border border-black p-2 text-xs outline-none mt-1" placeholder="OR PASTE COVER URL" value={newItem.coverImage?.startsWith('data:') ? 'Local Upload' : newItem.coverImage} onChange={e => setNewItem(prev => ({...prev, coverImage: e.target.value}))} />
            </div>

            <textarea className="md:col-span-2 w-full border border-black p-4 text-sm" rows={2} placeholder="SHORT DESCRIPTION (SUMMARY)" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} />
            <textarea className="md:col-span-2 w-full border border-black p-4 text-sm font-mono h-48" placeholder="DETAILED CONTENT (MARKDOWN)" value={newItem.content} onChange={e => setNewItem({...newItem, content: e.target.value})} />
            <input className="w-full border border-black p-4 text-sm" placeholder="EXTERNAL LINK (URL)" value={newItem.link} onChange={e => setNewItem({...newItem, link: e.target.value})} />
            <div className="w-full">
               <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">GALLERY (MANUAL URLS)</label>
               <input className="w-full border border-black p-4 text-sm mt-1" placeholder="COMMA SEPARATED URLS" value={newItem.gallery?.join(', ')} onChange={e => handleGalleryChange(e.target.value)} />
            </div>
         </div>
         <button onClick={add} className="bg-black text-white px-12 py-5 font-bold tracking-[0.2em] text-xs uppercase hover:bg-neutral-800 transition-all">
            Publish Research
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <div key={item.id} className="border border-black p-6 flex flex-col justify-between group h-full">
            <div>
               <div className="flex justify-between mb-4">
                  <span className="text-[10px] font-mono text-gray-400">0{idx+1}</span>
                  <Link to={`/research/${item.id}`} className="text-gray-400 hover:text-black"><ExternalLink size={16} /></Link>
               </div>
               <h4 className="font-display font-bold text-xl mb-4 tracking-tight uppercase leading-none">{item.title}</h4>
               <p className="text-gray-500 text-xs line-clamp-2 italic">{item.description}</p>
            </div>
            <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
               <span className="text-[10px] font-bold tracking-widest text-gray-300 uppercase">{item.date}</span>
               <button onClick={() => remove(item.id)} className="text-gray-200 hover:text-red-600 transition-colors">
                  <Trash2 size={16} />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TickerManager({ items }: { items: TickerImage[] }) {
    const [newImage, setNewImage] = useState({ url: '', alt: '' });
    const [adding, setAdding] = useState(false);

    const add = async () => {
        if (!newImage.url) return;
        setAdding(true);
        try {
            await addDoc(collection(db, 'ticker'), newImage);
            setNewImage({ url: '', alt: '' });
        } catch (e) {
            console.error(e);
        } finally {
            setAdding(false);
        }
    };

    const remove = async (id: string) => {
        await deleteDoc(doc(db, 'ticker', id));
    };

    return (
        <div className="space-y-12">
            <div className="bg-neutral-50 p-10 border-l-8 border-black">
                <h3 className="font-display font-bold text-2xl mb-8 uppercase tracking-tighter">ADD TICKER IMAGE_</h3>
                
                <div className="mb-8">
                  <ImageUpload 
                    label="UPLOAD TICKER IMAGE"
                    currentValue={newImage.url}
                    onUpload={(url) => setNewImage(prev => ({...prev, url: url}))}
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <input className="flex-grow border border-black p-4 text-sm" placeholder="OR PASTE IMAGE URL" value={newImage.url.startsWith('data:') ? 'LOCAL UPLOADED IMAGE' : newImage.url} onChange={e => setNewImage(prev => ({...prev, url: e.target.value}))} />
                    <input className="border border-black p-4 text-sm w-full md:w-48" placeholder="ALT TEXT" value={newImage.alt} onChange={e => setNewImage({...newImage, alt: e.target.value})} />
                    <button 
                        disabled={adding}
                        onClick={add} 
                        className="bg-black text-white px-8 py-4 font-bold uppercase text-xs tracking-widest hover:bg-neutral-800 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {adding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                        {adding ? 'ADDING...' : 'ADD TO TICKER'}
                    </button>
                </div>
                {newImage.url && (
                    <div className="mt-6 flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                        <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">PREVIEW:</span>
                        <div className="w-20 h-20 border border-black p-1 bg-white">
                            <img src={formatImageUrl(newImage.url)} alt="Preview" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {items.length === 0 && <p className="col-span-full text-center py-20 text-gray-400 font-bold tracking-widest uppercase border border-dashed border-gray-200">NO TICKER IMAGES FOUND.</p>}
                {items.map(item => (
                    <div key={item.id} className="relative aspect-square border border-black group p-1 animate-in zoom-in-95">
                        <img src={formatImageUrl(item.url)} alt={item.alt} className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
                        <button 
                            onClick={() => remove(item.id)}
                            className="absolute top-2 right-2 bg-red-600 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function BlogManager({ items }: { items: Blog[] }) {
  const [newItem, setNewItem] = useState<Partial<Blog>>({ title: '', content: '', slug: '', date: new Date().toISOString().split('T')[0], coverImage: '', gallery: [] });

  const add = async () => {
    if (!newItem.title) return;
    await addDoc(collection(db, 'blogs'), { ...newItem, gallery: newItem.gallery || [] });
    setNewItem({ title: '', content: '', slug: '', date: new Date().toISOString().split('T')[0], coverImage: '', gallery: [] });
  };

  const remove = async (id: string) => {
    if (confirm('Delete post permanently?')) await deleteDoc(doc(db, 'blogs', id));
  };

  const handleGalleryChange = (val: string) => {
      setNewItem({...newItem, gallery: val.split(',').map(s => s.trim()).filter(s => s !== '')});
  };

  return (
    <div className="space-y-12">
      <div className="bg-neutral-50 p-10 border-l-8 border-black space-y-8">
         <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-3xl uppercase tracking-tighter">NEW BLOG ARTICLE_</h3>
            <BookOpen size={24} />
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input className="w-full border border-black p-4 text-sm font-bold" placeholder="ARTICLE TITLE" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} />
            <input className="w-full border border-black p-4 text-sm" placeholder="SLUG (e.g. econometric-insights-2026)" value={newItem.slug} onChange={e => setNewItem({...newItem, slug: e.target.value})} />
            
            <div className="md:col-span-2">
              <ImageUpload 
                label="BLOG COVER IMAGE"
                currentValue={newItem.coverImage}
                onUpload={(url) => setNewItem(prev => ({...prev, coverImage: url}))}
              />
              <input className="w-full border border-black p-2 text-xs outline-none mt-1" placeholder="OR PASTE COVER URL" value={newItem.coverImage?.startsWith('data:') ? 'Local Upload' : newItem.coverImage} onChange={e => setNewItem(prev => ({...prev, coverImage: e.target.value}))} />
            </div>

            <textarea className="md:col-span-2 w-full border border-black p-4 text-sm font-mono h-80" placeholder="MARKDOWN CONTENT" value={newItem.content} onChange={e => setNewItem({...newItem, content: e.target.value})} />
            <input className="md:col-span-2 w-full border border-black p-4 text-sm" placeholder="GALLERY IMAGES (COMMA SEPARATED URLS)" value={newItem.gallery?.join(', ')} onChange={e => handleGalleryChange(e.target.value)} />
         </div>
         <button onClick={add} className="bg-black text-white px-12 py-5 font-bold tracking-[0.2em] text-xs uppercase hover:bg-neutral-800 transition-all">PUBLISH ARTICLE</button>
      </div>

      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="border border-black p-6 flex justify-between items-center hover:bg-neutral-50 transition-colors">
             <div className="flex gap-10 items-center">
                <span className="text-[10px] font-bold text-gray-300 tracking-widest w-24 uppercase">{item.date}</span>
                <span className="font-display font-bold text-xl tracking-tight uppercase">{item.title}</span>
             </div>
             <div className="flex gap-6">
                <Link to={`/blog/${item.id}`} className="text-gray-400 hover:text-black transition-colors"><ExternalLink size={20} /></Link>
                <button onClick={() => remove(item.id)} className="text-gray-200 hover:text-red-600 transition-colors"><Trash2 size={20} /></button>
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
    <div className="max-w-2xl space-y-12">
      <div className="flex gap-4">
         <input className="flex-grow border border-black p-4 text-sm outline-none" placeholder="NEW INTEREST..." value={newName} onChange={e => setNewName(e.target.value)} />
         <button onClick={add} className="bg-black text-white px-10 py-4 font-bold tracking-widest text-xs"><Plus size={18} /></button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.id} className="border border-black p-4 flex justify-between items-center hover:bg-black hover:text-white transition-all group">
             <span className="font-display font-bold text-xs tracking-widest uppercase">{item.name}</span>
             <button onClick={() => remove(item.id)} className="text-gray-200 hover:text-red-400 group-hover:text-red-200"><X size={14} /></button>
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
      {items.length === 0 && <p className="text-gray-400 font-bold tracking-widest p-10 uppercase border border-dashed border-gray-200 text-center">NO INCOMING MESSAGES.</p>}
      {items.map(item => (
        <div key={item.id} className="border border-black p-8 group relative bg-neutral-50 hover:bg-white transition-colors">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="font-display font-bold text-2xl tracking-tight uppercase">{item.name}</p>
              <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase mt-1">{item.email}</p>
            </div>
            <span className="text-[10px] font-bold text-gray-300 tracking-[0.2em]">{item.timestamp ? new Date(item.timestamp.toDate()).toLocaleString() : 'N/A'}</span>
          </div>
          <p className="text-gray-600 italic leading-relaxed text-lg">"{item.message}"</p>
          <button onClick={() => remove(item.id)} className="absolute bottom-8 right-8 text-gray-200 hover:text-red-600 transition-colors">
            <Trash2 size={20} />
          </button>
        </div>
      ))}
    </div>
  );
}
