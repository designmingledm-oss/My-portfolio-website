import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface FileUploadProps {
  onUpload: (url: string) => void;
  currentValue?: string;
  label: string;
  accept?: string;
  type?: 'image' | 'pdf';
}

export function FileUpload({ onUpload, currentValue, label, accept = "image/jpeg,image/png,image/webp", type = 'image' }: FileUploadProps) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (700KB limit for Firestore base64 strings to ensure document stays under 1MB)
    const limit = 700 * 1024;
    if (file.size > limit) {
      alert(`File is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Please upload a file smaller than 700KB (or use an external URL).`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setLoading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onUpload(base64);
        setLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload failed", error);
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const clear = () => {
    onUpload('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isBase64 = currentValue?.startsWith('data:');
  const isPDF = isBase64 ? currentValue?.includes('application/pdf') : currentValue?.toLowerCase().endsWith('.pdf');

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <label className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">{label}</label>
        {currentValue && (
            <button onClick={clear} className="text-red-600 hover:text-red-700 p-1 flex items-center gap-1 text-[8px] font-bold tracking-widest uppercase">
                <X size={10} /> CLEAR FILE
            </button>
        )}
      </div>

      <div className="relative group">
        <div className={cn(
            "w-full border border-black border-dashed min-h-[160px] flex flex-col items-center justify-center transition-all bg-neutral-50 overflow-hidden cursor-pointer hover:bg-neutral-100",
            loading && "opacity-50 pointer-events-none"
        )} onClick={() => fileInputRef.current?.click()}>
          
          {currentValue ? (
            <div className="relative w-full h-full p-4 group flex flex-col items-center justify-center">
              {isPDF || type === 'pdf' ? (
                 <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
                        <span className="font-bold text-xs uppercase">PDF</span>
                    </div>
                    <span className="text-[8px] font-bold tracking-widest text-gray-400 uppercase">DOCUMENT LOADED</span>
                 </div>
              ) : (
                <img src={currentValue} alt="Preview" className="max-h-32 object-contain grayscale" referrerPolicy="no-referrer" />
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                 <button onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }} className="bg-white text-black px-4 py-2 text-[10px] font-bold tracking-widest pointer-events-auto uppercase">REPLACE FILE</button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 p-6 text-center">
              {loading ? (
                <Loader2 size={24} className="animate-spin text-gray-400" />
              ) : (
                <>
                  <Upload size={24} className="text-gray-300 group-hover:text-black transition-colors" />
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-gray-400 group-hover:text-black uppercase">CLICK TO UPLOAD {type === 'pdf' ? 'PDF' : 'IMAGE'}</p>
                    <p className="text-[8px] font-bold tracking-widest text-gray-300 mt-1 uppercase">MAX SIZE: 700KB ({accept.toUpperCase().replace(/image\//g, '').replace(/application\//g, '')})</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept={accept} 
          onChange={handleFileChange} 
        />
      </div>
    </div>
  );
}
