import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface FileUploadProps {
  onUpload: (url: string) => void;
  currentValue?: string;
  label: string;
}

export function ImageUpload({ onUpload, currentValue, label }: FileUploadProps) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (700KB limit for Firestore base64 strings to ensure document stays under 1MB)
    if (file.size > 700 * 1024) {
      alert("Image is too large. Please upload an image smaller than 700KB (or use an external URL).");
      return;
    }

    setLoading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onUpload(base64);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload failed", error);
      setLoading(false);
    }
  };

  const clear = () => {
    onUpload('');
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <label className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">{label}</label>
        {currentValue && (
            <button onClick={clear} className="text-red-600 hover:text-red-700 p-1 flex items-center gap-1 text-[8px] font-bold tracking-widest uppercase">
                <X size={10} /> CLEAR IMAGE
            </button>
        )}
      </div>

      <div className="relative group">
        <div className={cn(
            "w-full border border-black border-dashed h-40 flex flex-col items-center justify-center transition-all bg-neutral-50 overflow-hidden cursor-pointer hover:bg-neutral-100",
            loading && "opacity-50 pointer-events-none"
        )} onClick={() => fileInputRef.current?.click()}>
          
          {currentValue ? (
            <div className="relative w-full h-full p-2 group">
              <img src={currentValue} alt="Preview" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                 <button onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }} className="bg-white text-black px-4 py-2 text-[10px] font-bold tracking-widest pointer-events-auto">REPLACE IMAGE</button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              {loading ? (
                <Loader2 size={24} className="animate-spin text-gray-400" />
              ) : (
                <>
                  <Upload size={24} className="text-gray-300 group-hover:text-black transition-colors" />
                  <div className="text-center">
                    <p className="text-[10px] font-bold tracking-widest text-gray-400 group-hover:text-black uppercase">CLICK TO UPLOAD IMAGE</p>
                    <p className="text-[8px] font-bold tracking-widest text-gray-300 mt-1 uppercase">MAX SIZE: 700KB (.JPG, .PNG, .WEBP)</p>
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
          accept="image/jpeg,image/png,image/webp" 
          onChange={handleFileChange} 
        />
      </div>
    </div>
  );
}
